import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client"';

const prisma = new PrismaClient();

// Get user swipe preferences
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

    // Get or create user preferences
    let preferences = await prisma.userSwipePreferences.findUnique({
      where: { userId: user.id }
    });

    if (!preferences) {
      preferences = await prisma.userSwipePreferences.create({
        data: { userId: user.id }
      });
    }

    return NextResponse.json({
      success: true,
      preferences
    });

  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching preferences' 
    }, { status: 500 });
  }
}

// Update user swipe preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      walletAddress,
      preferredCategories,
      preferredRarities,
      minPricePreference,
      maxPricePreference,
      preferredCardTypes,
      avoidCategories,
      explorationRate,
      diversityScore
    } = body;

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

    // Get or create user preferences
    let preferences = await prisma.userSwipePreferences.findUnique({
      where: { userId: user.id }
    });

    const updateData: any = {};
    
    if (preferredCategories !== undefined) updateData.preferredCategories = preferredCategories;
    if (preferredRarities !== undefined) updateData.preferredRarities = preferredRarities;
    if (minPricePreference !== undefined) updateData.minPricePreference = minPricePreference;
    if (maxPricePreference !== undefined) updateData.maxPricePreference = maxPricePreference;
    if (preferredCardTypes !== undefined) updateData.preferredCardTypes = preferredCardTypes;
    if (avoidCategories !== undefined) updateData.avoidCategories = avoidCategories;
    if (explorationRate !== undefined) updateData.explorationRate = explorationRate;
    if (diversityScore !== undefined) updateData.diversityScore = diversityScore;

    if (preferences) {
      // Update existing preferences
      preferences = await prisma.userSwipePreferences.update({
        where: { userId: user.id },
        data: updateData
      });
    } else {
      // Create new preferences
      preferences = await prisma.userSwipePreferences.create({
        data: {
          userId: user.id,
          ...updateData
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json({ 
      error: 'Internal server error updating preferences' 
    }, { status: 500 });
  }
}

// Reset user preferences to defaults
export async function DELETE(request: NextRequest) {
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

    // Reset preferences to defaults
    const defaultPreferences = {
      preferredCategories: {},
      preferredRarities: {},
      minPricePreference: null,
      maxPricePreference: null,
      preferredCardTypes: [],
      avoidCategories: [],
      explorationRate: 0.1,
      diversityScore: 0.5
    };

    let preferences = await prisma.userSwipePreferences.findUnique({
      where: { userId: user.id }
    });

    if (preferences) {
      preferences = await prisma.userSwipePreferences.update({
        where: { userId: user.id },
        data: defaultPreferences
      });
    } else {
      preferences = await prisma.userSwipePreferences.create({
        data: {
          userId: user.id,
          ...defaultPreferences
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Preferences reset to defaults',
      preferences
    });

  } catch (error) {
    console.error('Reset preferences error:', error);
    return NextResponse.json({ 
      error: 'Internal server error resetting preferences' 
    }, { status: 500 });
  }
}
