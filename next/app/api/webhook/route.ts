import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';

async function getMollieClient() {
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-mollie-signature');

    // Verify webhook signature (implement proper verification)
    // For now, we'll trust the webhook

    const paymentId = new URLSearchParams(body).get('id');

    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    // Get payment details from Mollie
    const mollieClient = await getMollieClient();
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status === 'paid' && payment.metadata) {
      // Payment successful, update customer record
      const planId = (payment.metadata as any).planId;

      // Note: In a real implementation, you'd need to get the user ID from the payment metadata
      // For now, this is a placeholder
      console.log('Payment successful for plan:', planId);

      // TODO: Update customer record with plan
      // This would require storing user ID in payment metadata
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}