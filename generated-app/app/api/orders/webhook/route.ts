import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { findOrderByStripeSession, updateOrder } from '@/src/lib/data-store';
import { initiateBuildProcess, generateTradingCard } from '@/src/lib/build-process';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handlePaymentSuccess(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  try {
    const orderId = session.metadata?.orderId;
    
    if (!orderId) {
      console.error('No order ID found in session metadata:', session.id);
      return;
    }

    const order = findOrderByStripeSession(session.id);
    if (!order) {
      console.error('Order not found for session:', session.id);
      return;
    }
    
    // Update order status to paid
    updateOrder(orderId, {
      status: 'paid',
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined
    });

    console.log(`Payment successful for order ${orderId}`);
    
    // Start the build process
    setTimeout(async () => {
      try {
        await initiateBuildProcess({
          orderId: order.id,
          appName: order.appName,
          framework: order.framework,
          features: order.features || [],
          complexity: order.complexity,
          customerEmail: order.customerEmail
        });
        console.log(`Build process initiated for order ${orderId}`);
      } catch (error) {
        console.error(`Failed to initiate build for order ${orderId}:`, error);
        updateOrder(orderId, {
          status: 'build_failed',
          updatedAt: new Date().toISOString()
        });
      }
    }, 1000);

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`Payment failed for payment intent: ${paymentIntent.id}`);
    
    // Note: In a real implementation, you'd search through orders to find the matching payment intent
    // For now, we'll log the failure
    console.error('Payment failure handling not fully implemented - need to find order by payment intent');
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
