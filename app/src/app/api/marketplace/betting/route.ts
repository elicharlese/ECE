import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'trending'
    const limit = parseInt(searchParams.get('limit') || '20')

    const whereClause: any = {
      status: 'ACTIVE',
      expiryDate: {
        gt: new Date()
      }
    }

    if (category && category !== 'all') {
      whereClause.card = {
        category: category
      }
    }

    let orderBy: any = {}
    switch (sortBy) {
      case 'trending':
        orderBy = { createdAt: 'desc' }
        break
      case 'volume':
        orderBy = { totalPot: 'desc' }
        break
      case 'pot':
        orderBy = { totalPot: 'desc' }
        break
      case 'time':
        orderBy = { expiryDate: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const markets = await prisma.bettingMarket.findMany({
      where: whereClause,
      orderBy,
      take: limit,
      include: {
        card: {
          select: {
            name: true,
            category: true,
            imageUrl: true
          }
        },
        _count: {
          select: {
            positions: true
          }
        }
      }
    })

    const enrichedMarkets = markets.map((market: any) => ({
      ...market,
      participantCount: market._count.positions,
      timeLeft: new Date(market.expiryDate).getTime() - Date.now(),
      cardName: market.card.name,
      cardCategory: market.card.category
    }))

    return NextResponse.json({
      success: true,
      markets: enrichedMarkets
    })

  } catch (error) {
    console.error('Error fetching betting markets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch betting markets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { marketId, direction, amount } = await request.json()

    if (!marketId || !direction || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid bet parameters' },
        { status: 400 }
      )
    }

    // Check if market exists and is active
    const market = await prisma.bettingMarket.findUnique({
      where: { id: marketId },
      include: { card: true }
    })

    if (!market || market.status !== 'ACTIVE' || market.expiryDate <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Market not available for betting' },
        { status: 400 }
      )
    }

    if (amount < market.minimumBet) {
      return NextResponse.json(
        { success: false, error: `Minimum bet is ${market.minimumBet} ECE` },
        { status: 400 }
      )
    }

    // Check user balance
    const userBalance = await prisma.user.findUnique({
      where: { id: user.id },
      select: { eceBalance: true }
    })

    if (!userBalance || userBalance.eceBalance < amount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient ECE balance' },
        { status: 400 }
      )
    }

    // Create bet and update balances in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create the betting position
      const bet = await tx.bettingPosition.create({
        data: {
          userId: user.id,
          marketId,
          position: direction as 'UP' | 'DOWN',
          amount,
          odds: market.odds,
          potentialWinning: amount * market.odds
        }
      })

      // Update user balance
      await tx.user.update({
        where: { id: user.id },
        data: {
          eceBalance: {
            decrement: amount
          }
        }
      })

      // Update market stats
      await tx.bettingMarket.update({
        where: { id: marketId },
        data: {
          totalPot: {
            increment: amount
          }
        }
      })

      return bet
    })

    return NextResponse.json({
      success: true,
      bet: result,
      message: `Successfully placed ${amount} ECE bet ${direction} on ${market.card.name}`
    })

  } catch (error) {
    console.error('Error placing bet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to place bet' },
      { status: 500 }
    )
  }
}
