import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

async function getMollieClient() {
  const { createMollieClient } = await import('@mollie/api-client');
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
}

// GET /api/payment-methods - Get user's saved payment methods
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return empty array - real implementation would fetch from Mollie
    return NextResponse.json({
      paymentMethods: [],
      message: "Payment methods endpoint ready - integration pending"
    });

  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

// POST /api/payment-methods - Create new payment method
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mollieClient = await getMollieClient();

    // Create a minimal payment to setup payment method
    const payment = await mollieClient.payments.create({
      amount: {
        value: '0.01', // Minimal amount for payment method setup
        currency: 'EUR',
      },
      description: 'Payment method setup',
      redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard?tab=billing&payment_method=success`,
      webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhook`,
      metadata: {
        userId: (session.user as any).id,
        type: 'payment_method_setup',
      },
    });

    return NextResponse.json({
      checkoutUrl: payment.getCheckoutUrl(),
      paymentId: payment.id,
    });

  } catch (error) {
    console.error('Error creating payment method setup:', error);
    return NextResponse.json(
      { error: 'Failed to create payment method setup' },
      { status: 500 }
    );
  }
}

// DELETE /api/payment-methods/[id] - Delete payment method
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, just return success - real implementation would revoke mandate
    return NextResponse.json({ success: true, message: "Delete endpoint ready - integration pending" });

  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}