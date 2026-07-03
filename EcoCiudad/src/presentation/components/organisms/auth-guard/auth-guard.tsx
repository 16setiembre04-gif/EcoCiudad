import { type UserRole } from '@/domain/entities';
import { ThemedText } from '@/presentation/components/atoms';
import { useAuthStore } from '@/presentation/stores/auth.store';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

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

  if (!isInitialized || isLoading) {
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
    return <Redirect href="/(auth)/login" />;
  }

  if (requireEmailVerification && !user?.isEmailVerified) {
    return <Redirect href="/(auth)/verify-email" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const roleRedirects: Record<UserRole, string> = {
      citizen: '/(citizen)',
      operator: '/(operator)',
      admin: '/(admin)',
    };
    return <Redirect href={roleRedirects[user.role]} />;
  }

  return <>{children}</>;
}

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized, isLoading, user } = useAuthStore();

  if (!isInitialized || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated && user) {
    const roleRedirects: Record<UserRole, string> = {
      citizen: '/(citizen)',
      operator: '/(operator)',
      admin: '/(admin)',
    };
    return <Redirect href={roleRedirects[user.role]} />;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { user, hasRole, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasRole(roles)) {
    if (fallback) return <>{fallback}</>;

    if (user) {
      const roleRedirects: Record<UserRole, string> = {
        citizen: '/(citizen)',
        operator: '/(operator)',
        admin: '/(admin)',
      };
      return <Redirect href={roleRedirects[user.role]} />;
    }

    return <Redirect href="/(auth)/login" />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
