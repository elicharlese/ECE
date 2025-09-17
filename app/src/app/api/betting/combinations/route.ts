import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { MultiPickBettingService } from '../../services/multi-pick-betting';

const prisma = new PrismaClient();
const bettingService = new MultiPickBettingService(prisma);

// Create a betting combination (multi-pick bet)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { picks, stake, walletAddress } = body;

    if (!picks || !stake || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!Array.isArray(picks) || picks.length === 0) {
      return NextResponse.json({ error: 'Picks must be a non-empty array' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate picks format
    for (const pick of picks) {
      if (!pick.marketId || !pick.position || !pick.odds) {
        return NextResponse.json({ 
          error: 'Each pick must have marketId, position, and odds' 
        }, { status: 400 });
      }
    }

    // Create betting combination
    const betRequest = {
      userId: user.id,
      picks,
      stake
    };

    const result = await bettingService.createBetCombination(betRequest);

    return NextResponse.json({
      success: true,
      message: 'Betting combination created successfully',
      combination: result
    });

  } catch (error: any) {
    console.error('Betting combination creation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error creating betting combination' 
    }, { status: 500 });
  }
}

// Get user's betting combinations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const combinations = await bettingService.getUserCombinations(user.id);

    return NextResponse.json({
      success: true,
      combinations
    });

  } catch (error: any) {
    console.error('Get betting combinations error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching betting combinations' 
    }, { status: 500 });
  }
}

// Cancel a betting combination
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const combinationId = searchParams.get('combinationId');
    const walletAddress = searchParams.get('walletAddress');

    if (!combinationId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await bettingService.cancelCombination(combinationId, user.id);

    return NextResponse.json({
      success: true,
      message: 'Betting combination cancelled successfully'
    });

  } catch (error: any) {
    console.error('Cancel betting combination error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error cancelling betting combination' 
    }, { status: 500 });
  }
}
