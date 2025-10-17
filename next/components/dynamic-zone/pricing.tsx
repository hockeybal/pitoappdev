'use client';

import { IconCheck, IconPlus, IconReceipt2 } from '@tabler/icons-react';
import React from 'react';

import { Container } from '../container';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { cn } from '@/lib/utils';

type Perks = {
  [key: string]: string;
};

type CTA = {
  [key: string]: string;
};

type Plan = {
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

export const Pricing = ({
  heading,
  sub_heading,
  plans,
}: {
  heading: string;
  sub_heading: string;
  plans: any[];
}) => {
  const onClick = (plan: Plan) => {
    console.log('click', plan);
  };
  return (
    <div className="pt-40 pb-20 bg-white">
      <Container>
        <Heading className="pt-4 text-neutral-900">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto text-neutral-600">{sub_heading}</Subheading>
        
        {/* Prijzen grid met verbeterde spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-6 py-20">
          {plans.map((plan) => (
            <Card onClick={() => onClick(plan)} key={plan.name} plan={plan} />
          ))}
        </div>
      </Container>
    </div>
  );
};

const Card = ({ plan, onClick }: { plan: Plan; onClick: () => void }) => {
  // Bereken prijs per dag (365 dagen per jaar)
  const pricePerDay = plan.price ? (plan.price / 365).toFixed(2) : null;
  
  return (
    <div
      className={cn(
        'p-1 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group',
        plan.featured 
          ? 'border-brand-orange shadow-lg scale-[1.02] bg-white' 
          : 'border-neutral-200 bg-gradient-to-b from-neutral-50 to-white hover:border-neutral-300 shadow-sm'
      )}
    >
      <div
        className={cn(
          'p-6 rounded-[22px] h-full relative overflow-hidden',
          plan.featured ? 'bg-neutral-50' : 'bg-white'
        )}
      >
        {/* Background decoration - subtiel */}
        {plan.featured ? (
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/3 rounded-full blur-3xl -z-0" />
        ) : (
          <div className="absolute top-0 right-0 w-40 h-40 bg-neutral-100/50 rounded-full blur-3xl -z-0" />
        )}
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className={cn('font-semibold text-lg text-neutral-900', plan.featured && 'text-brand-blue')}>
                {plan.name}
              </p>
              {plan.sub_text && (
                <p className="text-sm text-neutral-500 mt-1">
                  {plan.sub_text}
                </p>
              )}
            </div>
            {plan.featured && (
              <div
                className={cn(
                  'font-medium text-xs px-3 py-1.5 rounded-full bg-brand-orange text-white shadow-md'
                )}
              >
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
              <span className={cn('text-5xl font-bold text-neutral-900 ml-1', plan.featured && 'text-brand-orange')}>
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
            variant="outline"
            className={cn(
              'w-full mb-6 border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 font-medium',
              plan.featured &&
                'bg-brand-orange text-white border-brand-orange hover:bg-brand-orange/90 hover:border-brand-orange hover:shadow-lg hover:text-white transform hover:scale-[1.02]'
            )}
            onClick={onClick}
          >
            {plan?.CTA?.text}
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
