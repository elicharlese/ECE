import { NextRequest, NextResponse } from 'next/server';
import { ECETreasuryService } from '../../services/ece-treasury.service';
import { z } from 'zod';

const BurnRequestSchema = z.object({
  eceAmount: z.number().min(0.01, 'Minimum burn amount is 0.01 ECE'),
  userWallet: z.string().min(1, 'User wallet address required')
});

/**
 * POST /api/treasury/burn
 * Burn ECE tokens and release USDC
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

    const body = await request.json();
    const validatedData = BurnRequestSchema.parse(body);

    // Ensure user can only burn from their own wallet unless they're an admin
    const authorizedAdmins = process.env.ECE_ADMIN_WALLETS?.split(',') || [];
    const isAdmin = authorizedAdmins.includes(walletAddress);
    
    if (!isAdmin && validatedData.userWallet !== walletAddress) {
      return NextResponse.json(
        { error: 'Can only burn tokens from your own wallet' },
        { status: 403 }
      );
    }

    const result = await ECETreasuryService.burnECETokens(
      validatedData.userWallet,
      validatedData.eceAmount
    );

    return NextResponse.json({
      success: result.success,
      data: result.success ? {
        usdcAmount: result.usdcAmount,
        transactionSignature: result.transactionSignature
      } : null,
      error: result.error
    });

  } catch (error) {
    console.error('ECE burning error:', error);
    
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
        error: 'Failed to burn ECE tokens',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
