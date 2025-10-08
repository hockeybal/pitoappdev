import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  calculateProRatedUpgrade,
  getAmountForMollie,
  generatePaymentDescription,
  isUpgradeValid,
  type Customer,
  type Plan,
  type ProRatedCalculation,
} from '@/lib/shared/pro-rated-billing';

// Helper type for User with plan data
interface UserWithPlan {
  id: number;
  email: string;
  plan: Plan;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  mollie_customer_id?: string;
}

// Convert user to customer format for compatibility with existing billing functions
function userToCustomer(user: UserWithPlan): Customer {
  return {
    id: user.id,
    user_id: user.id,
    user_email: user.email,
    plan: user.plan,
    subscription_status: user.subscription_status || 'active' as any,
    subscription_start_date: user.subscription_start_date || '',
    subscription_end_date: user.subscription_end_date || '',
    mollie_customer_id: user.mollie_customer_id,
  };
}

async function getMollieClient() {
  const { createMollieClient } = await import('@mollie/api-client');
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
}

async function getStrapiClient() {
  const token = process.env.STRAPI_API_TOKEN;
  const baseUrl = process.env.STRAPI_API_URL || 'http://localhost:1337';
  
  return {
    baseUrl,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}

/**
 * POST /api/upgrade-plan
 * Berekent pro-rated kosten en maakt Mollie betaling aan voor plan upgrade
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPlanId } = await request.json();

    if (!newPlanId) {
      return NextResponse.json(
        { error: 'New plan ID is required' },
        { status: 400 }
      );
    }

    const strapi = await getStrapiClient();
    const userEmail = session.user.email;

    // Haal huidige customer gegevens op
    const customerResponse = await fetch(
      `${strapi.baseUrl}/api/customers?filters[user_email][$eq]=${userEmail}&populate=plan`,
      { headers: strapi.headers }
    );

    if (!customerResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    const customerData = await customerResponse.json();
    
    if (!customerData.data || customerData.data.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer: Customer = customerData.data[0];

    // Haal nieuwe plan gegevens op
    const planResponse = await fetch(
      `${strapi.baseUrl}/api/plans/${newPlanId}`,
      { headers: strapi.headers }
    );

    if (!planResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch plan data' },
        { status: 500 }
      );
    }

    const planData = await planResponse.json();
    const newPlan: Plan = planData.data;

    // Valideer of upgrade mogelijk is
    if (!isUpgradeValid(customer.plan, newPlan)) {
      return NextResponse.json(
        { error: 'Invalid upgrade: new plan must be different and typically more expensive' },
        { status: 400 }
      );
    }

    // Bereken pro-rated kosten
    let proRatedCalculation: ProRatedCalculation;
    try {
      proRatedCalculation = calculateProRatedUpgrade(customer, newPlan);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to calculate pro-rated billing' },
        { status: 400 }
      );
    }

    // Als er niets te betalen is, werk de subscription direct bij
    if (proRatedCalculation.final_amount_to_pay === 0) {
      try {
        // Update customer record in Strapi
        const updateResponse = await fetch(
          `${strapi.baseUrl}/api/customers/${customer.id}`,
          {
            method: 'PUT',
            headers: strapi.headers,
            body: JSON.stringify({
              data: {
                plan: newPlanId,
                credits_available: 0, // Reset credits na gebruik
                last_payment_date: new Date().toISOString(),
              },
            }),
          }
        );

        if (!updateResponse.ok) {
          throw new Error('Failed to update customer');
        }

        return NextResponse.json({
          success: true,
          message: 'Plan upgraded successfully with available credits',
          proRatedCalculation,
          paymentRequired: false,
        });
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        );
      }
    }

    // Maak Mollie betaling aan voor het resterende bedrag
    const mollieClient = await getMollieClient();
    const amountInCents = getAmountForMollie(proRatedCalculation);
    const description = generatePaymentDescription(proRatedCalculation);

    const payment = await mollieClient.payments.create({
      amount: {
        value: (parseFloat(amountInCents) / 100).toFixed(2),
        currency: 'EUR',
      },
      description,
      redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard?payment=success&plan=${newPlanId}&upgrade=true`,
      webhookUrl: `${process.env.NEXTAUTH_URL}/api/webhook-upgrade`,
      metadata: {
        planId: newPlanId.toString(),
        userId: (session.user as any).id || customer.user_id.toString(),
        userEmail: session.user.email || '',
        customerId: customer.id.toString(),
        upgradeType: 'pro-rated',
        originalPlanId: customer.plan.id.toString(),
        unusedAmount: proRatedCalculation.unused_amount.toString(),
        finalAmount: proRatedCalculation.final_amount_to_pay.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      proRatedCalculation,
      paymentRequired: true,
      checkoutUrl: payment.getCheckoutUrl(),
      paymentId: payment.id,
      description,
    });

  } catch (error) {
    console.error('Plan upgrade error:', error);
    return NextResponse.json(
      { 
        error: 'Plan upgrade failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upgrade-plan?planId=123
 * Berekent pro-rated kosten zonder betaling aan te maken (voor preview)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const newPlanId = searchParams.get('planId');

    if (!newPlanId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const strapi = await getStrapiClient();
    const userEmail = session.user.email;

    // Haal huidige customer gegevens op
    const customerResponse = await fetch(
      `${strapi.baseUrl}/api/customers?filters[user_email][$eq]=${userEmail}&populate=plan`,
      { headers: strapi.headers }
    );

    if (!customerResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    const customerData = await customerResponse.json();
    
    if (!customerData.data || customerData.data.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer: Customer = customerData.data[0];

    // Haal nieuwe plan gegevens op
    const planResponse = await fetch(
      `${strapi.baseUrl}/api/plans/${newPlanId}`,
      { headers: strapi.headers }
    );

    if (!planResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch plan data' },
        { status: 500 }
      );
    }

    const planData = await planResponse.json();
    const newPlan: Plan = planData.data;

    // Valideer of upgrade mogelijk is
    if (!isUpgradeValid(customer.plan, newPlan)) {
      return NextResponse.json(
        { error: 'Invalid upgrade: new plan must be different and typically more expensive' },
        { status: 400 }
      );
    }

    // Bereken pro-rated kosten
    let proRatedCalculation: ProRatedCalculation;
    try {
      proRatedCalculation = calculateProRatedUpgrade(customer, newPlan);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to calculate pro-rated billing' },
        { status: 400 }
      );
    }

    const description = generatePaymentDescription(proRatedCalculation);

    return NextResponse.json({
      success: true,
      proRatedCalculation,
      description,
      paymentRequired: proRatedCalculation.final_amount_to_pay > 0,
    });

  } catch (error) {
    console.error('Plan upgrade preview error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to calculate upgrade costs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}