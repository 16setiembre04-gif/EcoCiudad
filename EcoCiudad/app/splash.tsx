import { useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { useSession } from '@/presentation/hooks';
import { spacing } from '@/theme/spacing';
import { animations } from '@/theme/animations';
import { logger } from '@/services/logger';

export default function SplashScreen() {
  const theme = useTheme();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { isInitialized } = useSession();

  logger.info('[SplashScreen] Component mounted', { isInitialized });

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  // Animaciones de entrada
  useEffect(() => {
    logger.info('[SplashScreen] Starting animations');
    
    logoOpacity.value = withTiming(1, {
      duration: animations.duration.slow,
    });

    logoScale.value = withTiming(1, {
      duration: animations.duration.slow,
    });

    textOpacity.value = withTiming(1, {
      duration: animations.duration.slow,
    });

    textTranslateY.value = withTiming(0, {
      duration: animations.duration.slow,
    });
  }, []);

  // Navegación reactiva cuando la inicialización está completa
  useEffect(() => {
    logger.info('[SplashScreen] Checking initialization status', { isInitialized });
    
    if (!isInitialized) {
      logger.info('[SplashScreen] Not initialized yet, waiting...');
      return;
    }

    logger.info('[SplashScreen] Initialization complete, navigating to role-selection in 500ms');
    
    // Esperar un poco para que las animaciones se completen visualmente
    const timer = setTimeout(() => {
      logger.info('[SplashScreen] Navigating to /(auth)/role-selection');
      router.replace('/(auth)/role-selection');
    }, 500);

    return () => {
      logger.info('[SplashScreen] Cleanup: clearing navigation timer');
      clearTimeout(timer);
    };
  }, [isInitialized, router]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Icon
              name="leaf"
              size={64}
              color={theme.colors.surface}
              strokeWidth={2}
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <ThemedText
            type="displayLarge"
            color={theme.colors.textPrimary}
            style={styles.title}
          >
            EcoCiudad
          </ThemedText>
          <ThemedText
            type="body"
            color={theme.colors.textSecondary}
            style={styles.subtitle}
          >
            Building a sustainable future together
          </ThemedText>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <ThemedText
          type="caption"
          color={theme.colors.textSecondary}
        >
          v1.0.0
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing['2xl'],
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
