'use client';

import React from 'react';
import { TbLocationBolt } from 'react-icons/tb';

import { AmbientColor } from '../../decorations/ambient-color';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { FeatureIconContainer } from '../features/feature-icon-container';
import { TestimonialsSlider } from './slider';
import { TestimonialsMarquee } from './testimonials-marquee';

export const Testimonials = ({
  heading,
  sub_heading,
  testimonials,
}: {
  heading: string;
  sub_heading: string;
  testimonials: object;
}) => {
  return (
    <div className="relative">
      <AmbientColor />
      <div className="pb-20 pt-24 md:pt-32">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <TbLocationBolt className="h-7 w-7 text-brand-orange" />
        </FeatureIconContainer>
        <Heading className="pt-6">{heading}</Heading>
        <Subheading className="mt-4">{sub_heading}</Subheading>
      </div>

      {testimonials && (
        <div className="relative md:py-20 pb-20">
          <TestimonialsSlider testimonials={testimonials} />
          <div className="h-full w-full mt-20 bg-white py-12">
            <TestimonialsMarquee testimonials={testimonials} />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-[#f6f6f6] to-transparent"></div>
    </div>
  );
};
