import { EVENT_CATEGORIES } from '@/constants/event.constants';
import { CapacityBadge } from '@/presentation/components/atoms/capacity-badge';
import { Card } from '@/presentation/components/atoms/card';
import { DateChip } from '@/presentation/components/atoms/date-chip';
import { EventBadge } from '@/presentation/components/atoms/event-badge';
import { Icon } from '@/presentation/components/atoms/icon';
import { LocationBadge } from '@/presentation/components/atoms/location-badge';
import { RewardChip } from '@/presentation/components/atoms/reward-chip';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { type EventCardProps } from './types';

export function EventCard({
  event,
  isFavorite = false,
  isRegistered = false,
  onPress,
  onFavoritePress,
  containerStyle,
  testID,
}: EventCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const categoryConfig = EVENT_CATEGORIES[event.category];

  const content = (
    <View style={styles.container}>
      {event.bannerUrl || event.imageUrl ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.bannerUrl || event.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.badgeOverlay}>
            <EventBadge status={event.status} size="sm" />
          </View>
          {onFavoritePress && (
            <Pressable
              style={styles.favoriteButton}
              onPress={onFavoritePress}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
            >
              <Icon
                name="heart"
                size={20}
                color={isFavorite ? theme.colors.error : theme.colors.onPrimary}
              />
            </Pressable>
          )}
        </View>
      ) : (
        <View style={[styles.placeholderImage, { backgroundColor: categoryConfig.color + '20' }]}>
          <Icon name={categoryConfig.icon} size={32} color={categoryConfig.color} />
          <View style={styles.badgeOverlay}>
            <EventBadge status={event.status} size="sm" />
          </View>
          {onFavoritePress && (
            <Pressable
              style={styles.favoriteButton}
              onPress={onFavoritePress}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
            >
              <Icon
                name="heart"
                size={20}
                color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.categoryRow}>
            <Icon name={categoryConfig.icon} size={16} color={categoryConfig.color} />
            <ThemedText type="caption" color={categoryConfig.color}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {categoryConfig ? t(categoryConfig.labelKey as any) : ''}
            </ThemedText>
          </View>
          {isRegistered && (
            <View style={[styles.registeredBadge, { backgroundColor: theme.colors.success + '20' }]}>
              <Icon name="check" size={12} color={theme.colors.success} />
              <ThemedText type="caption" style={{ color: theme.colors.success, fontWeight: '600' }}>
                {t('common.registered')}
              </ThemedText>
            </View>
          )}
        </View>

        <ThemedText type="title" numberOfLines={2} style={styles.title}>
          {event.title}
        </ThemedText>

        <View style={styles.chipsRow}>
          <DateChip date={event.startDate} compact />
          <RewardChip points={event.ecoPointsReward} />
        </View>

        <View style={styles.footerRow}>
          <LocationBadge
            address={event.location.address ?? ''}
            isVirtual={event.isVirtual}
            style={styles.location}
          />
          <CapacityBadge current={event.currentAttendees} max={event.maxAttendees} />
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Card variant="elevated" padding="none" onPress={onPress} style={containerStyle} testID={testID}>
        {content}
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="none" style={containerStyle} testID={testID}>
      {content}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  imageContainer: {
    aspectRatio: 16 / 9,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    aspectRatio: 16 / 9,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  title: {
    marginVertical: 0,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flex: 1,
  },
});
