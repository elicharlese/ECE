// Card Powerup Application API - Apply/remove powerups to cards
// /apps/ece-web/src/app/api/cards/[cardId]/powerups/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PowerupService } from '@/services/powerupService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/cards/[cardId]/powerups - Get all powerups applied to a card
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const cardPowerups = await PowerupService.getCardPowerups(params.cardId);

    return NextResponse.json({
      success: true,
      data: cardPowerups,
      total: cardPowerups.length
    });
  } catch (error) {
    console.error('Error fetching card powerups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch card powerups' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cards/[cardId]/powerups - Apply powerup to card
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { powerupId, config } = await request.json();

    if (!powerupId) {
      return NextResponse.json(
        { success: false, error: 'Powerup ID is required' },
        { status: 400 }
      );
    }

    const cardPowerup = await PowerupService.applyPowerupToCard(
      session.user.id,
      params.cardId,
      powerupId,
      config
    );

    if (!cardPowerup) {
      return NextResponse.json(
        { success: false, error: 'Failed to apply powerup' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cardPowerup,
      message: 'Powerup applied successfully'
    });
  } catch (error) {
    console.error('Error applying powerup:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to apply powerup' },
      { status: 500 }
    );
  }
}
