import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, walletAddress, amount } = body;

    if (!cardId || !walletAddress || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user exists and has sufficient ECE balance
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.eceBalance < amount) {
      return NextResponse.json({ 
        error: 'Insufficient ECE balance',
        required: amount,
        current: user.eceBalance
      }, { status: 400 });
    }

    // Verify card exists and is available for bidding
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        owner: { select: { walletAddress: true } },
        bids: {
          orderBy: { amount: 'desc' },
          take: 1
        }
      }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (!card.availableForBidding) {
      return NextResponse.json({ error: 'Card is not available for bidding' }, { status: 400 });
    }

    if (card.owner.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot bid on your own card' }, { status: 400 });
    }

    // Check minimum bid amount
    const currentHighestBid = card.bids[0]?.amount || 0;
    const minimumBid = Math.max(card.minimumBidAmount || 0, currentHighestBid + 1);

    if (amount < minimumBid) {
      return NextResponse.json({ 
        error: 'Bid amount too low',
        minimumBid,
        currentHighestBid
      }, { status: 400 });
    }

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        cardId,
        bidderId: user.id,
        amount,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      include: {
        bidder: {
          select: { username: true, walletAddress: true }
        },
        card: {
          select: { name: true, currentPrice: true }
        }
      }
    });

    // Record transaction for bid placement
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'BID_PLACED',
        amount,
        currency: 'ECE',
        status: 'PENDING',
        description: `Bid placed on ${card.name}`,
        metadata: {
          cardId,
          bidId: bid.id,
          bidType: 'card_bid'
        }
      }
    });

    return NextResponse.json({
      success: true,
      bid,
      message: 'Bid placed successfully'
    });

  } catch (error) {
    console.error('Card bid error:', error);
    return NextResponse.json({ 
      error: 'Internal server error placing bid' 
    }, { status: 500 });
  }
}
