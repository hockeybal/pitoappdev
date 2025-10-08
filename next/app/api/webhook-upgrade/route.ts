import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';

async function getMollieClient() {
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
 * Webhook specifiek voor plan upgrades met pro-rated billing
 * Wordt aangeroepen door Mollie na succesvolle betaling
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-mollie-signature');

    // TODO: Implementeer proper webhook signature verificatie
    // Voor nu vertrouwen we de webhook

    const paymentId = new URLSearchParams(body).get('id');

    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    // Haal betaling gegevens op van Mollie
    const mollieClient = await getMollieClient();
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status !== 'paid' || !payment.metadata) {
      // Betaling nog niet gelukt of geen metadata
      return NextResponse.json({ status: 'ok' });
    }

    const metadata = payment.metadata as any;
    const {
      planId,
      customerId,
      upgradeType,
      originalPlanId,
      unusedAmount,
      finalAmount,
      userEmail,
    } = metadata;

    if (upgradeType !== 'pro-rated') {
      // Dit is geen upgrade betaling
      return NextResponse.json({ status: 'ok' });
    }

    console.log('Processing pro-rated upgrade payment:', {
      paymentId: payment.id,
      customerId,
      planId,
      originalPlanId,
      finalAmount,
      unusedAmount,
    });

    const strapi = await getStrapiClient();

    try {
      // Update de user record met nieuwe plan
      const updateData = {
        plan: parseInt(planId),
        subscription_status: 'active',
        last_payment_date: new Date().toISOString(),
        credits_available: 0, // Reset credits na upgrade
        total_paid: parseFloat(finalAmount), // Voeg betaalde bedrag toe aan totaal
      };

      // Optioneel: Update subscription dates voor nieuwe billing periode
      // Je kunt hier logica toevoegen om nieuwe subscription_start_date en subscription_end_date te zetten

      const updateResponse = await fetch(
        `${strapi.baseUrl}/api/users/${customerId}`,
        {
          method: 'PUT',
          headers: strapi.headers,
          body: JSON.stringify(updateData),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Failed to update customer:', errorText);
        throw new Error(`Failed to update customer: ${updateResponse.status}`);
      }

      console.log('Successfully updated customer after pro-rated upgrade');

      // Optioneel: Log de upgrade voor audit trail
      try {
        await fetch(`${strapi.baseUrl}/api/payment-logs`, {
          method: 'POST',
          headers: strapi.headers,
          body: JSON.stringify({
            data: {
              customer_id: parseInt(customerId),
              payment_id: payment.id,
              payment_type: 'upgrade_prorated',
              original_plan_id: parseInt(originalPlanId),
              new_plan_id: parseInt(planId),
              amount_paid: parseFloat(finalAmount),
              credit_applied: parseFloat(unusedAmount),
              payment_date: new Date().toISOString(),
              mollie_status: payment.status,
            },
          }),
        });
      } catch (logError) {
        // Log error maar laat de webhook succesvol zijn
        console.error('Failed to log payment:', logError);
      }

      return NextResponse.json({ 
        status: 'ok',
        message: 'Pro-rated upgrade processed successfully'
      });

    } catch (error) {
      console.error('Error processing pro-rated upgrade:', error);
      
      // Bij fout, probeer de betaling status bij te werken voor handmatige verwerking
      try {
        await fetch(`${strapi.baseUrl}/api/failed-payments`, {
          method: 'POST',
          headers: strapi.headers,
          body: JSON.stringify({
            data: {
              payment_id: payment.id,
              customer_id: customerId,
              error_message: error instanceof Error ? error.message : 'Unknown error',
              payment_data: JSON.stringify(payment.metadata),
              created_at: new Date().toISOString(),
            },
          }),
        });
      } catch (logError) {
        console.error('Failed to log failed payment:', logError);
      }

      return NextResponse.json(
        { 
          error: 'Failed to process upgrade',
          paymentId: payment.id 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}