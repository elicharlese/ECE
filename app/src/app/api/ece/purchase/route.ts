import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, amount, paymentMethod, transactionHash } = body;

    if (!walletAddress || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create ECE purchase transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'ECE_PURCHASE',
        amount,
        currency: 'ECE',
        status: 'COMPLETED',
        description: `ECE Purchase - ${amount} ECE tokens`,
        paymentMethod,
        paymentId: transactionHash,
        metadata: {
          walletAddress,
          purchaseType: 'direct',
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Update user ECE balance
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        eceBalance: {
          increment: amount,
        },
      },
      select: {
        id: true,
        walletAddress: true,
        eceBalance: true,
        username: true,
      },
    });

    return NextResponse.json({
      success: true,
      transaction,
      user: updatedUser,
      newBalance: updatedUser.eceBalance,
    });
  } catch (error) {
    console.error('Error processing ECE purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
