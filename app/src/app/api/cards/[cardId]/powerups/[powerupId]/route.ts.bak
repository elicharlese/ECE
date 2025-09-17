// Remove Powerup from Card API
// /apps/ece-web/src/app/api/cards/[cardId]/powerups/[powerupId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PowerupService } from '@/services/powerupService';
import { getCurrentUser } from '@/lib/auth';

/**
 * DELETE /api/cards/[cardId]/powerups/[powerupId] - Remove powerup from card
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ cardId: string; powerupId: string }> }
) {
  try {
    const params = await context.params;
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const success = await PowerupService.removePowerupFromCard(
      user.id,
      params.cardId,
      params.powerupId
    );

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to remove powerup' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Powerup removed successfully'
    });
  } catch (error) {
    console.error('Error removing powerup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove powerup' },
      { status: 500 }
    );
  }
}
