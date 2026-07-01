import { env } from '@/infrastructure/config/env.config';

export const appConfig = {
  environment: env.environment,
  isDevelopment: env.environment === 'development',
  isProduction: env.environment === 'production',
  isStaging: env.environment === 'staging',
} as const;

export const supabaseConfig = {
  url: env.supabaseUrl,
  anonKey: env.supabaseAnonKey,
} as const;

export const mapsConfig = {
  apiKey: env.googleMapsApiKey,
  defaultRegion: {
    latitude: -9.0888,
    longitude: -78.5833,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
} as const;

export const firebaseConfig = {
  projectId: env.firebaseProjectId,
} as const;
