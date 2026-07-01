import { locales, type Locale } from './locales';

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string): string {
  const keys = key.split('.');
  let value: any = locales[currentLocale];

  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }

  return value as string;
}

export { locales, type Locale, type TranslationKey } from './locales';
