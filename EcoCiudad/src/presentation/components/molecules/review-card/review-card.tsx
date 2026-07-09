import { Avatar } from '@/presentation/components/atoms/avatar';
import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { RatingStars } from '@/presentation/components/atoms/rating-stars';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Pressable, StyleSheet, View } from 'react-native';
import { type ReviewCardProps } from './types';

export function ReviewCard({
  review,
  onHelpfulPress,
  containerStyle,
}: ReviewCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(t('common.locale'), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="elevated" padding="md" style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Avatar
          uri={review.userAvatar}
          name={review.userName}
          size="sm"
        />
        <View style={styles.headerInfo}>
          <ThemedText type="body" numberOfLines={1}>
            {review.userName}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {formatDate(review.createdAt)}
          </ThemedText>
        </View>
        <RatingStars rating={review.rating} size="sm" />
      </View>

      {review.comment && (
        <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
          {review.comment}
        </ThemedText>
      )}

      {review.images && review.images.length > 0 && (
        <View style={styles.imagesContainer}>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {t('common.photosAttached', { count: review.images.length })}
          </ThemedText>
        </View>
      )}

      <Pressable
        style={styles.helpfulButton}
        onPress={onHelpfulPress}
        accessibilityRole="button"
        accessibilityLabel={t('common.markAsHelpful')}
      >
        <Icon name="success" size={16} color={theme.colors.textSecondary} />
        <ThemedText type="caption" color={theme.colors.textSecondary}>
          {t('common.helpful')} ({review.helpfulCount})
        </ThemedText>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  imagesContainer: {
    paddingTop: spacing.xs,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
    alignSelf: 'flex-start',
  },
});
