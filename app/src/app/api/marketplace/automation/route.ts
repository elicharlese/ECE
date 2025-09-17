import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// Market maker algorithm for automatic liquidity provision
async function calculateMarketOdds(marketId: string, totalVolume: number, directionVolume: { up: number, down: number }) {
  const baseOdds = 2.0
  const volumeRatio = directionVolume.up / (directionVolume.up + directionVolume.down)
  
  // Adjust odds based on betting volume distribution
  const upOdds = Math.max(1.1, Math.min(10.0, baseOdds / volumeRatio))
  const downOdds = Math.max(1.1, Math.min(10.0, baseOdds / (1 - volumeRatio)))
  
  return { upOdds, downOdds }
}

// Automated market settlement and payout processing
async function settleBettingMarket(marketId: string) {
  const market = await prisma.bettingMarket.findUnique({
    where: { id: marketId },
    include: {
      positions: {
        include: { user: true }
      },
      card: true
    }
  })

  if (!market || market.status !== 'ACTIVE' || market.expiryDate > new Date()) {
    return { success: false, error: 'Market not ready for settlement' }
  }

  // Determine winning direction based on actual outcome
  const actualValue = await fetchActualMetricValue(market.card.id, market.metricType)
  const targetMet = market.targetDirection === 'UP' 
    ? actualValue >= market.predictionTarget 
    : actualValue <= market.predictionTarget

  const winningDirection = targetMet ? market.targetDirection : (market.targetDirection === 'UP' ? 'DOWN' : 'UP')

  // Process payouts
  const winners = market.positions.filter((pos: any) => pos.position === winningDirection)
  const totalWinningBets = winners.reduce((sum: number, pos: any) => sum + pos.amount, 0)
  const totalPot = market.positions.reduce((sum: number, pos: any) => sum + pos.amount, 0)

  const payouts = await Promise.all(
    winners.map(async (pos: any) => {
      const winnings = (pos.amount / Math.max(totalWinningBets, 1)) * totalPot * 0.95 // 5% house edge
      
      // Update user balance
      await prisma.user.update({
        where: { id: pos.userId },
        data: { eceBalance: { increment: winnings } }
      })

      // Create payout record
      return await prisma.bettingPayout.create({
        data: {
          userId: pos.userId,
          marketId: market.id,
          positionId: pos.id,
          originalBet: pos.amount,
          winnings,
          multiplier: pos.multiplier ?? 1.0,
          status: 'COMPLETED'
        }
      })
    })
  )

  // Update market status
  await prisma.bettingMarket.update({
    where: { id: marketId },
    data: {
      status: 'SETTLED',
      settled: true,
      settledValue: actualValue,
      winningDirection
    }
  })

  return {
    success: true,
    payouts: payouts.length,
    totalPaid: payouts.reduce((sum, p) => sum + p.winnings, 0),
    winners: winners.length
  }
}

// Fetch real metric values (mock implementation)
async function fetchActualMetricValue(cardId: string, metricType: string): Promise<number> {
  const card = await prisma.card.findUnique({ where: { id: cardId } })
  if (!card) return 0

  // Mock API call to get real company data
  // In production, integrate with financial APIs
  switch (metricType) {
    case 'REVENUE_GROWTH':
      return (card.currentPrice ?? 0) * (1 + (Math.random() * 0.4 - 0.2))
    case 'USER_GROWTH':
      return (card.currentPrice ?? 0) * (1 + (Math.random() * 0.6 - 0.3))
    case 'VALUATION_CHANGE':
      return (card.currentPrice ?? 0) * (1 + (Math.random() * 0.8 - 0.4))
    default:
      return card.currentPrice ?? 0
  }
}

// Daily market creation job
async function createDailyMarkets() {
  const companies = await prisma.card.findMany({
    where: {
      category: {
        in: ['TECHNOLOGY', 'AUTOMOTIVE', 'ENTERTAINMENT', 'SPORTS']
      }
    },
    take: 10
  })

  const markets = await Promise.all(
    companies.map(async (company: any) => {
      const metricTypes = ['REVENUE_GROWTH', 'USER_GROWTH', 'VALUATION_CHANGE']
      const metricType = metricTypes[Math.floor(Math.random() * metricTypes.length)]
      
      let currentValue: number, predictionTarget: number, targetDirection: 'UP' | 'DOWN'
      
      switch (metricType) {
        case 'REVENUE_GROWTH':
          currentValue = company.currentPrice
          predictionTarget = currentValue * (1 + (Math.random() * 0.4 - 0.2))
          targetDirection = predictionTarget > currentValue ? 'UP' : 'DOWN'
          break
        case 'USER_GROWTH':
          currentValue = company.currentPrice
          predictionTarget = currentValue * (1 + (Math.random() * 0.6 - 0.3))
          targetDirection = predictionTarget > currentValue ? 'UP' : 'DOWN'
          break
        case 'VALUATION_CHANGE':
          currentValue = company.currentPrice
          predictionTarget = currentValue * (1 + (Math.random() * 0.8 - 0.4))
          targetDirection = predictionTarget > currentValue ? 'UP' : 'DOWN'
          break
        default:
          return null
      }

      const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      return await prisma.bettingMarket.create({
        data: {
          cardId: company.id,
          title: `${company.name} ${metricType.replace('_', ' ')} Prediction`,
          description: `Will ${company.name} ${targetDirection === 'UP' ? 'exceed' : 'fall below'} ${predictionTarget.toFixed(1)} in the next 24 hours?`,
          metricType,
          currentValue,
          predictionTarget,
          targetDirection,
          odds: 2.0 + (Math.random() * 2), // Random odds between 2-4
          minimumBet: 10,
          expiryDate,
          status: 'ACTIVE'
        }
      })
    })
  )

  return markets.filter(Boolean)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    if (action === 'create-daily-markets') {
      const markets = await createDailyMarkets()
      return NextResponse.json({
        success: true,
        marketsCreated: markets.length,
        markets
      })
    }

    if (action === 'settle-markets') {
      const expiredMarkets = await prisma.bettingMarket.findMany({
        where: {
          status: 'ACTIVE',
          expiryDate: { lte: new Date() }
        }
      })

      const settlements = await Promise.all(
        expiredMarkets.map((market: any) => settleBettingMarket(market.id))
      )

      return NextResponse.json({
        success: true,
        marketsSettled: settlements.filter(s => s.success).length,
        settlements
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Error in market automation:', error)
    return NextResponse.json(
      { success: false, error: 'Market automation failed' },
      { status: 500 }
    )
  }
}
