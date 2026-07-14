import { type GeoLocation } from '@/domain/entities';
import { type MapRegion } from './location.service';

export const calculateDistance = (from: GeoLocation, to: GeoLocation): number => {
  const R = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => (value * Math.PI) / 180;

export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

export const DEFAULT_MAP_REGION: MapRegion = {
  latitude: -9.0747,
  longitude: -78.5936,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

/**
 * Calcula una region de mapa que abarque todos los puntos dados.
 * Similar a MapView.fitToCoordinates pero sin dependencia del componente.
 */
export const getRegionForCoordinates = (
  coordinates: { latitude: number; longitude: number }[],
  paddingFactor = 1.4,
): MapRegion => {
  if (coordinates.length === 0) return DEFAULT_MAP_REGION;

  const minLat = Math.min(...coordinates.map((c) => c.latitude));
  const maxLat = Math.max(...coordinates.map((c) => c.latitude));
  const minLng = Math.min(...coordinates.map((c) => c.longitude));
  const maxLng = Math.max(...coordinates.map((c) => c.longitude));

  const latDelta = Math.max((maxLat - minLat) * paddingFactor, 0.01);
  const lngDelta = Math.max((maxLng - minLng) * paddingFactor, 0.01);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

/**
 * Ordena coordenadas por proximidad a un punto de origen (Nearest Neighbor).
 * Util para preparar rutas logicas simples.
 */
export const sortByNearestNeighbor = (
  origin: { latitude: number; longitude: number },
  points: { latitude: number; longitude: number; id?: string }[],
): { latitude: number; longitude: number; id?: string }[] => {
  if (points.length === 0) return [];

  const remaining = [...points];
  const route: { latitude: number; longitude: number; id?: string }[] = [];
  let current = origin;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    remaining.forEach((point, index) => {
      const distance = calculateDistance(
        { latitude: current.latitude, longitude: current.longitude },
        { latitude: point.latitude, longitude: point.longitude },
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    const next = remaining.splice(nearestIndex, 1)[0];
    route.push(next);
    current = next;
  }

  return route;
};
