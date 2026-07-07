import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProviders } from '@/providers';
import { logger } from '@/services/logger';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  logger.info('[RootLayout] Component rendered');
  
  const [loaded, error] = useFonts({
  'Inter-Regular': require('../assets/fonts/Inter_28pt-Regular.ttf'),
  'Inter-Medium': require('../assets/fonts/Inter_28pt-Medium.ttf'),
  'Inter-SemiBold': require('../assets/fonts/Inter_28pt-SemiBold.ttf'),
  'Inter-Bold': require('../assets/fonts/Inter_28pt-Bold.ttf'),
});

  useEffect(() => {
    logger.info('[RootLayout] useEffect triggered', { loaded, error: !!error });
    if (loaded || error) {
      logger.info('[RootLayout] Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    logger.info('[RootLayout] Waiting for fonts to load');
    return null;
  }

  logger.info('[RootLayout] Rendering AppProviders');
  return (
    <AppProviders>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(citizen)" />
          <Stack.Screen name="(operator)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </AppProviders>
  );
}
