// User Powerup Inventory API - Manage user's powerup collection
// /apps/ece-web/src/app/api/users/[userId]/powerups/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PowerupService } from '@/services/powerupService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/users/[userId]/powerups - Get user's powerup inventory
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Users can only access their own inventory
    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const inventory = await PowerupService.getUserPowerupInventory(params.userId);

    return NextResponse.json({
      success: true,
      data: inventory,
      total: inventory.length
    });
  } catch (error) {
    console.error('Error fetching user powerups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch powerups' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users/[userId]/powerups - Add powerup to user inventory
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const { powerupId, quantity = 1, source = 'PURCHASE', sourceId } = await request.json();

    if (!powerupId) {
      return NextResponse.json(
        { success: false, error: 'Powerup ID is required' },
        { status: 400 }
      );
    }

    const userPowerup = await PowerupService.addPowerupToInventory(
      params.userId,
      powerupId,
      quantity,
      source,
      sourceId
    );

    return NextResponse.json({
      success: true,
      data: userPowerup,
      message: 'Powerup added to inventory'
    });
  } catch (error) {
    console.error('Error adding powerup to inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add powerup' },
      { status: 500 }
    );
  }
}
