import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'battles'
    const limit = parseInt(searchParams.get('limit') || '20')

    if (type === 'companies') {
      // Fetch companies for discovery
      const companies = await prisma.card.findMany({
        where: {
          category: {
            in: ['TECHNOLOGY', 'AUTOMOTIVE', 'ENTERTAINMENT', 'FINANCE']
          }
        },
        take: limit,
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          imageUrl: true,
          marketCap: true,
          revenue: true,
          employees: true,
          founded: true,
          advantages: true,
          weaknesses: true,
          battlePower: true,
          defensiveRating: true,
          acquisitionPrice: true,
          ceo: true,
          headquarters: true,
          recentNews: true,
          stockPrice: true,
          priceChange: true,
          battleHistory: true
        },
        orderBy: {
          battlePower: 'desc'
        }
      })

      return NextResponse.json({
        success: true,
        companies
      })
    }

    // Fetch active M&A battles
    const battles = await prisma.mABattle.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'VOTING']
        }
      },
      take: limit,
      include: {
        challenger: {
          select: {
            id: true,
            name: true,
            category: true,
            battlePower: true,
            defensiveRating: true,
            imageUrl: true
          }
        },
        defender: {
          select: {
            id: true,
            name: true,
            category: true,
            battlePower: true,
            defensiveRating: true,
            imageUrl: true
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const enrichedBattles = await Promise.all(
      battles.map(async (battle) => {
        // Get vote counts
        const challengerVotes = await prisma.mABattleVote.count({
          where: {
            battleId: battle.id,
            choice: 'CHALLENGER'
          }
        })

        const defenderVotes = await prisma.mABattleVote.count({
          where: {
            battleId: battle.id,
            choice: 'DEFENDER'
          }
        })

        // Get pot size
        const potSizeResult = await prisma.mABattleVote.aggregate({
          where: { battleId: battle.id },
          _sum: { amount: true }
        })

        return {
          ...battle,
          timeLeft: battle.endTime.getTime() - Date.now(),
          totalVotes: challengerVotes + defenderVotes,
          challengerVotes,
          defenderVotes,
          potSize: potSizeResult._sum.amount || 0,
          participants: battle._count.votes
        }
      })
    )

    return NextResponse.json({
      success: true,
      battles: enrichedBattles
    })

  } catch (error) {
    console.error('Error fetching M&A battles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch M&A battles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { action, ...data } = await request.json()

    if (action === 'create_battle') {
      const { challengerId, defenderId } = data

      if (!challengerId || !defenderId || challengerId === defenderId) {
        return NextResponse.json(
          { success: false, error: 'Invalid battle parameters' },
          { status: 400 }
        )
      }

      // Check if companies exist
      const [challenger, defender] = await Promise.all([
        prisma.card.findUnique({ where: { id: challengerId } }),
        prisma.card.findUnique({ where: { id: defenderId } })
      ])

      if (!challenger || !defender) {
        return NextResponse.json(
          { success: false, error: 'Invalid company selection' },
          { status: 400 }
        )
      }

      // Create battle
      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      
      const battle = await prisma.mABattle.create({
        data: {
          challengerId,
          defenderId,
          creatorId: session.user.id,
          status: 'VOTING',
          endTime
        },
        include: {
          challenger: { select: { name: true } },
          defender: { select: { name: true } }
        }
      })

      return NextResponse.json({
        success: true,
        battle,
        message: `Created M&A battle: ${challenger.name} vs ${defender.name}`
      })

    } else if (action === 'vote') {
      const { battleId, choice, amount } = data

      if (!battleId || !choice || !amount || amount <= 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid vote parameters' },
          { status: 400 }
        )
      }

      // Check if battle exists and is active
      const battle = await prisma.mABattle.findUnique({
        where: { id: battleId },
        include: { challenger: true, defender: true }
      })

      if (!battle || battle.status !== 'VOTING' || battle.endTime <= new Date()) {
        return NextResponse.json(
          { success: false, error: 'Battle not available for voting' },
          { status: 400 }
        )
      }

      // Check user balance
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { eceBalance: true }
      })

      if (!user || user.eceBalance < amount) {
        return NextResponse.json(
          { success: false, error: 'Insufficient ECE balance' },
          { status: 400 }
        )
      }

      // Create vote and update balance
      const result = await prisma.$transaction(async (tx) => {
        const vote = await tx.mABattleVote.create({
          data: {
            battleId,
            userId: session.user.id,
            choice: choice as 'CHALLENGER' | 'DEFENDER',
            amount
          }
        })

        await tx.user.update({
          where: { id: session.user.id },
          data: { eceBalance: { decrement: amount } }
        })

        return vote
      })

      const chosenCompany = choice === 'CHALLENGER' ? battle.challenger.name : battle.defender.name

      return NextResponse.json({
        success: true,
        vote: result,
        message: `Successfully voted ${amount} ECE for ${chosenCompany}`
      })

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error processing M&A battle action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process M&A battle action' },
      { status: 500 }
    )
  }
}
