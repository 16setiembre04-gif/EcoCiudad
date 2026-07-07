import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { RecyclingCentersLayout } from '@/presentation/components/templates/recycling-centers-layout';
import { Header } from '@/presentation/components/organisms/header';
import { MapContainer } from '@/presentation/components/organisms/map-container';
import { Chip } from '@/presentation/components/atoms/chip';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useRecyclingCenters } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { RECYCLING_MATERIALS } from '@/constants/recycling.constants';

export default function RecyclingCentersMapScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>();

  const { data: centers } = useRecyclingCenters({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    material: selectedMaterial,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed to show nearby centers');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const filteredCenters = centers?.filter((center) => {
    if (!selectedMaterial) return true;
    return center.acceptedMaterials.some(m => m.toLowerCase() === selectedMaterial.toLowerCase());
  }) ?? [];

  return (
    <RecyclingCentersLayout
      header={
        <Header
          title="Map View"
          onBackPress={() => router.back()}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.filtersContainer}>
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

        <MapContainer
          centers={filteredCenters}
          userLocation={userLocation}
          onMarkerPress={(centerId) => router.push(`/(citizen)/recycling/${centerId}`)}
          style={styles.map}
        />

        <View style={styles.infoContainer}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {filteredCenters.length} center{filteredCenters.length !== 1 ? 's' : ''} found
          </ThemedText>
        </View>
      </View>
    </RecyclingCentersLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  map: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  infoContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
});
