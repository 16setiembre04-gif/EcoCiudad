import { useCallback, useMemo } from 'react';
import { View, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { DashboardTemplate } from '@/presentation/components/templates';
import { DashboardHeader } from '@/presentation/components/organisms/dashboard-header';
import { QuickActions } from '@/presentation/components/organisms/quick-actions';
import { StatisticsSection } from '@/presentation/components/organisms/statistics-section';
import { RecentReportsList } from '@/presentation/components/organisms/recent-reports';
import { UpcomingEventsList } from '@/presentation/components/organisms/upcoming-events';
import { RecyclingCentersList } from '@/presentation/components/organisms/recycling-centers-list';
import { Icon } from '@/presentation/components/atoms/icon';
import { useDashboard } from '@/presentation/hooks/use-dashboard.hook';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { animations } from '@/theme/animations';
import { DASHBOARD_QUICK_ACTIONS, getGreeting } from '@/constants/dashboard.constants';

export default function CitizenHomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    stats,
    recentReports,
    upcomingEvents,
    recyclingCenters,
    isLoading,
    isRefreshing,
    refreshAll,
    user,
  } = useDashboard();

  const greeting = useMemo(() => getGreeting(), []);

  const handleQuickAction = useCallback((key: string) => {
    switch (key) {
      case 'report':
        router.push('/(citizen)/report/create');
        break;
      case 'community':
        router.push('/(citizen)/(tabs)/community');
        break;
      case 'recycling':
        router.push('/(citizen)/(tabs)/map');
        break;
      case 'events':
        router.push('/(citizen)/(tabs)/events');
        break;
    }
  }, [router]);

  const handleReportPress = useCallback((id: string) => {
    router.push(`/(citizen)/report/${id}`);
  }, [router]);

  const handleEventPress = useCallback((id: string) => {
    router.push(`/(citizen)/events/${id}`);
  }, [router]);

  return (
    <DashboardTemplate
      header={
        <DashboardHeader
          userName={user?.displayName ?? 'Citizen'}
          greeting={greeting}
          avatarUri={user?.avatarUrl}
          onProfilePress={() => router.push('/(citizen)/profile')}
          onNotificationsPress={() => router.push('/(citizen)/notifications')}
        />
      }
    >
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Animated.View entering={FadeInDown.duration(animations.duration.slow)} style={styles.section}>
          <QuickActions
            items={DASHBOARD_QUICK_ACTIONS}
            onItemPress={handleQuickAction}
            columns={4}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(50)}>
          <StatisticsSection stats={stats} isLoading={isLoading} />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(100)}>
          <RecentReportsList
            reports={recentReports}
            isLoading={isLoading}
            onReportPress={handleReportPress}
            onViewAllPress={() => router.push('/(citizen)/(tabs)/reports')}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(150)}>
          <UpcomingEventsList
            events={upcomingEvents}
            isLoading={isLoading}
            onEventPress={handleEventPress}
            onViewAllPress={() => router.push('/(citizen)/(tabs)/events')}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(200)}>
          <RecyclingCentersList
            centers={recyclingCenters}
            isLoading={isLoading}
            onViewAllPress={() => router.push('/(citizen)/(tabs)/map')}
          />
        </Animated.View>

        <View style={styles.fabSpacer} />
      </Animated.ScrollView>

      <Pressable
        onPress={() => router.push('/(citizen)/report/create')}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        accessibilityRole="button"
        accessibilityLabel="Report environmental issue"
      >
        <Icon name="plus" size={28} color={theme.colors.onPrimary} />
      </Pressable>
    </DashboardTemplate>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  fabSpacer: {
    height: spacing['3xl'],
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
