import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const filterType = searchParams.get('filter') || 'all'; // bidding, buying, battling, all
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Build filter conditions
    const whereConditions: any = {
      // Exclude user's own cards
      owner: {
        walletAddress: { not: walletAddress.toLowerCase() }
      }
    };

    // Apply interaction type filters
    switch (filterType) {
      case 'bidding':
        whereConditions.availableForBidding = true;
        break;
      case 'buying':
        whereConditions.availableForBuying = true;
        break;
      case 'battling':
        whereConditions.availableForBattling = true;
        break;
      case 'all':
      default:
        whereConditions.OR = [
          { availableForBidding: true },
          { availableForBuying: true },
          { availableForBattling: true }
        ];
        break;
    }

    // Fetch cards for discovery
    const cards = await prisma.card.findMany({
      where: whereConditions,
      include: {
        owner: {
          select: { 
            username: true, 
            walletAddress: true,
            avatar: true 
          }
        },
        bids: {
          select: {
            amount: true,
            createdAt: true
          },
          orderBy: { amount: 'desc' },
          take: 1
        },
        listing: {
          select: {
            price: true,
            listingType: true,
            status: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }, // Show newest cards first
        { currentPrice: 'desc' } // Then by price
      ],
      skip: offset,
      take: limit
    });

    // Enhance cards with interaction data
    const enhancedCards = cards.map(card => ({
      ...card,
      interactions: {
        canBid: card.availableForBidding,
        canBuy: card.availableForBuying,
        canBattle: card.availableForBattling,
        currentHighestBid: card.bids[0]?.amount || 0,
        marketPrice: card.listing?.price || card.currentPrice,
        minimumBid: card.minimumBidAmount || card.currentPrice * 1.1
      },
      metrics: {
        marketCap: card.marketCap,
        tradingVolume: card.tradingVolume || 0,
        priceChange24h: this.calculatePriceChange(card.historicalPrices),
      }
    }));

    return NextResponse.json({
      success: true,
      cards: enhancedCards,
      hasMore: cards.length === limit,
      filter: filterType,
      total: enhancedCards.length
    });

  } catch (error) {
    console.error('Discover cards error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching discover cards' 
    }, { status: 500 });
  }
}

// Helper function to calculate 24h price change
function calculatePriceChange(historicalPrices: any): number {
  if (!historicalPrices || !Array.isArray(historicalPrices) || historicalPrices.length < 2) {
    return 0;
  }
  
  const latest = historicalPrices[historicalPrices.length - 1]?.price || 0;
  const previous = historicalPrices[historicalPrices.length - 2]?.price || 0;
  
  if (previous === 0) return 0;
  return ((latest - previous) / previous) * 100;
}
