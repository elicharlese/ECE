import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, AutoBidStrategy } from '@prisma/client';
import { AutoBidService } from '../../../../services/auto-bid';

const prisma = new PrismaClient();
const autoBidService = new AutoBidService(prisma);

// Create or update auto-bid rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      auctionId, 
      maxBidAmount, 
      strategy = 'AGGRESSIVE',
      bidIncrement = 10,
      minBidGap = 5,
      walletAddress 
    } = body;

    if (!auctionId || !maxBidAmount || !walletAddress) {
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
    if (user.eceBalance < maxBidAmount) {
      return NextResponse.json({ 
        error: 'Insufficient balance for auto-bid maximum',
        required: maxBidAmount,
        current: user.eceBalance
      }, { status: 400 });
    }

    // Create or update auto-bid rule
    const autoBidRule = await autoBidService.createAutoBidRule({
      userId: user.id,
      auctionId,
      maxBidAmount,
      strategy: strategy as AutoBidStrategy,
      bidIncrement,
      minBidGap
    });

    return NextResponse.json({
      success: true,
      message: 'Auto-bid rule created successfully',
      autoBidRule
    });

  } catch (error: any) {
    console.error('Auto-bid rule creation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error creating auto-bid rule' 
    }, { status: 500 });
  }
}

// Get user's auto-bid rules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const auctionId = searchParams.get('auctionId');

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

    const where: any = { userId: user.id };
    if (auctionId) {
      where.auctionId = auctionId;
    }

    const autoBidRules = await prisma.autoBidRule.findMany({
      where,
      include: {
        auction: {
          include: {
            card: {
              select: { id: true, name: true, category: true, rarity: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      autoBidRules
    });

  } catch (error: any) {
    console.error('Get auto-bid rules error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching auto-bid rules' 
    }, { status: 500 });
  }
}

// Update auto-bid rule
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ruleId, maxBidAmount, strategy, isActive, walletAddress } = body;

    if (!ruleId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update auto-bid rule
    const updateData: any = {};
    if (maxBidAmount !== undefined) updateData.maxBidAmount = maxBidAmount;
    if (strategy !== undefined) updateData.strategy = strategy;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedRule = await prisma.autoBidRule.update({
      where: { 
        id: ruleId,
        userId: user.id // Ensure user owns the rule
      },
      data: updateData,
      include: {
        auction: {
          include: {
            card: {
              select: { id: true, name: true, category: true, rarity: true }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Auto-bid rule updated successfully',
      autoBidRule: updatedRule
    });

  } catch (error: any) {
    console.error('Auto-bid rule update error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error updating auto-bid rule' 
    }, { status: 500 });
  }
}

// Delete auto-bid rule
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('ruleId');
    const walletAddress = searchParams.get('walletAddress');

    if (!ruleId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete auto-bid rule
    await prisma.autoBidRule.delete({
      where: { 
        id: ruleId,
        userId: user.id // Ensure user owns the rule
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Auto-bid rule deleted successfully'
    });

  } catch (error: any) {
    console.error('Auto-bid rule deletion error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error deleting auto-bid rule' 
    }, { status: 500 });
  }
}
