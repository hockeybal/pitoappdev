// Pipedrive API integratie
// Documentatie: https://developers.pipedrive.com/docs/api/v1

export interface PipedrivePersonData {
  name: string;
  email: string[];
  phone: string[];
  org_id?: number;
}

export interface PipedriveOrganizationData {
  name: string;
}

export interface PipedriveLeadData {
  title: string;
  person_id?: number;
  organization_id?: number;
  value?: {
    amount: number;
    currency: string;
  };
  label_ids?: string[];
}

export type LeadType = 'zakelijk' | 'particulier';

/**
 * Get the Pipedrive API token for zakelijk leads
 * Particulier leads don't sync to Pipedrive
 */
function getPipedriveToken(leadType: LeadType): string {
  if (leadType !== 'zakelijk') {
    throw new Error('Pipedrive sync is only enabled for zakelijk leads');
  }
  
  const token = process.env.PIPEDRIVE_API_TOKEN_ZAKELIJK;
  
  if (!token) {
    throw new Error('Pipedrive API token for zakelijk not configured');
  }
  
  return token;
}

/**
 * Make a request to Pipedrive API
 */
async function pipedriveRequest<T>(
  endpoint: string,
  leadType: LeadType,
  options: RequestInit = {}
): Promise<T> {
  const token = getPipedriveToken(leadType);
  const baseUrl = 'https://api.pipedrive.com/v1';
  
  const url = `${baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_token=${token}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pipedrive API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`Pipedrive API returned success=false: ${JSON.stringify(data)}`);
  }
  
  return data.data;
}

/**
 * Create or update a person in Pipedrive
 */
export async function createPipedrivePerson(
  personData: PipedrivePersonData,
  leadType: LeadType
): Promise<{ id: number }> {
  return pipedriveRequest<{ id: number }>(
    '/persons',
    leadType,
    {
      method: 'POST',
      body: JSON.stringify(personData),
    }
  );
}

/**
 * Create an organization in Pipedrive
 */
export async function createPipedriveOrganization(
  orgData: PipedriveOrganizationData,
  leadType: LeadType
): Promise<{ id: number }> {
  return pipedriveRequest<{ id: number }>(
    '/organizations',
    leadType,
    {
      method: 'POST',
      body: JSON.stringify(orgData),
    }
  );
}

/**
 * Create a lead in Pipedrive
 */
export async function createPipedriveLead(
  leadData: PipedriveLeadData,
  leadType: LeadType
): Promise<{ id: string }> {
  return pipedriveRequest<{ id: string }>(
    '/leads',
    leadType,
    {
      method: 'POST',
      body: JSON.stringify(leadData),
    }
  );
}

/**
 * Add a note to a lead in Pipedrive
 */
export async function addPipedriveNote(
  leadId: string,
  content: string,
  leadType: LeadType
): Promise<void> {
  await pipedriveRequest(
    '/notes',
    leadType,
    {
      method: 'POST',
      body: JSON.stringify({
        content,
        lead_id: leadId,
      }),
    }
  );
}

/**
 * Main function to sync a lead to Pipedrive
 * This handles the complete flow: person -> organization -> lead -> note
 */
export async function syncLeadToPipedrive(lead: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  leadType: LeadType;
}): Promise<{ pipedriveId: string; personId: number }> {
  try {
    const { firstName, lastName, email, phone, company, message, leadType } = lead;
    
    // Step 1: Create or get organization (if company is provided)
    let organizationId: number | undefined;
    if (company) {
      const org = await createPipedriveOrganization(
        { name: company },
        leadType
      );
      organizationId = org.id;
    }
    
    // Step 2: Create person
    const person = await createPipedrivePerson(
      {
        name: `${firstName} ${lastName}`,
        email: [email],
        phone: phone ? [phone] : [],
        org_id: organizationId,
      },
      leadType
    );
    
    // Step 3: Create lead
    const leadTitle = company 
      ? `${company} - ${firstName} ${lastName}` 
      : `${firstName} ${lastName}`;
    
    const pipedriveLeadData: PipedriveLeadData = {
      title: leadTitle,
      person_id: person.id,
      organization_id: organizationId,
    };
    
    const createdLead = await createPipedriveLead(pipedriveLeadData, leadType);
    
    // Step 4: Add note if message is provided
    if (message) {
      await addPipedriveNote(
        createdLead.id,
        `Bericht van website:\n\n${message}`,
        leadType
      );
    }
    
    return {
      pipedriveId: createdLead.id,
      personId: person.id,
    };
  } catch (error) {
    console.error('Error syncing lead to Pipedrive:', error);
    throw error;
  }
}
