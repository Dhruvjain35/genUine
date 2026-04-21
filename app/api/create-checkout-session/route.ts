import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
 const stripeKey = process.env.STRIPE_SECRET_KEY;

 // Graceful degradation if Stripe not configured
 if (!stripeKey) {
 return NextResponse.json(
 { error: 'payments coming soon, reach out directly to get pro access.' },
 { status: 503 }
 );
 }

 try {
 const Stripe = (await import('stripe')).default;
 const stripe = new Stripe(stripeKey, { apiVersion: '2026-02-25.clover' });

 const { plan } = await request.json();
 const baseUrl = request.headers.get('origin') || 'http://localhost:3000';

 const PRICES = {
 monthly: { unit_amount: 1200, interval: 'month' as const },
 yearly: { unit_amount: 9900, interval: 'year' as const },
 };

 const price = PRICES[plan as keyof typeof PRICES] || PRICES.monthly;

 const session = await stripe.checkout.sessions.create({
 mode: 'subscription',
 payment_method_types: ['card'],
 line_items: [
 {
 price_data: {
 currency: 'usd',
 product_data: {
 name: 'genUine Pro',
 description: 'Unlimited LinkedIn messages in your voice.',
 },
 unit_amount: price.unit_amount,
 recurring: { interval: price.interval },
 },
 quantity: 1,
 },
 ],
 success_url: `${baseUrl}/app?success=true&session_id={CHECKOUT_SESSION_ID}`,
 cancel_url: `${baseUrl}/pricing`,
 allow_promotion_codes: true,
 });

 return NextResponse.json({ url: session.url });
 } catch (error) {
 console.error('Stripe checkout error:', error);
 return NextResponse.json({ error: 'Payment setup failed. Try again?' }, { status: 500 });
 }
}
