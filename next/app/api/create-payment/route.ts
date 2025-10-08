import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';

async function getMollieClient() {
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
}

export async function POST(request: NextRequest) {
  try {
    const { planId, amount, description } = await request.json();

    console.log('Creating payment for:', { planId, amount, description });

    if (!planId || !amount || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.MOLLIE_API_KEY) {
      console.error('MOLLIE_API_KEY not configured');
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 });
    }

    // Create Mollie payment
    const mollieClient = await getMollieClient();
    
    // Voor lokale development - geen webhook URL
    const paymentData: any = {
      amount: {
        value: (amount * 100).toFixed(2), // Convert to cents
        currency: 'EUR',
      },
      description,
      redirectUrl: `${process.env.NEXTAUTH_URL}/payment/success?planId=${planId}`,
      metadata: {
        planId: planId.toString(),
      },
    };

    // Alleen webhook URL toevoegen als niet lokaal
    if (process.env.NODE_ENV === 'production') {
      paymentData.webhookUrl = `${process.env.NEXTAUTH_URL}/api/webhook`;
    }

    const payment = await mollieClient.payments.create(paymentData);

    console.log('Payment created:', { id: payment.id, status: payment.status });

    const checkoutUrl = payment._links?.checkout?.href;
    if (!checkoutUrl) {
      console.error('No checkout URL in payment response:', payment);
      return NextResponse.json({ error: 'No checkout URL received' }, { status: 500 });
    }

    return NextResponse.json({
      checkoutUrl,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ 
      error: 'Payment creation failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}