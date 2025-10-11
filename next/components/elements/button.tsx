import { LinkProps } from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  href?: LinkProps['href'];
  onClick?: () => void;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  as: Tag = 'button',
  className,
  children,
  ...props
}) => {
  const variantClass =
    variant === 'simple'
      ? 'bg-transparent relative z-10 hover:border-brand-blue/30 hover:bg-brand-blue/5  border border-transparent text-neutral-900 text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center'
      : variant === 'outline'
        ? 'bg-white relative z-10 hover:bg-brand-blue/5 hover:shadow-lg hover:border-brand-blue  text-neutral-900 border border-neutral-300 hover:text-brand-blue text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center'
        : variant === 'primary'
          ? 'bg-brand-orange relative z-10 hover:bg-brand-orange/90  border border-brand-orange text-white text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center shadow-sm  hover:-translate-y-1 active:-translate-y-0'
          : variant === 'muted'
            ? 'bg-neutral-200 relative z-10 hover:bg-neutral-300  border border-transparent text-neutral-900 text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center'
            : '';
  const Element = Tag as any;

  return (
    <Element
      className={cn(
        'bg-transparent relative z-10 hover:border-brand-blue/30 hover:bg-brand-blue/5  border border-transparent text-neutral-900 text-sm md:text-sm transition font-medium duration-200  rounded-md px-4 py-2  flex items-center justify-center ',
        variantClass,
        className
      )}
      {...props}
    >
      {children ?? `Get Started`}
    </Element>
  );
};
