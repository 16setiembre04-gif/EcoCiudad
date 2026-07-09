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
  logger.info('[SessionProvider] Componente renderizado');

  const { setUser, setInitialized, setLoading } = useAuthStore();
  const subscriptionRef = useRef<AuthSubscription | null>(null);

  useEffect(() => {
    logger.info('[SessionProvider] useEffect disparado');

    const initSession = async () => {
      logger.info('[SessionProvider] initSession() llamada');
      logger.info('[SessionProvider] Estableciendo cargando a true');
      setLoading(true);

      try {
        logger.info('[SessionProvider] Llamando onAuthStateChange()');
        // Suscribirse a cambios de autenticación
        const result = authService.onAuthStateChange(
          async (event, session) => {
            logger.info('[SessionProvider] Estado de autenticación cambiado', { event });

            if (event === 'SIGNED_IN' && session) {
              logger.info('[SessionProvider] Evento SIGNED_IN, obteniendo usuario actual');
              const currentResult = await authService.getCurrentUser();
              if (currentResult.right) {
                logger.info('[SessionProvider] Usuario actual encontrado, estableciendo usuario');
                setUser(currentResult.right);
              }
            } else if (event === 'SIGNED_OUT') {
              logger.info('[SessionProvider] Evento SIGNED_OUT, limpiando usuario');
              setUser(null);
            } else if (event === 'TOKEN_REFRESHED') {
              logger.info('[SessionProvider] Evento TOKEN_REFRESHED, obteniendo usuario actual');
              const refreshedResult = await authService.getCurrentUser();
              if (refreshedResult.right) {
                logger.info('[SessionProvider] Usuario refrescado encontrado, estableciendo usuario');
                setUser(refreshedResult.right);
              }
            } else if (event === 'PASSWORD_RECOVERY') {
              logger.info('[SessionProvider] Evento de recuperación de contraseña detectado');
            }
          }
        );

        logger.info('[SessionProvider] onAuthStateChange() completado');
        subscriptionRef.current = result as unknown as AuthSubscription;

        // Obtener sesión actual
        logger.info('[SessionProvider] Llamando getSession()');
        const sessionResult = await authService.getSession();
        logger.info('[SessionProvider] getSession() resuelto', { hasResult: !!sessionResult.right });

        if (sessionResult.right) {
          logger.info('[SessionProvider] Sesión encontrada, estableciendo usuario');
          setUser(sessionResult.right.user);
        } else {
          logger.info('[SessionProvider] No se encontró sesión, estableciendo usuario a vacío');
          setUser(null);
        }

        logger.info('[SessionProvider] Estableciendo isInitialized a true');
        setInitialized(true);
        logger.info('[SessionProvider] Estableciendo cargando a false');
        setLoading(false);
        logger.info('[SessionProvider] Inicialización de sesión completada');
      } catch (error) {
        logger.error('[SessionProvider] Falló la inicialización de sesión', error);
        setUser(null);
        setInitialized(true);
        setLoading(false);
      }
    };

    logger.info('[SessionProvider] Llamando initSession()');
    initSession();

    return () => {
      logger.info('[SessionProvider] Limpieza llamada');
      if (subscriptionRef.current) {
        subscriptionRef.current.data.subscription.unsubscribe();
      }
    };
  }, []);

  // NO bloquear el render - permitir que splash.tsx se renderice
  return <>{children}</>;
}
