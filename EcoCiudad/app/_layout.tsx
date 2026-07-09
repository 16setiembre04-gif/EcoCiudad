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
  logger.info('[RootLayout] Componente renderizado');

  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Inter-Regular': require('../assets/fonts/Inter_28pt-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Inter-Medium': require('../assets/fonts/Inter_28pt-Medium.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Inter-SemiBold': require('../assets/fonts/Inter_28pt-SemiBold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Inter-Bold': require('../assets/fonts/Inter_28pt-Bold.ttf'),
  });

  useEffect(() => {
    logger.info('[RootLayout] useEffect disparado', { loaded, error: !!error });
    if (loaded || error) {
      logger.info('[RootLayout] Ocultando pantalla de inicio');
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    logger.info('[RootLayout] Esperando carga de fuentes');
    return null;
  }

  logger.info('[RootLayout] Renderizando AppProviders');
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
