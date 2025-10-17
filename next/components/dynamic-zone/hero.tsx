'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Cover } from '../decorations/cover';
import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StrapiImage } from '../ui/strapi-image';

export const Hero = ({
  heading,
  sub_heading,
  CTAs,
  locale,
  image,
  logo,
  icons,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
  image?: any;
  logo?: any;
  icons?: any[];
}) => {
  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center bg-gradient-to-br from-brand-blue via-brand-light-blue to-blue-400">
      {/* Background Image if provided */}
      {image?.url && (
        <div className="absolute inset-0 z-0">
          <StrapiImage
            src={image.url.replace(':1338', ':1337')}
            alt={image.alternativeText || heading}
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}
      
      {/* Decorative animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute inset-0 z-0"
      >
        <StarBackground />
        <ShootingStars />
      </motion.div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none" />
      
      {/* Logo if provided */}
      {logo?.url && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-8"
        >
          <StrapiImage
            src={logo.url.replace(':1338', ':1337')}
            alt={logo.alternativeText || 'Logo'}
            width={logo.width || 200}
            height={logo.height || 200}
            className="w-auto h-24 md:h-32 object-contain drop-shadow-lg"
          />
        </motion.div>
      )}
      
      <Heading
        as="h1"
        className="text-4xl md:text-5xl lg:text-8xl font-bold max-w-7xl mx-auto text-center mt-6 relative z-10 py-6 px-4 text-white drop-shadow-lg"
      >
        {heading.substring(0, heading.lastIndexOf(' '))}{' '}
        <span className="inline-block bg-gradient-to-r from-brand-orange to-[#ff9a56] text-white px-6 py-2 rounded-2xl shadow-[0_8px_24px_rgba(255,126,29,0.4)] transform hover:scale-105 transition-transform duration-300">
          {heading.split(' ').pop()}
        </span>
      </Heading>
      
      <Subheading className="text-center mt-6 md:mt-8 text-lg md:text-2xl text-white/90 max-w-3xl mx-auto relative z-10 px-4 leading-relaxed">
        {sub_heading}
      </Subheading>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center mt-10 md:mt-12 relative z-10 px-4">
        {CTAs &&
          CTAs.map((cta) => (
            <Button
              key={cta?.id}
              as={Link}
              href={`/${locale}${cta.URL}`}
              {...(cta.variant && { variant: cta.variant })}
              className="min-w-[180px]"
            >
              {cta.text}
            </Button>
          ))}
      </div>
      
      {/* Wave shape at bottom - Orange color */}
      <div className="absolute inset-x-0 bottom-0 w-full pointer-events-none">
        <svg 
          className="w-full h-auto" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="#ff7e1d" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        
        {/* Features in Orange Section */}
        {icons && icons.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 pb-8 md:pb-12 z-10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                {icons.map((icon: any, index: number) => (
                  <motion.div
                    key={icon.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Icon */}
                    {icon.icon?.url && (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-blue flex items-center justify-center mb-3 shadow-lg">
                        <StrapiImage
                          src={icon.icon.url.replace(':1338', ':1337')}
                          alt={icon.icon.alternativeText || icon.title}
                          width={40}
                          height={40}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />
                      </div>
                    )}
                    {/* Title */}
                    <p className="text-white font-bold text-sm md:text-base leading-tight relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                      {icon.title || icon.Title || icon.text || 'No title'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
