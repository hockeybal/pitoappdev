'use client';

import Image from 'next/image';
import React from 'react';
import Marquee from 'react-fast-marquee';

import { StrapiImage } from '@/components/ui/strapi-image';
import { cn } from '@/lib/utils';

export const TestimonialsMarquee = ({
  testimonials,
}: {
  testimonials: any;
}) => {
  const levelOne = testimonials.slice(0, 8);
  const levelTwo = testimonials.slice(8, 16);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex h-full relative">
        <div className="h-full absolute w-20 left-0 inset-y-0 z-30 bg-gradient-to-r from-white to-transparent" />
        <div className="h-full absolute w-20 right-0 inset-y-0 z-30 bg-gradient-to-l from-white to-transparent" />
        <Marquee>
          {levelOne.map((testimonial: any, index: any) => (
            <Card
              key={`testimonial-${testimonial.id}-${index}`}
              className="max-w-xl h-60 mx-4"
            >
              <Quote>{testimonial?.text}</Quote>
              <div className="flex gap-2 items-center mt-8">
                <StrapiImage
                  src={testimonial?.user?.image?.url}
                  alt={`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-brand-orange/20"
                />
                <div className="flex flex-col">
                  <QuoteDescription className="text-neutral-900 font-semibold">
                    {`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                  </QuoteDescription>
                  <QuoteDescription className="text-neutral-600">
                    {testimonial.user.job}
                  </QuoteDescription>
                </div>
              </div>
            </Card>
          ))}
        </Marquee>
      </div>
      <div className="flex h-full relative mt-8">
        <div className="h-full absolute w-20 left-0 inset-y-0 z-30 bg-gradient-to-r from-white to-transparent" />
        <div className="h-full absolute w-20 right-0 inset-y-0 z-30 bg-gradient-to-l from-white to-transparent" />
        <Marquee direction="right" speed={20}>
          {levelTwo.map((testimonial: any, index: any) => (
            <Card
              key={`testimonial-${testimonial.id}-${index}`}
              className="max-w-xl h-60 mx-4"
            >
              <Quote>{testimonial.text}</Quote>
              <div className="flex gap-2 items-center mt-8">
                <StrapiImage
                  src={testimonial?.user?.image?.url}
                  alt={`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-brand-orange/20"
                />
                <div className="flex flex-col">
                  <QuoteDescription className="text-neutral-900 font-semibold">
                    {`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                  </QuoteDescription>
                  <QuoteDescription className="text-neutral-600">
                    {testimonial.user.job}
                  </QuoteDescription>
                </div>
              </div>
            </Card>
          ))}
        </Marquee>
      </div>
    </div>
  );
};
export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'p-8 rounded-2xl border border-neutral-200 bg-white shadow-md hover:shadow-[0_12px_32px_rgba(12,111,249,0.15)] hover:border-brand-blue/30 hover:-translate-y-1 transition-all duration-300 group',
        className
      )}
    >
      {children}
    </div>
  );
};

export const Quote = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn('text-base font-semibold text-neutral-900 py-2 group-hover:text-brand-blue transition-colors duration-300', className)}>
      {children}
    </h3>
  );
};

export const QuoteDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn('text-sm font-normal text-neutral-600 max-w-sm', className)}
    >
      {children}
    </p>
  );
};
