import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { ReportCard } from '@/presentation/components/molecules/report-card';
import { spacing } from '@/theme/spacing';
import { FlatList, StyleSheet, View } from 'react-native';
import { type ReportListProps } from './types';

function mapStatus(status: string): 'pending' | 'in-review' | 'resolved' | 'rejected' {
  if (status === 'in_review') return 'in-review';
  return status as 'pending' | 'in-review' | 'resolved' | 'rejected';
}

function mapCategoryToIcon(category: string): 'leaf' | 'water' | 'tree' | 'noise' | 'recycle' | 'help' {
  const map: Record<string, 'leaf' | 'water' | 'tree' | 'noise' | 'recycle' | 'help'> = {
    waste: 'leaf',
    pollution: 'water',
    green_space: 'tree',
    water: 'water',
    noise: 'noise',
    other: 'help',
  };
  return map[category] ?? 'help';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ReportList({
  reports,
  isLoading = false,
  onReportPress,
  onViewAllPress,
  style,
}: ReportListProps) {
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title="Reports" actionLabel="View All" onActionPress={onViewAllPress} />
        <View style={styles.listContainer}>
          {[0, 1, 2].map((i) => (
            <Card key={i} variant="elevated" padding="lg" style={styles.skeletonCard}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="100%" height={14} />
              <Skeleton variant="text" width="40%" height={14} />
            </Card>
          ))}
        </View>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title="Reports" actionLabel="View All" onActionPress={onViewAllPress} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="report"
            title="No reports yet"
            description="Your environmental reports will appear here"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title="Reports" actionLabel="View All" onActionPress={onViewAllPress} />
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ReportCard
            title={item.title}
            description={item.description}
            status={mapStatus(item.status)}
            category={mapCategoryToIcon(item.category)}
            location={item.location.address ?? 'Unknown location'}
            date={formatDate(item.createdAt)}
            onPress={onReportPress ? () => onReportPress(item.id) : undefined}
            containerStyle={styles.card}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonCard: {
    gap: spacing.sm,
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: '100%',
  },
});
