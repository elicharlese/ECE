import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'battles'
    const limit = parseInt(searchParams.get('limit') || '20')

    if (type === 'companies') {
      // Fetch companies for discovery (select only valid Card fields)
      const companies = await prisma.card.findMany({
        where: {
          category: {
            in: ['TECHNOLOGY', 'AUTOMOTIVE', 'ENTERTAINMENT', 'SPORTS']
          }
        },
        take: limit,
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          imageUrl: true,
          currentPrice: true
        },
        orderBy: {
          currentPrice: 'desc'
        }
      })

      return NextResponse.json({
        success: true,
        companies
      })
    }

    // Fetch active M&A battles (align with Prisma schema relations/fields)
    const battles = await prisma.mABattle.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'VOTING']
        }
      },
      take: limit,
      include: {
        initiatorCard: {
          select: {
            id: true,
            name: true,
            category: true,
            imageUrl: true
          }
        },
        targetCard: {
          select: {
            id: true,
            name: true,
            category: true,
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

    const enrichedBattles = battles.map((battle: any) => {
      const votingEndsAt = new Date(battle.votingPeriod)
      return {
        ...battle,
        timeLeft: votingEndsAt.getTime() - Date.now(),
        totalVotes: battle?._count?.votes ?? 0,
        participants: battle?._count?.votes ?? 0
      }
    })

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
    const user = await getCurrentUser(request)
    if (!user?.id) {
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

      // Create battle (align with Prisma schema)
      const votingPeriod = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      const timeline = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours total timeline

      const battle = await prisma.mABattle.create({
        data: {
          initiatorCardId: challengerId,
          targetCardId: defenderId,
          initiatorUserId: user.id,
          battleType: 'COMPETITIVE_CHALLENGE',
          title: `${challenger.name} vs ${defender.name}`,
          description: `Competitive challenge between ${challenger.name} and ${defender.name}.`,
          stakes: 0,
          timeline,
          votingPeriod,
          status: 'VOTING'
        },
        include: {
          initiatorCard: { select: { name: true } },
          targetCard: { select: { name: true } }
        }
      })

      return NextResponse.json({
        success: true,
        battle,
        message: `Created M&A battle: ${challenger.name} vs ${defender.name}`
      })

    } else if (action === 'vote') {
      const { battleId, amount, vote } = data as { battleId: string; amount?: number; vote?: 'APPROVE' | 'REJECT' | 'ABSTAIN' }

      if (!battleId) {
        return NextResponse.json(
          { success: false, error: 'Invalid vote parameters' },
          { status: 400 }
        )
      }

      // Check if battle exists and is in voting window
      const battle = await prisma.mABattle.findUnique({
        where: { id: battleId }
      })

      if (!battle || battle.status !== 'VOTING' || new Date(battle.votingPeriod) <= new Date()) {
        return NextResponse.json(
          { success: false, error: 'Battle not available for voting' },
          { status: 400 }
        )
      }

      // Create vote (align with BattleVoting model)
      const createdVote = await prisma.battleVoting.create({
        data: {
          battleId,
          voterId: user.id,
          vote: (vote ?? 'APPROVE') as any,
          voteWeight: amount ?? 1,
          eceStaked: amount ?? undefined
        }
      })

      return NextResponse.json({
        success: true,
        vote: createdVote,
        message: `Vote submitted${amount ? ` with ${amount} ECE staked` : ''}`
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
