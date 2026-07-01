import { View, Image, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { EventBadge } from '@/components/atoms/event-badge';
import { DateChip } from '@/components/atoms/date-chip';
import { TimeChip } from '@/components/atoms/time-chip';
import { RewardChip } from '@/components/atoms/reward-chip';
import { CapacityBadge } from '@/components/atoms/capacity-badge';
import { LocationBadge } from '@/components/atoms/location-badge';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { EVENT_CATEGORIES } from '@/constants/event.constants';
import { type EventHeaderProps } from './types';

export function EventHeader({
  event,
  isFavorite = false,
  isRegistered = false,
  onFavoritePress,
  onSharePress,
  onBackPress,
  style,
}: EventHeaderProps) {
  const theme = useTheme();
  const categoryConfig = EVENT_CATEGORIES[event.category];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        {event.bannerUrl || event.imageUrl ? (
          <Image
            source={{ uri: event.bannerUrl || event.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: categoryConfig.color + '30' }]}>
            <Icon name={categoryConfig.icon} size={48} color={categoryConfig.color} />
          </View>
        )}

        {onBackPress && (
          <Pressable
            style={styles.backButton}
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="arrow-left" size={20} color={theme.colors.onPrimary} />
          </Pressable>
        )}

        <View style={styles.topActions}>
          {onFavoritePress && (
            <Pressable
              style={styles.actionButton}
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
          {onSharePress && (
            <Pressable
              style={styles.actionButton}
              onPress={onSharePress}
              accessibilityRole="button"
              accessibilityLabel="Share event"
            >
              <Icon name="share" size={20} color={theme.colors.onPrimary} />
            </Pressable>
          )}
        </View>

        <View style={styles.bottomOverlay}>
          <EventBadge status={event.status} />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.categoryRow}>
          <Icon name={categoryConfig.icon} size={16} color={categoryConfig.color} />
          <ThemedText type="bodySmall" style={{ color: categoryConfig.color, fontWeight: '600' }}>
            {categoryConfig.label}
          </ThemedText>
        </View>

        <ThemedText type="headline">{event.title}</ThemedText>

        <View style={styles.chipsRow}>
          <DateChip date={event.startDate} />
          <TimeChip startTime={event.startDate} endTime={event.endDate} />
        </View>

        <View style={styles.infoRow}>
          <LocationBadge address={event.location.address} isVirtual={event.isVirtual} />
          <View style={styles.rightInfo}>
            <CapacityBadge current={event.currentAttendees} max={event.maxAttendees} />
            <RewardChip points={event.ecoPointsReward} />
          </View>
        </View>

        {isRegistered && (
          <View style={[styles.registeredBanner, { backgroundColor: theme.colors.success + '15' }]}>
            <Icon name="check" size={16} color={theme.colors.success} />
            <ThemedText type="bodySmall" style={{ color: theme.colors.success, fontWeight: '600' }}>
              You are registered for this event
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  imageContainer: {
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topActions: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rightInfo: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  registeredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
});
