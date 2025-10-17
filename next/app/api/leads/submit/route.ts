import { NextRequest, NextResponse } from 'next/server';
import { syncLeadToPipedrive } from '@/lib/pipedrive';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface LeadSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  leadType: 'zakelijk' | 'particulier';
  pipedriveEnabled?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadSubmission = await request.json();
    
    // Validatie
    if (!body.firstName || !body.lastName || !body.email || !body.leadType) {
      return NextResponse.json(
        { error: 'Verplichte velden ontbreken: firstName, lastName, email, leadType' },
        { status: 400 }
      );
    }
    
    // Email validatie
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 }
      );
    }
    
    let pipedriveId: string | null = null;
    let pipedriveSyncStatus: 'pending' | 'synced' | 'failed' = 'pending';
    let pipedriveSyncError: string | null = null;
    
    // Sync naar Pipedrive ALLEEN voor zakelijke leads EN indien ingeschakeld
    if (body.leadType === 'zakelijk' && body.pipedriveEnabled !== false) {
      try {
        const result = await syncLeadToPipedrive({
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          company: body.company,
          message: body.message,
          leadType: body.leadType,
        });
        
        pipedriveId = result.pipedriveId;
        pipedriveSyncStatus = 'synced';
      } catch (error) {
        console.error('Pipedrive sync failed:', error);
        pipedriveSyncStatus = 'failed';
        pipedriveSyncError = error instanceof Error ? error.message : 'Unknown error';
        // We gaan door om de lead wel in Strapi op te slaan
      }
    } else if (body.leadType === 'particulier') {
      // Particuliere leads gaan NIET naar Pipedrive, alleen naar database
      pipedriveSyncStatus = 'pending'; // We markeren als 'pending' omdat we niet naar Pipedrive willen
      console.log('Particuliere lead - alleen opgeslagen in database, niet gesynchroniseerd naar Pipedrive');
    }
    
    // Opslaan in Strapi
    const strapiData = {
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        leadType: body.leadType,
        message: body.message || null,
        pipedriveId: pipedriveId,
        pipedriveSyncStatus: pipedriveSyncStatus,
        pipedriveSyncError: pipedriveSyncError,
        source: 'website',
      },
    };
    
    const strapiResponse = await fetch(`${STRAPI_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      body: JSON.stringify(strapiData),
    });
    
    if (!strapiResponse.ok) {
      const errorText = await strapiResponse.text();
      console.error('Strapi error:', errorText);
      return NextResponse.json(
        { error: 'Fout bij opslaan van lead in database' },
        { status: 500 }
      );
    }
    
    const strapiResult = await strapiResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'Lead succesvol opgeslagen',
      data: {
        id: strapiResult.data.id,
        pipedriveId: pipedriveId,
        pipedriveSyncStatus: pipedriveSyncStatus,
      },
    });
    
  } catch (error) {
    console.error('Error in lead submission:', error);
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij het verwerken van je aanvraag',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
