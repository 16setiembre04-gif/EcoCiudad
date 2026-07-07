export { default as es } from './es';
export { default as en } from './en';

export type Locale = 'es' | 'en';

export const locales = {
  es: () => import('./es'),
  en: () => import('./en'),
};

export const defaultLocale: Locale = 'es';
