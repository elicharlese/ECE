// Battles API - Handles battle creation and app performance metrics competitions
import { NextRequest, NextResponse } from 'next/server'
import { mockDatabase } from '@/lib/db'
import { Battle, ApiResponse } from '@/lib/db/schema'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const metric = searchParams.get('metric')

    // Get battles based on filters
    const battles: Battle[] = [] // MockDatabase.findBattles() - to be implemented

    const response: ApiResponse<Battle[]> = {
      success: true,
      data: battles
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Battles GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch battles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { 
      title, 
      description, 
      card1Id, 
      card2Id, 
      metric, 
      duration,
      entryFee,
      creatorId 
    } = body

    if (!title || !description || !card1Id || !card2Id || !metric || !duration || !creatorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['valuation', 'volume', 'growth', 'performance'].includes(metric)) {
      return NextResponse.json(
        { success: false, error: 'Invalid metric' },
        { status: 400 }
      )
    }

    if (card1Id === card2Id) {
      return NextResponse.json(
        { success: false, error: 'Battle cards must be different' },
        { status: 400 }
      )
    }

    // Create new battle
    // Mock battle creation - to be implemented with real database
    const newBattle = {
      id: Date.now(),
      title,
      description,
      card1Id,
      card2Id,
      metric,
      duration,
      entryFee: entryFee || 0,
      totalPrizePool: entryFee || 0,
      participantCount: 0,
      creatorId,
      status: 'pending' as const,
      expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000), // duration in hours
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [],
      winnerCardId: null,
      endedAt: null
    }

    return NextResponse.json({
      success: true,
      data: newBattle,
      message: 'Battle created successfully'
    })
  } catch (error) {
    console.error('Create Battle Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create battle' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { battleId, action, userId, chosenCardId, amount } = body

    if (!battleId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: battleId, action' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'join':
        if (!userId || !chosenCardId || !amount) {
          return NextResponse.json(
            { success: false, error: 'Missing fields for join action: userId, chosenCardId, amount' },
            { status: 400 }
          )
        }

        // Join battle logic (mock implementation)
        const participant = {
          id: `participant_${Date.now()}`,
          battleId,
          userId,
          chosenCardId,
          amount,
          status: 'active',
          createdAt: new Date()
        }

        return NextResponse.json({
          success: true,
          data: participant,
          message: 'Successfully joined battle'
        })

      case 'start':
        // Start battle logic
        return NextResponse.json({
          success: true,
          message: 'Battle started successfully'
        })

      case 'resolve':
        // Resolve battle logic
        return NextResponse.json({
          success: true,
          message: 'Battle resolved successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Update Battle Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update battle' },
      { status: 500 }
    )
  }
}
