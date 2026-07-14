import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  Map,
  Camera,
  Marker,
  GeoJSONSource,
  Layer,
  type MapRef as MLMapRef,
  type CameraRef,
  type LngLat,
  type StyleSpecification,
  type PressEvent,
} from '@maplibre/maplibre-react-native';

import { Icon, type IconName } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Button } from '@/presentation/components/atoms/button';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import {
  LocationService,
  LocationServiceError,
  type LocationCoordinates,
  type MapRegion,
} from '@/infrastructure/maps';
import { logger } from '@/services/logger';

export interface MapPoint extends LocationCoordinates {
  id: string;
  title?: string;
  description?: string;
  color?: string;
  icon?: IconName;
}

export interface MapViewerProps {
  selectable?: boolean;
  selectedCoordinate?: LocationCoordinates;
  points?: MapPoint[];
  activePointId?: string;
  showsUserLocation?: boolean;
  followUserLocation?: boolean;
  showUserLocationButton?: boolean;
  initialRegion?: MapRegion;
  routeCoordinates?: LocationCoordinates[];
  routeColor?: string;
  height?: number;
  userLocation?: LocationCoordinates;
  onLocationSelect?: (location: LocationCoordinates & { address: string }) => void;
  onMapPointPress?: (point: MapPoint) => void;
  onRegionChange?: (region: MapRegion) => void;
  emptyMessage?: string;
  containerStyle?: import('react-native').ViewStyle;
}

export interface MapViewerRef {
  animateToCoordinate: (coordinate: LocationCoordinates) => void;
  animateToRegion: (region: MapRegion) => void;
  fitToPoints: (padding?: number) => void;
  getCurrentLocation: () => Promise<LocationCoordinates>;
}

const CHIMBOTE_REGION: MapRegion = {
  latitude: -9.0747,
  longitude: -78.5936,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors, © CARTO',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

function toLngLat(coordinate: LocationCoordinates): LngLat {
  return [coordinate.longitude, coordinate.latitude];
}

function deltaToZoom(latitudeDelta: number): number {
  const clamped = Math.max(0.0001, Math.min(180, latitudeDelta));
  const zoom = Math.log2(360 / clamped);
  return Math.max(2, Math.min(20, zoom));
}

function regionToCameraStop(region: MapRegion) {
  return {
    center: toLngLat(region),
    zoom: deltaToZoom(region.latitudeDelta),
  };
}

function coordinatesToBounds(coordinates: LocationCoordinates[]): [number, number, number, number] {
  const lats = coordinates.map((c) => c.latitude);
  const lngs = coordinates.map((c) => c.longitude);
  return [
    Math.min(...lngs),
    Math.min(...lats),
    Math.max(...lngs),
    Math.max(...lats),
  ];
}

function buildRouteGeoJson(coordinates: LocationCoordinates[]) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: coordinates.map(toLngLat),
    },
  };
}

interface MapMarkerProps {
  point: MapPoint;
  isActive?: boolean;
  onPress?: (point: MapPoint) => void;
}

function MapMarker({ point, isActive, onPress }: MapMarkerProps) {
  const theme = useTheme();
  const size = isActive ? 44 : 36;
  const iconSize = isActive ? 24 : 20;
  const backgroundColor = point.color || theme.colors.primary;

  return (
    <Marker
      id={point.id}
      lngLat={toLngLat(point)}
      anchor="center"
      onPress={onPress ? () => onPress(point) : undefined}
    >
      <View
        style={[
          styles.markerContainer,
          {
            width: size,
            height: size,
            backgroundColor,
            borderRadius: size / 2,
            borderColor: theme.colors.surface,
            shadowColor: '#000000',
          },
        ]}
      >
        <Icon name={point.icon ?? 'map-pin'} size={iconSize} color={theme.colors.onPrimary} />
      </View>
    </Marker>
  );
}

