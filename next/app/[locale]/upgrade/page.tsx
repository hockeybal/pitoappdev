'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Pricing } from '@/components/dynamic-zone/pricing';
import UpgradePreview from '@/components/upgrade-preview';

interface Customer {
  id: number;
  plan: {
    id: number;
    name: string;
    price: number;
  };
  subscription_status: string;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  sub_text: string;
  featured: boolean;
  perks: any[];
  additional_perks: any[];
  CTA: any;
}

export default function UpgradePage() {
  const { data: session } = useSession();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    console.log('UpgradePage: useEffect triggered', { session: !!session });
    loadPlans();
    if (session) {
      loadCustomerData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const loadCustomerData = async () => {
    console.log('Loading customer data...');
    try {
      const response = await fetch('/api/customer-info');
      const data = await response.json();
      
      console.log('Customer API response:', { status: response.status, data });
      
      if (response.ok && data.customer) {
        setCustomer(data.customer);
        console.log('Customer loaded:', data.customer);
      } else {
        console.log('No customer found or error:', data);
      }
    } catch (error) {
      console.error('Failed to load customer data:', error);
      setError('Failed to load customer data: ' + (error as Error).message);
    }
  };

  const loadPlans = async () => {
    console.log('Loading plans...');
    try {
      const response = await fetch('/api/plans');
      const data = await response.json();
      
      console.log('Plans API response:', { status: response.status, data });
      
      if (response.ok) {
        setPlans(data.plans || []);
        setDebugInfo(data);
        console.log('Plans loaded:', data.plans?.length || 0, 'plans');
        console.log('Plans loaded:', data.plans?.length || 0, 'plans');
      } else {
        setError('Failed to load plans: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
      setError('Failed to load plans: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <div className="text-white">
          <div className="animate-pulse text-lg mb-4">Laden...</div>
          <div className="text-sm text-gray-400">
            {session ? 'Ingelogd als: ' + session.user?.email : 'Niet ingelogd'}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <div className="text-white max-w-md p-6">
          <h2 className="text-xl font-bold mb-4 text-red-400">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              loadPlans();
              if (session) loadCustomerData();
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Probeer opnieuw
          </button>
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer text-gray-400">Debug info</summary>
            <pre className="mt-2 p-2 bg-gray-800 rounded overflow-auto">
              {JSON.stringify({ session: !!session, customer, plans, debugInfo }, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Debug informatie */}
      <div className="bg-gray-800 text-white p-4 text-sm">
        <strong>Debug Info:</strong>
        <div>Session: {session ? '✅ ' + session.user?.email : '❌ Not logged in'}</div>
        <div>Customer: {customer ? '✅ ' + customer.plan?.name : '❌ No customer'}</div>
        <div>Plans: {plans.length > 0 ? '✅ ' + plans.length + ' plans' : '❌ No plans'}</div>
      </div>

      {/* Normale pricing component gebruiken */}
      <Pricing
        heading="Upgrade je plan"
        sub_heading="Kies een hoger plan en betaal alleen voor het verschil. Je krijgt automatisch korting voor je resterende tijd."
        plans={plans}
      />
      
      {customer && (
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="bg-neutral-800 rounded-lg p-6 mb-8">
            <h2 className="text-white text-xl font-semibold mb-4">Je huidige plan</h2>
            <div className="text-neutral-300 space-y-2">
              <p><strong>Plan:</strong> {customer.plan.name}</p>
              <p><strong>Prijs:</strong> €{customer.plan.price}/maand</p>
              <p><strong>Status:</strong> {customer.subscription_status}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-blue-900 font-semibold mb-2">
              Hoe werkt pro-rated billing?
            </h3>
            <div className="text-blue-800 text-sm space-y-2">
              <p>• Je krijgt automatisch korting voor de resterende tijd van je huidige plan</p>
              <p>• Betaal alleen het verschil tussen je oude en nieuwe plan</p>
              <p>• Geen dubbele betalingen - wij rekenen precies uit wat je schuldig bent</p>
              <p>• Je nieuwe plan gaat direct in na succesvolle betaling</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}