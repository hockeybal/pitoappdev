'use client';

import { 
  IconPencil, 
  IconFileText, 
  IconRocket, 
  IconSearch, 
  IconSpeakerphone, 
  IconChartBar 
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React from 'react';

export const HowItWorks = ({
  heading,
  sub_heading,
  steps,
}: {
  heading: string;
  sub_heading: string;
  steps: any;
}) => {
  // Icon mapping for each step
  const stepIcons = [
    IconPencil,      // Stap 1: Inschrijven
    IconFileText,    // Stap 2: Onboarding
    IconRocket,      // Stap 3: Livegang
    IconSearch,      // Stap 4: Bereik
    IconSpeakerphone, // Stap 5: Promotie
    IconChartBar,    // Stap 6: Dashboard & Rapportage
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Orange Top Section */}
      <div className="relative bg-brand-orange text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl"
          >
            {sub_heading}
          </motion.p>
        </div>

        {/* Wave Transition to White - Full Width */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-px">
          <svg
            className="relative block w-full h-24 md:h-32"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,60 C360,100 720,20 1080,60 C1260,80 1440,100 1440,100 L1440,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* Timeline Section - White Background */}
      <div className="bg-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative">
            {/* Vertical Blue Line (Desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#3A7BD5] transform -translate-x-1/2" />

            {/* Steps */}
            <div className="space-y-20 md:space-y-32">
              {steps &&
                steps.map((step: { title: string; description: string }, index: number) => {
                  const IconComponent = stepIcons[index] || IconRocket;
                  const isLeft = index % 2 === 0;

                  return (
                    <motion.div
                      key={`step-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Desktop Layout */}
                      <div className="hidden md:block relative">
                        {/* Large Blue Circle with Icon - positioned on the line side */}
                        <div className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'}`}>
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#3A7BD5] shadow-lg">
                            <IconComponent className="w-10 h-10 text-white" />
                          </div>
                        </div>

                        {/* Dotted Line from Circle to Center */}
                        <div
                          className={`absolute top-10 ${
                            isLeft 
                              ? 'left-20 w-[calc(50%-5rem)]' 
                              : 'right-20 w-[calc(50%-5rem)]'
                          } border-t-2 border-dashed border-[#3A7BD5]`}
                        />

                        {/* Small Circle on Center Line */}
                        <div className="absolute left-1/2 top-10 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-3 h-3 rounded-full bg-[#3A7BD5]" />
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-2 gap-16 pt-24">
                          {/* Left Side */}
                          {isLeft ? (
                            <>
                              {/* Content on Left */}
                              <div className="text-left pl-24">
                                <h3 className="text-sm font-bold text-[#3A7BD5] mb-2 uppercase">
                                  STAP {index + 1}
                                </h3>
                                <h4 className="text-xl md:text-2xl font-bold text-[#3A7BD5] mb-3">
                                  {step.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                              {/* Empty space on Right */}
                              <div />
                            </>
                          ) : (
                            <>
                              {/* Empty space on Left */}
                              <div />
                              {/* Content on Right */}
                              <div className="text-left pr-24">
                                <h3 className="text-sm font-bold text-[#3A7BD5] mb-2 uppercase">
                                  STAP {index + 1}
                                </h3>
                                <h4 className="text-xl md:text-2xl font-bold text-[#3A7BD5] mb-3">
                                  {step.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="md:hidden flex items-start gap-6">
                        {/* Blue Circle with Icon */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#3A7BD5] shadow-lg">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-2">
                          <h3 className="text-sm font-bold text-[#3A7BD5] mb-1 uppercase">
                            STAP {index + 1}
                          </h3>
                          <h4 className="text-lg font-bold text-[#3A7BD5] mb-2">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
