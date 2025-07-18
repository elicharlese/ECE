// Powerup Details API - Get specific powerup information
// /apps/ece-web/src/app/api/powerups/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PowerupService } from '@/services/powerupService';

/**
 * GET /api/powerups/[id] - Get powerup type details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const powerup = await PowerupService.getPowerupTypeById(params.id);

    if (!powerup) {
      return NextResponse.json(
        { success: false, error: 'Powerup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: powerup
    });
  } catch (error) {
    console.error('Error fetching powerup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch powerup' },
      { status: 500 }
    );
  }
}
