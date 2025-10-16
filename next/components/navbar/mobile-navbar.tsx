'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { useState } from 'react';
import { IoIosMenu } from 'react-icons/io';
import { IoIosClose } from 'react-icons/io';

import { LocaleSwitcher } from '../locale-switcher';
import { Button } from '@/components/elements/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  rightNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  logo: any;
  locale: string;
};

export const MobileNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
}: Props) => {
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => {
    if (value > 100 && !open) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });

  return (
    <div
      className={cn(
        'flex justify-between bg-transparent items-center w-full rounded-full px-4 py-2.5 transition duration-300',
        showBackground && !open &&
          'bg-white/85 backdrop-blur-lg shadow-[0_8px_32px_rgba(12,111,249,0.12),0_2px_8px_rgba(0,0,0,0.04)] border border-brand-blue/10'
      )}
    >
      <Logo locale={locale} image={logo?.image} />

      <IoIosMenu
        className={cn(
          'h-7 w-7 transition-colors duration-200 cursor-pointer',
          showBackground ? 'text-neutral-900' : 'text-neutral-900'
        )}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="fixed inset-0 bg-gradient-to-b from-brand-blue to-brand-light-blue z-50 flex flex-col items-start justify-start space-y-10 pt-5 text-xl transition duration-300 ease-out">
          <div className="flex items-center justify-between w-full px-5 py-2 bg-white/10 backdrop-blur-md">
            <Logo locale={locale} image={logo?.image} />
            <div className="flex items-center space-x-2">
              <IoIosClose
                className="h-9 w-9 text-white hover:text-brand-orange transition-colors duration-200 cursor-pointer hover:rotate-90 transition-transform"
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-2 px-8 w-full">
            {leftNavbarItems.map((navItem: any, idx: number) => (
              <>
                {navItem.children && navItem.children.length > 0 ? (
                  <>
                    {navItem.children.map((childNavItem: any, childIdx: number) => (
                      <Link
                        key={`link=${childIdx}`}
                        href={`/${locale}${childNavItem.URL}`}
                        onClick={() => setOpen(false)}
                        className="relative w-full text-left py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 hover:pl-6 group"
                      >
                        <span className="block text-white text-2xl font-medium group-hover:text-brand-orange transition-colors duration-300">
                          {childNavItem.text}
                        </span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    key={`link=${idx}`}
                    href={`/${locale}${navItem.URL}`}
                    onClick={() => setOpen(false)}
                    className="relative w-full py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 hover:pl-6 group"
                  >
                    <span className="block text-white text-[26px] font-medium group-hover:text-brand-orange transition-colors duration-300">
                      {navItem.text}
                    </span>
                  </Link>
                )}
              </>
            ))}
          </div>
          <div className="flex flex-col w-full items-stretch gap-3 px-8 py-4">
            {rightNavbarItems.map((item, index) => (
              <Button
                key={item.text}
                variant={
                  index === rightNavbarItems.length - 1 ? 'primary' : 'outline'
                }
                as={Link}
                href={`/${locale}${item.URL}`}
                className="w-full justify-center"
              >
                {item.text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
