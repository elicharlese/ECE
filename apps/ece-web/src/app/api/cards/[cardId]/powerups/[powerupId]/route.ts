// Remove Powerup from Card API
// /apps/ece-web/src/app/api/cards/[cardId]/powerups/[powerupId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PowerupService } from '@/services/powerupService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * DELETE /api/cards/[cardId]/powerups/[powerupId] - Remove powerup from card
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { cardId: string; powerupId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const success = await PowerupService.removePowerupFromCard(
      session.user.id,
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
