import { NextRequest, NextResponse } from 'next/server';
import { findOrderById, updateOrder } from '@/src/lib/data-store';
import { addCard, getAllCards } from '@/src/lib/card-store';
import type { TradingCard } from '@/src/lib/card-store';

// Generate trading card from completed order
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = findOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only generate cards for completed orders
    if (order.status !== 'completed') {
      return NextResponse.json(
        { error: 'Order must be completed to generate trading card' },
        { status: 400 }
      );
    }

    // Check if card already exists for this order
    const existingCards = getAllCards();
    const existingCard = existingCards.find((card: TradingCard) => card.orderId === orderId);
    if (existingCard) {
      return NextResponse.json({
        success: true,
        card: existingCard,
        message: 'Trading card already exists for this order'
      });
    }

    // Generate trading card data from order
    const cardId = `card_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Calculate rarity based on complexity and features
    let rarity: 'common' | 'rare' | 'epic' | 'legendary';
    const featureCount = order.features?.length || 0;
    
    if (order.complexity === 'complex' && featureCount >= 5) {
      rarity = 'legendary';
    } else if (order.complexity === 'complex' || featureCount >= 3) {
      rarity = 'epic';
    } else if (order.complexity === 'medium' || featureCount >= 2) {
      rarity = 'rare';
    } else {
      rarity = 'common';
    }

    // Generate stats based on order characteristics
    const stats = {
      performance: Math.min(100, 60 + (order.complexity === 'complex' ? 30 : order.complexity === 'medium' ? 15 : 0) + featureCount * 3),
      scalability: Math.min(100, 50 + (order.expectedTraffic === 'enterprise' ? 40 : order.expectedTraffic === 'high' ? 25 : order.expectedTraffic === 'medium' ? 15 : 5)),
      security: Math.min(100, 70 + (order.authentication?.length || 0) * 10 + (order.sslRequired ? 15 : 0)),
      userExperience: Math.min(100, 65 + (order.designPreferences ? 15 : 0)),
      innovation: Math.min(100, 40 + (order.thirdPartyIntegrations?.length || 0) * 8)
    };

    // Generate market price based on original order value and rarity multiplier
    const rarityMultipliers = { common: 1.1, rare: 1.3, epic: 1.6, legendary: 2.0 };
    const basePrice = order.totalAmount || order.price || 0;
    const marketPrice = Math.round(basePrice * rarityMultipliers[rarity]);

    // Create trading card
    const tradingCard: TradingCard = {
      id: cardId,
      orderId: orderId,
      title: order.appName,
      description: order.appDescription,
      category: order.projectType || 'web-app',
      rarity,
      stats,
      originalPrice: basePrice,
      currentPrice: marketPrice,
      marketCap: marketPrice,
      priceChange24h: 0, // New card, no change yet
      volume24h: 0,
      isForSale: true,
      isCrowdfunding: false,
      bettingPool: 0,
      totalBets: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: {
        name: order.customerName,
        email: order.customerEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customerEmail}`
      },
      metadata: {
        framework: order.framework,
        complexity: order.complexity,
        features: order.features || [],
        deliveryMethod: order.deliveryMethod || 'github',
        timeline: order.timeline || '1w',
        completedAt: order.completedAt || new Date().toISOString(),
        buildProgress: 100,
        techStack: [
          order.framework,
          order.database || 'database',
          ...(order.authentication || []),
          ...(order.thirdPartyIntegrations || [])
        ].filter(Boolean),
        githubUrl: order.githubUsername && order.repositoryName 
          ? `https://github.com/${order.githubUsername}/${order.repositoryName}`
          : undefined,
        deploymentUrl: order.deliveryUrl
      }
    };

    // Add card to store
    addCard(tradingCard);

    // Update order with card reference
    updateOrder(orderId, {
      adminNotes: [
        ...(order.adminNotes || []),
        {
          note: `Trading card generated: ${cardId}`,
          timestamp: new Date().toISOString(),
          admin: 'system'
        }
      ]
    });

    return NextResponse.json({
      success: true,
      card: tradingCard,
      message: 'Trading card generated successfully'
    });

  } catch (error) {
    console.error('Card generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate trading card' },
      { status: 500 }
    );
  }
}

// Get trading card for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const cards = getAllCards();
    const card = cards.find((c: TradingCard) => c.orderId === orderId);
    
    if (!card) {
      return NextResponse.json(
        { error: 'Trading card not found for this order' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      card
    });

  } catch (error) {
    console.error('Get card error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve trading card' },
      { status: 500 }
    );
  }
}
