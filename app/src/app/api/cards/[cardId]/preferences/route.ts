import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ cardId: string }> }
) {
  try {
    const { params } = context;
    const { cardId } = await params;
    const body = await request.json();
    const { 
      walletAddress,
    } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Verify user owns the card
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        owner: { select: { walletAddress: true } }
      }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.owner.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Not authorized to modify this card' }, { status: 403 });
    }

    // Update card preferences
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
      },
      include: {
        owner: {
          select: { username: true, walletAddress: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      card: updatedCard
    });

  } catch (error) {
    console.error('Card preferences update error:', error);
    return NextResponse.json({ 
      error: 'Internal server error updating card preferences' 
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ cardId: string }> }
) {
  try {
    const { params } = context;
    const { cardId } = await params;

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        name: true,
        owner: {
          select: { username: true, walletAddress: true }
        }
      }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, card });

  } catch (error) {
    console.error('Get card preferences error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching card preferences' 
    }, { status: 500 });
  }
}
