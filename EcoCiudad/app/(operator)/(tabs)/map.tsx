import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/presentation/components/atoms/text';
import { Header } from '@/presentation/components/organisms/header';
import { MapViewer, type MapPoint } from '@/presentation/components/organisms/map-viewer';
import { PermissionDenied } from '@/presentation/components/molecules/permission-denied';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { useAssignedReports } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { LocationService, LocationServiceError } from '@/infrastructure/maps';
import { logger } from '@/services/logger';

export default function OperatorMapScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined' | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  const { data: reports } = useAssignedReports();

  const checkPermissionAndLocation = useCallback(async () => {
    try {
      const status = await LocationService.getPermissionStatus();
      setPermissionStatus(status);

      if (status === 'granted') {
        const location = await LocationService.getCurrentLocation();
        setUserLocation(location);
      }
    } catch (error) {
      logger.error('[OperatorMap] Error location:', error);
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
      const message = error instanceof LocationServiceError ? error.message : t('common.failedToGetLocation');
      Alert.alert(t('common.error'), message);
    }
  }, [t]);

  const reportsWithLocation = reports?.filter((report) => report.location?.latitude && report.location?.longitude) ?? [];

  const mapPoints: MapPoint[] = reportsWithLocation.map((report) => ({
    id: report.id,
    latitude: report.location.latitude,
    longitude: report.location.longitude,
    title: report.title,
    description: report.location.address ?? t('common.noAddress'),
    icon: 'report',
  }));

  if (isCheckingPermission) {
    return (
      <OperatorLayout
        header={<Header title={t('common.mapView')} onBackPress={() => router.back()} />}
      >
        <View style={styles.centered}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.loading')}
          </ThemedText>
        </View>
      </OperatorLayout>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <OperatorLayout
        header={<Header title={t('common.mapView')} onBackPress={() => router.back()} />}
      >
        <PermissionDenied
          title={t('common.locationPermissionRequired')}
          description={t('common.locationPermissionNeeded')}
          onRetry={handleRetryPermission}
        />
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout
      header={<Header title={t('common.mapView')} onBackPress={() => router.back()} />}
    >
      <View style={styles.container}>
        <MapViewer
          points={mapPoints}
          userLocation={userLocation}
          onMapPointPress={(point) => router.push(`/(operator)/reports/${point.id}`)}
          containerStyle={styles.map}
        />

        <View style={styles.infoContainer}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.assignedReportsCount', { count: reportsWithLocation.length })}
          </ThemedText>
          {userLocation && (
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              {t('common.yourLocation')}: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </ThemedText>
          )}
        </View>
      </View>
    </OperatorLayout>
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
  map: {
    flex: 1,
    margin: spacing.lg,
    borderRadius: 16,
  },
  infoContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
});
