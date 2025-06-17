import { NextRequest, NextResponse } from 'next/server';
import { addOrder } from '@/src/lib/data-store';
import type { OrderData } from '@/src/lib/data-store';

// Test endpoint to create a sample completed order and generate a trading card
export async function POST(request: NextRequest) {
  try {
    const { appName, customerName, customerEmail } = await request.json();

    if (!appName || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'appName, customerName, and customerEmail are required' },
        { status: 400 }
      );
    }

    // Create a sample completed order
    const orderId = `test_order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const testOrder: OrderData = {
      id: orderId,
      customerName,
      customerEmail,
      appName,
      appDescription: `${appName} - A custom application built with modern technologies`,
      framework: 'Next.js',
      complexity: 'medium',
      features: ['User Authentication', 'Dashboard', 'API Integration', 'Mobile Responsive'],
      totalAmount: 1500,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      timeline: '1w',
      deliveryMethod: 'github',
      authentication: ['OAuth', 'JWT'],
      database: 'PostgreSQL',
      sslRequired: true,
      designPreferences: 'Modern and clean UI with dark theme',
      thirdPartyIntegrations: ['Stripe', 'SendGrid', 'AWS S3']
    };
    
    // Add the order to the store
    addOrder(testOrder);

    // Auto-generate trading card
    try {
      const cardResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cards/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      if (cardResponse.ok) {
        const cardResult = await cardResponse.json();
        return NextResponse.json({
          success: true,
          order: testOrder,
          card: cardResult.card,
          message: 'Test order created and trading card generated successfully!'
        });
      } else {
        return NextResponse.json({
          success: true,
          order: testOrder,
          message: 'Test order created, but card generation failed',
          cardError: await cardResponse.text()
        });
      }
    } catch (cardError: any) {
      return NextResponse.json({
        success: true,
        order: testOrder,
        message: 'Test order created, but card generation failed',
        cardError: cardError.message
      });
    }

  } catch (error) {
    console.error('Test order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create test order' },
      { status: 500 }
    );
  }
}
