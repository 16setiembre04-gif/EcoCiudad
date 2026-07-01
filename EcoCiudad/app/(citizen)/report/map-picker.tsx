import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
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
import { type GeoLocation } from '@/domain/entities';

export default function MapPickerScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<GeoLocation | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is required to pick a location');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const address = geocode[0]
        ? `${geocode[0].street}, ${geocode[0].city}`
        : 'Current location';

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const geocode = await Location.geocodeAsync(searchQuery);
      if (geocode.length === 0) {
        Alert.alert('Not found', 'Location not found');
        return;
      }

      const reverseGeocode = await Location.reverseGeocodeAsync(geocode[0]);
      const address = reverseGeocode[0]
        ? `${reverseGeocode[0].street}, ${reverseGeocode[0].city}`
        : searchQuery;

      setLocation({
        latitude: geocode[0].latitude,
        longitude: geocode[0].longitude,
        address,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to search location');
    }
  };

  const handleConfirm = () => {
    if (location) {
      router.back();
    }
  };

  if (loading) {
    return (
      <DashboardTemplate
        header={<Header title="Pick Location" onBackPress={() => router.back()} />}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            Getting your location...
          </ThemedText>
        </View>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      header={<Header title="Pick Location" onBackPress={() => router.back()} />}
    >
      <View style={styles.container}>
        <Animated.View entering={FadeIn} style={styles.content}>
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              rightIcon="search"
              onRightIconPress={handleSearch}
            />
          </View>

          <View style={styles.mapPlaceholder}>
            <Icon name="map" size={64} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Map view placeholder
            </ThemedText>
          </View>

          {location && (
            <View style={styles.locationInfo}>
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
              Use Current Location
            </Button>
            <Button
              variant="primary"
              onPress={handleConfirm}
              disabled={!location}
            >
              Confirm Location
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
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: '#F8FAFC',
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
