import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, type Region } from 'react-native-maps';
import Animated, { FadeIn } from 'react-native-reanimated';
import { DashboardTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Button } from '@/presentation/components/atoms/button';
import { Input } from '@/presentation/components/atoms/input';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Icon } from '@/presentation/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';
import { type GeoLocation } from '@/domain/entities';

const DEFAULT_REGION: Region = {
  latitude: -25.2637,
  longitude: -57.5759,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapPickerScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { editReportId } = useLocalSearchParams<{ editReportId?: string }>();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<GeoLocation | undefined>();
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const updateLocation = useCallback(async (coords: { latitude: number; longitude: number }) => {
    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      const address = geocode[0]
        ? [geocode[0].street, geocode[0].city, geocode[0].region]
            .filter(Boolean)
            .join(', ')
        : t('common.selectedLocation');

      const newLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        address,
      };

      setLocation(newLocation);
      setRegion((prev) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    } catch {
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: t('common.selectedLocation'),
      });
    }
  }, [t]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.permissionRequired'), t('common.locationPermissionRequired'));
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      await updateLocation(coords);
    } catch {
      Alert.alert(t('common.error'), t('common.failedToGetLocation'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const geocode = await Location.geocodeAsync(searchQuery);
      if (geocode.length === 0) {
        Alert.alert(t('common.error'), t('common.locationNotFound'));
        return;
      }

      await updateLocation({ latitude: geocode[0].latitude, longitude: geocode[0].longitude });
    } catch {
      Alert.alert(t('common.error'), t('common.failedToSearchLocation'));
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMapPress = async (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { coordinate } = e.nativeEvent;
    await updateLocation(coordinate);
  };

  const handleConfirm = () => {
    if (!location) {
      Alert.alert(t('common.error'), t('errors.selectLocation'));
      return;
    }

    if (editReportId) {
      router.navigate({
        pathname: `/(citizen)/report/edit/${editReportId}` as any,
        params: { selectedLocation: JSON.stringify(location) },
      });
    } else {
      router.navigate({
        pathname: '/(citizen)/report/create',
        params: { selectedLocation: JSON.stringify(location) },
      });
    }
  };

  if (loading) {
    return (
      <DashboardTemplate
        header={<Header title={t('common.pickLocation')} onBackPress={() => router.back()} />}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.gettingLocation')}
          </ThemedText>
        </View>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      header={<Header title={t('common.pickLocation')} onBackPress={() => router.back()} />}
    >
      <View style={styles.container}>
        <Animated.View entering={FadeIn} style={styles.content}>
          <View style={styles.searchContainer}>
            <Input
              placeholder={t('common.searchLocation')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              rightIcon={searchLoading ? undefined : 'search'}
              onRightIconPress={searchLoading ? undefined : handleSearch}
            />
          </View>

          <View style={[styles.mapContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton
            >
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  draggable
                  onDragEnd={(e) => updateLocation(e.nativeEvent.coordinate)}
                />
              )}
            </MapView>
          </View>

          {location && (
            <View style={[styles.locationInfo, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Icon name="location" size={20} color={theme.colors.primary} />
              <View style={styles.locationText}>
                <ThemedText type="bodySmall" numberOfLines={2}>
                  {location.address}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </ThemedText>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button variant="outlined" onPress={getCurrentLocation}>
              {t('common.useCurrentLocation')}
            </Button>
            <Button variant="primary" onPress={handleConfirm} disabled={!location}>
              {t('common.confirmLocation')}
            </Button>
          </View>
        </Animated.View>
      </View>
    </DashboardTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  searchContainer: {
    gap: spacing.md,
  },
  mapContainer: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  locationText: {
    flex: 1,
    gap: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
