import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Record a swipe action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cardId, 
      action, 
      walletAddress, 
      sessionId,
      position,
      timeSpent,
      swipeVelocity,
      recommendationScore,
      algorithmVersion
    } = body;

    if (!cardId || !action || !walletAddress) {
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

    // Record swipe action
    const swipeAction = await prisma.swipeAction.create({
      data: {
        userId: user.id,
        cardId,
        action: action as SwipeActionType,
        sessionId,
        position,
        timeSpent,
        swipeVelocity,
        recommendationScore,
        algorithmVersion
      }
    });

    // Update user preferences based on swipe patterns (learning algorithm)
    await updateUserPreferences(user.id, card, action as SwipeActionType);

    return NextResponse.json({
      success: true,
      message: 'Swipe action recorded successfully',
      swipeAction
    });

  } catch (error) {
    console.error('Swipe action recording error:', error);
    return NextResponse.json({ 
      error: 'Internal server error recording swipe action' 
    }, { status: 500 });
  }
}

// Get user's swipe history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sessionId = searchParams.get('sessionId');

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
    if (sessionId) {
      where.sessionId = sessionId;
    }

    const swipeActions = await prisma.swipeAction.findMany({
      where,
      include: {
        card: {
          select: { id: true, name: true, category: true, rarity: true, imageUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return NextResponse.json({
      success: true,
      swipeActions
    });

  } catch (error) {
    console.error('Get swipe actions error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching swipe actions' 
    }, { status: 500 });
  }
}

// Helper function to update user preferences based on swipe patterns
async function updateUserPreferences(userId: string, card: any, action: SwipeActionType) {
  try {
    // Get or create user preferences
    let preferences = await prisma.userSwipePreferences.findUnique({
      where: { userId }
    });

    if (!preferences) {
      preferences = await prisma.userSwipePreferences.create({
        data: { userId }
      });
    }

    // Update preferences based on action
    const updates: any = {};

    if (action === SwipeActionType.LIKE || action === SwipeActionType.SUPER_LIKE) {
      // Increase preference for this category/rarity
      const currentPrefs = preferences.preferredCategories || {};
      const currentRarities = preferences.preferredRarities || {};

      // Update category preference
      const categoryKey = card.category;
      currentPrefs[categoryKey] = (currentPrefs[categoryKey] || 0.5) + 0.1;
      if (currentPrefs[categoryKey] > 1.0) currentPrefs[categoryKey] = 1.0;

      // Update rarity preference
      const rarityKey = card.rarity;
      currentRarities[rarityKey] = (currentRarities[rarityKey] || 0.5) + 0.1;
      if (currentRarities[rarityKey] > 1.0) currentRarities[rarityKey] = 1.0;

      updates.preferredCategories = currentPrefs;
      updates.preferredRarities = currentRarities;
    } else if (action === SwipeActionType.PASS) {
      // Decrease preference for this category/rarity
      const currentPrefs = preferences.preferredCategories || {};
      const currentRarities = preferences.preferredRarities || {};

      const categoryKey = card.category;
      currentPrefs[categoryKey] = (currentPrefs[categoryKey] || 0.5) - 0.05;
      if (currentPrefs[categoryKey] < 0.0) currentPrefs[categoryKey] = 0.0;

      const rarityKey = card.rarity;
      currentRarities[rarityKey] = (currentRarities[rarityKey] || 0.5) - 0.05;
      if (currentRarities[rarityKey] < 0.0) currentRarities[rarityKey] = 0.0;

      updates.preferredCategories = currentPrefs;
      updates.preferredRarities = currentRarities;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.userSwipePreferences.update({
        where: { userId },
        data: updates
      });
    }

  } catch (error) {
    console.error('Error updating user preferences:', error);
    // Don't throw error - preference updates are not critical
  }
}
