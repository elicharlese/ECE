// Powerup API Routes - RESTful endpoints for powerup operations
// /apps/ece-web/src/app/api/powerups/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PowerupService } from '@/services/powerupService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
      search
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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin (placeholder - implement with actual role check)
    const isAdmin = session.user.email?.includes('admin') || false;
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin privileges required' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Implement powerup creation logic
    const newPowerup = await PowerupService.createPowerupType({
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      category: data.category,
      rarity: data.rarity,
      iconUrl: data.iconUrl,
      animationUrl: data.animationUrl,
      effectColor: data.effectColor,
      glowEffect: data.glowEffect || false,
      particleEffect: data.particleEffect || false,
      baseCost: data.baseCost,
      duration: data.duration,
      maxStacks: data.maxStacks || 1,
      cooldownDuration: data.cooldownDuration || 0,
      isLimited: data.isLimited || false,
      effects: data.effects,
      acquisitionSources: data.acquisitionSources,
      requirements: data.requirements
    });
    
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
