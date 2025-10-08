'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Plan {
  id?: number;
  documentId?: string;
  name: string;
  price: number;
  sub_text?: string;
  description?: string;
}

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    
    if (planParam) {
      try {
        // Decode URL parameter first, then parse JSON
        const decodedParam = decodeURIComponent(planParam);
        const parsedPlan = JSON.parse(decodedParam);
        setPlan(parsedPlan);
      } catch (error) {
        console.error('❌ Error parsing plan:', error);
        console.error('Raw param:', planParam);
      }
    } else {
    }
  }, [searchParams]);

  const handlePayment = async () => {
    
    if (!plan || !session) {
      return;
    }

    setLoading(true);

    try {
      // Create payment with Mollie
      const paymentRes = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.jwt}`,
        },
        body: JSON.stringify({
          planId: plan.id || plan.documentId || plan.name,
          amount: plan.price,
          description: `Payment for ${plan.name}`,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        console.error('Payment creation failed:', paymentData);
        alert(`Payment creation failed: ${paymentData.error || 'Unknown error'}`);
        return;
      }

      if (paymentData.checkoutUrl) {
        // Redirect to Mollie checkout
        window.location.href = paymentData.checkoutUrl;
      } else {
        console.error('No checkout URL received:', paymentData);
        alert('Payment creation failed: No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  console.log('🔄 Payment page render - Status:', status, 'Session:', !!session, 'Plan:', !!plan);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  if (!plan) {
    return <div className="min-h-screen flex items-center justify-center">No plan selected</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Payment
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Details</h3>
          <div className="space-y-2">
            <p><strong>Name:</strong> {plan.name}</p>
            <p><strong>Description:</strong> {plan.sub_text || plan.description || 'No description'}</p>
            <p><strong>Price:</strong> €{plan.price}</p>
            <p><strong>ID:</strong> {plan.id || plan.documentId || 'Generated'}</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay €${plan.price}`}
          </button>
        </div>
      </div>
    </div>
  );
}