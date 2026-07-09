import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { RecyclingCentersLayout } from '@/presentation/components/templates/recycling-centers-layout';
import { Header } from '@/presentation/components/organisms/header';
import { NearbyCentersList } from '@/presentation/components/organisms/nearby-centers-list';
import { useCenterFavorites, useToggleCenterFavorite } from '@/presentation/hooks';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';

export default function RecyclingCentersFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: favorites, isLoading } = useCenterFavorites();
  const { mutate: toggleFavorite } = useToggleCenterFavorite();

  const favoriteIds = favorites?.map((c) => c.id) ?? [];

  const handleCenterPress = useCallback((id: string) => {
    router.push(`/(citizen)/recycling/${id}`);
  }, [router]);

  const handleFavoritePress = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  return (
    <RecyclingCentersLayout
      header={
        <Header
          title={t('common.favoriteCenters')}
          onBackPress={() => router.back()}
        />
      }
    >
      <View style={styles.container}>
        <NearbyCentersList
          centers={favorites ?? []}
          isLoading={isLoading}
          favorites={favoriteIds}
          onCenterPress={handleCenterPress}
          onFavoritePress={handleFavoritePress}
          title={t('common.favoriteCenters')}
          horizontal={false}
        />
      </View>
    </RecyclingCentersLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
  },
});
