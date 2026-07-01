import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { SectionHeader } from '@/components/atoms/section-header';
import { Skeleton } from '@/components/atoms/skeleton';
import { AdminActivityItem } from '@/components/molecules/admin-activity-item';
import { spacing } from '@/theme/spacing';
import { type AdminActivityLog } from '@/domain/entities';

export interface AdminRecentActivityProps {
  activity: AdminActivityLog[];
  isLoading: boolean;
  onViewAllPress?: () => void;
}

export function AdminRecentActivity({ activity, isLoading, onViewAllPress }: AdminRecentActivityProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <SectionHeader title="Recent Activity" />
        <Card variant="elevated" padding="lg">
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={styles.skeletonRow}>
              <Skeleton width={32} height={32} variant="circle" />
              <View style={{ flex: 1, gap: 4 }}>
                <Skeleton width="60%" height={14} variant="text" />
                <Skeleton width="40%" height={10} variant="text" />
              </View>
            </View>
          ))}
        </Card>
      </View>
    );
  }

  if (activity.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Recent Activity"
        actionLabel="View All"
        onActionPress={onViewAllPress}
      />
      <Card variant="elevated" padding="lg" style={styles.card}>
        {activity.slice(0, 8).map((item) => (
          <AdminActivityItem key={item.id} activity={item} />
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  card: {
    gap: spacing.xs,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
});
