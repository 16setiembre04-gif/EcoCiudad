import { View, FlatList, StyleSheet } from 'react-native';
import { ReviewCard } from '@/components/molecules/review-card';
import { SectionHeader } from '@/components/atoms/section-header';
import { Button } from '@/components/atoms/button';
import { EmptyState } from '@/components/atoms/empty-state';
import { Skeleton } from '@/components/atoms/skeleton';
import { Card } from '@/components/atoms/card';
import { spacing } from '@/theme/spacing';
import { type ReviewsSectionProps } from './types';

export function ReviewsSection({
  reviews,
  isLoading = false,
  onReviewPress,
  onHelpfulPress,
  onAddReviewPress,
  style,
}: ReviewsSectionProps) {
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title="Reviews" />
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
        <SectionHeader title="Reviews" />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="message"
            title="No reviews yet"
            description="Be the first to review this center"
            action={
              onAddReviewPress ? (
                <Button variant="primary" size="md" onPress={onAddReviewPress}>
                  Write Review
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
      <SectionHeader title={`Reviews (${reviews.length})`} />
      {onAddReviewPress && (
        <View style={styles.addButtonContainer}>
          <Button variant="outlined" size="sm" onPress={onAddReviewPress} iconName="plus">
            Write Review
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
