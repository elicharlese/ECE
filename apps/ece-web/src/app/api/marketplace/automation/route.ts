import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// Market maker algorithm for automatic liquidity provision
export async function calculateMarketOdds(marketId: string, totalVolume: number, directionVolume: { up: number, down: number }) {
  const baseOdds = 2.0
  const volumeRatio = directionVolume.up / (directionVolume.up + directionVolume.down)
  
  // Adjust odds based on betting volume distribution
  const upOdds = Math.max(1.1, Math.min(10.0, baseOdds / volumeRatio))
  const downOdds = Math.max(1.1, Math.min(10.0, baseOdds / (1 - volumeRatio)))
  
  return { upOdds, downOdds }
}

// Automated market settlement and payout processing
export async function settleBettingMarket(marketId: string) {
  const market = await prisma.bettingMarket.findUnique({
    where: { id: marketId },
    include: {
      bets: {
        include: { user: true }
      },
      card: true
    }
  })

  if (!market || market.status !== 'ACTIVE' || market.endTime > new Date()) {
    return { success: false, error: 'Market not ready for settlement' }
  }

  // Determine winning direction based on actual outcome
  const actualValue = await fetchActualMetricValue(market.card.id, market.metricType)
  const targetMet = market.targetDirection === 'UP' 
    ? actualValue >= market.predictionTarget 
    : actualValue <= market.predictionTarget

  const winningDirection = targetMet ? market.targetDirection : (market.targetDirection === 'UP' ? 'DOWN' : 'UP')

  // Process payouts
  const winners = market.bets.filter(bet => bet.direction === winningDirection)
  const totalWinningBets = winners.reduce((sum, bet) => sum + bet.amount, 0)
  const totalPot = market.bets.reduce((sum, bet) => sum + bet.amount, 0)

  const payouts = await Promise.all(
    winners.map(async (bet) => {
      const winnings = (bet.amount / totalWinningBets) * totalPot * 0.95 // 5% house edge
      
      // Update user balance
      await prisma.user.update({
        where: { id: bet.userId },
        data: { eceBalance: { increment: winnings } }
      })

      // Create payout record
      return await prisma.betPayout.create({
        data: {
          userId: bet.userId,
          marketId: market.id,
          betId: bet.id,
          amount: winnings,
          status: 'COMPLETED'
        }
      })
    })
  )

  // Update market status
  await prisma.bettingMarket.update({
    where: { id: marketId },
    data: {
      status: 'COMPLETED',
      actualValue,
      winningDirection
    }
  })

  return {
    success: true,
    payouts: payouts.length,
    totalPaid: payouts.reduce((sum, p) => sum + p.amount, 0),
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
      return card.revenue * (1 + (Math.random() * 0.4 - 0.2)) // ±20% variation
    case 'USER_GROWTH':
      return card.employees * 1000 * (1 + (Math.random() * 0.6 - 0.3)) // ±30% variation  
    case 'VALUATION_CHANGE':
      return card.stockPrice * (1 + (Math.random() * 0.8 - 0.4)) // ±40% variation
    default:
      return 0
  }
}

// Daily market creation job
export async function createDailyMarkets() {
  const companies = await prisma.card.findMany({
    where: {
      category: {
        in: ['TECHNOLOGY', 'AUTOMOTIVE', 'ENTERTAINMENT', 'FINANCE']
      }
    },
    take: 10
  })

  const markets = await Promise.all(
    companies.map(async (company) => {
      const metricTypes = ['REVENUE_GROWTH', 'USER_GROWTH', 'VALUATION_CHANGE']
      const metricType = metricTypes[Math.floor(Math.random() * metricTypes.length)]
      
      let currentValue: number, predictionTarget: number, targetDirection: 'UP' | 'DOWN'
      
      switch (metricType) {
        case 'REVENUE_GROWTH':
          currentValue = company.revenue / 1000000000 // Convert to billions
          predictionTarget = currentValue * (1 + (Math.random() * 0.4 - 0.2))
          targetDirection = predictionTarget > currentValue ? 'UP' : 'DOWN'
          break
        case 'USER_GROWTH':
          currentValue = company.employees * 1000 // Estimate users
          predictionTarget = currentValue * (1 + (Math.random() * 0.6 - 0.3))
          targetDirection = predictionTarget > currentValue ? 'UP' : 'DOWN'
          break
        case 'VALUATION_CHANGE':
          currentValue = company.stockPrice || company.marketCap / 1000000000
          predictionTarget = currentValue * (1 + (Math.random() * 0.8 - 0.4))
          targetDirection = predictionTarget > currentValue ? 'UP' : 'DOWN'
          break
        default:
          return null
      }

      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

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
          endTime,
          status: 'ACTIVE',
          trendingScore: Math.floor(Math.random() * 100)
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
          endTime: { lte: new Date() }
        }
      })

      const settlements = await Promise.all(
        expiredMarkets.map(market => settleBettingMarket(market.id))
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
