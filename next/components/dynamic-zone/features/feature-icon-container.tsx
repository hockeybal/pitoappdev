import React from 'react';

import { cn } from '@/lib/utils';

export const FeatureIconContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="[perspective:400px] [transform-style:preserve-3d]">
      <div
        className={cn(
          'h-16 w-16 p-[4px] rounded-xl bg-gradient-to-br from-brand-orange to-[#ff9a56] mx-auto relative shadow-[0_8px_24px_rgba(255,126,29,0.35)]'
        )}
        style={{
          transform: 'rotateX(25deg)',
          transformOrigin: 'center',
        }}
      >
        <div
          className={cn(
            'bg-white rounded-lg h-full w-full relative z-20',
            className
          )}
        >
          {children}
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-brand-orange/60 opacity-70 rounded-full blur-xl h-6 w-full mx-auto z-30"></div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-brand-orange to-transparent h-px w-[60%] mx-auto"></div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-brand-orange/50 blur-sm to-transparent h-[8px] w-[60%] mx-auto"></div>
      </div>
    </div>
  );
};
