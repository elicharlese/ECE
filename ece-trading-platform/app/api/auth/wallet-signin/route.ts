import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/src/lib/user-store';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature } = await request.json();

    if (!walletAddress || !signature) {
      return NextResponse.json(
        { success: false, error: 'Wallet address and signature are required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would verify the signature here
    // For this demo, we'll just check if the wallet address is valid
    const walletRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/; // Basic Solana wallet format
    
    if (!walletRegex.test(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Check if user exists with this wallet address
    let user = userStore.getByWalletAddress(walletAddress);

    if (!user) {
      // Create new user for this wallet
      user = await userStore.create({
        email: `${walletAddress.slice(0, 8)}@wallet.ece`,
        name: `Wallet User (${walletAddress.slice(0, 8)})`,
        walletAddress,
        provider: 'solana',
        role: 'user',
        profile: {
          firstName: 'Wallet',
          lastName: 'User',
          notifications: {
            email: false,
            push: true,
            sms: false,
          },
        },
      });
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Wallet signin error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
