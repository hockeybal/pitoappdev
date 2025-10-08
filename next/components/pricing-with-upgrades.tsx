'use client';

import { IconCheck, IconReceipt2 } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

import { Container } from './container';
import { Button } from './elements/button';
import { Heading } from './elements/heading';
import { Subheading } from './elements/subheading';
import { FeatureIconContainer } from './dynamic-zone/features/feature-icon-container';
import UpgradePreview from './upgrade-preview';
import { cn } from '@/lib/utils';

type Perks = {
  [key: string]: string;
};

type CTA = {
  [key: string]: string;
};

type Plan = {
  id: number;
  name: string;
  price: number;
  perks: Perks[];
  additional_perks: Perks[];
  description: string;
  sub_text?: string;
  number: string;
  featured?: boolean;
  CTA?: CTA | undefined;
};

interface PricingWithUpgradesProps {
  heading: string;
  sub_heading: string;
  plans: Plan[];
  currentPlanId?: number; // ID van het huidige plan van de ingelogde gebruiker
}

export const PricingWithUpgrades = ({
  heading,
  sub_heading,
  plans,
  currentPlanId,
}: PricingWithUpgradesProps) => {
  const { data: session } = useSession();
  const [selectedUpgrade, setSelectedUpgrade] = useState<{
    currentPlanId: number;
    newPlanId: number;
  } | null>(null);

  const handlePlanClick = (plan: Plan) => {
    // Als gebruiker is ingelogd en al een plan heeft
    if (session && currentPlanId) {
      if (plan.id === currentPlanId) {
        // Huidig plan - geen actie
        return;
      }
      
      // Toon upgrade preview
      setSelectedUpgrade({
        currentPlanId,
        newPlanId: plan.id,
      });
    } else {
      // Normale flow voor nieuwe klanten
      window.location.href = `/payment?plan=${encodeURIComponent(JSON.stringify(plan))}`;
    }
  };

  const isCurrentPlan = (planId: number) => currentPlanId === planId;
  const canUpgrade = (planId: number) => session && currentPlanId && planId !== currentPlanId;

  return (
    <div className="pt-40">
      <Container>
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceipt2 className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 py-20 lg:items-start">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => handlePlanClick(plan)}
              isCurrentPlan={isCurrentPlan(plan.id)}
              canUpgrade={!!canUpgrade(plan.id)}
              currentPlanId={currentPlanId}
            />
          ))}
        </div>

        {/* Upgrade Preview Modal/Section */}
        {selectedUpgrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Plan Upgrade</h2>
                  <button
                    onClick={() => setSelectedUpgrade(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <UpgradePreview
                  currentPlanId={selectedUpgrade.currentPlanId}
                  newPlanId={selectedUpgrade.newPlanId}
                  onUpgrade={() => setSelectedUpgrade(null)}
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

interface PlanCardProps {
  plan: Plan;
  onClick: () => void;
  isCurrentPlan: boolean;
  canUpgrade: boolean;
  currentPlanId?: number;
}

const PlanCard = ({ plan, onClick, isCurrentPlan, canUpgrade, currentPlanId }: PlanCardProps) => {
  const getButtonText = () => {
    if (isCurrentPlan) {
      return 'Huidig Plan';
    }
    if (canUpgrade) {
      return currentPlanId && plan.price > 0 ? 'Upgrade' : plan.CTA?.text || 'Kies Plan';
    }
    return plan.CTA?.text || 'Kies Plan';
  };

  const getButtonVariant = (): "outline" | "simple" | "primary" | "muted" => {
    if (isCurrentPlan) {
      return 'muted'; // Gedimde knop voor huidig plan
    }
    return 'outline';
  };

  return (
    <div
      className={cn(
        'p-4 md:p-4 rounded-3xl bg-neutral-900 border-2 border-neutral-800 cursor-pointer transition-all duration-200',
        plan.featured && 'border-neutral-50 bg-neutral-100',
        isCurrentPlan && 'ring-2 ring-blue-500 border-blue-500',
        canUpgrade && 'hover:border-indigo-500 hover:shadow-lg'
      )}
    >
      <div
        className={cn(
          'p-4 bg-neutral-800 rounded-2xl shadow-[0px_-1px_0px_0px_var(--neutral-700)]',
          plan.featured && 'bg-white shadow-aceternity',
          isCurrentPlan && 'bg-blue-50 border border-blue-200'
        )}
      >
        <div className="flex justify-between items-center">
          <p className={cn('font-medium', plan.featured && 'text-black', isCurrentPlan && 'text-blue-900')}>
            {plan.name}
            {isCurrentPlan && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ACTIEF</span>}
          </p>
          {plan.featured && !isCurrentPlan && (
            <div
              className={cn(
                'font-medium text-xs px-3 py-1 rounded-full relative bg-neutral-900'
              )}
            >
              <div className="absolute inset-x-0 bottom-0 w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
              Featured
            </div>
          )}
        </div>

        <p className={cn('text-sm text-neutral-500 mt-4', plan.featured && 'text-neutral-700')}>
          {plan.sub_text}
        </p>

        <div className="mt-8">
          {plan.price && (
            <span
              className={cn(
                'text-lg font-bold text-neutral-500',
                plan.featured && 'text-neutral-700'
              )}
            >
              €
            </span>
          )}
          <span
            className={cn('text-4xl font-bold', plan.featured && 'text-black')}
          >
            {plan.price || plan?.CTA?.text}
          </span>
          {plan.price && (
            <span
              className={cn(
                'text-lg font-normal text-neutral-500 ml-2',
                plan.featured && 'text-neutral-700'
              )}
            >
              / maand
            </span>
          )}
        </div>
        
        <Button
          variant={getButtonVariant()}
          className={cn(
            'w-full mt-10 mb-4',
            plan.featured &&
              'bg-black text-white hover:bg-black/80 hover:text-white',
            isCurrentPlan &&
              'bg-blue-100 text-blue-700 border-blue-200 cursor-default hover:bg-blue-100 hover:text-blue-700',
            canUpgrade && !isCurrentPlan &&
              'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'
          )}
          onClick={onClick}
          disabled={isCurrentPlan}
        >
          {getButtonText()}
        </Button>
      </div>

      <div className="mt-1 p-4">
        {plan.perks.map((feature, idx) => (
          <Step featured={plan.featured} key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
      
      {plan.additional_perks && plan.additional_perks.length > 0 && (
        <>
          <Divider featured={plan.featured} />
          <div className="p-4">
            {plan.additional_perks?.map((feature, idx) => (
              <Step featured={plan.featured} additional key={idx}>
                {feature.text}
              </Step>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Step = ({
  children,
  additional,
  featured,
}: {
  children: React.ReactNode;
  additional?: boolean;
  featured?: boolean;
}) => {
  return (
    <div className="flex items-start justify-start gap-2 my-4">
      <div
        className={cn(
          'h-4 w-4 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5',
          additional ? 'bg-indigo-600' : 'bg-neutral-700'
        )}
      >
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-neutral-300" />
      </div>
      <div
        className={cn(
          'font-medium text-white text-sm',
          featured && 'text-black'
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Divider = ({ featured }: { featured?: boolean }) => {
  return (
    <div className="relative">
      <div
        className={cn('w-full h-px bg-neutral-950', featured && 'bg-white')}
      />
      <div
        className={cn(
          'w-full h-px bg-neutral-800',
          featured && 'bg-neutral-200'
        )}
      />
    </div>
  );
};

export default PricingWithUpgrades;