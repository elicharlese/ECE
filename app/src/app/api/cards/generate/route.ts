import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CardGenerationService } from '@/services/card-generation.service';
import { TechnicalAnalysisService } from '@/services/technical-analysis.service';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      walletAddress, 
      generationType, 
      sourceCodeUrl, 
      companyName, 
      description,
      category,
      preferences = {}
    } = body;

    if (!walletAddress || !generationType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user exists and has sufficient ECE balance
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate generation cost based on type
    const generationCost = CardGenerationService.calculateGenerationCost(generationType);
    
    if (user.eceBalance < generationCost) {
      return NextResponse.json({ 
        error: 'Insufficient ECE balance',
        required: generationCost,
        current: user.eceBalance
      }, { status: 400 });
    }

    // Generate card based on type
    let cardData;
    switch (generationType) {
      case 'CODE_UPLOAD':
        if (!sourceCodeUrl) {
          return NextResponse.json({ error: 'Source code URL required for code upload' }, { status: 400 });
        }
        cardData = await CardGenerationService.generateFromCodebase({
          sourceCodeUrl,
          companyName,
          description,
          category,
          userId: user.id
        });
        break;

      case 'CARD_ORDER':
        if (!companyName) {
          return NextResponse.json({ error: 'Company name required for card order' }, { status: 400 });
        }
        cardData = await CardGenerationService.generateNewCard({
          companyName,
          description,
          category,
          userId: user.id
        });
        break;

      case 'CODEBASE_ENHANCE':
        if (!sourceCodeUrl) {
          return NextResponse.json({ error: 'Source code URL required for enhancement' }, { status: 400 });
        }
        cardData = await CardGenerationService.enhanceExistingCodebase({
          sourceCodeUrl,
          companyName,
          description,
          category,
          userId: user.id
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 });
    }

    // Create the card in database
    const card = await prisma.card.create({
      data: {
        name: cardData.name,
        description: cardData.description,
        category: category || 'TECHNOLOGY',
        rarity: cardData.rarity,
        company: companyName,
        generationType,
        sourceCodeUrl,
        codebaseHash: cardData.codebaseHash,
        enhancementLevel: cardData.enhancementLevel || 0,
        generationCost,
        
        // Preferences
        availableForBidding: preferences.bidding !== false,
        availableForBuying: preferences.buying !== false,
        availableForBattling: preferences.battling !== false,
        minimumBidAmount: preferences.minimumBid,
        fixedBuyPrice: preferences.fixedPrice,
        battleStakeAmount: preferences.battleStake,

        // Technical and business data
        technicalMetrics: cardData.technicalMetrics,
        codebaseStats: cardData.codebaseStats,
        businessMetrics: cardData.businessMetrics,

        // Market data
        currentPrice: cardData.basePrice,
        marketCap: cardData.marketCap,
        
        // Visual
        imageUrl: cardData.imageUrl,
        cardArtwork: cardData.cardArtwork,
        stats: cardData.battleStats,

        ownerId: user.id
      },
      include: {
        owner: {
          select: { username: true, walletAddress: true }
        }
      }
    });

    // Deduct ECE cost from user balance
    await prisma.user.update({
      where: { id: user.id },
      data: { eceBalance: { decrement: generationCost } }
    });

    // Record transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'CARD_GENERATION',
        amount: generationCost,
        currency: 'ECE',
        status: 'COMPLETED',
        description: `Card Generation - ${generationType}`,
        metadata: {
          cardId: card.id,
          generationType,
          companyName
        }
      }
    });

    return NextResponse.json({
      success: true,
      card,
      generationCost,
      newBalance: user.eceBalance - generationCost
    });

  } catch (error) {
    console.error('Card generation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error during card generation' 
    }, { status: 500 });
  }
}
