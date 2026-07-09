import { Button } from '@/presentation/components/atoms/button';
import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { ReviewCard } from '@/presentation/components/molecules/review-card';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, StyleSheet, View } from 'react-native';
import { type ReviewsSectionProps } from './types';

export function ReviewsSection({
  reviews,
  isLoading = false,
  onReviewPress: _onReviewPress,
  onHelpfulPress,
  onAddReviewPress,
  style,
}: ReviewsSectionProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={t('common.reviews')} />
        <View style={styles.listContainer}>
          {[0, 1, 2].map((i) => (
            <Card key={i} variant="elevated" padding="md" style={styles.skeletonCard}>
              <Skeleton width="100%" height={16} />
              <Skeleton width="80%" height={14} />
              <Skeleton width="60%" height={14} />
            </Card>
          ))}
        </View>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={t('common.reviews')} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="message"
            title={t('common.noReviewsYet')}
            description={t('common.beFirstToReview')}
            action={
              onAddReviewPress ? (
                <Button variant="primary" size="md" onPress={onAddReviewPress}>
                  {t('common.writeReview')}
                </Button>
              ) : undefined
            }
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={`${t('common.reviews')} (${reviews.length})`} />
      {onAddReviewPress && (
        <View style={styles.addButtonContainer}>
          <Button variant="outlined" size="sm" onPress={onAddReviewPress} iconName="plus">
            {t('common.writeReview')}
          </Button>
        </View>
      )}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            onHelpfulPress={onHelpfulPress ? () => onHelpfulPress(item.id) : undefined}
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
  listContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  skeletonCard: {
    gap: spacing.sm,
  },
  addButtonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
});
