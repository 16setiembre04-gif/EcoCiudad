import { Avatar } from '@/presentation/components/atoms/avatar';
import { Card } from '@/presentation/components/atoms/card';
import { Chip } from '@/presentation/components/atoms/chip';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { PerformanceCard } from '@/presentation/components/molecules/performance-card';
import { Header } from '@/presentation/components/organisms/header';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { useOperatorPerformance, useOperatorStats } from '@/presentation/hooks';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function OperatorProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const [performancePeriod, setPerformancePeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const { data: stats } = useOperatorStats();
  const { data: performance } = useOperatorPerformance(performancePeriod);

  if (!user) {
    return (
      <OperatorLayout>
        <View style={styles.loadingContainer}>
          <ThemedText>{t('common.loadingProfile')}</ThemedText>
        </View>
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout
      header={
        <Header
          title={t('common.myProfile')}
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
                {t('common.environmentalOfficer')}
              </ThemedText>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {user.email}
              </ThemedText>
            </View>
          </View>
        </Card>

        {stats && (
          <Card variant="elevated" padding="md" style={styles.statsCard}>
            <ThemedText type="subtitle">{t('common.statistics')}</ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Icon name="tasks" size={24} color={theme.colors.primary} />
                <ThemedText type="headline">{stats.totalAssigned}</ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {t('common.totalAssigned')}
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <Icon name="success" size={24} color={theme.colors.success} />
                <ThemedText type="headline">{stats.resolvedThisMonth}</ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {t('common.thisMonth')}
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <Icon name="eco-points" size={24} color={theme.colors.secondary} />
                <ThemedText type="headline">{stats.averageResolutionTime}h</ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {t('common.averageTime')}
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <Icon name="achievement" size={24} color={theme.colors.warning} />
                <ThemedText type="headline">{stats.completionRate}%</ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {t('common.completion')}
                </ThemedText>
              </View>
            </View>
          </Card>
        )}

        <View style={styles.periodSelector}>
          <ThemedText type="subtitle">{t('common.performance')}</ThemedText>
          <View style={styles.periodButtons}>
            {(['day', 'week', 'month', 'year'] as const).map((period) => (
              <Chip
                key={period}
                variant={performancePeriod === period ? 'filled' : 'tonal'}
                size="sm"
                onPress={() => setPerformancePeriod(period)}
              >
                {t(`common.${period}` as any)}
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
