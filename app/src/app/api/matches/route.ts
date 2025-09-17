import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get user's swipe matches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const status = searchParams.get('status') || 'active'; // active, expired, all

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const where: any = {
      userId: user.id
    };

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'expired') {
      where.isActive = false;
    }

    const matches = await prisma.swipeMatch.findMany({
      where,
      include: {
        matchedUser: {
          select: { id: true, username: true, walletAddress: true, avatar: true }
        },
        card: {
          select: { id: true, name: true, category: true, rarity: true, imageUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      matches
    });

  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching matches' 
    }, { status: 500 });
  }
}

// Create or update a match action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cardId, 
      matchedUserId, 
      action, 
      walletAddress 
    } = body;

    if (!cardId || !matchedUserId || !action || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find existing match
    let match = await prisma.swipeMatch.findFirst({
      where: {
        userId: user.id,
        matchedUserId,
        cardId,
        isActive: true
      }
    });

    if (!match) {
      return NextResponse.json({ error: 'Active match not found' }, { status: 404 });
    }

    // Update match action
    const updateData: any = {};

    if (user.id === match.userId) {
      updateData.userAction = action as MatchAction;
    } else {
      updateData.matchedUserAction = action as MatchAction;
    }

    // Check if both users have taken action
    const otherAction = user.id === match.userId ? match.matchedUserAction : match.userAction;
    
    if (otherAction && action === MatchAction.BATTLE) {
      // Both users want to battle - create battle
      await createBattleFromMatch(match, user.id, matchedUserId);
      updateData.isActive = false; // Deactivate match after battle creation
    } else if (otherAction && action === MatchAction.TRADE) {
      // Both users want to trade - create trade offer
      await createTradeFromMatch(match, user.id, matchedUserId);
      updateData.isActive = false; // Deactivate match after trade creation
    } else if (action === MatchAction.IGNORE) {
      updateData.isActive = false; // Deactivate match if ignored
    }

    match = await prisma.swipeMatch.update({
      where: { id: match.id },
      data: updateData,
      include: {
        matchedUser: {
          select: { id: true, username: true, walletAddress: true }
        },
        card: {
          select: { id: true, name: true, category: true, rarity: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Match action recorded successfully',
      match
    });

  } catch (error) {
    console.error('Match action error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error recording match action' 
    }, { status: 500 });
  }
}

// Helper function to create battle from match
async function createBattleFromMatch(match: any, userId: string, matchedUserId: string) {
  try {
    // Create M&A Battle
    await prisma.mABattle.create({
      data: {
        initiatorCardId: match.cardId,
        targetCardId: match.cardId, // Same card for both (could be different in future)
        initiatorUserId: userId,
        targetUserId: matchedUserId,
        battleType: 'CARD_BATTLE',
        title: `Match Battle: ${match.card.name}`,
        description: `Battle created from swipe match`,
        stakes: 10, // Default stakes
        timeline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        votingPeriod: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'PENDING'
      }
    });
  } catch (error) {
    console.error('Error creating battle from match:', error);
  }
}

// Helper function to create trade from match
async function createTradeFromMatch(match: any, userId: string, matchedUserId: string) {
  try {
    // Create trade offer
    await prisma.tradeOffer.create({
      data: {
        senderId: userId,
        receiverId: matchedUserId,
        status: 'PENDING',
        message: `Trade offer from swipe match for ${match.card.name}`,
        eceFromSender: 0,
        eceFromReceiver: 0
      }
    });
  } catch (error) {
    console.error('Error creating trade from match:', error);
  }
}

// Check for mutual matches and create SwipeMatch records
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, userId, action, walletAddress } = body;

    if (!cardId || !userId || !action || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify current user
    const currentUser = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the other user has also shown interest
    const otherUserSwipe = await prisma.swipeAction.findFirst({
      where: {
        userId,
        cardId,
        action: { in: ['LIKE', 'SUPER_LIKE'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    const currentUserSwipe = await prisma.swipeAction.findFirst({
      where: {
        userId: currentUser.id,
        cardId,
        action: { in: ['LIKE', 'SUPER_LIKE'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (otherUserSwipe && currentUserSwipe) {
      // Mutual interest - create match
      const matchType = (currentUserSwipe.action === 'SUPER_LIKE' || otherUserSwipe.action === 'SUPER_LIKE') 
        ? MatchType.SUPER_LIKE 
        : MatchType.MUTUAL;

      // Check if match already exists
      let existingMatch = await prisma.swipeMatch.findFirst({
        where: {
          OR: [
            { userId: currentUser.id, matchedUserId: userId, cardId },
            { userId: userId, matchedUserId: currentUser.id, cardId }
          ],
          isActive: true
        }
      });

      if (!existingMatch) {
        existingMatch = await prisma.swipeMatch.create({
          data: {
            userId: currentUser.id,
            matchedUserId: userId,
            cardId,
            matchType,
            matchStrength: 0.8, // High confidence for mutual likes
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        });

        // Create notification for match
        await prisma.notification.create({
          data: {
            userId,
            type: 'SWIPE_MATCH',
            title: 'New Match!',
            message: `You have a new match for ${existingMatch.card?.name || 'a card'}!`,
            data: {
              matchId: existingMatch.id,
              cardId,
              matchType
            }
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Mutual match created!',
        match: existingMatch
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Swipe recorded, no mutual match yet'
    });

  } catch (error) {
    console.error('Check mutual match error:', error);
    return NextResponse.json({ 
      error: 'Internal server error checking mutual matches' 
    }, { status: 500 });
  }
}
