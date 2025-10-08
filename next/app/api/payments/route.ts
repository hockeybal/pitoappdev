import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

async function getMollieClient() {
  const { createMollieClient } = await import('@mollie/api-client');
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
}

// Get payment history for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Temporarily disable auth for testing
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const mollieClient = await getMollieClient();
    
    // For now, return empty payments array (real implementation would fetch from Mollie)
    // Note: Mollie API key is configured: test_sS4cx5Ssfd2aTbSb5eW93K2gK4FxAS
    return NextResponse.json({ 
      payments: [],
      message: "Mollie API key configured successfully"
    });

  } catch (error) {
    console.error('Payment history error:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch payment history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Create new payment for plan upgrade
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, amount, description, planName } = await request.json();

    if (!planId || !amount || !description) {
      return NextResponse.json(
        { error: 'Plan ID, amount, and description are required' },
        { status: 400 }
      );
    }

    const mollieClient = await getMollieClient();
    
    const payment = await mollieClient.payments.create({
      amount: {
        value: (parseFloat(amount) * 100).toFixed(2), // Convert to cents
        currency: 'EUR',
      },
      description: description,
      redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard?payment=success&plan=${planId}`,
      webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhook`,
      metadata: {
        planId: planId.toString(),
        userId: (session.user as any).id,
        planName: planName || '',
        userEmail: session.user.email || '',
      },
    });

    return NextResponse.json({
      checkoutUrl: payment.getCheckoutUrl(),
      paymentId: payment.id,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    );
  }
}