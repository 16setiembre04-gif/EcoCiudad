import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { CenterCard } from '@/presentation/components/molecules/center-card';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, StyleSheet, View } from 'react-native';
import { type NearbyCentersListProps } from './types';

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function NearbyCentersList({
  centers,
  userLocation,
  isLoading = false,
  favorites = [],
  onCenterPress,
  onFavoritePress,
  onViewAllPress,
  title,
  horizontal = true,
  style,
}: NearbyCentersListProps) {
  const { t } = useTranslation();
  const sectionTitle = title ?? t('recycling.centers');

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={sectionTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
        <View style={horizontal ? styles.skeletonHorizontal : styles.skeletonVertical}>
          {[0, 1, 2].map((i) => (
            <Card key={i} variant="elevated" padding="md" style={horizontal ? styles.skeletonCardH : styles.skeletonCardV}>
              <Skeleton width="100%" height={20} />
              <Skeleton width="60%" height={16} />
              <Skeleton width="80%" height={14} />
            </Card>
          ))}
        </View>
      </View>
    );
  }

  if (centers.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={sectionTitle} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="recycle"
            title={t('recycling.noCentersNearby')}
            description={t('recycling.noCentersArea')}
          />
        </View>
      </View>
    );
  }

  if (horizontal) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={sectionTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
        <FlatList
          data={centers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => {
            const distance = userLocation
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  item.latitude,
                  item.longitude,
                )
              : undefined;

            return (
              <View style={styles.horizontalCard}>
                <CenterCard
                  center={item}
                  distanceKm={distance}
                  isFavorite={favorites.includes(item.id)}
                  onPress={onCenterPress ? () => onCenterPress(item.id) : undefined}
                  onFavoritePress={onFavoritePress ? () => onFavoritePress(item.id) : undefined}
                />
              </View>
            );
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={sectionTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
      <FlatList
        data={centers}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.verticalList}
        renderItem={({ item }) => {
          const distance = userLocation
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                item.latitude,
                item.longitude,
              )
            : undefined;

          return (
            <CenterCard
              center={item}
              distanceKm={distance}
              isFavorite={favorites.includes(item.id)}
              onPress={onCenterPress ? () => onCenterPress(item.id) : undefined}
              onFavoritePress={onFavoritePress ? () => onFavoritePress(item.id) : undefined}
              containerStyle={styles.verticalCard}
            />
          );
        }}
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
    width: 320,
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
    width: 320,
    gap: spacing.sm,
  },
  skeletonCardV: {
    width: '100%',
    gap: spacing.sm,
  },
});
