import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/presentation/stores/auth.store';
import { authService } from '@/services/auth';
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
  logger.info('[SessionProvider] Component rendered');
  
  const { setUser, setInitialized, setLoading } = useAuthStore();
  const subscriptionRef = useRef<AuthSubscription | null>(null);

  useEffect(() => {
    logger.info('[SessionProvider] useEffect triggered');
    
    const initSession = async () => {
      logger.info('[SessionProvider] initSession() called');
      logger.info('[SessionProvider] Setting loading to true');
      setLoading(true);

      try {
        logger.info('[SessionProvider] Calling onAuthStateChange()');
        // Suscribirse a cambios de autenticación
        const result = authService.onAuthStateChange(
          async (event, session) => {
            logger.info('[SessionProvider] Auth state changed', { event });

            if (event === 'SIGNED_IN' && session) {
              logger.info('[SessionProvider] SIGNED_IN event, getting current user');
              const currentResult = await authService.getCurrentUser();
              if (currentResult.right) {
                logger.info('[SessionProvider] Current user found, setting user');
                setUser(currentResult.right);
              }
            } else if (event === 'SIGNED_OUT') {
              logger.info('[SessionProvider] SIGNED_OUT event, clearing user');
              setUser(null);
            } else if (event === 'TOKEN_REFRESHED') {
              logger.info('[SessionProvider] TOKEN_REFRESHED event, getting current user');
              const refreshedResult = await authService.getCurrentUser();
              if (refreshedResult.right) {
                logger.info('[SessionProvider] Refreshed user found, setting user');
                setUser(refreshedResult.right);
              }
            } else if (event === 'PASSWORD_RECOVERY') {
              logger.info('[SessionProvider] Password recovery event detected');
            }
          }
        );

        logger.info('[SessionProvider] onAuthStateChange() completed');
        subscriptionRef.current = result as unknown as AuthSubscription;

        // Obtener sesión actual
        logger.info('[SessionProvider] Calling getSession()');
        const sessionResult = await authService.getSession();
        logger.info('[SessionProvider] getSession() resolved', { hasResult: !!sessionResult.right });
        
        if (sessionResult.right) {
          logger.info('[SessionProvider] Session found, setting user');
          setUser(sessionResult.right.user);
        } else {
          logger.info('[SessionProvider] No session found, setting user to null');
          setUser(null);
        }

        logger.info('[SessionProvider] Setting isInitialized to true');
        setInitialized(true);
        logger.info('[SessionProvider] Setting loading to false');
        setLoading(false);
        logger.info('[SessionProvider] Session initialization complete');
      } catch (error) {
        logger.error('[SessionProvider] Session initialization failed', error);
        setUser(null);
        setInitialized(true);
        setLoading(false);
      }
    };

    logger.info('[SessionProvider] Calling initSession()');
    initSession();

    return () => {
      logger.info('[SessionProvider] Cleanup called');
      if (subscriptionRef.current) {
        subscriptionRef.current.data.subscription.unsubscribe();
      }
    };
  }, []);

  // NO bloquear el render - permitir que splash.tsx se renderice
  return <>{children}</>;
}
