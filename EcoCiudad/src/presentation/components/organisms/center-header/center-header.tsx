import { DistanceBadge } from '@/presentation/components/atoms/distance-badge';
import { FavoriteIcon } from '@/presentation/components/atoms/favorite-icon';
import { Icon } from '@/presentation/components/atoms/icon';
import { NavigationIcon } from '@/presentation/components/atoms/navigation-icon';
import { OpenStatus } from '@/presentation/components/atoms/open-status';
import { RatingStars } from '@/presentation/components/atoms/rating-stars';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { type CenterHeaderProps } from './types';

export function CenterHeader({
  center,
  distanceKm,
  isFavorite = false,
  onFavoritePress,
  onDirectionsPress,
  onCallPress,
  onSharePress,
  onBackPress,
  style,
}: CenterHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        {center.imageUrl ? (
          <Image
            source={{ uri: center.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: theme.colors.primaryLight + '30' }]}>
            <Icon name="recycle" size={48} color={theme.colors.primary} />
          </View>
        )}

        {onBackPress && (
          <Pressable
            style={styles.backButton}
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel={t('common.goBack')}
          >
            <Icon name="arrow-left" size={20} color={theme.colors.onPrimary} />
          </Pressable>
        )}

        <View style={styles.topActions}>
          {onFavoritePress && (
            <View style={styles.actionButton}>
              <FavoriteIcon
                isFavorite={isFavorite}
                onPress={onFavoritePress}
                size={20}
              />
            </View>
          )}
          {onSharePress && (
            <Pressable
              style={styles.actionButton}
              onPress={onSharePress}
              accessibilityRole="button"
              accessibilityLabel={t('common.share')}
            >
              <Icon name="share" size={20} color={theme.colors.onPrimary} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ThemedText type="headline">{center.name}</ThemedText>

        {center.rating && (
          <View style={styles.ratingRow}>
            <RatingStars rating={center.rating} size="md" />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              ({center.reviewCount ?? 0} {t('common.reviews')})
            </ThemedText>
          </View>
        )}

        <View style={styles.statusRow}>
          <OpenStatus openingHours={center.openingHours} />
          {distanceKm !== undefined && <DistanceBadge distanceKm={distanceKm} />}
        </View>

        <ThemedText type="body" color={theme.colors.textSecondary}>
          {center.address}
        </ThemedText>

        <View style={styles.actionsRow}>
          <NavigationIcon onPress={onDirectionsPress} />
          {center.phone && (
            <Pressable
              style={[styles.callButton, { backgroundColor: theme.colors.secondary }]}
              onPress={onCallPress}
              accessibilityRole="button"
              accessibilityLabel={t('common.callCenter')}
            >
              <Icon name="phone" size={24} color={theme.colors.onSecondary} />
            </Pressable>
          )}
        </View>
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
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
