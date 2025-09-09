import { NextRequest, NextResponse } from 'next/server';
import { ECETreasuryService } from '../../../../services/ece-treasury.service';
import { z } from 'zod';

const EmergencyActionSchema = z.object({
  action: z.enum(['pause', 'unpause']),
  reason: z.string().min(1, 'Reason required for emergency action')
});

/**
 * POST /api/treasury/emergency
 * Emergency pause/unpause treasury operations
 */
export async function POST(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 401 }
      );
    }

    // Check if user is authorized for emergency operations
    const emergencySigners = process.env.ECE_EMERGENCY_SIGNERS?.split(',') || [];
    if (!emergencySigners.includes(walletAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized: Emergency signer access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = EmergencyActionSchema.parse(body);

    let result;
    if (validatedData.action === 'pause') {
      result = await ECETreasuryService.emergencyPause(walletAddress);
    } else {
      // Note: emergencyUnpause method would need to be implemented in ECETreasuryService
      result = { success: false, error: 'Emergency unpause not yet implemented' };
    }

    return NextResponse.json({
      success: result.success,
      data: result.success ? {
        action: validatedData.action,
        authorizedBy: walletAddress,
        reason: validatedData.reason,
        timestamp: new Date().toISOString()
      } : null,
      error: result.error
    });

  } catch (error) {
    console.error('Emergency action error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to execute emergency action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
