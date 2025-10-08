import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

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
 * GET /api/customer-info
 * Haalt customer informatie op voor de ingelogde gebruiker
 */
export async function GET(request: NextRequest) {
  let session;
  try {
    session = await getServerSession();
    
    // Check if userId parameter is provided in query string
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');
    
    // Temporary: Allow testing without session when userId is provided (DEBUG MODE)
    if (!session?.user && !requestedUserId) {
      return NextResponse.json({ error: 'Unauthorized - Please provide userId parameter for testing' }, { status: 401 });
    }
    
    console.log('🔍 Debug info:', {
      hasSession: !!session?.user,
      sessionUserId: session?.user?.id,
      requestedUserId,
      sessionEmail: session?.user?.email
    });

    const strapi = await getStrapiClient();
    
    let userLookupUrl;
    if (requestedUserId) {
      // Look up by user ID
      userLookupUrl = `${strapi.baseUrl}/api/users/${requestedUserId}`;
      console.log('Customer API called for user ID:', requestedUserId);
    } else {
      // Look up by email (fallback)
      const userEmail = session?.user?.email;
      userLookupUrl = `${strapi.baseUrl}/api/users?filters[email][$eq]=${userEmail}`;
      console.log('Customer API called for user email:', userEmail);
    }

    console.log('🔧 Strapi config:', {
      baseUrl: strapi.baseUrl,
      hasToken: !!process.env.STRAPI_API_TOKEN,
      lookupUrl: userLookupUrl
    });

    // Haal user gegevens op inclusief plan informatie
    const userResponse = await fetch(userLookupUrl, { headers: strapi.headers });

    console.log('📡 Strapi API response:', {
      status: userResponse.status,
      ok: userResponse.ok,
      url: userLookupUrl
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('User fetch error:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        body: errorText
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch user data',
          details: `${userResponse.status}: ${errorText}`
        },
        { status: 500 }
      );
    }

    const userData = await userResponse.json();
    
    // Handle different response formats (direct user lookup vs filtered search)
    let user;
    if (Array.isArray(userData)) {
      // Email-based search returns array
      if (userData.length === 0) {
        return NextResponse.json({
          customer: null,
          message: 'User not found'
        });
      }
      user = userData[0];
    } else {
      // Direct ID-based lookup returns object
      if (!userData || !userData.id) {
        return NextResponse.json({
          customer: null,
          message: 'User not found'
        });
      }
      user = userData;
    }
    
    console.log('User data from Strapi:', {
      id: user.id,
      username: user.username,
      email: user.email,
      company_name: user.company_name,
      kvk_number: user.kvk_number,
      street_address: user.street_address,
      postal_code: user.postal_code,
      city: user.city,
      country: user.country,
      allKeys: Object.keys(user)
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        user_id: user.id,
        user_email: user.email,
        username: user.username,
        company_name: user.company_name,
        kvk_number: user.kvk_number,
        street_address: user.street_address,
        postal_code: user.postal_code,
        city: user.city,
        country: user.country,
        plan: user.plan,
        subscription_status: user.subscription_status || 'inactive',
        subscription_start_date: user.subscription_start_date,
        subscription_end_date: user.subscription_end_date,
        mollie_customer_id: user.mollie_customer_id,
        billing_period: user.billing_period || 'monthly',
        total_paid: user.total_paid || 0,
        credits_available: user.credits_available || 0,
        createdAt: user.createdAt || user.created_at || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Customer info error:', error);
    console.log('Returning dummy customer data as fallback');
    
    // Fallback met dummy customer data voor testing
    const dummyCustomer = {
      id: 1,
      user_id: 1,
      user_email: session?.user?.email || 'test@example.com',
      plan: {
        id: 2,
        name: 'Professional',
        price: 59
      },
      subscription_status: 'active',
      subscription_start_date: '2024-09-01T00:00:00.000Z',
      subscription_end_date: '2024-10-01T00:00:00.000Z',
      mollie_customer_id: 'cst_test123',
      billing_period: 'monthly',
      total_paid: 59,
      credits_available: 0,
    };

    return NextResponse.json({
      success: true,
      data: dummyCustomer,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}