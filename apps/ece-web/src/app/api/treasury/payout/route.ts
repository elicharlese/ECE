import { NextRequest, NextResponse } from 'next/server';
import { ECETreasuryService } from '../../../../services/ece-treasury.service';
import { z } from 'zod';

const PayoutRequestSchema = z.object({
  revenueAmount: z.number().min(0),
  payoutPercentage: z.number().min(0).max(100),
  authorizedSigners: z.array(z.string())
});

/**
 * POST /api/treasury/payout
 * Process weekly company payout from ECE revenue to USDC
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

    // Check if user is authorized admin
    const authorizedAdmins = process.env.ECE_ADMIN_WALLETS?.split(',') || [];
    if (!authorizedAdmins.includes(walletAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = PayoutRequestSchema.parse(body);

    // Add the requesting wallet to authorized signers if not already included
    if (!validatedData.authorizedSigners.includes(walletAddress)) {
      validatedData.authorizedSigners.push(walletAddress);
    }

    const result = await ECETreasuryService.processWeeklyPayout(validatedData);

    return NextResponse.json({
      success: result.success,
      data: result.success ? {
        payoutId: result.payoutId,
        eceConverted: result.eceConverted,
        usdcReceived: result.usdcReceived,
        transactionSignature: result.transactionSignature
      } : null,
      error: result.error
    });

  } catch (error) {
    console.error('Weekly payout error:', error);
    
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
        error: 'Failed to process weekly payout',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/treasury/payout
 * Get payout history with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 401 }
      );
    }

    // Check if user is authorized admin
    const authorizedAdmins = process.env.ECE_ADMIN_WALLETS?.split(',') || [];
    if (!authorizedAdmins.includes(walletAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const history = await ECETreasuryService.getPayoutHistory(page, limit);

    return NextResponse.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Payout history error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get payout history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
