import { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';


import { DashboardTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Button } from '@/presentation/components/atoms/button';
import { Input } from '@/presentation/components/atoms/input';
import { ThemedText } from '@/presentation/components/atoms/text';
import { MapViewer, type MapViewerRef } from '@/presentation/components/organisms/map-viewer';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';
import { LocationService, LocationServiceError } from '@/infrastructure/maps';
import { type GeoLocation } from '@/domain/entities';
import { useReportDraftStore } from '@/presentation/stores';
import { logger } from '@/services/logger';

export default function MapPickerScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const mapViewerRef = useRef<MapViewerRef>(null);
  const {
    editReportId,
    returnTo,
    initialLatitude,
    initialLongitude,
    initialAddress,
  } = useLocalSearchParams<{
    editReportId?: string;
    returnTo?: 'report-create' | 'report-edit' | 'event-create' | 'community-create' | 'community-edit';
    initialLatitude?: string;
    initialLongitude?: string;
    initialAddress?: string;
  }>();

  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | undefined>(() => {
    if (initialLatitude && initialLongitude) {
      return {
        latitude: parseFloat(initialLatitude),
        longitude: parseFloat(initialLongitude),
        address: initialAddress || t('common.selectedLocation'),
      };
    }
    return undefined;
  });
  const setDraftLocation = useReportDraftStore((s) => s.setLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined' | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  const checkPermission = useCallback(async () => {
    try {
      const status = await LocationService.getPermissionStatus();
      setPermissionStatus(status);
    } catch (error) {
      logger.error('[MapPicker] Error checking permission:', error);
      setPermissionStatus('undetermined');
    } finally {
      setIsCheckingPermission(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const handleRetryPermission = useCallback(async () => {
    try {
      const status = await LocationService.requestPermission();
      setPermissionStatus(status);
    } catch (error) {
      const message = error instanceof LocationServiceError ? error.message : t('common.failedToGetLocation');
      Alert.alert(t('common.locationPermissionRequired'), message);
      setPermissionStatus('denied');
    }
  }, [t]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const results = await LocationService.geocodeAddress(searchQuery);
      if (results.length > 0 && mapViewerRef.current) {
        const first = results[0];
        const placemark = await LocationService.reverseGeocode(first);
        const location = { ...first, address: placemark.formattedAddress };
        setSelectedLocation(location);
        mapViewerRef.current.animateToCoordinate(first);
      }
    } catch (searchError) {
      logger.error('[MapPicker] Search error:', searchError);
      const message = searchError instanceof LocationServiceError ? searchError.message : t('common.failedToGetLocation');
      Alert.alert(t('common.error'), message);
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, t]);

  const handleLocationSelect = useCallback((location: GeoLocation) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedLocation) {
      return;
    }

    const serialized = JSON.stringify(selectedLocation);

    if (returnTo === 'report-edit' && editReportId) {
      router.navigate({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathname: `/(citizen)/report/edit/${editReportId}` as any,
        params: { selectedLocation: serialized },
      });
      return;
    }

    if (returnTo === 'event-create') {
      router.navigate({
        pathname: '/(citizen)/events/create',
        params: { selectedLocation: serialized },
      });
      return;
    }

    if (returnTo === 'community-create') {
      router.navigate({
        pathname: '/(citizen)/community/create',
        params: { selectedLocation: serialized },
      });
      return;
    }

    if (returnTo === 'community-edit' && editReportId) {
      router.navigate({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pathname: `/(citizen)/community/${editReportId}/edit` as any,
        params: { selectedLocation: serialized },
      });
      return;
    }

    // default: report-create
    setDraftLocation(selectedLocation);
    router.back();
  }, [selectedLocation, returnTo, editReportId, router, setDraftLocation]);

  if (isCheckingPermission) {
    return (
      <DashboardTemplate
        header={<Header title={t('common.pickLocation')} onBackPress={() => router.back()} />}
      >
        <View style={styles.centered}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.loading')}
          </ThemedText>
        </View>
      </DashboardTemplate>
    );
  }

  const permissionBlocked = permissionStatus === 'denied';

  return (
    <DashboardTemplate
      header={<Header title={t('common.pickLocation')} onBackPress={() => router.back()} />}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
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

          {permissionBlocked && (
            <View style={[styles.warningBanner, { backgroundColor: theme.colors.errorContainer }]}>
              <ThemedText type="bodySmall" color={theme.colors.error} style={styles.warningText}>
                {t('common.locationPermissionNeeded')}
              </ThemedText>
              <Button
                variant="ghost"
                size="sm"
                onPress={handleRetryPermission}
                textStyle={{ color: theme.colors.error }}
              >
                {t('common.retry')}
              </Button>
            </View>
          )}

          <View style={styles.mapWrapper}>
            <MapViewer
              ref={mapViewerRef}
              selectable
              selectedCoordinate={selectedLocation}
              onLocationSelect={handleLocationSelect}
              showsUserLocation={!permissionBlocked}
              showUserLocationButton={!permissionBlocked}
              containerStyle={styles.mapContainer}
            />
          </View>

          {selectedLocation && (
            <View style={[styles.locationInfo, { backgroundColor: theme.colors.surfaceVariant }]}>
              <ThemedText type="bodySmall" numberOfLines={2}>
                {selectedLocation.address}
              </ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </ThemedText>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              variant="outlined"
              onPress={() => mapViewerRef.current?.getCurrentLocation()}
              style={styles.flexButton}
            >
              {t('common.useCurrentLocation')}
            </Button>
            <Button
              variant="primary"
              onPress={handleConfirm}
              disabled={!selectedLocation}
              style={styles.flexButton}
            >
              {t('common.confirmLocation')}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </DashboardTemplate>
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
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  searchContainer: {
    gap: spacing.md,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  warningText: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
    minHeight: 240,
  },
  mapContainer: {
    borderRadius: borderRadius.lg,
  },
  locationInfo: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  flexButton: {
    flex: 1,
    minWidth: 140,
  },
});
