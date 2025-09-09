import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, MarketStatus, PredictionDirection } from '../../../../generated/prisma';
import { MultiPickBettingService } from '../../../services/multi-pick-betting';

const prisma = new PrismaClient();
const bettingService = new MultiPickBettingService(prisma);

// Create a betting market
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cardId, 
      metricType, 
      title, 
      description, 
      currentValue, 
      predictionTarget, 
      targetDirection, 
      odds = 2.0, 
      minimumBet = 10, 
      expiryHours = 24,
      walletAddress 
    } = body;

    if (!cardId || !title || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify card exists
    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Create betting market
    const expiryDate = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    
    const market = await prisma.bettingMarket.create({
      data: {
        cardId,
        metricType,
        title,
        description,
        currentValue,
        predictionTarget,
        targetDirection: targetDirection as PredictionDirection,
        odds,
        minimumBet,
        expiryDate,
        status: MarketStatus.ACTIVE
      },
      include: {
        card: {
          select: { id: true, name: true, category: true, rarity: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Betting market created successfully',
      market
    });

  } catch (error) {
    console.error('Betting market creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error creating betting market' 
    }, { status: 500 });
  }
}

// Get active betting markets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('cardId');
    const status = searchParams.get('status') || 'ACTIVE';
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {
      status: status as MarketStatus
    };

    if (cardId) {
      where.cardId = cardId;
    }

    const markets = await prisma.bettingMarket.findMany({
      where,
      include: {
        card: {
          select: { id: true, name: true, category: true, rarity: true, currentPrice: true }
        },
        positions: {
          select: {
            _count: true
          }
        },
        _count: {
          select: { positions: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json({
      success: true,
      markets: markets.map(market => ({
        ...market,
        totalPositions: market._count.positions,
        totalPot: market.totalPot
      }))
    });

  } catch (error) {
    console.error('Get betting markets error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching betting markets' 
    }, { status: 500 });
  }
}
