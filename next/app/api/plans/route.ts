import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/auth';

async function getStrapiClient() {
  const token = process.env.STRAPI_API_TOKEN;
  const baseUrl = process.env.STRAPI_API_URL || 'http://localhost:1337';
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Only add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return {
    baseUrl,
    headers,
  };
}

/**
 * GET /api/plans
 * Haalt alle beschikbare plans op
 */
export async function GET(request: NextRequest) {
  try {
    // Debug logging
    console.log('Plans API called');
    
    // Optioneel: authenticatie voor protected endpoints
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const strapi = await getStrapiClient();
    
    console.log('Strapi config:', {
      baseUrl: strapi.baseUrl,
      hasToken: !!process.env.STRAPI_API_TOKEN
    });

    // Haal alle plans op inclusief perks en CTA
    const plansResponse = await fetch(
      `${strapi.baseUrl}/api/plans?populate=*&sort=price:asc`,
      { headers: strapi.headers }
    );

    if (!plansResponse.ok) {
      throw new Error('Failed to fetch plans from Strapi');
    }

    const plansData = await plansResponse.json();
    
    // Transform data voor frontend gebruik
    const plans = (plansData.data || []).map((plan: any) => ({
      id: plan.id,
      name: plan.name || 'Unknown Plan',
      price: plan.price || 0,
      sub_text: plan.sub_text || '',
      featured: plan.featured || false,
      perks: plan.perks || [],
      additional_perks: plan.additional_perks || [],
      CTA: plan.CTA || null,
    }));

    return NextResponse.json({
      success: true,
      plans
    });

  } catch (error) {
    console.error('Plans fetch error:', error);
    console.log('Returning dummy data as fallback');
    
    // Fallback met dummy data voor testing
    const dummyPlans = [
      {
        id: 1,
        name: 'Basic',
        price: 29,
        sub_text: 'Perfect voor kleine projecten',
        featured: false,
        perks: [
          { text: '1 project' },
          { text: '5GB opslag' },
          { text: 'Email support' }
        ],
        additional_perks: [],
        CTA: { text: 'Kies Basic' }
      },
      {
        id: 2,
        name: 'Professional',
        price: 59,
        sub_text: 'Voor groeiende bedrijven',
        featured: true,
        perks: [
          { text: '5 projecten' },
          { text: '50GB opslag' },
          { text: 'Priority support' }
        ],
        additional_perks: [
          { text: 'Custom domain' },
          { text: 'Analytics dashboard' }
        ],
        CTA: { text: 'Kies Professional' }
      },
      {
        id: 3,
        name: 'Enterprise',
        price: 99,
        sub_text: 'Voor grote organisaties',
        featured: false,
        perks: [
          { text: 'Unlimited projecten' },
          { text: '500GB opslag' },
          { text: '24/7 support' }
        ],
        additional_perks: [
          { text: 'Custom integration' },
          { text: 'Dedicated manager' },
          { text: 'SLA guarantee' }
        ],
        CTA: { text: 'Kies Enterprise' }
      }
    ];

    return NextResponse.json({
      success: true,
      plans: dummyPlans,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}