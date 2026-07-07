import { type UserRole } from '@/domain/entities';
import { ThemedText } from '@/presentation/components/atoms';
import { useAuthStore } from '@/presentation/stores/auth.store';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
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

  logger.info('[AuthGuard] Render', { isAuthenticated, isInitialized, isLoading, user: user?.displayName });

  if (!isInitialized || isLoading) {
    logger.info('[AuthGuard] Waiting for initialization');
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText style={{ marginTop: spacing.md, color: theme.colors.textPrimary }}>
          Loading...
        </ThemedText>
      </View>
    );
  }

  if (!isAuthenticated) {
    logger.info('[AuthGuard] Not authenticated, redirecting to role-selection');
    return <Redirect href="/(auth)/role-selection" />;
  }

  if (requireEmailVerification && !user?.isEmailVerified) {
    logger.info('[AuthGuard] Email not verified, redirecting to verify-email');
    return <Redirect href="/(auth)/verify-email" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    logger.info('[AuthGuard] Wrong role, redirecting', { userRole: user.role, allowedRoles });
    const roleRedirects = {
      citizen: '/(citizen)' as const,
      operator: '/(operator)' as const,
      admin: '/(admin)' as const,
    };
    return <Redirect href={roleRedirects[user.role]} />;
  }

  logger.info('[AuthGuard] Access granted, rendering children');
  return <>{children}</>;
}

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, isLoading, user } = useAuthStore();

  logger.info('[GuestGuard] Render', { isAuthenticated, isInitialized, isLoading });

  if (!isInitialized || isLoading) {
    logger.info('[GuestGuard] Waiting for initialization');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated && user) {
    logger.info('[GuestGuard] Already authenticated, redirecting', { role: user.role });
    const roleRedirects = {
      citizen: '/(citizen)' as const,
      operator: '/(operator)' as const,
      admin: '/(admin)' as const,
    };
    return <Redirect href={roleRedirects[user.role]} />;
  }

  logger.info('[GuestGuard] Not authenticated, rendering children');
  return <>{children}</>;
}

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { user, hasRole, isInitialized } = useAuthStore();

  logger.info('[RoleGuard] Render', { isInitialized, hasAccess: hasRole(roles) });

  if (!isInitialized) {
    logger.info('[RoleGuard] Waiting for initialization');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasRole(roles)) {
    logger.info('[RoleGuard] No access, redirecting');
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

  logger.info('[RoleGuard] Access granted, rendering children');
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
