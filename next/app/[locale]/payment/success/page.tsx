'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [updating, setUpdating] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const updateCustomerPlan = async () => {
      if (!session?.user?.jwt) return;

      const planId = searchParams.get('planId');

      if (!planId) {
        setUpdating(false);
        return;
      }

      try {
        // First, check if customer record exists
        const customerRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/customers?filters[user_id][$eq]=${session.user.id}&populate=plan`, {
          headers: {
            'Authorization': `Bearer ${session.user.jwt}`,
          },
        });

        const customerData = await customerRes.json();

        if (customerData.data && customerData.data.length > 0) {
          // Update existing customer
          const customerId = customerData.data[0].id;
          await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/customers/${customerId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.user.jwt}`,
            },
            body: JSON.stringify({
              data: {
                plan: planId,
                subscription_status: 'active',
              },
            }),
          });
        } else {
          // Create new customer
          await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/customers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.user.jwt}`,
            },
            body: JSON.stringify({
              data: {
                user_id: session.user.id,
                user_email: session.user.email,
                plan: planId,
                subscription_status: 'active',
              },
            }),
          });
        }

        setUpdating(false);
      } catch (error) {
        console.error('Error updating customer:', error);
        setUpdating(false);
      }
    };

    if (session?.user?.jwt) {
      updateCustomerPlan();
    }
  }, [session, searchParams]);

  if (status === 'loading' || updating) {
    return <div className="min-h-screen flex items-center justify-center">Processing your payment...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your plan has been activated. You can now access your dashboard.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}