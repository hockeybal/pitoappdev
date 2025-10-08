'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatAmount } from '@/lib/shared/pro-rated-billing';

interface ProRatedCalculation {
  current_plan: {
    id: number;
    name: string;
    price: number;
  };
  new_plan: {
    id: number;
    name: string;
    price: number;
  };
  remaining_days: number;
  total_days_in_period: number;
  unused_amount: number;
  upgrade_cost: number;
  final_amount_to_pay: number;
  discount_percentage: number;
}

interface UpgradePreviewProps {
  currentPlanId: number;
  newPlanId: number;
  onUpgrade?: (calculation: ProRatedCalculation) => void;
  className?: string;
}

export function UpgradePreview({ 
  currentPlanId, 
  newPlanId, 
  onUpgrade,
  className = ""
}: UpgradePreviewProps) {
  const { data: session } = useSession();
  const [calculation, setCalculation] = useState<ProRatedCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  // Laad upgrade preview wanneer plan IDs veranderen
  useEffect(() => {
    if (!session || currentPlanId === newPlanId) {
      return;
    }

    loadUpgradePreview();
  }, [currentPlanId, newPlanId, session]);

  const loadUpgradePreview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/upgrade-plan?planId=${newPlanId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load upgrade preview');
      }

      setCalculation(data.proRatedCalculation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load upgrade preview');
      setCalculation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!calculation || !session) return;

    setUpgrading(true);
    setError(null);

    try {
      const response = await fetch('/api/upgrade-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPlanId: calculation.new_plan.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upgrade failed');
      }

      if (data.paymentRequired && data.checkoutUrl) {
        // Redirect naar Mollie checkout
        window.location.href = data.checkoutUrl;
      } else {
        // Upgrade succesvol zonder betaling
        onUpgrade?.(calculation);
        // Refresh de pagina of toon succes bericht
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className={`border rounded-lg p-6 bg-gray-50 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border border-red-200 rounded-lg p-6 bg-red-50 ${className}`}>
        <div className="text-red-700">
          <h3 className="font-medium mb-2">Upgrade niet mogelijk</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={loadUpgradePreview}
            className="mt-3 text-red-600 hover:text-red-700 text-sm underline"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    );
  }

  if (!calculation) {
    return null;
  }

  const hasDiscount = calculation.unused_amount > 0;
  const isFree = calculation.final_amount_to_pay === 0;

  return (
    <div className={`border rounded-lg p-6 bg-white shadow-sm ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upgrade Preview
          </h3>
          <p className="text-sm text-gray-600">
            Van <span className="font-medium">{calculation.current_plan.name}</span> naar{' '}
            <span className="font-medium">{calculation.new_plan.name}</span>
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Prijs nieuwe plan:</span>
            <span className="font-medium">{formatAmount(calculation.upgrade_cost)}</span>
          </div>

          {hasDiscount && (
            <>
              <div className="flex justify-between text-green-700">
                <span>
                  Credit van huidig plan ({calculation.remaining_days} dagen over):
                </span>
                <span className="font-medium">
                  -{formatAmount(calculation.unused_amount)}
                </span>
              </div>
              
              <div className="flex justify-between text-green-700 text-xs">
                <span>Korting percentage:</span>
                <span>{calculation.discount_percentage.toFixed(1)}%</span>
              </div>

              <hr className="border-gray-200" />
            </>
          )}

          <div className="flex justify-between text-lg font-semibold">
            <span>Te betalen nu:</span>
            <span className={isFree ? 'text-green-600' : 'text-gray-900'}>
              {isFree ? 'Gratis!' : formatAmount(calculation.final_amount_to_pay)}
            </span>
          </div>
        </div>

        {hasDiscount && !isFree && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <span className="font-medium">Goed nieuws!</span> Je krijgt{' '}
              {formatAmount(calculation.unused_amount)} korting voor je resterende tijd.
            </p>
          </div>
        )}

        {isFree && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <span className="font-medium">Geweldig!</span> Je upgrade is gratis dankzij je 
              resterende credit van {formatAmount(calculation.unused_amount)}.
            </p>
          </div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={upgrading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium 
                   hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          {upgrading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Upgraden...
            </span>
          ) : (
            `${isFree ? 'Upgrade Gratis' : `Betaal ${formatAmount(calculation.final_amount_to_pay)}`}`
          )}
        </button>
      </div>
    </div>
  );
}

export default UpgradePreview;