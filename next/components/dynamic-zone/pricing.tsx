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
    <div className="pt-40">
      <Container>
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceipt2 className="h-6 w-6 text-brand-blue" />
        </FeatureIconContainer>
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 py-20 lg:items-start">
          {plans.map((plan) => (
            <Card onClick={() => onClick(plan)} key={plan.name} plan={plan} />
          ))}
        </div>
      </Container>
    </div>
  );
};

const Card = ({ plan, onClick }: { plan: Plan; onClick: () => void }) => {
  return (
    <div
      className={cn(
        'p-4 md:p-4 rounded-3xl bg-white border-2 border-neutral-200',
        plan.featured && 'border-brand-blue bg-brand-blue/5'
      )}
    >
      <div
        className={cn(
          'p-4 bg-neutral-50 rounded-2xl shadow-sm',
          plan.featured && 'bg-white shadow-lg'
        )}
      >
        <div className="flex justify-between items-center">
          <p className={cn('font-medium text-neutral-900')}>
            {plan.name}
          </p>
          {plan.featured && (
            <div
              className={cn(
                'font-medium text-xs px-3 py-1 rounded-full relative bg-brand-orange text-white'
              )}
            >
              <div className="absolute inset-x-0 bottom-0 w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
              Meest gekozen
            </div>
          )}
        </div>
        <div className="mt-8">
          {plan.price && (
            <span
              className={cn(
                'text-lg font-bold text-neutral-600'
              )}
            >
              €
            </span>
          )}
          <span
            className={cn('text-4xl font-bold text-neutral-900')}
          >
            {plan.price || plan?.CTA?.text}
          </span>
          {plan.price && (
            <span
              className={cn(
                'text-lg font-normal text-neutral-600 ml-2'
              )}
            >
              / Per jaar
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className={cn(
            'w-full mt-10 mb-4 border-neutral-300 text-neutral-900 hover:bg-neutral-50',
            plan.featured &&
              'bg-brand-orange text-white border-brand-orange hover:bg-brand-orange/90 hover:text-white'
          )}
          onClick={onClick}
        >
          {plan?.CTA?.text}
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
        <Divider featured={plan.featured} />
      )}
      <div className="p-4">
        {plan.additional_perks?.map((feature, idx) => (
          <Step featured={plan.featured} additional key={idx}>
            {feature.text}
          </Step>
        ))}
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
    <div className="flex items-start justify-start gap-2 my-4">
      <div
        className={cn(
          'h-4 w-4 rounded-full bg-neutral-300 flex items-center justify-center flex-shrink-0 mt-0.5',
          additional ? 'bg-brand-light-blue' : 'bg-neutral-300'
        )}
      >
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-white" />
      </div>
      <div
        className={cn(
          'font-medium text-neutral-900 text-sm'
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
        className={cn('w-full h-px bg-neutral-100')}
      />
      <div
        className={cn(
          'w-full h-px bg-neutral-200'
        )}
      />
      <div
        className={cn(
          'absolute inset-0 h-5 w-5 m-auto rounded-xl bg-white shadow-sm flex items-center justify-center border border-neutral-200'
        )}
      >
        <IconPlus
          className={cn(
            'h-3 w-3 [stroke-width:4px] text-neutral-600'
          )}
        />
      </div>
    </div>
  );
};
