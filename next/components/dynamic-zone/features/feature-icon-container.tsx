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
    <div className=" [perspective:400px] [transform-style:preserve-3d]">
      <div
        className={cn(
          'h-14 w-14 p-[4px] rounded-md bg-gradient-to-b from-neutral-200  to-neutral-300 mx-auto relative'
        )}
        style={{
          transform: 'rotateX(25deg)',
          transformOrigin: 'center',
        }}
      >
        <div
          className={cn(
            'bg-white rounded-[5px] h-full w-full relative z-20',
            className
          )}
        >
          {children}
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-neutral-300 opacity-50 rounded-full blur-lg h-4 w-full mx-auto z-30"></div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-neutral-400 to-transparent h-px w-[60%] mx-auto"></div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-neutral-300 blur-sm to-transparent h-[8px] w-[60%] mx-auto"></div>
      </div>
    </div>
  );
};
