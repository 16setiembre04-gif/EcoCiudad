import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, type Region } from 'react-native-maps';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Header } from '@/presentation/components/organisms/header';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { useAssignedReports } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';

export default function OperatorMapScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [region, setRegion] = useState<Region>({
    latitude: -25.2637,
    longitude: -57.5759,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const { data: reports } = useAssignedReports();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.permissionRequired'), t('common.locationPermissionNeeded'));
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(coords);
      setRegion((prev) => ({
        ...prev,
        ...coords,
      }));
    })();
  }, [t]);

  const handleMarkerPress = useCallback((reportId: string) => {
    router.push(`/(operator)/reports/${reportId}`);
  }, [router]);

  const reportsWithLocation = reports?.filter((report) => report.location?.latitude && report.location?.longitude) ?? [];

  return (
    <OperatorLayout
      header={
        <Header
          title={t('common.mapView')}
          onBackPress={() => router.back()}
        />
      }
    >
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {reportsWithLocation.map((report) => (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              title={report.title}
              description={report.location.address ?? t('common.noAddress')}
              onPress={() => handleMarkerPress(report.id)}
            />
          ))}
        </MapView>

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
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
});
