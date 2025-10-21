'use client';

import { IconCheck, IconPlus, IconReceipt2 } from '@tabler/icons-react';
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
    <div className="pt-40 pb-20 bg-white">
      <Container>
        <Heading className="pt-4 text-neutral-900">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto text-neutral-600">{sub_heading}</Subheading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-6 py-20">
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
      return currentPlanId && plan.price > 0 ? 'Upgrade Plan' : plan.CTA?.text || 'Kies Plan';
    }
    return plan.CTA?.text || 'Kies Plan';
  };

  const getButtonVariant = (): "outline" | "simple" | "primary" | "muted" => {
    if (isCurrentPlan) {
      return 'muted';
    }
    return 'outline';
  };

  // Bereken prijs per dag
  const pricePerDay = plan.price ? (plan.price / 365).toFixed(2) : null;

  return (
    <div
      className={cn(
        'p-1 rounded-3xl border transition-all duration-300 group',
        plan.featured && 'border-brand-orange shadow-lg scale-[1.02] bg-white',
        isCurrentPlan && 'border-blue-400 shadow-lg bg-white',
        !plan.featured && !isCurrentPlan && 'border-neutral-200 bg-gradient-to-b from-neutral-50 to-white hover:border-neutral-300 shadow-sm',
        canUpgrade && 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
      )}
    >
      <div
        className={cn(
          'p-6 rounded-[22px] h-full relative overflow-hidden',
          plan.featured && 'bg-neutral-50',
          isCurrentPlan && 'bg-blue-50',
          !plan.featured && !isCurrentPlan && 'bg-white'
        )}
      >
        {/* Background decoration - subtiel */}
        {plan.featured ? (
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/3 rounded-full blur-3xl -z-0" />
        ) : isCurrentPlan ? (
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl -z-0" />
        ) : (
          <div className="absolute top-0 right-0 w-40 h-40 bg-neutral-100/50 rounded-full blur-3xl -z-0" />
        )}
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className={cn('font-semibold text-lg text-neutral-900', 
                plan.featured && 'text-brand-blue',
                isCurrentPlan && 'text-blue-900'
              )}>
                {plan.name}
                {isCurrentPlan && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                    ✓ Actief
                  </span>
                )}
              </p>
              {plan.sub_text && (
                <p className={cn('text-sm text-neutral-500 mt-1',
                  isCurrentPlan && 'text-blue-600'
                )}>
                  {plan.sub_text}
                </p>
              )}
            </div>
            {plan.featured && !isCurrentPlan && (
              <div className="font-medium text-xs px-3 py-1.5 rounded-full bg-brand-orange text-white shadow-md">
                ⭐ Populair
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <div className="flex items-baseline">
              {plan.price && (
                <span className={cn('text-2xl font-bold text-neutral-600')}>
                  €
                </span>
              )}
              <span className={cn('text-5xl font-bold text-neutral-900 ml-1', 
                plan.featured && 'text-brand-orange',
                isCurrentPlan && 'text-blue-900'
              )}>
                {plan.price || plan?.CTA?.text}
              </span>
              {plan.price && (
                <span className={cn('text-base font-medium text-neutral-500 ml-2')}>
                  / jaar
                </span>
              )}
            </div>
            {pricePerDay && (
              <p className="text-sm text-neutral-500 mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-brand-orange"></span>
                Slechts €{pricePerDay} per dag
              </p>
            )}
          </div>
        
          <Button
            variant={getButtonVariant()}
            className={cn(
              'w-full mb-6 border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 font-medium',
              plan.featured &&
                'bg-brand-orange text-white border-brand-orange hover:bg-brand-orange/90 hover:border-brand-orange hover:shadow-lg hover:text-white transform hover:scale-[1.02]',
              isCurrentPlan &&
                'bg-blue-100 text-blue-700 border-blue-300 cursor-not-allowed opacity-75 hover:bg-blue-100 hover:text-blue-700 hover:scale-100',
              canUpgrade && !isCurrentPlan &&
                'border-indigo-500 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-600'
            )}
            onClick={onClick}
            disabled={isCurrentPlan}
          >
            {getButtonText()}
          </Button>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Inclusief</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
            </div>
            
            {plan.perks.map((feature, idx) => (
              <Step featured={plan.featured} key={idx}>
                {feature.text}
              </Step>
            ))}
          </div>
          
          {plan.additional_perks && plan.additional_perks.length > 0 && (
            <>
              <Divider featured={plan.featured} />
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent" />
                  <span className="text-xs font-medium text-brand-orange uppercase tracking-wider">Extra voordelen</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent" />
                </div>
                {plan.additional_perks?.map((feature, idx) => (
                  <Step featured={plan.featured} additional key={idx}>
                    {feature.text}
                  </Step>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
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
    <div className="flex items-start justify-start gap-3 group">
      <div
        className={cn(
          'h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200',
          additional 
            ? 'bg-brand-orange shadow-sm group-hover:shadow-md group-hover:scale-110' 
            : 'bg-neutral-200 group-hover:bg-neutral-300',
          featured && !additional && 'bg-brand-blue/20'
        )}
      >
        <IconCheck 
          className={cn(
            'h-3 w-3 [stroke-width:3px]',
            additional ? 'text-white' : 'text-neutral-600',
            featured && !additional && 'text-brand-blue'
          )} 
        />
      </div>
      <div
        className={cn(
          'font-normal text-neutral-700 text-sm leading-relaxed',
          additional && 'font-medium text-neutral-900'
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Divider = ({ featured }: { featured?: boolean }) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-neutral-200" />
      </div>
      <div className="relative flex justify-center">
        <div
          className={cn(
            'bg-white px-3 py-1.5 rounded-full border border-neutral-200 shadow-sm',
            featured && 'border-brand-orange/30 bg-neutral-50'
          )}
        >
          <IconPlus
            className={cn(
              'h-3.5 w-3.5 [stroke-width:2.5px] text-neutral-400',
              featured && 'text-brand-orange'
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PricingWithUpgrades;