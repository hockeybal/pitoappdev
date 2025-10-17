'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { AmbientColor } from '../decorations/ambient-color';
import { Button } from '../elements/button';

export const CTA = ({
  heading,
  sub_heading,
  CTAs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
}) => {
  return (
    <div className="relative py-40">
      <AmbientColor />
      <Container className="flex flex-col items-center w-full px-8">
        <div className="flex flex-col items-center text-center max-w-2xl">
          <motion.h2 className="text-neutral-900 text-xl md:text-3xl font-bold">
            {heading}
          </motion.h2>
          <p className="max-w-md mt-8 text-sm md:text-base text-neutral-600">
            {sub_heading}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          {CTAs &&
            CTAs.map((cta, index) => (
              <Button
                as={Link}
                key={index}
                href={`/${locale}${cta.URL}`}
                variant={cta.variant}
                className="py-3"
              >
                {cta.text}
              </Button>
            ))}
        </div>
      </Container>
    </div>
  );
};
