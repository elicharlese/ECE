import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AutoBidService } from '../services/auto-bid';

const prisma = new PrismaClient();
const autoBidService = new AutoBidService(prisma);

// Create an auction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cardId, 
      title, 
      description, 
      startingBid, 
      reservePrice, 
      durationHours = 24,
      walletAddress 
    } = body;

    if (!cardId || !title || !startingBid || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify card ownership
    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.ownerId !== user.id) {
      return NextResponse.json({ error: 'You do not own this card' }, { status: 403 });
    }

    // Check if card is already in an active auction
    const existingAuction = await prisma.cardAuction.findFirst({
      where: {
        cardId,
        status: AuctionStatus.ACTIVE
      }
    });

    if (existingAuction) {
      return NextResponse.json({ error: 'Card is already in an active auction' }, { status: 400 });
    }

    // Create auction
    const endTime = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    
    const auction = await prisma.cardAuction.create({
      data: {
        cardId,
        ownerId: user.id,
        title,
        description,
        startPrice: startingBid,
        reservePrice,
        endTime,
        status: AuctionStatus.ACTIVE
      },
      include: {
        card: {
          select: { id: true, name: true, category: true, rarity: true, imageUrl: true }
        },
        owner: {
          select: { id: true, username: true, walletAddress: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Auction created successfully',
      auction
    });

  } catch (error: any) {
    console.error('Auction creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error creating auction' 
    }, { status: 500 });
  }
}

// Get active auctions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ACTIVE';
    const limit = parseInt(searchParams.get('limit') || '20');
    const cardId = searchParams.get('cardId');

    const where: any = {
      status: status as AuctionStatus
    };

    if (cardId) {
      where.cardId = cardId;
    }

    const auctions = await prisma.cardAuction.findMany({
      where,
      include: {
        card: {
          select: { id: true, name: true, category: true, rarity: true, imageUrl: true }
        },
        owner: {
          select: { id: true, username: true, walletAddress: true }
        },
        bids: {
          orderBy: { bidAmount: 'desc' },
          take: 1,
          include: {
            bidder: {
              select: { id: true, username: true }
            }
          }
        },
        _count: {
          select: { bids: true }
        }
      },
      orderBy: {
        endTime: 'asc'
      },
      take: limit
    });

    return NextResponse.json({
      success: true,
      auctions: auctions.map(auction => ({
        ...auction,
        currentBid: auction.bids[0]?.bidAmount || auction.startPrice,
        totalBids: auction._count.bids,
        highestBidder: auction.bids[0]?.bidder || null
      }))
    });

  } catch (error: any) {
    console.error('Get auctions error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching auctions' 
    }, { status: 500 });
  }
}
