import React from 'react';

import { cn } from '@/lib/utils';

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
        'p-8 rounded-3xl border border-neutral-200 bg-white shadow-md group transition-all duration-300 hover:shadow-[0_12px_32px_rgba(12,111,249,0.15)] hover:border-brand-blue/30 hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn('text-xl font-bold text-neutral-900 py-2 group-hover:text-brand-blue transition-colors duration-300', className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn('text-base font-normal text-neutral-600 max-w-sm leading-relaxed', className)}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        'h-[20rem] rounded-xl z-40',
        className,
        showGradient &&
          ' bg-neutral-50 [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]'
      )}
    >
      {children}
    </div>
  );
};
