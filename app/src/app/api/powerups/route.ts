// Powerup API Routes - RESTful endpoints for powerup operations
// /app/src/app/api/powerups/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PowerupService } from '@/services/powerupService';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

/**
 * GET /api/powerups - Get all available powerup types
 * Query params:
 * - category: PowerupCategory (optional)
 * - rarity: PowerupRarity (optional)
 * - search: string (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as any;
    const rarity = searchParams.get('rarity') as any;
    const search = searchParams.get('search');

    const powerups = await PowerupService.getPowerupsByFilter(
      category,
      rarity,
      search || undefined
    );

    return NextResponse.json({
      success: true,
      data: powerups,
      total: powerups.length
    });
  } catch (error) {
    console.error('Error fetching powerups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch powerups' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/powerups - Create new powerup type (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    requireAdmin(user);
    
    const data = await request.json();
    
    // Placeholder for powerup creation logic
    // In a real implementation, this would create a new powerup type in the database
    const newPowerup = {
      id: Date.now().toString(),
      name: data.name || 'New Powerup',
      displayName: data.displayName || 'New Powerup',
      description: data.description || 'A new powerup',
      category: data.category || 'ATTACK',
      rarity: data.rarity || 'COMMON',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: newPowerup,
      message: 'Powerup created successfully'
    });
  } catch (error) {
    console.error('Error creating powerup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create powerup' },
      { status: 500 }
    );
  }
}
