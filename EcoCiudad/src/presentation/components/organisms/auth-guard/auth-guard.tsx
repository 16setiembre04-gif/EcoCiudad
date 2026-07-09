import { type UserRole } from '@/domain/entities';
import { ThemedText } from '@/presentation/components/atoms';
import { useAuthStore } from '@/presentation/stores/auth.store';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { logger } from '@/services/logger';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireEmailVerification?: boolean;
}

export function AuthGuard({
  children,
  allowedRoles,
  requireEmailVerification = false,
}: AuthGuardProps) {
  const { user, isAuthenticated, isInitialized, isLoading } = useAuthStore();
  const theme = useTheme();
  const { t } = useTranslation();

  logger.info('[AuthGuard] Renderizado', { isAuthenticated, isInitialized, isLoading, user: user?.displayName });

  if (!isInitialized || isLoading) {
    logger.info('[AuthGuard] Esperando inicialización');
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText style={{ marginTop: spacing.md, color: theme.colors.textPrimary }}>
          {t('common.loading')}...
        </ThemedText>
      </View>
    );
  }

  if (!isAuthenticated) {
    logger.info('[AuthGuard] No autenticado, redirigiendo a selección de rol');
    return <Redirect href="/(auth)/role-selection" />;
  }

  if (requireEmailVerification && !user?.isEmailVerified) {
    logger.info('[AuthGuard] Correo no verificado, redirigiendo a verificación de correo');
    return <Redirect href="/(auth)/verify-email" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    logger.info('[AuthGuard] Rol incorrecto, redirigiendo', { userRole: user.role, allowedRoles });
    const roleRedirects = {
      citizen: '/(citizen)' as const,
      operator: '/(operator)' as const,
      admin: '/(admin)' as const,
    };
    return <Redirect href={roleRedirects[user.role]} />;
  }

  logger.info('[AuthGuard] Acceso concedido, renderizando hijos');
  return <>{children}</>;
}

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, isLoading, user } = useAuthStore();

  logger.info('[GuestGuard] Renderizado', { isAuthenticated, isInitialized, isLoading });

  if (!isInitialized || isLoading) {
    logger.info('[GuestGuard] Esperando inicialización');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated && user) {
    logger.info('[GuestGuard] Ya autenticado, redirigiendo', { role: user.role });
    const roleRedirects = {
      citizen: '/(citizen)' as const,
      operator: '/(operator)' as const,
      admin: '/(admin)' as const,
    };
    return <Redirect href={roleRedirects[user.role]} />;
  }

  logger.info('[GuestGuard] Sin autenticar, renderizando hijos');
  return <>{children}</>;
}

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { user, hasRole, isInitialized } = useAuthStore();

  logger.info('[RoleGuard] Renderizado', { isInitialized, hasAccess: hasRole(roles) });

  if (!isInitialized) {
    logger.info('[RoleGuard] Esperando inicialización');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasRole(roles)) {
    logger.info('[RoleGuard] Sin acceso, redirigiendo');
    if (fallback) return <>{fallback}</>;

    if (user) {
      const roleRedirects = {
        citizen: '/(citizen)' as const,
        operator: '/(operator)' as const,
        admin: '/(admin)' as const,
      };
      return <Redirect href={roleRedirects[user.role]} />;
    }

    return <Redirect href="/(auth)/role-selection" />;
  }

  logger.info('[RoleGuard] Acceso concedido, renderizando hijos');
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
