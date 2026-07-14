import { useCallback, useMemo } from 'react';
import { View, StyleSheet, RefreshControl, Pressable, useWindowDimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { DashboardTemplate } from '@/presentation/components/templates';
import { DashboardHeader } from '@/presentation/components/organisms/dashboard-header';
import { QuickActions } from '@/presentation/components/organisms/quick-actions';
import { StatisticsSection } from '@/presentation/components/organisms/statistics-section';
import { RecentReportsList } from '@/presentation/components/organisms/recent-reports';
import { UpcomingEventsList } from '@/presentation/components/organisms/upcoming-events';
import { RecyclingCentersList } from '@/presentation/components/organisms/recycling-centers-list';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { EcoPointsCard } from '@/presentation/components/molecules/eco-points-card';
import { CommunityCard } from '@/presentation/components/molecules/community-card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { Icon } from '@/presentation/components/atoms/icon';
import { useDashboard } from '@/presentation/hooks/use-dashboard.hook';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { animations } from '@/theme/animations';
import { useTranslation } from '@/localization';
import { DASHBOARD_QUICK_ACTIONS, getGreeting } from '@/constants/dashboard.constants';

export default function CitizenHomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const communityCardWidth = Math.min(Math.max(width * 0.72, 240), 320);
  const quickActionColumns = width < 360 ? 3 : 4;
  const {
    stats,
    recentReports,
    upcomingEvents,
    recyclingCenters,
    communities,
    isLoading,
    isRefreshing,
    refreshAll,
    user,
    ecoPoints,
    level,
    progress,
    pointsForNextLevel,
  } = useDashboard();

  const greeting = useMemo(() => getGreeting(), []);

  const handleQuickAction = useCallback((key: string) => {
    switch (key) {
      case 'report':
        router.push('/(citizen)/report/create');
        break;
      case 'map':
        router.push('/(citizen)/(tabs)/map');
        break;
      case 'community':
        router.push('/(citizen)/(tabs)/community');
        break;
      case 'recycling':
        router.push('/(citizen)/recycling/map');
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

  const handleCommunityPress = useCallback((id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(`/(citizen)/community/${id}` as any);
  }, [router]);

  return (
    <DashboardTemplate
      header={
        <DashboardHeader
          userName={user?.displayName ?? t('dashboard.citizen')}
          greeting={greeting}
          avatarUri={user?.avatarUrl}
          points={ecoPoints}
          level={level}
          onProfilePress={() => {
            router.push('/(citizen)/(tabs)/profile');
          }}
          onNotificationsPress={() => router.push('/(citizen)/settings')}
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
        <Animated.View entering={FadeInDown.duration(animations.duration.slow)}>
          <EcoPointsCard
            points={ecoPoints}
            level={level}
            progress={progress}
            pointsForNextLevel={pointsForNextLevel}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(50)} style={styles.section}>
          <SectionHeader title={t('dashboard.quickActions')} />
          <QuickActions
            items={DASHBOARD_QUICK_ACTIONS}
            onItemPress={handleQuickAction}
            columns={quickActionColumns}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(100)}>
          <StatisticsSection stats={stats} isLoading={isLoading} />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(150)}>
          <RecentReportsList
            reports={recentReports}
            isLoading={isLoading}
            onReportPress={handleReportPress}
            onViewAllPress={() => router.push('/(citizen)/(tabs)/reports')}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(200)}>
          <UpcomingEventsList
            events={upcomingEvents}
            isLoading={isLoading}
            onEventPress={handleEventPress}
            onViewAllPress={() => router.push('/(citizen)/(tabs)/events')}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(250)}>
          <View>
            <SectionHeader
              title={t('dashboard.communities')}
              actionLabel={t('common.viewAll')}
              onActionPress={() => router.push('/(citizen)/(tabs)/community')}
            />
            {isLoading ? (
              <View style={styles.horizontalList}>
                {[0, 1].map((i) => (
                  <View key={i} style={[styles.communityCard, { width: communityCardWidth }]}>
                    <View style={[styles.communityAvatar, { backgroundColor: theme.colors.surfaceVariant }]} />
                    <View style={[styles.communityLine, { backgroundColor: theme.colors.surfaceVariant }]} />
                    <View style={[styles.communityLineShort, { backgroundColor: theme.colors.surfaceVariant }]} />
                  </View>
                ))}
              </View>
            ) : communities.length === 0 ? (
              <View style={styles.emptyContainer}>
                <EmptyState
                  iconName="community"
                  title={t('communities.noCommunities')}
                  description={t('communities.joinFirst')}
                />
              </View>
            ) : (
              <FlatList
                data={communities}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                renderItem={({ item }) => (
                  <View style={[styles.communityCard, { width: communityCardWidth }]}>
                    <CommunityCard
                      name={item.name}
                      description={item.description}
                      memberCount={item.memberCount}
                      imageUrl={item.imageUrl}
                      onPress={() => handleCommunityPress(item.id)}
                    />
                  </View>
                )}
              />
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(animations.duration.slow).delay(300)}>
          <RecyclingCentersList
            centers={recyclingCenters}
            isLoading={isLoading}
            onViewAllPress={() => router.push('/(citizen)/recycling/map')}
          />
        </Animated.View>

        <View style={styles.fabSpacer} />
      </Animated.ScrollView>

      <Pressable
        onPress={() => router.push('/(citizen)/report/create')}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        accessibilityRole="button"
        accessibilityLabel={t('accessibility.reportEnvironmentalIssue')}
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
    gap: spacing.lg,
  },
  section: {
    paddingTop: spacing.md,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  communityCard: {
    flexShrink: 0,
  },
  communityAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: spacing.md,
  },
  communityLine: {
    width: '70%',
    height: 16,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  communityLineShort: {
    width: '40%',
    height: 12,
    borderRadius: 4,
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
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
