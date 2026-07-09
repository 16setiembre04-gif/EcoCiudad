import { useState, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AdminLayout } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { Card } from '@/presentation/components/atoms/card';
import { Avatar } from '@/presentation/components/atoms/avatar';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Badge } from '@/presentation/components/atoms/badge';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { useAdminUsers } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { USER_ROLES_CONFIG } from '@/constants';
import { type User, type UserRole } from '@/domain/entities';
import { type AdminFilters } from '@/domain/repositories';

export default function AdminUsersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  const filters = useMemo<AdminFilters>(() => ({
    search: search || undefined,
    role: roleFilter,
    limit: 20,
  }), [search, roleFilter]);

  const { data: users, isLoading, refetch } = useAdminUsers(filters);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleUserPress = useCallback((id: string) => {
    router.push(`/(admin)/users/${id}` as any);
  }, [router]);

  const handleRoleFilter = useCallback((role: UserRole | undefined) => {
    setRoleFilter(role);
  }, []);

  const renderUser = useCallback(({ item }: { item: User }) => {
    const roleConfig = USER_ROLES_CONFIG[item.role] ?? USER_ROLES_CONFIG.citizen;

    return (
      <Card
        variant="elevated"
        padding="md"
        onPress={() => handleUserPress(item.id)}
        style={styles.userCard}
      >
        <View style={styles.userRow}>
          <Avatar
            uri={item.avatarUrl}
            name={item.displayName}
            size="md"
          />
          <View style={styles.userInfo}>
            <ThemedText type="body" style={{ fontWeight: '600' }} numberOfLines={1}>
              {item.displayName}
            </ThemedText>
            <ThemedText type="caption" color={theme.colors.textSecondary} numberOfLines={1}>
              {item.email}
            </ThemedText>
          </View>
          <View style={styles.badges}>
            <Badge variant="tonal" color={roleConfig.color === '#22C55E' ? 'success' : roleConfig.color === '#3B82F6' ? 'info' : 'primary'}>
              {t(roleConfig.labelKey)}
            </Badge>
          </View>
        </View>
      </Card>
    );
  }, [handleUserPress, theme.colors.textSecondary, t]);

  const renderSkeleton = useCallback(() => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} variant="elevated" padding="md" style={styles.userCard}>
          <View style={styles.userRow}>
            <Skeleton width={48} height={48} variant="circle" />
            <View style={{ flex: 1, gap: 4 }}>
              <Skeleton width="60%" height={16} variant="text" />
              <Skeleton width="80%" height={12} variant="text" />
            </View>
            <Skeleton width={60} height={24} variant="rect" />
          </View>
        </Card>
      ))}
    </View>
  ), []);

  return (
    <AdminLayout
      header={
        <Header title={t('common.usersManagement')} />
      }
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={t('common.searchUsers')}
          />
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            <Pressable onPress={() => handleRoleFilter(undefined)}>
              <Badge
                variant={roleFilter === undefined ? 'filled' : 'outlined'}
                color="primary"
              >
                {t('common.all')}
              </Badge>
            </Pressable>
            {Object.entries(USER_ROLES_CONFIG).map(([role, config]) => (
              <Pressable key={role} onPress={() => handleRoleFilter(role as UserRole)}>
                <Badge
                  variant={roleFilter === role ? 'filled' : 'outlined'}
                  color={config.color === '#22C55E' ? 'success' : config.color === '#3B82F6' ? 'info' : 'primary'}
                >
                  {t(config.labelKey)}
                </Badge>
              </Pressable>
            ))}
          </View>
        </View>

        {isLoading ? (
          renderSkeleton()
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                iconName="user"
                title={t('common.noUsersFound')}
                description={t('common.tryAdjustingSearchFilters')}
              />
            }
          />
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  userCard: {
    marginBottom: spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  badges: {
    gap: spacing.xs,
  },
  skeletonContainer: {
    paddingHorizontal: spacing.lg,
  },
});
