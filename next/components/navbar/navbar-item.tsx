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
        'flex items-center justify-center  text-sm leading-[110%] px-4 py-2 rounded-md  hover:bg-brand-blue/10 hover:text-brand-blue text-neutral-900 transition duration-200',
        (active || pathname?.includes(href)) && 'bg-brand-blue/10 text-brand-blue',
        className
      )}
      target={target}
    >
      {children}
    </Link>
  );
}
