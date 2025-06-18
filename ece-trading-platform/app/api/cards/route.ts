import { NextResponse } from 'next/server';
import { getAllCards, getCardsForSale, getCrowdfundingCards } from '@/src/lib/card-store';

export async function GET() {
  try {
    const allCards = getAllCards();
    const forSaleCards = getCardsForSale();
    const crowdfundingCards = getCrowdfundingCards();

    return NextResponse.json({
      success: true,
      cards: allCards,
      forSale: forSaleCards,
      crowdfunding: crowdfundingCards,
      stats: {
        total: allCards.length,
        forSale: forSaleCards.length,
        crowdfunding: crowdfundingCards.length,
        totalVolume: allCards.reduce((sum, card) => sum + card.volume24h, 0),
        totalMarketCap: allCards.reduce((sum, card) => sum + card.marketCap, 0)
      }
    });
  } catch (error) {
    console.error('Get cards error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cards' },
      { status: 500 }
    );
  }
}
