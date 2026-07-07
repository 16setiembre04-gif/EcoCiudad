import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Locale, defaultLocale, locales } from './locales';
import { logger } from '@/services/logger';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const STORAGE_KEY = '@ecociudad/locale';

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Cargar traducciones para el idioma actual
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        logger.info('[i18n] Loading translations for locale:', locale);
        const module = await locales[locale]();
        setTranslations(module.default);
        logger.info('[i18n] Translations loaded successfully');
      } catch (error) {
        logger.error('[i18n] Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  // Cargar idioma guardado al iniciar
  useEffect(() => {
    const loadSavedLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLocale && (savedLocale === 'es' || savedLocale === 'en')) {
          logger.info('[i18n] Loading saved locale:', savedLocale);
          setLocaleState(savedLocale as Locale);
        } else {
          logger.info('[i18n] Using default locale:', defaultLocale);
        }
      } catch (error) {
        logger.error('[i18n] Failed to load saved locale:', error);
      }
    };

    loadSavedLocale();
  }, []);

  // Cambiar idioma y persistir
  const setLocale = async (newLocale: Locale) => {
    try {
      logger.info('[i18n] Changing locale to:', newLocale);
      setLocaleState(newLocale);
      await AsyncStorage.setItem(STORAGE_KEY, newLocale);
      logger.info('[i18n] Locale changed and saved successfully');
    } catch (error) {
      logger.error('[i18n] Failed to save locale:', error);
    }
  };

  // Función de traducción
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Si no se encuentra la traducción, devolver la clave
        logger.warn('[i18n] Translation not found for key:', key);
        return key;
      }
    }

    if (typeof value !== 'string') {
      logger.warn('[i18n] Translation is not a string for key:', key);
      return key;
    }

    // Reemplazar parámetros
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match;
      });
    }

    return value;
  };

  const value: TranslationContextType = {
    locale,
    setLocale,
    t,
    isLoading,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
