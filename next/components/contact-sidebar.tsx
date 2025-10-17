'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { StrapiImage } from './ui/strapi-image';
import { Button } from './elements/button';
import Link from 'next/link';
import {
  IconX,
  IconHelp,
  IconMail,
  IconBrandWhatsapp,
  IconPhone,
  IconChevronRight,
} from '@tabler/icons-react';

interface ContactMethod {
  id: number;
  icon?: {
    url: string;
    alternativeText?: string;
  };
  icon_name?: 'faq' | 'email' | 'whatsapp' | 'phone';
  title: string;
  subtitle?: string;
  link?: string;
}

interface ContactSidebarProps {
  heading?: string;
  description?: string;
  team_members?: Array<{
    url: string;
    alternativeText?: string;
  }>;
  opening_hours?: string;
  contact_methods?: ContactMethod[];
  cta_button?: {
    text: string;
    URL: string;
    variant?: string;
  };
  locale?: string;
}

const iconMap = {
  faq: IconHelp,
  email: IconMail,
  whatsapp: IconBrandWhatsapp,
  phone: IconPhone,
};

export const ContactSidebar: React.FC<ContactSidebarProps> = ({
  heading = 'Service & contact',
  description,
  team_members,
  opening_hours,
  contact_methods,
  cta_button,
  locale = 'nl',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        aria-label="Open contact sidebar"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-br from-brand-blue to-brand-light-blue text-white px-4 py-6 rounded-l-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
        whileHover={{ x: -5 }}
        initial={{ x: 0 }}
        animate={{ x: 0 }}
      >
        <span className="writing-mode-vertical text-xs md:text-sm font-bold tracking-wider">
          SERVICE & CONTACT
        </span>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Close contact sidebar"
              >
                <IconX className="w-6 h-6 text-red-500" />
              </button>

              {/* Content */}
              <div className="p-8 pt-16">
                {/* Team Members */}
                {team_members && team_members.length > 0 && (
                  <div className="flex justify-center gap-4 mb-8">
                    {team_members.slice(0, 3).map((member, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="relative"
                      >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <StrapiImage
                            src={member.url.replace(':1338', ':1337')}
                            alt={member.alternativeText || 'Team member'}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4"
                >
                  {heading}
                </motion.h2>

                {/* Description */}
                {description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-center mb-6 leading-relaxed"
                  >
                    {description}
                  </motion.p>
                )}

                {/* Opening Hours */}
                {opening_hours && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-8"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 font-medium text-sm">
                      {opening_hours}
                    </span>
                  </motion.div>
                )}

                {/* Contact Methods */}
                {contact_methods && contact_methods.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {contact_methods.map((method, index) => {
                      const IconComponent = method.icon_name
                        ? iconMap[method.icon_name]
                        : IconMail;

                      const content = (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                            {method.icon?.url ? (
                              <StrapiImage
                                src={method.icon.url.replace(':1338', ':1337')}
                                alt={method.icon.alternativeText || method.title}
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <IconComponent className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {method.title}
                            </h3>
                            {method.subtitle && (
                              <p className="text-gray-500 text-sm">
                                {method.subtitle}
                              </p>
                            )}
                          </div>
                          <IconChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                        </motion.div>
                      );

                      if (method.link) {
                        return (
                          <Link key={method.id} href={method.link}>
                            {content}
                          </Link>
                        );
                      }

                      return <div key={method.id}>{content}</div>;
                    })}
                  </div>
                )}

                {/* CTA Button */}
                {cta_button && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8"
                  >
                    <Button
                      as={Link}
                      href={`/${locale}${cta_button.URL}`}
                      className="w-full bg-gradient-to-r from-brand-orange to-[#ff9a56] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      {cta_button.text}
                      <IconChevronRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </>
  );
};
