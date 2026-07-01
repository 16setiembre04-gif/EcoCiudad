import { View, StyleSheet } from 'react-native';
import { StatCard } from '@/components/atoms/stat-card';
import { Skeleton } from '@/components/atoms/skeleton';
import { spacing } from '@/theme/spacing';
import { type DashboardStats } from '@/domain/entities';
import { type IconName } from '@/components/atoms/icon';

export interface AdminStatsGridProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

interface StatItem {
  label: string;
  value: number | string;
  icon: IconName;
  color: string;
}

export function AdminStatsGrid({ stats, isLoading }: AdminStatsGridProps) {
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
    { label: 'Total Users', value: stats.totalUsers, icon: 'user', color: '#3B82F6' },
    { label: 'Citizens', value: stats.totalCitizens, icon: 'community', color: '#22C55E' },
    { label: 'Operators', value: stats.totalOperators, icon: 'truck', color: '#1565C0' },
    { label: 'Administrators', value: stats.totalAdmins, icon: 'settings', color: '#6B7280' },
    { label: 'Total Reports', value: stats.totalReports, icon: 'report', color: '#EF4444' },
    { label: 'Pending', value: stats.pendingReports, icon: 'warning', color: '#F59E0B' },
    { label: 'In Progress', value: stats.inProgressReports, icon: 'refresh', color: '#F97316' },
    { label: 'Resolved', value: stats.resolvedReports, icon: 'success', color: '#22C55E' },
    { label: 'Communities', value: stats.totalCommunities, icon: 'community', color: '#8B5CF6' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: 'calendar', color: '#3B82F6' },
    { label: 'Recycling Centers', value: stats.totalRecyclingCenters, icon: 'recycle', color: '#10B981' },
    { label: 'Eco Points', value: stats.ecoPointsDistributed.toLocaleString(), icon: 'eco-points', color: '#F59E0B' },
  ];

  return (
    <View style={styles.container}>
      {statItems.map((item) => (
        <View key={item.label} style={styles.statItem}>
          <StatCard
            label={item.label}
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
