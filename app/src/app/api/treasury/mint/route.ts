import { NextRequest, NextResponse } from 'next/server';
import { ECETreasuryService } from '../../services/ece-treasury.service';
import { z } from 'zod';

const MintRequestSchema = z.object({
  usdcAmount: z.number().min(0.01, 'Minimum mint amount is 0.01 USDC'),
  userWallet: z.string().min(1, 'User wallet address required')
});

/**
 * POST /api/treasury/mint
 * Mint ECE tokens backed by USDC deposit
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
    const validatedData = MintRequestSchema.parse(body);

    // Ensure user can only mint for their own wallet unless they're an admin
    const authorizedAdmins = process.env.ECE_ADMIN_WALLETS?.split(',') || [];
    const isAdmin = authorizedAdmins.includes(walletAddress);
    
    if (!isAdmin && validatedData.userWallet !== walletAddress) {
      return NextResponse.json(
        { error: 'Can only mint tokens for your own wallet' },
        { status: 403 }
      );
    }

    const result = await ECETreasuryService.mintECETokens(
      validatedData.userWallet,
      validatedData.usdcAmount
    );

    return NextResponse.json({
      success: result.success,
      data: result.success ? {
        eceAmount: result.eceAmount,
        transactionSignature: result.transactionSignature
      } : null,
      error: result.error
    });

  } catch (error) {
    console.error('ECE minting error:', error);
    
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
        error: 'Failed to mint ECE tokens',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
