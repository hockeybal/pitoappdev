'use client';

import React, { useState } from 'react';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';
import { Container } from '../container';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { cn } from '@/lib/utils';

type SignupFormProps = {
  heading: string;
  sub_heading?: string;
  formType: 'zakelijk' | 'particulier';
  showCompanyField?: boolean;
  showPhoneField?: boolean;
  showMessageField?: boolean;
  buttonText?: string;
  successMessage?: string;
  privacyText?: string;
  backgroundColor?: 'white' | 'gray' | 'gradient';
  pipedriveEnabled?: boolean;
};

export const SignupForm = ({
  heading,
  sub_heading,
  formType,
  showCompanyField = false,
  showPhoneField = true,
  showMessageField = true,
  buttonText = 'Verstuur',
  successMessage = 'Bedankt voor je inschrijving! We nemen zo spoedig mogelijk contact met je op.',
  privacyText = 'Door dit formulier te verzenden ga je akkoord met onze privacyverklaring.',
  backgroundColor = 'white',
  pipedriveEnabled = true,
}: SignupFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          leadType: formType,
          pipedriveEnabled,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan');
      }

      setIsSuccess(true);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setIsSubmitting(false);
    }
  };

  const backgroundClass = 
    backgroundColor === 'white' 
      ? 'bg-white' 
      : backgroundColor === 'gray'
        ? 'bg-neutral-50'
        : 'bg-gradient-to-br from-brand-blue/5 via-white to-brand-orange/5';

  return (
    <div className={cn('py-20', backgroundClass)}>
      <Container>
        <div className="max-w-3xl mx-auto">
          <Heading className="text-neutral-900 text-center">{heading}</Heading>
          {sub_heading && (
            <Subheading className="text-neutral-600 text-center max-w-2xl mx-auto">
              {sub_heading}
            </Subheading>
          )}

          {isSuccess ? (
            <div className="mt-12 p-8 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Succesvol verzonden!
                  </h3>
                  <p className="text-green-700">{successMessage}</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 text-sm text-green-600 hover:text-green-700 underline"
                  >
                    Nog een inschrijving doen
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voornaam */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Voornaam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                    placeholder="John"
                  />
                </div>

                {/* Achternaam */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Achternaam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
                  E-mailadres <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>

              {/* Telefoon (optioneel) */}
              {showPhoneField && (
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Telefoonnummer
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                    placeholder="+31 6 12345678"
                  />
                </div>
              )}

              {/* Bedrijf (optioneel, alleen voor zakelijk) */}
              {showCompanyField && (
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Bedrijfsnaam {formType === 'zakelijk' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required={formType === 'zakelijk'}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                    placeholder="Bedrijfsnaam B.V."
                  />
                </div>
              )}

              {/* Bericht */}
              {showMessageField && (
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Bericht
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Vertel ons meer over je vraag of interesse..."
                  />
                </div>
              )}

              {/* Privacy tekst */}
              {privacyText && (
                <div className="text-sm text-neutral-600">
                  {privacyText}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[200px] relative"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="w-5 h-5 mr-2 animate-spin" />
                      Bezig met verzenden...
                    </>
                  ) : (
                    buttonText
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
};
