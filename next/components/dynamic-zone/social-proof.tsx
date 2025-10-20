'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';

interface StatItem {
  id: number;
  value: string;
  label: string;
  description?: string;
}

interface SocialProofProps {
  heading?: string;
  sub_heading?: string;
  stats: StatItem[];
}

export const SocialProof: React.FC<SocialProofProps> = ({
  heading = 'Sluit je aan bij vele anderen',
  sub_heading,
  stats,
}) => {
  // Limit to max 4 stats
  const displayStats = stats?.slice(0, 4) || [];

  return (
    <div className="relative w-full bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="px-6 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        {(heading || sub_heading) && (
          <div className="text-center mb-12 md:mb-16">
            {heading && (
              <Heading className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {heading}
              </Heading>
            )}
            {sub_heading && (
              <Subheading className="mt-4 text-lg md:text-xl text-gray-600">
                {sub_heading}
              </Subheading>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="group"
            >
              <div className="relative h-full">
                {/* Card */}
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-sm border border-gray-200 
                              hover:shadow-xl hover:border-brand-blue/30 hover:-translate-y-1 
                              transition-all duration-300 ease-out overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-orange/5 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                    {/* Value/Number */}
                    <div className="mb-3">
                      <span className="text-5xl md:text-6xl font-bold text-brand-blue 
                                     group-hover:scale-110 transition-transform duration-300 
                                     inline-block">
                        {stat.value}
                      </span>
                    </div>

                    {/* Label */}
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                      {stat.label}
                    </h3>

                    {/* Optional description */}
                    {stat.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {stat.description}
                      </p>
                    )}

                    {/* Decorative dot */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-brand-blue to-brand-orange 
                                  rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-150 
                                  transition-all duration-300" />
                  </div>
                </div>

                {/* Subtle bottom glow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 
                              bg-gradient-to-br from-brand-blue/20 to-brand-orange/20 blur-xl 
                              opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Optional: Trust indicator */}
        {displayStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Realtime bijgewerkt
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
