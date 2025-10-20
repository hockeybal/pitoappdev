'use client';

import { IconEye, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { strapiImage } from '@/lib/strapi/strapiImage';

interface MockupImage {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

interface Mockup {
  id: number;
  title?: string;
  description?: string;
  screenshot: MockupImage;
}

export const Launches = ({
  heading,
  sub_heading,
  mockups,
}: {
  heading: string;
  sub_heading: string;
  mockups: Mockup[];
}) => {
  const [selectedMockup, setSelectedMockup] = useState<MockupImage | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Validate mockups (max 4)
  const validMockups = mockups?.slice(0, 4) || [];

  // Auto-advance carousel every 4 seconds (mobile only)
  useEffect(() => {
    if (validMockups.length <= 1) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % validMockups.length);
      }, 4000);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [validMockups.length]);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < validMockups.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }

    // Reset touch positions
    setTouchStart(0);
    setTouchEnd(0);

    // Reset autoplay timer after manual swipe
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % validMockups.length);
      }, 4000);
    }
  };

  return (
    <>
      <div className="w-full relative bg-white py-16 md:py-24 overflow-hidden">
        <div className="px-6 max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <Heading className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {heading}
            </Heading>
            <Subheading className="mt-4 text-lg md:text-xl text-brand-orange font-semibold flex items-center justify-center gap-2">
              <IconEye className="h-6 w-6" />
              {sub_heading}
            </Subheading>
          </div>

          {/* Mobile Carousel (< 768px) */}
          <div className="md:hidden relative">
            <div 
              className="overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`
                }}
              >
                {validMockups.map((mockup, index) => (
                  <div
                    key={mockup.id || index}
                    className="w-full flex-shrink-0 flex flex-col items-center px-4"
                  >
                    {/* Container for iPhone and Eye Icon */}
                    <div className="relative max-w-xs w-full">
                      {/* iPhone Frame Container */}
                      <motion.button
                        onClick={() => setSelectedMockup(mockup.screenshot)}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full aspect-[9/19.5] bg-black rounded-[3rem] p-3 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-shadow duration-300 cursor-pointer overflow-hidden group"
                        aria-label={`View ${mockup.screenshot.alternativeText || 'screenshot'} in fullscreen`}
                      >
                        {/* iPhone Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-3xl z-20" />
                        
                        {/* Screen Content */}
                        <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                          {mockup.screenshot?.url ? (
                            <Image
                              src={strapiImage(mockup.screenshot.url)}
                              alt={mockup.screenshot.alternativeText || 'App screenshot'}
                              fill
                              className="object-cover"
                              sizes="100vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <span className="text-gray-400 text-sm">No image</span>
                            </div>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/10 transition-colors duration-300 rounded-[3rem] flex items-center justify-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                          >
                            <span className="text-sm font-semibold text-gray-900">Klik voor groter</span>
                          </motion.div>
                        </div>
                      </motion.button>

                      {/* Orange Eye Icon - Floating Above iPhone */}
                      <div className="absolute -top-3 -right-3 z-30 w-16 h-16 bg-gradient-to-br from-brand-orange to-[#ff9a56] rounded-full shadow-xl flex items-center justify-center">
                        <IconEye className="h-8 w-8 text-white" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Title and Description below iPhone */}
                    {(mockup.title || mockup.description) && (
                      <div className="mt-6 text-center px-2 max-w-xs">
                        {mockup.title && (
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {mockup.title}
                          </h3>
                        )}
                        {mockup.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {mockup.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            {validMockups.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {validMockups.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      // Reset autoplay timer
                      if (autoplayRef.current) {
                        clearInterval(autoplayRef.current);
                        autoplayRef.current = setInterval(() => {
                          setCurrentSlide((prev) => (prev + 1) % validMockups.length);
                        }, 4000);
                      }
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'w-8 bg-brand-orange' 
                        : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop/Tablet Grid (>= 768px) */}
          <div 
            className={`hidden md:grid gap-6 md:gap-8 ${
              validMockups.length === 1 
                ? 'grid-cols-1 max-w-sm mx-auto' 
                : validMockups.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                : validMockups.length === 3
                ? 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {validMockups.map((mockup, index) => (
              <motion.div
                key={mockup.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Container for iPhone and Eye Icon */}
                <div className="relative">
                  {/* iPhone Frame Container */}
                  <motion.button
                    onClick={() => setSelectedMockup(mockup.screenshot)}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full aspect-[9/19.5] bg-black rounded-[3rem] p-3 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-shadow duration-300 cursor-pointer overflow-hidden group"
                    aria-label={`View ${mockup.screenshot.alternativeText || 'screenshot'} in fullscreen`}
                  >
                    {/* iPhone Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-3xl z-20" />
                    
                    {/* Screen Content */}
                    <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                      {mockup.screenshot?.url ? (
                        <Image
                          src={strapiImage(mockup.screenshot.url)}
                          alt={mockup.screenshot.alternativeText || 'App screenshot'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/10 transition-colors duration-300 rounded-[3rem] flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                      >
                        <span className="text-sm font-semibold text-gray-900">Klik voor groter</span>
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Orange Eye Icon - Floating Above iPhone */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute -top-3 -right-3 z-30 w-16 h-16 bg-gradient-to-br from-brand-orange to-[#ff9a56] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  >
                    <IconEye className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </motion.div>
                </div>

                {/* Title and Description below iPhone */}
                {(mockup.title || mockup.description) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    className="mt-6 text-center px-2"
                  >
                    {mockup.title && (
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        {mockup.title}
                      </h3>
                    )}
                    {mockup.description && (
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {mockup.description}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {validMockups.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Geen mockups beschikbaar</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMockup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMockup(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedMockup(null)}
              className="absolute top-4 right-4 z-60 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-200"
              aria-label="Close fullscreen view"
            >
              <IconX className="h-6 w-6 text-white" />
            </motion.button>

            {/* Large iPhone Mockup */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              {/* iPhone Frame */}
              <div className="relative w-full max-w-sm md:max-w-md aspect-[9/19.5] bg-black rounded-[3rem] p-3 shadow-2xl">
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-3xl z-20" />
                
                {/* Screen Content */}
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {selectedMockup.url && (
                    <Image
                      src={strapiImage(selectedMockup.url)}
                      alt={selectedMockup.alternativeText || 'App screenshot fullscreen'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
                </div>
              </div>

              {/* Orange Eye Icon - Floating Above */}
              <div className="absolute -top-3 -right-3 z-30 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-orange to-[#ff9a56] rounded-full shadow-xl flex items-center justify-center">
                <IconEye className="h-8 w-8 md:h-10 md:w-10 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>

            {/* Instruction Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 text-sm md:text-base"
            >
              Klik ergens om te sluiten
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
