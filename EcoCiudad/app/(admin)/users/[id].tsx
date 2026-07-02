import { useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AdminLayout } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Card } from '@/presentation/components/atoms/card';
import { Avatar } from '@/presentation/components/atoms/avatar';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Badge } from '@/presentation/components/atoms/badge';
import { Button } from '@/presentation/components/atoms/button';
import { Divider } from '@/presentation/components/atoms/divider';
import { Icon } from '@/presentation/components/atoms/icon';
import { Loader } from '@/presentation/components/atoms/loader';
import {
  useAdminUser,
  useAdminUserStatistics,
  useAdminActivateUser,
  useAdminDeactivateUser,
  useAdminSuspendUser,
  useAdminRestoreUser,
  useAdminDeleteUser,
  useAdminAssignRole,
} from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { USER_ROLES_CONFIG } from '@/constants';
import { type UserRole } from '@/domain/entities';

export default function AdminUserDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: user, isLoading, refetch } = useAdminUser(id ?? '');
  const { data: statistics } = useAdminUserStatistics(id ?? '');

  const activateMutation = useAdminActivateUser();
  const deactivateMutation = useAdminDeactivateUser();
  const suspendMutation = useAdminSuspendUser();
  const restoreMutation = useAdminRestoreUser();
  const deleteMutation = useAdminDeleteUser();
  const assignRoleMutation = useAdminAssignRole();

  const handleActivate = useCallback(async () => {
    if (!id) return;
    try {
      await activateMutation.mutateAsync(id);
      await refetch();
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  }, [id, activateMutation, refetch]);

  const handleDeactivate = useCallback(async () => {
    if (!id) return;
    Alert.alert(
      'Deactivate User',
      'Are you sure you want to deactivate this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await deactivateMutation.mutateAsync(id);
              await refetch();
            } catch (error) {
              console.error('Failed to deactivate user:', error);
            }
          },
        },
      ]
    );
  }, [id, deactivateMutation, refetch]);

  const handleSuspend = useCallback(() => {
    if (!id) return;
    Alert.prompt(
      'Suspend User',
      'Enter reason for suspension:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Suspend',
          style: 'destructive',
          onPress: async (reason: string | undefined) => {
            if (!reason) return;
            try {
              await suspendMutation.mutateAsync({ id, reason });
              await refetch();
            } catch (error) {
              console.error('Failed to suspend user:', error);
            }
          },
        },
      ],
      'plain-text'
    );
  }, [id, suspendMutation, refetch]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    Alert.alert(
      'Delete User',
      'Are you sure you want to permanently delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id);
              router.back();
            } catch (error) {
              console.error('Failed to delete user:', error);
            }
          },
        },
      ]
    );
  }, [id, deleteMutation, router]);

  const handleAssignRole = useCallback(async (role: UserRole) => {
    if (!id) return;
    try {
      await assignRoleMutation.mutateAsync({ id, role });
      await refetch();
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  }, [id, assignRoleMutation, refetch]);

  if (isLoading || !user) {
    return (
      <AdminLayout>
        <Loader size="lg" />
      </AdminLayout>
    );
  }

  const roleConfig = USER_ROLES_CONFIG[user.role] ?? USER_ROLES_CONFIG.citizen;

  return (
    <AdminLayout
      header={
        <Header title="User Details" showBackButton />
      }
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        <Card variant="elevated" padding="lg" style={styles.infoCard}>
          <View style={styles.headerRow}>
            <Avatar
              uri={user.avatarUrl}
              name={user.displayName}
              size="xl"
            />
            <View style={styles.headerInfo}>
              <ThemedText type="title" style={{ fontWeight: '700' }}>
                {user.displayName}
              </ThemedText>
              <ThemedText type="body" color={theme.colors.textSecondary}>
                {user.email}
              </ThemedText>
              <View style={styles.badgeRow}>
                <Badge variant="tonal" color={roleConfig.color === '#22C55E' ? 'success' : roleConfig.color === '#3B82F6' ? 'info' : 'primary'}>
                  {roleConfig.label}
                </Badge>
                <Badge variant="tonal" color="success">
                  Active
                </Badge>
              </View>
            </View>
          </View>

          <Divider orientation="horizontal" />

          {/* User Details */}
          <View style={styles.detailsSection}>
            {user.phone && (
              <View style={styles.detailRow}>
                <Icon name="phone" size={16} color={theme.colors.textSecondary} />
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  {user.phone}
                </ThemedText>
              </View>
            )}
            {user.department && (
              <View style={styles.detailRow}>
                <Icon name="location" size={16} color={theme.colors.textSecondary} />
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  {user.department}, {user.district}
                </ThemedText>
              </View>
            )}
            <View style={styles.detailRow}>
              <Icon name="calendar" size={16} color={theme.colors.textSecondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Statistics Card */}
        {statistics && (
          <Card variant="elevated" padding="lg" style={styles.statsCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Statistics
            </ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Icon name="report" size={24} color={theme.colors.primary} />
                <ThemedText type="title" style={{ fontWeight: '600' }}>
                  {statistics.reportCount}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  Reports
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <Icon name="calendar" size={24} color={theme.colors.secondary} />
                <ThemedText type="title" style={{ fontWeight: '600' }}>
                  {statistics.eventCount}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  Events
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <Icon name="community" size={24} color={theme.colors.success} />
                <ThemedText type="title" style={{ fontWeight: '600' }}>
                  {statistics.communityCount}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  Communities
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <Icon name="eco-points" size={24} color={theme.colors.warning} />
                <ThemedText type="title" style={{ fontWeight: '600' }}>
                  {statistics.ecoPoints}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  Eco Points
                </ThemedText>
              </View>
            </View>
          </Card>
        )}

        {/* Actions Card */}
        <Card variant="elevated" padding="lg" style={styles.actionsCard}>
          <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
            Actions
          </ThemedText>

          {/* Role Assignment */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Assign Role
            </ThemedText>
            <View style={styles.roleButtons}>
              {Object.entries(USER_ROLES_CONFIG).map(([role, config]) => (
                <Button
                  key={role}
                  variant={user.role === role ? 'primary' : 'outlined'}
                  size="sm"
                  onPress={() => handleAssignRole(role as UserRole)}
                  loading={assignRoleMutation.isPending}
                  disabled={user.role === role}
                >
                  {config.label}
                </Button>
              ))}
            </View>
          </View>

          <Divider orientation="horizontal" />

          {/* Status Actions */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Status Actions
            </ThemedText>
            <View style={styles.statusButtons}>
              <Button
                variant="outlined"
                size="md"
                onPress={handleDeactivate}
                loading={deactivateMutation.isPending}
              >
                Deactivate
              </Button>
              <Button
                variant="outlined"
                size="md"
                onPress={handleSuspend}
                loading={suspendMutation.isPending}
              >
                Suspend
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={handleActivate}
                loading={activateMutation.isPending}
              >
                Activate
              </Button>
            </View>
          </View>

          <Divider orientation="horizontal" />

          {/* Danger Zone */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.error} style={{ fontWeight: '600' }}>
              Danger Zone
            </ThemedText>
            <Button
              variant="destructive"
              size="md"
              onPress={handleDelete}
              loading={deleteMutation.isPending}
            >
              Delete User Permanently
            </Button>
          </View>
        </Card>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  infoCard: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  headerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  detailsSection: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statsCard: {
    gap: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statItem: {
    width: '45%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionsCard: {
    gap: spacing.md,
  },
  actionSection: {
    gap: spacing.md,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
