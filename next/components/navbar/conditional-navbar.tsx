'use client';

import { usePathname } from 'next/navigation';

import { Navbar } from './index';

export function ConditionalNavbar({ data, locale }: { data: any; locale: string }) {
  const pathname = usePathname();

  // Hide navbar on dashboard pages
  if (pathname.includes('/dashboard')) {
    return null;
  }

  return <Navbar data={data} locale={locale} />;
}