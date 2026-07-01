import { View, Pressable, Image, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { EventBadge } from '@/components/atoms/event-badge';
import { DateChip } from '@/components/atoms/date-chip';
import { RewardChip } from '@/components/atoms/reward-chip';
import { CapacityBadge } from '@/components/atoms/capacity-badge';
import { LocationBadge } from '@/components/atoms/location-badge';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { EVENT_CATEGORIES } from '@/constants/event.constants';
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
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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
              {categoryConfig.label}
            </ThemedText>
          </View>
          {isRegistered && (
            <View style={[styles.registeredBadge, { backgroundColor: theme.colors.success + '20' }]}>
              <Icon name="check" size={12} color={theme.colors.success} />
              <ThemedText type="caption" style={{ color: theme.colors.success, fontWeight: '600' }}>
                Registered
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
            address={event.location.address}
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
    height: 140,
    borderTopLeftRadius: borderRadius.card,
    borderTopRightRadius: borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    height: 140,
    borderTopLeftRadius: borderRadius.card,
    borderTopRightRadius: borderRadius.card,
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
