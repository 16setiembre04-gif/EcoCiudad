import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { Header } from '@/components/organisms/header';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Avatar } from '@/components/atoms/avatar';
import { Icon } from '@/components/atoms/icon';
import { Chip } from '@/components/atoms/chip';
import { PerformanceCard } from '@/components/molecules/performance-card';
import { useOperatorStats, useOperatorPerformance } from '@/presentation/hooks';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';

export default function OperatorProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [performancePeriod, setPerformancePeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const { data: stats, isLoading: statsLoading } = useOperatorStats();
  const { data: performance, isLoading: performanceLoading } = useOperatorPerformance(performancePeriod);

  if (!user) {
    return (
      <OperatorLayout>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading profile...</ThemedText>
        </View>
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout
      header={
        <Header
          title="My Profile"
          showBackButton={false}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" padding="lg" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar name={user.displayName} size="xl" />
            <View style={styles.profileInfo}>
              <ThemedText type="headline">{user.displayName}</ThemedText>
              <ThemedText type="body" color={theme.colors.textSecondary}>
                Environmental Officer
              </ThemedText>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {user.email}
              </ThemedText>
            </View>
          </View>
        </Card>

        {stats && (
          <Card variant="elevated" padding="md" style={styles.statsCard}>
            <ThemedText type="subtitle">Statistics</ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Icon name="tasks" size={24} color={theme.colors.primary} />
                <ThemedText type="headline">{stats.totalAssigned}</ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  Total Assigned
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <Icon name="success" size={24} color={theme.colors.success} />
                <ThemedText type="headline">{stats.resolvedThisMonth}</ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  This Month
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <Icon name="eco-points" size={24} color={theme.colors.secondary} />
                <ThemedText type="headline">{stats.averageResolutionTime}h</ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  Avg Time
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <Icon name="achievement" size={24} color={theme.colors.warning} />
                <ThemedText type="headline">{stats.completionRate}%</ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  Completion
                </ThemedText>
              </View>
            </View>
          </Card>
        )}

        <View style={styles.periodSelector}>
          <ThemedText type="subtitle">Performance</ThemedText>
          <View style={styles.periodButtons}>
            {(['day', 'week', 'month', 'year'] as const).map((period) => (
              <Chip
                key={period}
                variant={performancePeriod === period ? 'filled' : 'tonal'}
                size="sm"
                onPress={() => setPerformancePeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Chip>
            ))}
          </View>
        </View>

        {performance && (
          <PerformanceCard performance={performance} />
        )}
      </ScrollView>
    </OperatorLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
    gap: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    gap: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  statsCard: {
    gap: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 80,
  },
  periodSelector: {
    gap: spacing.md,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
