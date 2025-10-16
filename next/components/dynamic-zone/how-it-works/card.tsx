'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import React, { MouseEvent as ReactMouseEvent, useRef } from 'react';

import Beam from '../../beam';
import { CanvasRevealEffect } from '../../ui/canvas-reveal-effect';
import { StrapiImage } from '../../ui/strapi-image';

export const Card = ({
  title,
  description,
  index,
  screenshot,
}: {
  title: string;
  description: string;
  index: number;
  screenshot?: any;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'start start'],
  });

  const width = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 300]), {
    stiffness: 500,
    damping: 90,
  });

  useMotionValueEvent(width, 'change', (latest) => {});
  
  // Fix wrong port 1338 to correct port 1337
  const fixedScreenshotUrl = screenshot?.url 
    ? screenshot.url.replace(':1338', ':1337')
    : screenshot?.url;
  
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-4 max-w-4xl mx-auto py-20"
    >
      {fixedScreenshotUrl ? (
        <div className="flex items-center justify-center mt-8">
          <StrapiImage
            src={fixedScreenshotUrl}
            alt={screenshot.alternativeText || title}
            width={200}
            height={200}
            className="w-full h-auto max-w-[200px] object-contain rounded-lg"
          />
        </div>
      ) : (
        <p className="text-9xl font-bold bg-gradient-to-br from-brand-orange to-[#ff9a56] bg-clip-text text-transparent mt-8">{'0' + index}</p>
      )}
      <motion.div
        className="h-px w-full hidden md:block bg-gradient-to-r from-brand-orange to-brand-light-blue rounded-full mt-16 relative overflow-hidden"
        style={{ width }}
      >
        <Beam className="top-0" />
      </motion.div>
      <div
        className="group p-8 rounded-2xl border border-neutral-200 bg-white hover:border-brand-blue/30 hover:shadow-[0_12px_32px_rgba(12,111,249,0.15)] transition-all duration-300 hover:-translate-y-1 relative z-40 col-span-2"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="pointer-events-none absolute z-10 -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            maskImage: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(12, 111, 249, 0.1),
              transparent 80%
            )
          `,
          }}
        >
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [255, 126, 29],
              [50, 170, 255],
            ]}
            dotSize={2}
          />
        </motion.div>

        <p className="text-xl font-bold relative z-20 mt-2 text-neutral-900 group-hover:text-brand-blue transition-colors duration-300">{title}</p>
        <p className="text-neutral-600 mt-4 relative z-20 text-base leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
