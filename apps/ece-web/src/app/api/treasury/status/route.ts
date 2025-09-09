import { NextRequest, NextResponse } from 'next/server';
import { ECETreasuryService } from '../../../../services/ece-treasury.service';

/**
 * GET /api/treasury/status
 * Get current treasury status including ECE circulation, USDC reserves, and company balances
 */
export async function GET(request: NextRequest) {
  try {
    // Get wallet address from headers (set by middleware)
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

    const status = await ECETreasuryService.getTreasuryStatus();

    return NextResponse.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Treasury status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get treasury status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
