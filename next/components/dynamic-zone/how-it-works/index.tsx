'use client';

import { IconArrowRight, IconCheck, IconSettings } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React from 'react';

import { Container } from '../../container';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { FeatureIconContainer } from '../features/feature-icon-container';
import { StrapiImage } from '../../ui/strapi-image';

export const HowItWorks = ({
  heading,
  sub_heading,
  steps,
}: {
  heading: string;
  sub_heading: string;
  steps: any;
}) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <Container className="py-24 md:py-32 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden mx-auto">
            <IconSettings className="h-7 w-7 text-white" />
          </FeatureIconContainer>
          <Heading className="pt-6">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto mt-4">{sub_heading}</Subheading>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps &&
            steps.map(
              (item: { title: string; description: string; screenshots?: any }, index: number) => {
                const fixedScreenshotUrl = item.screenshots?.url 
                  ? item.screenshots.url.replace(':1338', ':1337')
                  : item.screenshots?.url;

                return (
                  <motion.div
                    key={'step' + index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-brand-blue/30 hover:shadow-[0_20px_50px_rgba(12,111,249,0.15)] transition-all duration-300 group"
                    >
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 -left-4 z-10">
                        <div className="relative">
                          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-[#ff9a56] shadow-[0_8px_24px_rgba(255,126,29,0.4)]">
                            <span className="text-xl font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                          {/* Check mark overlay on hover */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg"
                          >
                            <IconCheck className="w-7 h-7 text-white" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Screenshot or Icon */}
                      {fixedScreenshotUrl ? (
                        <div className="mb-6 mt-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 min-h-[180px] group-hover:from-brand-blue/5 group-hover:to-brand-light-blue/5 transition-all duration-300">
                          <StrapiImage
                            src={fixedScreenshotUrl}
                            alt={item.screenshots.alternativeText || item.title}
                            width={200}
                            height={200}
                            className="w-full h-auto max-w-[160px] object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="mb-6 mt-4 flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 rounded-2xl p-8 min-h-[180px]">
                          <IconArrowRight className="w-16 h-16 text-brand-orange group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom accent line */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-orange via-brand-light-blue to-brand-blue rounded-b-3xl"
                      />
                    </motion.div>
                  </motion.div>
                );
              }
            )}
        </div>

        {/* Bottom CTA or additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm">
            Volg deze stappen om aan de slag te gaan ✨
          </p>
        </motion.div>
      </Container>
    </div>
  );
};
