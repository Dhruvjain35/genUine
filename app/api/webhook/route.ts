import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ received: true });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2026-02-25.clover' });

    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
    }

    // Handle events
    switch (event.type) {
      case 'checkout.session.completed': {
        // Payment succeeded — the client-side /app?success=true handles localStorage
        // Here you'd update a database in production
        console.log('Payment completed:', event.data.object);
        break;
      }
      case 'customer.subscription.deleted': {
        // Subscription cancelled — in production, revoke access in database
        console.log('Subscription cancelled:', event.data.object);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
  }
}
