'use client';

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  href: never;
  children: ReactNode;
  active?: boolean;
  className?: string;
  target?: string;
};

export function NavbarItem({
  children,
  href,
  active,
  target,
  className,
}: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-center text-sm leading-[110%] px-4 py-2 rounded-lg font-medium text-neutral-700 transition-all duration-300 ease-out hover:bg-brand-orange/10 hover:text-brand-orange hover:scale-[1.02]',
        (active || pathname?.includes(href)) && 'bg-brand-blue/10 text-brand-blue',
        className
      )}
      target={target}
    >
      {children}
    </Link>
  );
}
