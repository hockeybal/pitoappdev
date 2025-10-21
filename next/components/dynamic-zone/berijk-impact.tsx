'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Container } from '../container';
import { StrapiImage } from '../ui/strapi-image';

interface Stat {
  id: number;
  description: string;
  percentage: string;
}

interface Location {
  id: number;
  name: string;
  details?: string;
  households?: string;
  icon?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
}

interface BerijkImpactProps {
  heading?: string;
  stats?: Stat[];
  locations?: Location[];
  bottom_text?: string;
  CTA?: string;
  locale: string;
}

export const BerijkImpact: React.FC<BerijkImpactProps> = ({
  heading,
  stats,
  locations,
  bottom_text,
  CTA,
}) => {
  return (
    <div className="py-20 md:py-32 bg-gradient-to-br from-brand-blue via-brand-light-blue to-blue-400">
      <Container>
        {/* Heading */}
        {heading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left mb-12 md:mb-16 px-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {heading}
            </h2>
          </motion.div>
        )}

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-16 mx-4 md:mx-0"
        >
          {/* Stats Grid - Top Section */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#5B8FD4] mb-3">
                    {stat.percentage}
                  </div>
                  <div className="text-gray-800 text-base md:text-lg font-medium max-w-xs mx-auto leading-relaxed">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Locations with Icons */}
          {locations && locations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                {locations.map((location, index) => {
                  // Fix the URL if needed (replace :1338 with :1337)
                  const iconUrl = location.icon?.url?.replace(':1338', ':1337');
                  
                  return (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex flex-col items-center text-center"
                    >
                      {/* Icon from Strapi */}
                      {iconUrl && (
                        <div className="mb-4">
                          <StrapiImage
                            src={iconUrl}
                            alt={location.icon?.alternativeText || location.name}
                            width={location.icon?.width || 80}
                            height={location.icon?.height || 80}
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                          />
                        </div>
                      )}
                      
                      {/* Location Name */}
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {location.name}
                      </h3>
                      
                      {/* Households Info */}
                      {location.households && (
                        <p className="text-gray-700 font-medium mb-1">
                          {location.households}
                        </p>
                      )}
                      
                      {/* Details */}
                      {location.details && (
                        <p className="text-gray-600 text-sm">
                          → {location.details}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Bottom Text */}
          {bottom_text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mb-6"
            >
              <p className="text-[#FF7E1D] font-bold text-lg md:text-xl">
                {bottom_text}
              </p>
            </motion.div>
          )}

          {/* CTA with emoji */}
          {CTA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF7E1D] to-[#FF9A4D] text-white px-8 py-4 rounded-full font-medium text-base md:text-lg shadow-lg">
                <span className="text-2xl">👉</span>
                <span className="italic">{CTA}</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};
