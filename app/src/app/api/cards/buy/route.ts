import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, walletAddress } = body;

    if (!cardId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user exists and has sufficient ECE balance
    const buyer = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!buyer) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify card exists and is available for buying
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        owner: { select: { id: true, walletAddress: true, username: true } }
      }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (!card.availableForBuying) {
      return NextResponse.json({ error: 'Card is not available for purchase' }, { status: 400 });
    }

    if (card.owner.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot buy your own card' }, { status: 400 });
    }

    // Determine purchase price (fixed price or current market price)
    const purchasePrice = card.fixedBuyPrice || card.currentPrice;

    if (buyer.eceBalance < purchasePrice) {
      return NextResponse.json({ 
        error: 'Insufficient ECE balance',
        required: purchasePrice,
        current: buyer.eceBalance
      }, { status: 400 });
    }

    // Execute the purchase transaction
    const result = await prisma.$transaction(async (tx) => {
      // Transfer ECE from buyer to seller
      await tx.user.update({
        where: { id: buyer.id },
        data: { eceBalance: { decrement: purchasePrice } }
      });

      await tx.user.update({
        where: { id: card.ownerId },
        data: { eceBalance: { increment: purchasePrice } }
      });

      // Transfer card ownership
      const updatedCard = await tx.card.update({
        where: { id: cardId },
        data: {
          ownerId: buyer.id,
          // Reset preferences to defaults for new owner
          availableForBidding: true,
          availableForBuying: false, // Turn off buying after purchase
          availableForBattling: true,
          minimumBidAmount: null,
          fixedBuyPrice: null,
          battleStakeAmount: null
        },
        include: {
          owner: {
            select: { username: true, walletAddress: true }
          }
        }
      });

      // Record purchase transaction for buyer
      const buyerTransaction = await tx.transaction.create({
        data: {
          userId: buyer.id,
          type: 'CARD_PURCHASE',
          amount: purchasePrice,
          currency: 'ECE',
          status: 'COMPLETED',
          description: `Purchased card: ${card.name}`,
          metadata: {
            cardId,
            sellerId: card.ownerId,
            purchaseType: 'direct_buy'
          }
        }
      });

      // Record sale transaction for seller
      const sellerTransaction = await tx.transaction.create({
        data: {
          userId: card.ownerId,
          type: 'CARD_SALE',
          amount: purchasePrice,
          currency: 'ECE',
          status: 'COMPLETED',
          description: `Sold card: ${card.name}`,
          metadata: {
            cardId,
            buyerId: buyer.id,
            saleType: 'direct_sale'
          }
        }
      });

      // Update card's price history
      const currentPrices = card.historicalPrices as any[] || [];
      const updatedPrices = [
        ...currentPrices,
        {
          price: purchasePrice,
          timestamp: new Date().toISOString(),
          type: 'sale'
        }
      ].slice(-50); // Keep last 50 price points

      await tx.card.update({
        where: { id: cardId },
        data: {
          currentPrice: purchasePrice,
          historicalPrices: updatedPrices
        }
      });

      return {
        card: updatedCard,
        buyerTransaction,
        sellerTransaction,
        purchasePrice
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Card purchased successfully',
      card: result.card,
      purchasePrice: result.purchasePrice,
      transaction: result.buyerTransaction
    });

  } catch (error) {
    console.error('Card purchase error:', error);
    return NextResponse.json({ 
      error: 'Internal server error processing purchase' 
    }, { status: 500 });
  }
}
