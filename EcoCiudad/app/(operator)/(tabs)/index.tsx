import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { ActivityCard } from '@/presentation/components/molecules/activity-card';
import { AssignedReportsList } from '@/presentation/components/organisms/assigned-reports-list';
import { OperatorDashboardHeader } from '@/presentation/components/organisms/operator-dashboard-header';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { useOperatorDashboard } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function OperatorDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();

  const {
    stats,
    assignedReports,
    recentActivity,
    isLoading,
    user,
  } = useOperatorDashboard();

  const handleReportPress = useCallback((id: string) => {
    router.push(`/(operator)/reports/${id}`);
  }, [router]);

  const handleViewAllReports = useCallback(() => {
    router.push('/(operator)/(tabs)/reports');
  }, [router]);

  const handleProfilePress = useCallback(() => {
    router.push('/(operator)/(tabs)/profile');
  }, [router]);

  if (!stats || !user) {
    return (
      <OperatorLayout>
        <View style={styles.loadingContainer}>
          <Animated.Text>Loading dashboard...</Animated.Text>
        </View>
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout
      header={
        <OperatorDashboardHeader
          stats={stats}
          operatorName={user.displayName}
          onProfilePress={handleProfilePress}
          onNotificationsPress={() => {}}
        />
      }
    >
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => {}} tintColor={theme.colors.primary} />
        }
      >
        <AssignedReportsList
          reports={assignedReports.slice(0, 5)}
          isLoading={isLoading}
          onReportPress={handleReportPress}
          onViewAllPress={handleViewAllReports}
          title="My Assigned Reports"
          horizontal
        />

        {recentActivity.length > 0 && (
          <View style={styles.sectionSpacer}>
            <SectionHeader title="Recent Activity" />
            <View style={styles.activityList}>
              {recentActivity.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </OperatorLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['5xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionSpacer: {
    marginTop: spacing.xl,
  },
  activityList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
});
