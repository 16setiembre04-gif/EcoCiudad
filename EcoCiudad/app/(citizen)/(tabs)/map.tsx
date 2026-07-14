import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

import { MapViewer, type MapPoint, type MapViewerRef } from '@/presentation/components/organisms/map-viewer';
import { MapFilterBar, type MapLayer } from '@/presentation/components/organisms/map-filter-bar';
import { MapPointCard, type MapPointDetail } from '@/presentation/components/organisms/map-point-card';
import { MapLocationPill } from '@/presentation/components/molecules/map-location-pill';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';
import {
  LocationService,
  LocationServiceError,
  type LocationCoordinates,
} from '@/infrastructure/maps';
import { calculateDistance } from '@/infrastructure/maps/geo.utils';
import {
  useReports,
  useEvents,
  useRecyclingCenters,
  useCommunities,
  useTruckLocations,
} from '@/presentation/hooks';
import { logger } from '@/services/logger';
import { REPORT_STATUSES } from '@/constants/report.constants';
import { EVENT_STATUSES } from '@/constants/event.constants';

const LAYER_KEYS = ['reports', 'events', 'recycling', 'communities', 'trucks'] as const;
type LayerKey = (typeof LAYER_KEYS)[number];

const LAYER_COLORS: Record<LayerKey, string> = {
  reports: '#EF4444',
  events: '#8B5CF6',
  recycling: '#22C55E',
  communities: '#3B82F6',
  trucks: '#F59E0B',
};

