import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';
import { AutoBidService } from '../../../../services/auto-bid';

const prisma = new PrismaClient();
const autoBidService = new AutoBidService(prisma);

// Place a bid on an auction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auctionId, bidAmount, walletAddress } = body;

    if (!auctionId || !bidAmount || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check user balance
    if (user.eceBalance < bidAmount) {
      return NextResponse.json({ 
        error: 'Insufficient balance',
        required: bidAmount,
        current: user.eceBalance
      }, { status: 400 });
    }

    // Place the bid using AutoBidService
    await autoBidService.handleNewBid(auctionId, user.id, bidAmount);

    return NextResponse.json({
      success: true,
      message: 'Bid placed successfully'
    });

  } catch (error) {
    console.error('Bid placement error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error placing bid' 
    }, { status: 500 });
  }
}

// Get bids for an auction
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get('auctionId');

    if (!auctionId) {
      return NextResponse.json({ error: 'Auction ID required' }, { status: 400 });
    }

    const bids = await prisma.auctionBid.findMany({
      where: { auctionId },
      include: {
        bidder: {
          select: { id: true, username: true, walletAddress: true }
        }
      },
      orderBy: { bidAmount: 'desc' }
    });

    return NextResponse.json({
      success: true,
      bids: bids.map(bid => ({
        id: bid.id,
        bidderId: bid.bidderId,
        bidder: bid.bidder,
        bidAmount: bid.bidAmount,
        bidType: bid.bidType,
        status: bid.status,
        createdAt: bid.createdAt
      }))
    });

  } catch (error) {
    console.error('Get bids error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching bids' 
    }, { status: 500 });
  }
}
