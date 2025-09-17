import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { BattleEngineService } from '../services/battle-engine/index';

const prisma = new PrismaClient();
const battleEngine = new BattleEngineService(prisma);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengerCardId, targetCardId, walletAddress, battleType = 'CARD_BATTLE', stakes = 10 } = body;

    if (!targetCardId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify challenger user exists
    const challenger = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!challenger) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify target card exists
    const targetCard = await prisma.card.findUnique({
      where: { id: targetCardId },
      include: {
        owner: { select: { id: true, walletAddress: true, username: true } }
      }
    });

    if (!targetCard) {
      return NextResponse.json({ error: 'Target card not found' }, { status: 404 });
    }

    if (targetCard.owner.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot battle your own card' }, { status: 400 });
    }

    // Check if challenger has sufficient balance
    if (challenger.eceBalance < stakes) {
      return NextResponse.json({ 
        error: 'Insufficient ECE balance for battle stakes',
        required: stakes,
        current: challenger.eceBalance
      }, { status: 400 });
    }

    // Get challenger's cards for selection (if no specific card provided)
    let challengerCard = null;
    if (challengerCardId) {
      challengerCard = await prisma.card.findFirst({
        where: {
          id: challengerCardId,
          ownerId: challenger.id
        }
      });

      if (!challengerCard) {
        return NextResponse.json({ error: 'Invalid challenger card' }, { status: 400 });
      }
    } else {
      // Find challenger's available cards
      const availableCards = await prisma.card.findMany({
        where: {
          ownerId: challenger.id
        },
        select: {
          id: true,
          name: true,
          stats: true,
          category: true,
          rarity: true
        }
      });

      if (availableCards.length === 0) {
        return NextResponse.json({ error: 'No cards available for battles' }, { status: 400 });
      }

      return NextResponse.json({
        success: false,
        requiresCardSelection: true,
        message: 'Please select a card for battle',
        availableCards,
        targetCard: {
          id: targetCard.id,
          name: targetCard.name,
          stats: targetCard.stats,
          category: targetCard.category,
          rarity: targetCard.rarity,
          stakes
        }
      });
    }

    // Create M&A Battle using new schema
    const battle = await prisma.mABattle.create({
      data: {
        initiatorCardId: challengerCard.id,
        targetCardId: targetCard.id,
        initiatorUserId: challenger.id,
        targetUserId: targetCard.ownerId,
        battleType: battleType as BattleType,
        title: `${challengerCard.name} vs ${targetCard.name}`,
        description: `Battle between ${challenger.username}'s ${challengerCard.name} and ${targetCard.owner.username}'s ${targetCard.name}`,
        stakes,
        timeline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        votingPeriod: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
        status: BattleStatus.PENDING
      },
      include: {
        initiatorCard: {
          select: { id: true, name: true, stats: true, category: true, rarity: true }
        },
        targetCard: {
          select: { id: true, name: true, stats: true, category: true, rarity: true }
        },
        initiator: {
          select: { id: true, username: true, walletAddress: true }
        },
        target: {
          select: { id: true, username: true, walletAddress: true }
        }
      }
    });

    // Deduct stakes from challenger
    await prisma.user.update({
      where: { id: challenger.id },
      data: {
        eceBalance: { decrement: stakes }
      }
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: challenger.id,
        type: 'BATTLE_CHALLENGE',
        amount: stakes,
        currency: 'ECE',
        status: 'COMPLETED',
        description: `Battle challenge: ${challengerCard.name} vs ${targetCard.name}`,
        metadata: {
          battleId: battle.id,
          targetCardId,
          challengerCardId,
          battleType
        }
      }
    });

    // Create notification for target user
    await prisma.notification.create({
      data: {
        userId: targetCard.ownerId,
        type: 'BATTLE_CHALLENGE',
        title: 'Battle Challenge Received',
        message: `${challenger.username} has challenged your card "${targetCard.name}" to battle!`,
        data: {
          battleId: battle.id,
          challengerId: challenger.id,
          challengerCard: challengerCard.name,
          stakes,
          battleType
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Battle challenge created successfully',
      battle: {
        id: battle.id,
        title: battle.title,
        description: battle.description,
        stakes: battle.stakes,
        status: battle.status,
        timeline: battle.timeline,
        initiatorCard: battle.initiatorCard,
        targetCard: battle.targetCard,
        initiator: battle.initiator,
        target: battle.target
      }
    });

  } catch (error) {
    console.error('Battle creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error creating battle' 
    }, { status: 500 });
  }
}

// Accept battle challenge
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { battleId, walletAddress, accept = true } = body;

    if (!battleId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Find the battle
    const battle = await prisma.mABattle.findUnique({
      where: { id: battleId },
      include: {
        initiator: true,
        target: true,
        initiatorCard: true,
        targetCard: true
      }
    });

    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    // Verify user is the target
    if (battle.target?.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized to accept this battle' }, { status: 403 });
    }

    if (!accept) {
      // Reject battle
      await prisma.mABattle.update({
        where: { id: battleId },
        data: { status: BattleStatus.CANCELLED }
      });

      // Refund initiator's stakes
      await prisma.user.update({
        where: { id: battle.initiatorUserId },
        data: {
          eceBalance: { increment: battle.stakes }
        }
      });

      // Create refund transaction
      await prisma.transaction.create({
        data: {
          userId: battle.initiatorUserId,
          type: 'REFUND',
          amount: battle.stakes,
          currency: 'ECE',
          status: 'COMPLETED',
          description: `Battle challenge rejected: ${battle.title}`,
          metadata: { battleId }
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Battle challenge rejected',
        battleId
      });
    }

    // Accept battle - deduct target stakes
    if (battle.target && battle.target.eceBalance < battle.stakes) {
      return NextResponse.json({ 
        error: 'Insufficient balance to accept battle',
        required: battle.stakes,
        current: battle.target.eceBalance
      }, { status: 400 });
    }

    // Deduct target stakes
    await prisma.user.update({
      where: { id: battle.targetUserId! },
      data: {
        eceBalance: { decrement: battle.stakes }
      }
    });

    // Update battle status to active
    await prisma.mABattle.update({
      where: { id: battleId },
      data: { status: BattleStatus.ACTIVE }
    });

    // Create transaction for target
    await prisma.transaction.create({
      data: {
        userId: battle.targetUserId!,
        type: 'BATTLE_STAKE',
        amount: battle.stakes,
        currency: 'ECE',
        status: 'COMPLETED',
        description: `Battle stake: ${battle.title}`,
        metadata: { battleId }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Battle accepted and started',
      battleId,
      status: 'ACTIVE'
    });

  } catch (error) {
    console.error('Battle acceptance error:', error);
    return NextResponse.json({ 
      error: 'Internal server error accepting battle' 
    }, { status: 500 });
  }
}

// Execute battle move
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { battleId, cardId, moveType, powerupUsed, targetCardId, walletAddress } = body;

    if (!battleId || !cardId || !moveType || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Execute battle move using BattleEngineService
    const move = {
      playerId: user.id,
      cardId,
      moveType,
      powerupUsed,
      targetCardId
    };

    const result = await battleEngine.executeBattleRound(battleId, move);

    return NextResponse.json({
      success: true,
      message: 'Battle move executed successfully',
      result
    });

  } catch (error) {
    console.error('Battle move error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error executing battle move' 
    }, { status: 500 });
  }
}
