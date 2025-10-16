'use client';

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '../elements/button';
import ShootingStars from '@/components/decorations/shooting-star';
import StarBackground from '@/components/decorations/star-background';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  section,
  social_media_icon_links,
}: {
  heading: string;
  sub_heading: string;
  form: any;
  section: any;
  social_media_icon_links: any;
}) {
  const socials = [
    {
      title: 'twitter',
      href: 'https://twitter.com/strapijs',
      icon: (
        <IconBrandX className="h-6 w-6 text-white/70 hover:text-brand-orange transition-colors duration-200" />
      ),
    },
    {
      title: 'github',
      href: 'https://github.com/strapi',
      icon: (
        <IconBrandGithub className="h-6 w-6 text-white/70 hover:text-brand-orange transition-colors duration-200" />
      ),
    },
    {
      title: 'linkedin',
      href: 'https://linkedin.com/strapi',
      icon: (
        <IconBrandLinkedin className="h-6 w-6 text-white/70 hover:text-brand-orange transition-colors duration-200" />
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden bg-white">
      <div className="flex relative z-20 items-center w-full justify-center px-4 py-8 lg:py-40 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-gradient-to-br from-brand-blue to-brand-light-blue">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h1 className="mt-8 text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-lg">
              {heading}
            </h1>
            <p className="mt-4 text-white/90 text-base max-w-sm leading-relaxed">{sub_heading}</p>
          </div>

          <div className="py-10">
            <div>
              <form className="space-y-5">
                {form &&
                  form?.inputs?.map((input: any, index: number) => (
                    <div key={`form-input-${index}`}>
                      {input.type !== 'submit' && (
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold leading-6 text-white mb-2"
                        >
                          {input.name}
                        </label>
                      )}

                      <div className="mt-2">
                        {input.type === 'textarea' ? (
                          <textarea
                            rows={5}
                            id="message"
                            placeholder={input.placeholder}
                            className="block w-full bg-white/10 backdrop-blur-sm px-4 rounded-lg border-2 border-white/20 py-3 shadow-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:outline-none sm:text-base transition-all duration-300"
                          />
                        ) : input.type === 'submit' ? (
                          <div>
                            <Button variant="primary" className="w-full mt-6">
                              {input.name}
                            </Button>
                          </div>
                        ) : (
                          <input
                            id="name"
                            type={input.type}
                            placeholder={input.placeholder}
                            className="block w-full bg-white/10 backdrop-blur-sm px-4 rounded-lg border-2 border-white/20 py-3 shadow-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange focus:outline-none sm:text-base transition-all duration-300"
                          />
                        )}
                      </div>
                    </div>
                  ))}
              </form>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-6 py-4">
            {socials.map((social) => (
              <Link href={social.href} target="_blank" key={social.title} className="hover:scale-110 transition-transform duration-200">
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full z-20 hidden md:flex border-l-2 border-brand-blue/20 overflow-hidden bg-gradient-to-br from-white to-neutral-50 items-center justify-center p-12">
        <div className="absolute inset-0 opacity-5">
          <StarBackground />
          <ShootingStars />
        </div>
        <div className="max-w-sm mx-auto relative z-10">
          <div className="flex flex-row items-center justify-center mb-10 w-full">
            <AnimatedTooltip items={section.users} />
          </div>
          <p
            className={
              'font-bold text-2xl text-center text-neutral-900 text-balance'
            }
          >
            {section.heading}
          </p>
          <p
            className={
              'font-normal text-base text-center text-neutral-600 mt-6 text-balance leading-relaxed'
            }
          >
            {section.sub_heading}
          </p>
        </div>
      </div>
    </div>
  );
}
