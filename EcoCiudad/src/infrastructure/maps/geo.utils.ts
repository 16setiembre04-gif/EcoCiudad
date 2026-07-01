import { type GeoLocation } from '@/domain/entities';

export const calculateDistance = (
  from: GeoLocation,
  to: GeoLocation,
): number => {
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

export const DEFAULT_MAP_REGION = {
  latitude: -9.0888,
  longitude: -78.5833,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
