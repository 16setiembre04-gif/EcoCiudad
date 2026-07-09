import { type DashboardStats } from '@/domain/entities';
import { type IconName } from '@/presentation/components/atoms/icon';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { StatCard } from '@/presentation/components/atoms/stat-card';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet, View } from 'react-native';

export interface AdminStatsGridProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

interface StatItem {
  labelKey: string;
  value: number | string;
  icon: IconName;
  color: string;
}

export function AdminStatsGrid({ stats, isLoading }: AdminStatsGridProps) {
  const { t } = useTranslation();

  if (isLoading || !stats) {
    return (
      <View style={styles.container}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={styles.skeletonItem}>
            <Skeleton width={40} height={40} variant="circle" />
            <Skeleton width={48} height={24} variant="text" />
            <Skeleton width={72} height={12} variant="text" />
          </View>
        ))}
      </View>
    );
  }

  const statItems: StatItem[] = [
    { labelKey: 'common.totalUsers', value: stats.totalUsers, icon: 'user', color: '#3B82F6' },
    { labelKey: 'common.citizens', value: stats.totalCitizens, icon: 'community', color: '#22C55E' },
    { labelKey: 'common.operators', value: stats.totalOperators, icon: 'truck', color: '#1565C0' },
    { labelKey: 'common.administrators', value: stats.totalAdmins, icon: 'settings', color: '#6B7280' },
    { labelKey: 'common.totalReports', value: stats.totalReports, icon: 'report', color: '#EF4444' },
    { labelKey: 'common.pending', value: stats.pendingReports, icon: 'warning', color: '#F59E0B' },
    { labelKey: 'common.inProgress', value: stats.inProgressReports, icon: 'refresh', color: '#F97316' },
    { labelKey: 'common.resolved', value: stats.resolvedReports, icon: 'success', color: '#22C55E' },
    { labelKey: 'common.communities', value: stats.totalCommunities, icon: 'community', color: '#8B5CF6' },
    { labelKey: 'common.upcomingEvents', value: stats.upcomingEvents, icon: 'calendar', color: '#3B82F6' },
    { labelKey: 'common.recyclingCenters', value: stats.totalRecyclingCenters, icon: 'recycle', color: '#10B981' },
    { labelKey: 'common.ecoPoints', value: stats.ecoPointsDistributed.toLocaleString(), icon: 'eco-points', color: '#F59E0B' },
  ];

  return (
    <View style={styles.container}>
      {statItems.map((item) => (
        <View key={item.labelKey} style={styles.statItem}>
          <StatCard
            label={t(item.labelKey)}
            value={item.value}
            iconName={item.icon}
            color={item.color}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  statItem: {
    width: '47%',
  },
  skeletonItem: {
    width: '47%',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
});
