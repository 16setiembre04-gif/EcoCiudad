import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  static async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch {
      return [];
    }
  }
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@ecociudad/auth_token',
  USER_DATA: '@ecociudad/user_data',
  THEME: '@ecociudad/theme',
  LANGUAGE: '@ecociudad/language',
  ONBOARDING_COMPLETE: '@ecociudad/onboarding_complete',
} as const;