export default function CitizenMapScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const mapRef = useRef<MapViewerRef>(null);

  const [activeLayers, setActiveLayers] = useState<LayerKey[]>([...LAYER_KEYS]);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<MapPointDetail | null>(null);

  const { data: reports, isLoading: isLoadingReports } = useReports();
  const { data: events, isLoading: isLoadingEvents } = useEvents();
  const { data: centers, isLoading: isLoadingCenters } = useRecyclingCenters({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
  });
  const { data: communities, isLoading: isLoadingCommunities } = useCommunities();
  const { data: trucks, isLoading: isLoadingTrucks } = useTruckLocations();

  const isLoading = isLoadingReports || isLoadingEvents || isLoadingCenters || isLoadingCommunities || isLoadingTrucks;

  const checkPermissionAndLocation = useCallback(async () => {
    try {
      const status = await LocationService.getPermissionStatus();

      if (status === 'granted') {
        const servicesEnabled = await LocationService.checkServicesEnabled();
        if (servicesEnabled) {
          setIsLocating(true);
          const location = await LocationService.getCurrentLocation();
          setUserLocation(location);
        }
      }
    } catch (error) {
      const message = error instanceof LocationServiceError ? error.message : t('common.failedToGetLocation');
      logger.error('[CitizenMap] Location error:', error);
      Alert.alert(t('common.locationPermissionRequired'), message);
    } finally {
      setIsCheckingPermission(false);
      setIsLocating(false);
    }
  }, [t]);

  useEffect(() => {
    checkPermissionAndLocation();
  }, [checkPermissionAndLocation]);

  const handleRetryPermission = useCallback(async () => {
    setIsLocating(true);
    try {
      const status = await LocationService.requestPermission();
      if (status === 'granted') {
        const location = await LocationService.getCurrentLocation();
        setUserLocation(location);
        mapRef.current?.animateToCoordinate(location);
      }
    } catch (error) {
      const message = error instanceof LocationServiceError ? error.message : t('common.failedToGetLocation');
      Alert.alert(t('common.error'), message);
    } finally {
      setIsLocating(false);
    }
  }, [t]);

  const handleRecenterUser = useCallback(async () => {
    if (userLocation) {
      mapRef.current?.animateToCoordinate(userLocation);
      return;
    }

    setIsLocating(true);
    try {
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);
      mapRef.current?.animateToCoordinate(location);
    } catch (error) {
      const message = error instanceof LocationServiceError ? error.message : t('common.failedToGetLocation');
      Alert.alert(t('common.error'), message);
    } finally {
      setIsLocating(false);
    }
  }, [userLocation, t]);

  const toggleLayer = useCallback((key: string) => {
    setActiveLayers((prev) =>
      prev.includes(key as LayerKey)
        ? prev.filter((k) => k !== key)
        : [...prev, key as LayerKey],
    );
    setSelectedPoint(null);
  }, []);

  const activateAllLayers = useCallback(() => {
    setActiveLayers([...LAYER_KEYS]);
    setSelectedPoint(null);
  }, []);

  const distanceTo = useCallback(
    (coordinate: LocationCoordinates): number | undefined => {
      if (!userLocation) return undefined;
      return calculateDistance(userLocation, coordinate);
    },
    [userLocation],
  );

  const reportPoints: MapPoint[] = useMemo(() => {
    if (!activeLayers.includes('reports')) return [];
    return (reports ?? [])
      .filter((r) => r.location?.latitude && r.location?.longitude)
      .map((r) => ({
        id: `report-${r.id}`,
        latitude: r.location.latitude,
        longitude: r.location.longitude,
        title: r.title,
        description: r.location.address ?? t('common.noAddress'),
        icon: 'report',
        color: LAYER_COLORS.reports,
      }));
  }, [reports, activeLayers, t]);

  const eventPoints: MapPoint[] = useMemo(() => {
    if (!activeLayers.includes('events')) return [];
    return (events ?? [])
      .filter((e) => e.location?.latitude && e.location?.longitude && !e.isVirtual)
      .map((e) => ({
        id: `event-${e.id}`,
        latitude: e.location.latitude,
        longitude: e.location.longitude,
        title: e.title,
        description: e.location.address ?? '',
        icon: 'calendar',
        color: LAYER_COLORS.events,
      }));
  }, [events, activeLayers]);

  const centerPoints: MapPoint[] = useMemo(() => {
    if (!activeLayers.includes('recycling')) return [];
    return (centers ?? [])
      .filter((c) => c.latitude && c.longitude)
      .map((c) => ({
        id: `center-${c.id}`,
        latitude: c.latitude,
        longitude: c.longitude,
        title: c.name,
        description: c.address,
        icon: 'recycle',
        color: LAYER_COLORS.recycling,
      }));
  }, [centers, activeLayers]);

  const communityPoints: MapPoint[] = useMemo(() => {
    if (!activeLayers.includes('communities')) return [];
    return (communities ?? [])
      .filter((c) => c.geoLocation?.latitude && c.geoLocation?.longitude)
      .map((c) => ({
        id: `community-${c.id}`,
        latitude: c.geoLocation!.latitude,
        longitude: c.geoLocation!.longitude,
        title: c.name,
        description: c.geoLocation?.address ?? `${c.location?.department ?? ''}, ${c.location?.district ?? ''}`,
        icon: 'community',
        color: LAYER_COLORS.communities,
      }));
  }, [communities, activeLayers]);

  const truckPoints: MapPoint[] = useMemo(() => {
    if (!activeLayers.includes('trucks')) return [];
    return (trucks ?? []).map((t) => ({
      id: `truck-${t.truckId}`,
      latitude: t.latitude,
      longitude: t.longitude,
      title: `Camión ${t.truckId}`,
      description: t.status,
      icon: 'truck',
      color: LAYER_COLORS.trucks,
    }));
  }, [trucks, activeLayers]);

  const allPoints: MapPoint[] = useMemo(
    () => [...reportPoints, ...eventPoints, ...centerPoints, ...communityPoints, ...truckPoints],
    [reportPoints, eventPoints, centerPoints, communityPoints, truckPoints],
  );

  const findReportById = useCallback(
    (id: string) => (reports ?? []).find((r) => r.id === id),
    [reports],
  );
  const findEventById = useCallback(
    (id: string) => (events ?? []).find((e) => e.id === id),
    [events],
  );
  const findCenterById = useCallback(
    (id: string) => (centers ?? []).find((c) => c.id === id),
    [centers],
  );
  const findCommunityById = useCallback(
    (id: string) => (communities ?? []).find((c) => c.id === id),
    [communities],
  );

  const buildPointDetail = useCallback(
    (point: MapPoint): MapPointDetail | null => {
      const coordinate = { latitude: point.latitude, longitude: point.longitude };
      const distanceKm = distanceTo(coordinate);

      if (point.id.startsWith('report-')) {
        const report = findReportById(point.id.replace('report-', ''));
        if (!report) return null;
        const statusKey = report.status === 'in_progress' ? 'in_progress' : report.status;
        const statusConfig = REPORT_STATUSES[statusKey as keyof typeof REPORT_STATUSES];
        return {
          id: report.id,
          type: 'report',
          title: report.title,
          subtitle: report.location.address,
          description: report.description,
          icon: 'report',
          color: LAYER_COLORS.reports,
          coordinate,
          distanceKm,
          meta: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { label: 'Estado', value: statusConfig ? t(statusConfig.labelKey as any) : report.status },
            { label: 'Severidad', value: report.severity ?? 'No especificada' },
            { label: 'Fecha', value: report.createdAt.toLocaleDateString() },
          ],
        };
      }

      if (point.id.startsWith('event-')) {
        const event = findEventById(point.id.replace('event-', ''));
        if (!event) return null;
        const statusConfig = EVENT_STATUSES[event.status];
        return {
          id: event.id,
          type: 'event',
          title: event.title,
          subtitle: event.location.address,
          description: event.description,
          icon: 'calendar',
          color: LAYER_COLORS.events,
          coordinate,
          distanceKm,
          meta: [
            { label: 'Estado', value: statusConfig?.label ?? event.status },
            { label: 'Fecha', value: event.startDate.toLocaleDateString() },
            { label: 'Asistentes', value: `${event.currentAttendees}${event.maxAttendees ? `/${event.maxAttendees}` : ''}` },
          ],
        };
      }

      if (point.id.startsWith('center-')) {
        const center = findCenterById(point.id.replace('center-', ''));
        if (!center) return null;
        return {
          id: center.id,
          type: 'recycling',
          title: center.name,
          subtitle: center.address,
          description: center.description,
          icon: 'recycle',
          color: LAYER_COLORS.recycling,
          coordinate,
          distanceKm,
          meta: [
            { label: 'Materiales', value: center.acceptedMaterials.slice(0, 3).join(', ') },
            { label: 'Calificación', value: center.rating ? `${center.rating.toFixed(1)} ⭐` : 'Sin calificar' },
          ],
        };
      }

      if (point.id.startsWith('community-')) {
        const community = findCommunityById(point.id.replace('community-', ''));
        if (!community) return null;
        return {
          id: community.id,
          type: 'community',
          title: community.name,
          subtitle: community.geoLocation?.address,
          description: community.description,
          icon: 'community',
          color: LAYER_COLORS.communities,
          coordinate,
          distanceKm,
          meta: [
            { label: 'Miembros', value: String(community.memberCount) },
            { label: 'Privacidad', value: community.privacy },
          ],
        };
      }

      if (point.id.startsWith('truck-')) {
        return {
          id: point.id,
          type: 'truck',
          title: point.title ?? 'Camión recolector',
          subtitle: point.description,
          description: 'Seguimiento en tiempo real preparado para futura activación.',
          icon: 'truck',
          color: LAYER_COLORS.trucks,
          coordinate,
          distanceKm,
        };
      }

      return null;
    },
    [findReportById, findEventById, findCenterById, findCommunityById, distanceTo, t],
  );

  const handleMarkerPress = useCallback(
    (point: MapPoint) => {
      const detail = buildPointDetail(point);
      if (detail) {
        setSelectedPoint(detail);
        mapRef.current?.animateToCoordinate(detail.coordinate);
      }
    },
    [buildPointDetail],
  );

  const handleNavigate = useCallback((detail: MapPointDetail) => {
    if (detail.type === 'report') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/(citizen)/report/${detail.id}` as any);
    } else if (detail.type === 'event') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/(citizen)/events/${detail.id}` as any);
    } else if (detail.type === 'recycling') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/(citizen)/recycling/${detail.id}` as any);
    } else if (detail.type === 'community') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/(citizen)/community/${detail.id}` as any);
    } else {
      LocationService.openDirections(detail.coordinate, detail.title);
    }
  }, [router]);

  const handleOpenDirections = useCallback((detail: MapPointDetail) => {
    LocationService.openDirections(detail.coordinate, detail.title);
  }, []);

  const layers: MapLayer[] = useMemo(() => [
      { key: 'reports', label: t('common.reports'), icon: 'report', color: LAYER_COLORS.reports, activeColor: LAYER_COLORS.reports, count: reportPoints.length },
      { key: 'events', label: t('common.events'), icon: 'calendar', color: LAYER_COLORS.events, activeColor: LAYER_COLORS.events, count: eventPoints.length },
      { key: 'recycling', label: t('common.recycling'), icon: 'recycle', color: LAYER_COLORS.recycling, activeColor: LAYER_COLORS.recycling, count: centerPoints.length },
      { key: 'communities', label: t('communities.title'), icon: 'community', color: LAYER_COLORS.communities, activeColor: LAYER_COLORS.communities, count: communityPoints.length },
      { key: 'trucks', label: 'Camiones', icon: 'truck', color: LAYER_COLORS.trucks, activeColor: LAYER_COLORS.trucks, count: truckPoints.length },
    ],
    [reportPoints.length, eventPoints.length, centerPoints.length, communityPoints.length, truckPoints.length, t],
  );

  if (isCheckingPermission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText type="bodySmall" color={theme.colors.textSecondary} style={{ marginTop: spacing.md }}>
            {t('common.loading')}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.mapContainer}>
        <MapViewer
          ref={mapRef}
          points={allPoints}
          userLocation={userLocation ?? undefined}
          onMapPointPress={handleMarkerPress}
          containerStyle={styles.map}
          showUserLocationButton={false}
        />

        <Animated.View entering={FadeIn.delay(200)} style={styles.locationPill}>
          <MapLocationPill
            hasLocation={!!userLocation}
            locationName={userLocation ? t('common.myLocation') : undefined}
            onPress={handleRecenterUser}
            onRetry={handleRetryPermission}
            loading={isLocating}
          />
        </Animated.View>
      </View>

      <Animated.View entering={SlideInDown.delay(100)} style={styles.bottomPanel}>
        <MapFilterBar
          layers={layers}
          activeLayers={activeLayers}
          onToggleLayer={toggleLayer}
          onActivateAll={activateAllLayers}
        />

        <View style={styles.legend}>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {isLoading
              ? t('common.loading')
              : `${allPoints.length} ${allPoints.length === 1 ? 'elemento en el mapa' : 'elementos en el mapa'}`}
          </ThemedText>
          {userLocation && (
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              {t('common.myLocation')}: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </ThemedText>
          )}
        </View>
      </Animated.View>

      <MapPointCard
        point={selectedPoint}
        userLocation={userLocation ?? undefined}
        onClose={() => setSelectedPoint(null)}
        onNavigate={handleNavigate}
        onPressDetail={handleNavigate}
        onOpenDirections={handleOpenDirections}
      />
    </View>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    borderRadius: 0,
  },
  locationPill: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  legend: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
});
