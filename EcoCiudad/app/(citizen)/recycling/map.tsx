import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { RecyclingCentersLayout } from '@/presentation/components/templates/recycling-centers-layout';
import { Header } from '@/presentation/components/organisms/header';
import { MapViewer, type MapPoint } from '@/presentation/components/organisms/map-viewer';
import { PermissionDenied } from '@/presentation/components/molecules/permission-denied';
import { Chip } from '@/presentation/components/atoms/chip';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Button } from '@/presentation/components/atoms/button';
import { useRecyclingCenters } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { RECYCLING_MATERIALS } from '@/constants/recycling.constants';
import { LocationService, LocationServiceError } from '@/infrastructure/maps';
import { logger } from '@/services/logger';

export default function RecyclingCentersMapScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>();
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined' | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  const { data: centers } = useRecyclingCenters({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    material: selectedMaterial,
  });

  const checkPermissionAndLocation = useCallback(async () => {
    try {
      const status = await LocationService.getPermissionStatus();
      setPermissionStatus(status);

      if (status === 'granted') {
        const location = await LocationService.getCurrentLocation();
        setUserLocation(location);
      }
    } catch (error) {
      logger.error('[RecyclingMap] Error location:', error);
    } finally {
      setIsCheckingPermission(false);
    }
  }, []);

  useEffect(() => {
    checkPermissionAndLocation();
  }, [checkPermissionAndLocation]);

  const handleRetryPermission = useCallback(async () => {
    try {
      const status = await LocationService.requestPermission();
      setPermissionStatus(status);
      if (status === 'granted') {
        const location = await LocationService.getCurrentLocation();
        setUserLocation(location);
      }
    } catch (error) {
      logger.error('[RecyclingMap] Error requesting permission:', error);
    }
  }, []);

  const handleGetCurrentLocation = useCallback(async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      const message = error instanceof LocationServiceError ? error.message : t('common.failedToGetLocation');
      Alert.alert(t('common.error'), message);
    }
  }, [t]);

  const filteredCenters = centers?.filter((center) => {
    if (!selectedMaterial) return true;
    return center.acceptedMaterials.some((m) => m.toLowerCase() === selectedMaterial.toLowerCase());
  }) ?? [];

  const mapPoints: MapPoint[] = filteredCenters.map((center) => ({
    id: center.id,
    latitude: center.latitude,
    longitude: center.longitude,
    title: center.name,
    description: center.address,
    icon: 'recycle',
  }));

  if (isCheckingPermission) {
    return (
      <RecyclingCentersLayout
        header={<Header title={t('common.mapView')} onBackPress={() => router.back()} />}
      >
        <View style={styles.centered}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.loading')}
          </ThemedText>
        </View>
      </RecyclingCentersLayout>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <RecyclingCentersLayout
        header={<Header title={t('common.mapView')} onBackPress={() => router.back()} />}
      >
        <PermissionDenied
          title={t('common.locationPermissionRequired')}
          description={t('common.locationPermissionNearby')}
          onRetry={handleRetryPermission}
        />
      </RecyclingCentersLayout>
    );
  }

  return (
    <RecyclingCentersLayout
      header={<Header title={t('common.mapView')} onBackPress={() => router.back()} />}
    >
      <View style={styles.container}>
        <View style={styles.filtersContainer}>
          <Chip
            variant={selectedMaterial ? 'tonal' : 'filled'}
            size="sm"
            onPress={() => setSelectedMaterial(undefined)}
          >
            {t('common.all')}
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

        <View style={styles.mapWrapper}>
          <MapViewer
            points={mapPoints}
            userLocation={userLocation}
            onMapPointPress={(point) => router.push(`/(citizen)/recycling/${point.id}`)}
            containerStyle={styles.map}
          />
        </View>

        <View style={styles.infoContainer}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.centersFound', { count: filteredCenters.length })}
          </ThemedText>
          {!userLocation && (
            <Button variant="ghost" size="sm" onPress={handleGetCurrentLocation}>
              {t('common.useCurrentLocation')}
            </Button>
          )}
        </View>
      </View>
    </RecyclingCentersLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  mapWrapper: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    borderRadius: 16,
  },
  infoContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
});
