import { View, StyleSheet } from 'react-native';
import { StatCard } from '@/components/atoms/stat-card';
import { SectionHeader } from '@/components/atoms/section-header';
import { Skeleton } from '@/components/atoms/skeleton';
import { spacing } from '@/theme/spacing';

export interface DashboardStat {
  label: string;
  value: string | number;
  iconName: 'report' | 'success' | 'eco-points' | 'achievement';
  color?: string;
}

export interface StatisticsSectionProps {
  stats: DashboardStat[];
  isLoading?: boolean;
}

export function StatisticsSection({ stats, isLoading = false }: StatisticsSectionProps) {
  if (isLoading) {
    return (
      <View>
        <SectionHeader title="Your Statistics" />
        <View style={styles.grid}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton variant="circle" width={40} height={40} />
              <Skeleton variant="text" width={32} height={20} />
              <Skeleton variant="text" width={56} height={12} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View>
      <SectionHeader title="Your Statistics" />
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            iconName={stat.iconName}
            color={stat.color}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
  },
});
