export const i18n = {
  defaultLocale: 'nl',
  locales: ['nl', 'en', 'fr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
