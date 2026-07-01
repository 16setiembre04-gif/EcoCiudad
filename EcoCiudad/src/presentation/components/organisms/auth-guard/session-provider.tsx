import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/presentation/stores/auth.store';
import { authService } from '@/services/auth';
import { useTheme } from '@/theme/context';
import { ThemedText } from '@/presentation/components/atoms/text';
import { spacing } from '@/theme/spacing';
import { logger } from '@/services/logger';

interface SessionProviderProps {
  children: React.ReactNode;
}

interface AuthSubscription {
  data: {
    subscription: {
      unsubscribe: () => void;
    };
  };
}

export function SessionProvider({ children }: SessionProviderProps) {
  const theme = useTheme();
  const { setUser, setInitialized, setLoading, isInitialized } = useAuthStore();
  const subscriptionRef = useRef<AuthSubscription | null>(null);

  useEffect(() => {
    const initSession = async () => {
      setLoading(true);

      const result = authService.onAuthStateChange(
        async (event, session) => {
          logger.debug('Auth state changed', { event });

          if (event === 'SIGNED_IN' && session) {
            const currentResult = await authService.getCurrentUser();
            if (currentResult.right) {
              setUser(currentResult.right);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          } else if (event === 'TOKEN_REFRESHED') {
            const refreshedResult = await authService.getCurrentUser();
            if (refreshedResult.right) {
              setUser(refreshedResult.right);
            }
          } else if (event === 'PASSWORD_RECOVERY') {
            logger.info('Password recovery event detected');
          }
        }
      );

      subscriptionRef.current = result as unknown as AuthSubscription;

      const sessionResult = await authService.getSession();
      if (sessionResult.right) {
        setUser(sessionResult.right.user);
      } else {
        setUser(null);
      }

      setInitialized(true);
      setLoading(false);
    };

    initSession();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.data.subscription.unsubscribe();
      }
    };
  }, []);

  if (!isInitialized) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading...
        </ThemedText>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
  },
});
