import { Card } from '@/presentation/components/atoms/card';
import { DistanceBadge } from '@/presentation/components/atoms/distance-badge';
import { FavoriteIcon } from '@/presentation/components/atoms/favorite-icon';
import { MaterialChip } from '@/presentation/components/atoms/material-chip';
import { OpenStatus } from '@/presentation/components/atoms/open-status';
import { RatingStars } from '@/presentation/components/atoms/rating-stars';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTranslation } from '@/localization';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
import { type CenterCardProps } from './types';

export function CenterCard({
  center,
  distanceKm,
  isFavorite = false,
  onPress,
  onFavoritePress,
  containerStyle,
  testID,
}: CenterCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card
      variant="elevated"
      padding="md"
      onPress={onPress}
      style={[styles.container, containerStyle]}
      testID={testID}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" numberOfLines={1}>
            {center.name}
          </ThemedText>
          {center.rating && (
            <View style={styles.ratingContainer}>
              <RatingStars rating={center.rating} size="sm" />
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                ({center.reviewCount ?? 0})
              </ThemedText>
            </View>
          )}
        </View>
        <FavoriteIcon
          isFavorite={isFavorite}
          onPress={onFavoritePress}
          size={20}
        />
      </View>

      <View style={styles.statusRow}>
        <OpenStatus openingHours={center.openingHours} />
        {distanceKm !== undefined && <DistanceBadge distanceKm={distanceKm} />}
      </View>

      <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={2}>
        {center.address}
      </ThemedText>

      {center.acceptedMaterials.length > 0 && (
        <View style={styles.materialsContainer}>
          {center.acceptedMaterials.slice(0, 3).map((material) => (
            <MaterialChip key={material} material={material} />
          ))}
          {center.acceptedMaterials.length > 3 && (
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              +{center.acceptedMaterials.length - 3} {t('recycling.moreMaterials')}
            </ThemedText>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
});
