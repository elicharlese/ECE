import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Find or create user by wallet address
    let user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
      select: {
        id: true,
        walletAddress: true,
        eceBalance: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    });

    if (!user) {
      // Create new user with wallet address
      const username = `user_${address.slice(-8)}`;
      user = await prisma.user.create({
        data: {
          walletAddress: address.toLowerCase(),
          username,
          eceBalance: 100.0, // Welcome bonus
        },
        select: {
          id: true,
          walletAddress: true,
          eceBalance: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user,
      eceBalance: user.eceBalance,
    });
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