function MapViewerComponent(
  {
    selectable = false,
    selectedCoordinate,
    points = [],
    activePointId,
    showsUserLocation = true,
    followUserLocation = false,
    showUserLocationButton = true,
    initialRegion,
    routeCoordinates,
    routeColor,
    height,
    userLocation: externalUserLocation,
    onLocationSelect,
    onMapPointPress,
    onRegionChange,
    emptyMessage,
    containerStyle,
  }: MapViewerProps,
  ref: React.ForwardedRef<MapViewerRef>,
) {
  const theme = useTheme();
  const { t } = useTranslation();
  const mapRef = useRef<MLMapRef>(null);
  const cameraRef = useRef<CameraRef>(null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(externalUserLocation ?? null);
  const [selectedPoint, setSelectedPoint] = useState<LocationCoordinates | undefined>(selectedCoordinate);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const initialCamera = useMemo(
    () => regionToCameraStop(initialRegion || CHIMBOTE_REGION),
    [initialRegion],
  );

  useEffect(() => {
    if (selectedCoordinate) {
      setSelectedPoint(selectedCoordinate);
      cameraRef.current?.flyTo({
        center: toLngLat(selectedCoordinate),
        zoom: 16,
        duration: 300,
      });
    }
  }, [selectedCoordinate]);

  useEffect(() => {
    if (externalUserLocation) {
      setUserLocation(externalUserLocation);
    }
  }, [externalUserLocation]);

  useEffect(() => {
    if (followUserLocation && userLocation) {
      cameraRef.current?.flyTo({
        center: toLngLat(userLocation),
        zoom: 16,
        duration: 500,
      });
    }
  }, [followUserLocation, userLocation]);

  useImperativeHandle(
    ref,
    () => ({
      animateToCoordinate: (coordinate) => {
        cameraRef.current?.flyTo({
          center: toLngLat(coordinate),
          zoom: 16,
          duration: 500,
        });
      },
      animateToRegion: (region) => {
        cameraRef.current?.flyTo({
          ...regionToCameraStop(region),
          duration: 500,
        });
      },
      fitToPoints: (padding = 40) => {
        const allPoints: LocationCoordinates[] = [];
        if (selectedPoint) allPoints.push(selectedPoint);
        if (userLocation) allPoints.push(userLocation);
        points.forEach((p) => allPoints.push(p));

        if (allPoints.length === 0) return;
        if (allPoints.length === 1) {
          cameraRef.current?.flyTo({
            center: toLngLat(allPoints[0]),
            zoom: 16,
            duration: 500,
          });
          return;
        }

        cameraRef.current?.fitBounds(coordinatesToBounds(allPoints), {
          padding: { top: padding, right: padding, bottom: padding, left: padding },
          duration: 500,
        });
      },
      getCurrentLocation: async () => {
        const location = await LocationService.getCurrentLocation();
        setUserLocation(location);

        cameraRef.current?.flyTo({
          center: toLngLat(location),
          zoom: 16,
          duration: 500,
        });

        if (selectable) {
          setSelectedPoint(location);
          try {
            const placemark = await LocationService.reverseGeocode(location);
            setSelectedAddress(placemark.formattedAddress);
            onLocationSelect?.({ ...location, address: placemark.formattedAddress });
          } catch {
            setSelectedAddress(t('common.selectedLocation'));
            onLocationSelect?.({ ...location, address: t('common.selectedLocation') });
          }
        }

        return location;
      },
    }),
    [selectedPoint, userLocation, points, selectable, onLocationSelect, t],
  );

  const handleGetCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);

      cameraRef.current?.flyTo({
        center: toLngLat(location),
        zoom: 16,
        duration: 500,
      });

      if (selectable) {
        setSelectedPoint(location);
        const placemark = await LocationService.reverseGeocode(location);
        setSelectedAddress(placemark.formattedAddress);
        onLocationSelect?.({ ...location, address: placemark.formattedAddress });
      }
    } catch (error) {
      const message = error instanceof LocationServiceError ? error.message : t('common.failedToGetLocation');
      setLocationError(message);
      logger.error('[MapViewer] Error obteniendo ubicación:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  }, [onLocationSelect, selectable, t]);

  const handleMapPress = useCallback(
    async (event: { nativeEvent: PressEvent }) => {
      if (!selectable) return;

      const [longitude, latitude] = event.nativeEvent.lngLat;
      const coordinate = { latitude, longitude };
      setSelectedPoint(coordinate);
      setLocationError(null);

      try {
        const placemark = await LocationService.reverseGeocode(coordinate);
        setSelectedAddress(placemark.formattedAddress);
        onLocationSelect?.({ ...coordinate, address: placemark.formattedAddress });
      } catch {
        setSelectedAddress(t('common.selectedLocation'));
        onLocationSelect?.({ ...coordinate, address: t('common.selectedLocation') });
      }
    },
    [onLocationSelect, selectable, t],
  );

  const handleMarkerPress = useCallback(
    (point: MapPoint) => {
      onMapPointPress?.(point);
    },
    [onMapPointPress],
  );

  const handleRegionDidChange = useCallback(
    (event: { nativeEvent: { center: LngLat; zoom: number } }) => {
      const [longitude, latitude] = event.nativeEvent.center;
      const zoom = event.nativeEvent.zoom;
      const delta = 360 / Math.pow(2, zoom);
      onRegionChange?.({
        latitude,
        longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      });
    },
    [onRegionChange],
  );

  const showEmptyState = !selectable && points.length === 0 && !selectedCoordinate && !selectedPoint;

  const routeFeature = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length < 2) return null;
    return buildRouteGeoJson(routeCoordinates);
  }, [routeCoordinates]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }, containerStyle]}>
      {showEmptyState ? (
        <View style={styles.placeholder}>
          <Icon name="map" size={64} color={theme.colors.textSecondary} />
          <ThemedText type="title" color={theme.colors.textSecondary} style={styles.centeredText}>
            {t('common.mapView')}
          </ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary} style={styles.centeredText}>
            {emptyMessage || t('common.noCentersNearby')}
          </ThemedText>
        </View>
      ) : (
        <>
          <Map
            ref={mapRef}
            style={[styles.map, height ? { height } : undefined]}
            mapStyle={OSM_STYLE}
            onPress={handleMapPress}
            onRegionDidChange={handleRegionDidChange}
            onDidFinishLoadingMap={() => {
              setMapLoadError(null);
              logger.info('[MapViewer] Map style loaded successfully');
            }}
            onDidFailLoadingMap={(event) => {
              const message = (event as unknown as { nativeEvent?: { error?: string } }).nativeEvent?.error ?? t('common.failedToLoadMap');
              setMapLoadError(message);
              logger.error('[MapViewer] Failed to load map style:', message);
            }}
            attribution
            logo={false}
            compass
            scaleBar
            androidView="texture"
          >
            <Camera ref={cameraRef} initialViewState={initialCamera} />

            {selectable && selectedPoint && (
              <Marker id="selected" lngLat={toLngLat(selectedPoint)} anchor="center">
                <View
                  style={[
                    styles.markerContainer,
                    {
                      width: 44,
                      height: 44,
                      backgroundColor: theme.colors.primary,
                      borderRadius: 22,
                      borderColor: theme.colors.surface,
                      shadowColor: '#000000',
                    },
                  ]}
                >
                  <Icon name="map-pin" size={24} color={theme.colors.onPrimary} />
                </View>
              </Marker>
            )}

            {!selectable && selectedCoordinate && (
              <Marker id="selected" lngLat={toLngLat(selectedCoordinate)} anchor="center">
                <View
                  style={[
                    styles.markerContainer,
                    {
                      width: 44,
                      height: 44,
                      backgroundColor: theme.colors.primary,
                      borderRadius: 22,
                      borderColor: theme.colors.surface,
                      shadowColor: '#000000',
                    },
                  ]}
                >
                  <Icon name="map-pin" size={24} color={theme.colors.onPrimary} />
                </View>
              </Marker>
            )}

            {showsUserLocation && userLocation && (
              <Marker id="user-location" lngLat={toLngLat(userLocation)} anchor="center">
                <View
                  style={[
                    styles.userLocationOuter,
                    { borderColor: theme.colors.primary },
                  ]}
                >
                  <View style={[styles.userLocationInner, { backgroundColor: theme.colors.primary }]} />
                </View>
              </Marker>
            )}

            {points.map((point) => (
              <MapMarker
                key={point.id}
                point={point}
                isActive={activePointId === point.id}
                onPress={handleMarkerPress}
              />
            ))}

            {routeFeature && (
              <GeoJSONSource id="route" data={routeFeature}>
                <Layer
                  id="route-line"
                  type="line"
                  source="route"
                  paint={{
                    'line-color': routeColor || theme.colors.primary,
                    'line-width': 4,
                  }}
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round',
                  }}
                />
              </GeoJSONSource>
            )}
          </Map>

          {showUserLocationButton && (
            <View style={styles.locationButton}>
              <Button
                variant="primary"
                size="sm"
                iconName="locate"
                onPress={handleGetCurrentLocation}
                loading={isLoadingLocation}
                style={styles.roundButton}
              >
                {''}
              </Button>
            </View>
          )}

          {mapLoadError && (
            <View style={[styles.errorBanner, { backgroundColor: theme.colors.errorContainer }]}>
              <Icon name="error" size={16} color={theme.colors.error} />
              <ThemedText
                type="caption"
                color={theme.colors.error}
                style={styles.errorText}
                numberOfLines={3}
              >
                {mapLoadError}
              </ThemedText>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setMapLoadError(null)}
                textStyle={{ color: theme.colors.error }}
              >
                {t('common.ok')}
              </Button>
            </View>
          )}

          {locationError && (
            <View style={[styles.errorBanner, { backgroundColor: theme.colors.errorContainer }]}>
              <Icon name="error" size={16} color={theme.colors.error} />
              <ThemedText
                type="caption"
                color={theme.colors.error}
                style={styles.errorText}
                numberOfLines={3}
              >
                {locationError}
              </ThemedText>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setLocationError(null)}
                textStyle={{ color: theme.colors.error }}
              >
                {t('common.ok')}
              </Button>
            </View>
          )}

          {selectable && selectedAddress ? (
            <View style={[styles.addressBanner, { backgroundColor: theme.colors.surface }]}>
              <Icon name="location" size={16} color={theme.colors.primary} />
              <ThemedText type="bodySmall" style={styles.addressText} numberOfLines={2}>
                {selectedAddress}
              </ThemedText>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

export const MapViewer = forwardRef(MapViewerComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    minHeight: 200,
  },
  map: {
    width: '100%',
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  centeredText: {
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userLocationOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
  roundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBanner: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
  },
  addressBanner: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addressText: {
    flex: 1,
  },
});
