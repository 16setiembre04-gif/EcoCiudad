import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { AssignedReportCard } from '@/presentation/components/molecules/assigned-report-card';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { type AssignedReportsListProps } from './types';

const HORIZONTAL_CARD_MIN_WIDTH = 280;
const HORIZONTAL_CARD_MAX_WIDTH = 360;

function useHorizontalCardWidth() {
  const { width } = useWindowDimensions();
  return Math.min(Math.max(width * 0.82, HORIZONTAL_CARD_MIN_WIDTH), HORIZONTAL_CARD_MAX_WIDTH);
}

export function AssignedReportsList({
  reports,
  isLoading = false,
  onReportPress,
  onViewAllPress,
  title,
  horizontal = false,
  style,
}: AssignedReportsListProps) {
  const { t } = useTranslation();
  const horizontalCardWidth = useHorizontalCardWidth();
  const displayTitle = title ?? t('common.assignedReports');

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={displayTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
        <View style={horizontal ? styles.skeletonHorizontal : styles.skeletonVertical}>
          {[0, 1, 2].map((i) => (
            <Card
              key={i}
              variant="elevated"
              padding="md"
              style={horizontal ? [styles.skeletonCardH, { width: horizontalCardWidth }] : styles.skeletonCardV}
            >
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
        <SectionHeader title={displayTitle} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="tasks"
            title={t('common.noAssignedReports')}
            description={t('common.noReportsAssignedToYou')}
          />
        </View>
      </View>
    );
  }

  if (horizontal) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={displayTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <View style={[styles.horizontalCard, { width: horizontalCardWidth }]}>
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
      <SectionHeader title={displayTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
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
    flexShrink: 0,
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
    gap: spacing.sm,
  },
  skeletonCardV: {
    width: '100%',
    gap: spacing.sm,
  },
});
