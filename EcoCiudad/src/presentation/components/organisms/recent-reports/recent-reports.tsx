import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { type IconName } from '@/presentation/components/atoms/icon';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { ReportCard } from '@/presentation/components/molecules/report-card';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

const HORIZONTAL_CARD_MIN_WIDTH = 280;
const HORIZONTAL_CARD_MAX_WIDTH = 360;

function useHorizontalCardWidth() {
  const { width } = useWindowDimensions();
  return Math.min(Math.max(width * 0.82, HORIZONTAL_CARD_MIN_WIDTH), HORIZONTAL_CARD_MAX_WIDTH);
}

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
  const { t } = useTranslation();
  const cardWidth = useHorizontalCardWidth();

  if (isLoading) {
    return (
      <View>
        <SectionHeader title={t('dashboard.recentActivity')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
        <View style={styles.listContainer}>
          {[0, 1, 2].map((i) => (
            <Card key={i} variant="elevated" padding="lg" style={[styles.skeletonCard, { width: cardWidth }]}>
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
        <SectionHeader title={t('dashboard.recentActivity')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="report"
            title={t('reports.noReportsYet')}
            description={t('reports.createFirst')}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <SectionHeader title={t('dashboard.recentActivity')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
          <View style={[styles.cardWrapper, { width: cardWidth }]}>
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
    flexShrink: 0,
  },
  card: {
    width: '100%',
  },
});
