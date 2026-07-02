import { useCallback, useState } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { AdminLayout } from '@/presentation/components/templates/admin-layout';
import { AdminDashboardHeader } from '@/presentation/components/organisms/admin-dashboard-header';
import { AdminStatsGrid } from '@/presentation/components/organisms/admin-stats-grid';
import { AdminQuickActions } from '@/presentation/components/organisms/admin-quick-actions';
import { AdminRecentActivity } from '@/presentation/components/organisms/admin-recent-activity';
import { ActivityChart } from '@/presentation/components/molecules/activity-chart';
import { CategoryChart } from '@/presentation/components/molecules/category-chart';
import { DistrictChart } from '@/presentation/components/molecules/district-chart';
import { SectionHeader } from '@/components/atoms/section-header';
import { useAdminDashboard, useAuth } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';

export default function AdminDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const {
    stats,
    activityData,
    reportsByCategory,
    reportsByDistrict,
    recentActivity,
    isLoading,
    refetch,
  } = useAdminDashboard();

  const [activityPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const handleQuickAction = useCallback(
    (key: string) => {
      switch (key) {
        case 'users':
          router.push('/(admin)/users' as any);
          break;
        case 'reports':
          router.push('/(admin)/reports' as any);
          break;
        case 'events':
        case 'settings':
          break;
        default:
          break;
      }
    },
    [router]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <AdminLayout
      header={
        <AdminDashboardHeader
          adminName={user?.displayName ?? 'Administrator'}
          onNotificationsPress={() => {}}
        />
      }
    >
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.section}>
          <AdminStatsGrid stats={stats} isLoading={isLoading} />
        </View>

        <View style={styles.section}>
          <AdminQuickActions onActionPress={handleQuickAction} />
        </View>

        <View style={[styles.section, styles.chartSection]}>
          <SectionHeader title="Analytics" />
          <View style={styles.chartsContainer}>
            <ActivityChart data={activityData} period={activityPeriod} />
            <CategoryChart data={reportsByCategory} />
            <DistrictChart data={reportsByDistrict} />
          </View>
        </View>

        <View style={styles.section}>
          <AdminRecentActivity
            activity={recentActivity}
            isLoading={isLoading}
            onViewAllPress={() => {}}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['5xl'],
  },
  section: {
    marginBottom: spacing.xl,
  },
  chartSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  chartsContainer: {
    gap: spacing.md,
  },
  bottomSpacer: {
    height: spacing['3xl'],
  },
});
