import { View, FlatList, StyleSheet } from 'react-native';
import { AssignedReportCard } from '@/components/molecules/assigned-report-card';
import { SectionHeader } from '@/components/atoms/section-header';
import { EmptyState } from '@/components/atoms/empty-state';
import { Skeleton } from '@/components/atoms/skeleton';
import { Card } from '@/components/atoms/card';
import { spacing } from '@/theme/spacing';
import { type AssignedReportsListProps } from './types';

export function AssignedReportsList({
  reports,
  isLoading = false,
  onReportPress,
  onViewAllPress,
  title = 'Assigned Reports',
  horizontal = false,
  style,
}: AssignedReportsListProps) {
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={title} actionLabel={onViewAllPress ? 'View All' : undefined} onActionPress={onViewAllPress} />
        <View style={horizontal ? styles.skeletonHorizontal : styles.skeletonVertical}>
          {[0, 1, 2].map((i) => (
            <Card key={i} variant="elevated" padding="md" style={horizontal ? styles.skeletonCardH : styles.skeletonCardV}>
              <Skeleton width="100%" height={20} />
              <Skeleton width="80%" height={16} />
              <Skeleton width="60%" height={14} />
            </Card>
          ))}
        </View>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={title} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="tasks"
            title="No assigned reports"
            description="You don't have any reports assigned to you"
          />
        </View>
      </View>
    );
  }

  if (horizontal) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={title} actionLabel={onViewAllPress ? 'View All' : undefined} onActionPress={onViewAllPress} />
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <View style={styles.horizontalCard}>
              <AssignedReportCard
                report={item}
                onPress={onReportPress ? () => onReportPress(item.id) : undefined}
              />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={title} actionLabel={onViewAllPress ? 'View All' : undefined} onActionPress={onViewAllPress} />
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.verticalList}
        renderItem={({ item }) => (
          <AssignedReportCard
            report={item}
            onPress={onReportPress ? () => onReportPress(item.id) : undefined}
            containerStyle={styles.verticalCard}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  horizontalCard: {
    width: 320,
  },
  verticalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  verticalCard: {
    width: '100%',
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  skeletonHorizontal: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonVertical: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonCardH: {
    width: 320,
    gap: spacing.sm,
  },
  skeletonCardV: {
    width: '100%',
    gap: spacing.sm,
  },
});
