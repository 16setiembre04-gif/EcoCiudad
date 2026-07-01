export const APP_CONFIG = {
  NAME: 'EcoCiudad',
  VERSION: '1.0.0',
  SCHEME: 'ecociudad',
} as const;

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@ecociudad/auth_token',
  USER_DATA: '@ecociudad/user_data',
  THEME: '@ecociudad/theme',
  LANGUAGE: '@ecociudad/language',
  ONBOARDING_COMPLETE: '@ecociudad/onboarding_complete',
} as const;

export const QUERY_KEYS = {
  AUTH: 'auth',
  USER: 'user',
  REPORTS: 'reports',
  EVENTS: 'events',
  COMMUNITIES: 'communities',
  RECYCLERS: 'recyclers',
  RECYCLING_CENTERS: 'recycling_centers',
  NOTIFICATIONS: 'notifications',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY: 2,
} as const;
