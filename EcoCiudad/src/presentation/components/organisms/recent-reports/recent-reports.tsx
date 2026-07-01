import { View, FlatList, StyleSheet } from 'react-native';
import { ReportCard } from '@/components/molecules/report-card';
import { SectionHeader } from '@/components/atoms/section-header';
import { EmptyState } from '@/components/atoms/empty-state';
import { Skeleton } from '@/components/atoms/skeleton';
import { Card } from '@/components/atoms/card';
import { spacing } from '@/theme/spacing';
import { type IconName } from '@/components/atoms/icon';

export interface RecentReportItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-review' | 'resolved' | 'rejected';
  category: IconName;
  location: string;
  date: string;
}

export interface RecentReportsListProps {
  reports: RecentReportItem[];
  isLoading?: boolean;
  onReportPress?: (id: string) => void;
  onViewAllPress?: () => void;
}

export function RecentReportsList({
  reports,
  isLoading = false,
  onReportPress,
  onViewAllPress,
}: RecentReportsListProps) {
  if (isLoading) {
    return (
      <View>
        <SectionHeader title="Recent Reports" actionLabel="View All" onActionPress={onViewAllPress} />
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
      <View>
        <SectionHeader title="Recent Reports" actionLabel="View All" onActionPress={onViewAllPress} />
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
    <View>
      <SectionHeader title="Recent Reports" actionLabel="View All" onActionPress={onViewAllPress} />
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ReportCard
              title={item.title}
              description={item.description}
              status={item.status}
              category={item.category}
              location={item.location}
              date={item.date}
              onPress={onReportPress ? () => onReportPress(item.id) : undefined}
              containerStyle={styles.card}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  horizontalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  cardWrapper: {
    width: 300,
  },
  card: {
    width: '100%',
  },
});
