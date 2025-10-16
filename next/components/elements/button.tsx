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
      ? 'bg-transparent relative z-10 hover:border-brand-blue/30 hover:bg-brand-blue/5  border border-transparent text-neutral-900 text-sm md:text-sm transition font-medium duration-200  rounded-lg px-4 py-2  flex items-center justify-center'
      : variant === 'outline'
        ? 'bg-white relative z-10 hover:bg-brand-blue/5 hover:shadow-lg hover:border-brand-blue  text-neutral-900 border border-neutral-300 hover:text-brand-blue text-sm md:text-sm transition font-medium duration-200  rounded-lg px-4 py-2  flex items-center justify-center'
        : variant === 'primary'
          ? 'bg-gradient-to-r from-brand-orange to-[#ff9a56] relative z-10 hover:shadow-[0_8px_24px_rgba(255,126,29,0.35)] hover:scale-[1.02] border-0 text-white text-sm md:text-sm transition-all font-semibold duration-300 ease-out rounded-lg px-6 py-2.5 flex items-center justify-center shadow-[0_4px_14px_rgba(255,126,29,0.25)] hover:-translate-y-0.5 active:translate-y-0'
          : variant === 'muted'
            ? 'bg-neutral-200 relative z-10 hover:bg-neutral-300  border border-transparent text-neutral-900 text-sm md:text-sm transition font-medium duration-200  rounded-lg px-4 py-2  flex items-center justify-center'
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
