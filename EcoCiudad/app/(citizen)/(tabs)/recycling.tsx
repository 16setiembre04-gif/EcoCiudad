import { useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { RecyclingCentersLayout } from '@/presentation/components/templates/recycling-centers-layout';
import { Header } from '@/presentation/components/organisms/header';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { NearbyCentersList } from '@/presentation/components/organisms/nearby-centers-list';
import { Chip } from '@/presentation/components/atoms/chip';
import { useRecyclingCentersDashboard, useToggleCenterFavorite } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { RECYCLING_MATERIALS } from '@/constants/recycling.constants';

export default function RecyclingCentersHomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>();
  const [showMap, setShowMap] = useState(false);

  const {
    allCenters,
    favorites,
    favoriteIds,
    recommendedCenters,
    isLoading,
  } = useRecyclingCentersDashboard();

  const { mutate: toggleFavorite } = useToggleCenterFavorite();

  const filteredCenters = allCenters.filter((center) => {
    const matchesSearch = !searchQuery ||
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMaterial = !selectedMaterial ||
      center.acceptedMaterials.some(m => m.toLowerCase() === selectedMaterial.toLowerCase());
    return matchesSearch && matchesMaterial;
  });

  const handleCenterPress = useCallback((id: string) => {
    router.push(`/(citizen)/recycling/${id}`);
  }, [router]);

  const handleFavoritePress = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const handleViewAllPress = useCallback(() => {
    router.push('/(citizen)/recycling/favorites');
  }, [router]);

  const handleMapPress = useCallback(() => {
    router.push('/(citizen)/recycling/map');
  }, [router]);

  return (
    <RecyclingCentersLayout
      header={
        <Header
          title="Recycling Centers"
          showBackButton={false}
          rightIcon="map"
          onRightPress={handleMapPress}
        />
      }
    >
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} tintColor={theme.colors.primary} />
        }
      >
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search recycling centers..."
          />
        </View>

        <View style={styles.materialsContainer}>
          <Chip
            variant={selectedMaterial ? 'tonal' : 'filled'}
            size="sm"
            onPress={() => setSelectedMaterial(undefined)}
          >
            All
          </Chip>
          {Object.entries(RECYCLING_MATERIALS).map(([key, config]) => (
            <Chip
              key={key}
              variant={selectedMaterial === key ? 'filled' : 'tonal'}
              size="sm"
              iconName={config.icon}
              onPress={() => setSelectedMaterial(key)}
            >
              {config.label}
            </Chip>
          ))}
        </View>

        <NearbyCentersList
          centers={filteredCenters}
          isLoading={isLoading}
          favorites={favoriteIds}
          onCenterPress={handleCenterPress}
          onFavoritePress={handleFavoritePress}
          title="All Centers"
          horizontal={false}
        />

        {recommendedCenters.length > 0 && (
          <View style={styles.sectionSpacer}>
            <NearbyCentersList
              centers={recommendedCenters}
              favorites={favoriteIds}
              onCenterPress={handleCenterPress}
              onFavoritePress={handleFavoritePress}
              title="Recommended Centers"
              horizontal
            />
          </View>
        )}

        {favorites.length > 0 && (
          <View style={styles.sectionSpacer}>
            <NearbyCentersList
              centers={favorites}
              favorites={favoriteIds}
              onCenterPress={handleCenterPress}
              onFavoritePress={handleFavoritePress}
              title="My Favorites"
              horizontal
              onViewAllPress={handleViewAllPress}
            />
          </View>
        )}
      </Animated.ScrollView>
    </RecyclingCentersLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['5xl'],
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionSpacer: {
    marginTop: spacing.xl,
  },
});
