'use client';

import { IconRocket } from '@tabler/icons-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';

import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';

export const Launches = ({
  heading,
  sub_heading,
  launches,
}: {
  heading: string;
  sub_heading: string;
  launches: any[];
}) => {
  const itemsRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState(0);
  
  useEffect(() => {
    if (itemsRef.current) {
      setTimelineHeight(itemsRef.current.scrollHeight);
    }
  }, [launches]);
  
  const { scrollYProgress } = useScroll({
    target: itemsRef,
    offset: ['start center', 'end center'],
  });

  // Smooth spring animation for the dove
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const doveProgress = useSpring(scrollYProgress, springConfig);
  
  // Transform to actual pixel value based on timeline height
  const doveY = useTransform(
    doveProgress, 
    [0, 1], 
    [0, Math.max(timelineHeight - 100, 0)]
  );

  return (
    <div className="w-full relative bg-gradient-to-b from-white via-gray-50 to-white py-24 md:py-40 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-brand-light-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="px-6 max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden mx-auto">
            <IconRocket className="h-7 w-7 text-white" />
          </FeatureIconContainer>
          <Heading className="mt-6">{heading}</Heading>
          <Subheading className="mt-4 max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Launch Items */}
          <div ref={itemsRef} className="space-y-16 md:space-y-24 relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-brand-orange via-brand-light-blue to-brand-blue hidden md:block" />

            {/* Animated Flying Dove 🕊️ */}
            <motion.div
              className="hidden md:block absolute left-1/2 top-0 z-20 pointer-events-none"
              style={{ 
                y: doveY,
                x: '-50%'
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -5, 0, 5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl drop-shadow-lg"
              >
                🕊️
              </motion.div>
            </motion.div>
            {launches.map((launch, index) => (
              <motion.div
                key={launch.id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Card */}
                <div className="w-full md:w-[calc(50%-3rem)]">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-[0_12px_32px_rgba(12,111,249,0.15)] border border-gray-100 hover:border-brand-blue/30 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Animated connection line from dot to card */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                      className={`hidden md:block absolute top-1/2 ${
                        index % 2 === 0 ? 'left-full' : 'right-full'
                      } w-12 h-0.5 bg-gradient-to-r ${
                        index % 2 === 0
                          ? 'from-brand-orange to-transparent'
                          : 'from-transparent to-brand-orange'
                      }`}
                    />

                    {/* Mission Number Badge */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-[#ff9a56] shadow-[0_8px_24px_rgba(255,126,29,0.35)]">
                        <span className="text-2xl font-bold text-white">
                          {launch.mission_number}
                        </span>
                      </div>
                      <IconRocket className="h-8 w-8 text-brand-orange" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {launch.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {launch.description}
                    </p>
                  </motion.div>
                </div>

                {/* Timeline Dot (Desktop only) with glow effect */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-brand-orange to-[#ff9a56] border-4 border-white shadow-[0_0_20px_rgba(255,126,29,0.5)] z-10"
                >
                  {/* Pulse effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-brand-orange -z-10"
                  />
                </motion.div>

                {/* Empty space for layout */}
                <div className="hidden md:block w-[calc(50%-3rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
