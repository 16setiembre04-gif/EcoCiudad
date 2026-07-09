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
  useAdminDeleteUser,
  useAdminAssignRole,
} from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { USER_ROLES_CONFIG } from '@/constants';
import { type UserRole } from '@/domain/entities';

export default function AdminUserDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: user, isLoading, refetch } = useAdminUser(id ?? '');
  const { data: statistics } = useAdminUserStatistics(id ?? '');

  const activateMutation = useAdminActivateUser();
  const deactivateMutation = useAdminDeactivateUser();
  const suspendMutation = useAdminSuspendUser();
  const deleteMutation = useAdminDeleteUser();
  const assignRoleMutation = useAdminAssignRole();

  const handleActivate = useCallback(async () => {
    if (!id) return;
    try {
      await activateMutation.mutateAsync(id);
      await refetch();
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.failedToActivateUser'));
    }
  }, [id, activateMutation, refetch, t]);

  const handleDeactivate = useCallback(async () => {
    if (!id) return;
    Alert.alert(
      t('common.deactivateUser'),
      t('common.confirmDeactivateUser'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.deactivate'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deactivateMutation.mutateAsync(id);
              await refetch();
            } catch (error) {
              Alert.alert(t('common.error'), t('errors.failedToDeactivateUser'));
            }
          },
        },
      ]
    );
  }, [id, deactivateMutation, refetch, t]);

  const handleSuspend = useCallback(() => {
    if (!id) return;
    Alert.prompt(
      t('common.suspendUser'),
      t('common.enterSuspensionReason'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.suspend'),
          style: 'destructive',
          onPress: async (reason: string | undefined) => {
            if (!reason) return;
            try {
              await suspendMutation.mutateAsync({ id, reason });
              await refetch();
            } catch (error) {
              Alert.alert(t('common.error'), t('errors.failedToSuspendUser'));
            }
          },
        },
      ],
      'plain-text'
    );
  }, [id, suspendMutation, refetch, t]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    Alert.alert(
      t('common.deleteUser'),
      t('common.confirmDeleteUser'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id);
              router.back();
            } catch (error) {
              Alert.alert(t('common.error'), t('errors.failedToDeleteUser'));
            }
          },
        },
      ]
    );
  }, [id, deleteMutation, router, t]);

  const handleAssignRole = useCallback(async (role: UserRole) => {
    if (!id) return;
    try {
      await assignRoleMutation.mutateAsync({ id, role });
      await refetch();
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.failedToAssignRole'));
    }
  }, [id, assignRoleMutation, refetch, t]);

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
        <Header title={t('common.userDetails')} showBackButton />
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
                  {t(roleConfig.labelKey)}
                </Badge>
                <Badge variant="tonal" color="success">
                  {t('common.active')}
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
                {t('common.joined')} {new Date(user.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Statistics Card */}
        {statistics && (
          <Card variant="elevated" padding="lg" style={styles.statsCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.statistics')}
            </ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Icon name="report" size={24} color={theme.colors.primary} />
                <ThemedText type="title" style={{ fontWeight: '600' }}>
                  {statistics.reportCount}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {t('common.reports')}
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <Icon name="calendar" size={24} color={theme.colors.secondary} />
                <ThemedText type="title" style={{ fontWeight: '600' }}>
                  {statistics.eventCount}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {t('common.events')}
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <Icon name="community" size={24} color={theme.colors.success} />
                <ThemedText type="title" style={{ fontWeight: '600' }}>
                  {statistics.communityCount}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {t('common.communities')}
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <Icon name="eco-points" size={24} color={theme.colors.warning} />
                <ThemedText type="title" style={{ fontWeight: '600' }}>
                  {statistics.ecoPoints}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {t('common.ecoPoints')}
                </ThemedText>
              </View>
            </View>
          </Card>
        )}

        {/* Actions Card */}
        <Card variant="elevated" padding="lg" style={styles.actionsCard}>
          <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
            {t('common.actions')}
          </ThemedText>

          {/* Role Assignment */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.assignRole')}
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
                  {t(config.labelKey)}
                </Button>
              ))}
            </View>
          </View>

          <Divider orientation="horizontal" />

          {/* Status Actions */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.statusActions')}
            </ThemedText>
            <View style={styles.statusButtons}>
              <Button
                variant="outlined"
                size="md"
                onPress={handleDeactivate}
                loading={deactivateMutation.isPending}
              >
                {t('common.deactivate')}
              </Button>
              <Button
                variant="outlined"
                size="md"
                onPress={handleSuspend}
                loading={suspendMutation.isPending}
              >
                {t('common.suspend')}
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={handleActivate}
                loading={activateMutation.isPending}
              >
                {t('common.activate')}
              </Button>
            </View>
          </View>

          <Divider orientation="horizontal" />

          {/* Danger Zone */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.error} style={{ fontWeight: '600' }}>
              {t('common.dangerZone')}
            </ThemedText>
            <Button
              variant="destructive"
              size="md"
              onPress={handleDelete}
              loading={deleteMutation.isPending}
            >
              {t('common.deleteUserPermanently')}
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
