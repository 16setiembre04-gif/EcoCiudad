import * as Location from 'expo-location';

import { logger } from '@/services/logger';
import { DEFAULT_MAP_REGION } from './geo.utils';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapRegion extends LocationCoordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface PlacemarkInfo {
  street?: string;
  streetNumber?: string;
  district?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  formattedAddress: string;
}

export interface SelectedLocation extends LocationCoordinates {
  address: string;
}

export type LocationErrorCode =
  | 'PERMISSION_DENIED'
  | 'PERMISSION_UNDETERMINED'
  | 'LOCATION_UNAVAILABLE'
  | 'LOCATION_TIMEOUT'
  | 'GPS_DISABLED'
  | 'NETWORK_ERROR'
  | 'GEOCODING_ERROR'
  | 'UNKNOWN_ERROR';

export class LocationServiceError extends Error {
  constructor(
    public readonly code: LocationErrorCode,
    message: string,
    public readonly canRetry = false,
  ) {
    super(message);
    this.name = 'LocationServiceError';
  }
}

const LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.Balanced,
};

const LOCATION_TIMEOUT_MS = 15000;

async function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new LocationServiceError('LOCATION_TIMEOUT', errorMessage, true));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export const LocationService = {
  /**
   * Verifica si los servicios de ubicación están habilitados (GPS/WiFi).
   */
  async checkServicesEnabled(): Promise<boolean> {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      logger.info('[LocationService] Servicios habilitados:', enabled);
      return enabled;
    } catch (error) {
      logger.error('[LocationService] Error al verificar servicios:', error);
      return false;
    }
  },

  /**
   * Solicita el permiso de ubicación en primer plano.
   */
  async requestPermission(): Promise<Location.PermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      logger.info('[LocationService] Permiso de ubicación:', { status, canAskAgain });
      return status;
    } catch (error) {
      logger.error('[LocationService] Error al solicitar permiso:', error);
      throw new LocationServiceError(
        'PERMISSION_UNDETERMINED',
        'No se pudo determinar el estado del permiso de ubicación.',
        true,
      );
    }
  },

  /**
   * Obtiene el estado actual del permiso sin solicitarlo.
   */
  async getPermissionStatus(): Promise<Location.PermissionStatus> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status;
  },

  /**
   * Obtiene la ubicación actual del usuario con manejo robusto de errores.
   */
  async getCurrentLocation(): Promise<LocationCoordinates> {
    const permissionStatus = await this.getPermissionStatus();

    if (permissionStatus === 'denied') {
      throw new LocationServiceError(
        'PERMISSION_DENIED',
        'El permiso de ubicación fue denegado. Actívalo en la configuración de la aplicación para continuar.',
        false,
      );
    }

    if (permissionStatus === 'undetermined') {
      const requestedStatus = await this.requestPermission();
      if (requestedStatus !== 'granted') {
        throw new LocationServiceError(
          'PERMISSION_DENIED',
          'Se necesita permiso de ubicación para usar esta función.',
          false,
        );
      }
    }

    const servicesEnabled = await this.checkServicesEnabled();
    if (!servicesEnabled) {
      throw new LocationServiceError(
        'GPS_DISABLED',
        'El GPS o los servicios de ubicación están desactivados. Actívalos para continuar.',
        true,
      );
    }

    try {
      const position = await withTimeout(
        Location.getCurrentPositionAsync(LOCATION_OPTIONS),
        LOCATION_TIMEOUT_MS,
        'No se pudo obtener la ubicación a tiempo. Reintentar.',
      );

      logger.info('[LocationService] Ubicación obtenida:', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      if (error instanceof LocationServiceError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      logger.error('[LocationService] Error obteniendo ubicación:', error);

      if (message.toLowerCase().includes('network')) {
        throw new LocationServiceError(
          'NETWORK_ERROR',
          'Error de red al obtener la ubicación. Verifica tu conexión a internet.',
          true,
        );
      }

      throw new LocationServiceError(
        'LOCATION_UNAVAILABLE',
        'No se pudo obtener tu ubicación. Asegúrate de tener buena señal GPS.',
        true,
      );
    }
  },

  /**
   * Realiza geocodificación de una dirección a coordenadas usando Nominatim (OSM).
   * No depende de los servicios de geocodificación de Google/Apple.
   */
  async geocodeAddress(address: string): Promise<LocationCoordinates[]> {
    if (!address.trim()) {
      throw new LocationServiceError('GEOCODING_ERROR', 'Ingresa una dirección para buscar.', false);
    }

    try {
      const encoded = encodeURIComponent(address.trim());
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=5`;

      const response = await withTimeout(
        fetch(url, {
          headers: {
            'User-Agent': 'EcoCiudadApp/1.0 (university-demo)',
            Accept: 'application/json',
          },
        }),
        LOCATION_TIMEOUT_MS,
        'La búsqueda de dirección tardó demasiado. Inténtalo de nuevo.',
      );

      if (!response.ok) {
        throw new LocationServiceError(
          'GEOCODING_ERROR',
          'El servicio de búsqueda no está disponible en este momento.',
          true,
        );
      }

      const data = (await response.json()) as Array<{ lat: string; lon: string; display_name?: string }>;

      if (!data || data.length === 0) {
        throw new LocationServiceError(
          'GEOCODING_ERROR',
          'No se encontró ninguna ubicación para esa dirección.',
          true,
        );
      }

      return data.map((item) => ({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
    } catch (error) {
      if (error instanceof LocationServiceError) throw error;
      logger.error('[LocationService] Error de geocodificación:', error);
      throw new LocationServiceError(
        'GEOCODING_ERROR',
        'No se pudo buscar la dirección. Verifica tu conexión a internet.',
        true,
      );
    }
  },

  /**
   * Realiza geocodificación inversa de coordenadas a dirección usando Nominatim (OSM).
   */
  async reverseGeocode({ latitude, longitude }: LocationCoordinates): Promise<PlacemarkInfo> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      const response = await withTimeout(
        fetch(url, {
          headers: {
            'User-Agent': 'EcoCiudadApp/1.0 (university-demo)',
            Accept: 'application/json',
          },
        }),
        LOCATION_TIMEOUT_MS,
        'La búsqueda de dirección tardó demasiado.',
      );

      if (!response.ok) {
        return { formattedAddress: 'Ubicación seleccionada' };
      }

      const data = (await response.json()) as {
        display_name?: string;
        address?: {
          road?: string;
          house_number?: string;
          suburb?: string;
          city?: string;
          town?: string;
          village?: string;
          state?: string;
          country?: string;
          postcode?: string;
        };
      };

      const address = data.address;
      const formattedAddress = data.display_name || 'Ubicación seleccionada';

      return {
        street: address?.road ?? undefined,
        streetNumber: address?.house_number ?? undefined,
        district: address?.suburb ?? undefined,
        city: address?.city ?? address?.town ?? address?.village ?? undefined,
        region: address?.state ?? undefined,
        country: address?.country ?? undefined,
        postalCode: address?.postcode ?? undefined,
        formattedAddress,
      };
    } catch (error) {
      if (error instanceof LocationServiceError) throw error;
      logger.error('[LocationService] Error de reverse geocoding:', error);
      return { formattedAddress: 'Ubicación seleccionada' };
    }
  },

  /**
   * Abre direcciones hacia un destino usando OpenStreetMap (web) o un intent geo: en Android.
   * No depende de Google Maps.
   */
  async openDirections(destination: LocationCoordinates, label?: string): Promise<void> {
    const { openURL } = await import('expo-linking');
    const { Platform } = await import('react-native');
    const query = `${destination.latitude},${destination.longitude}`;
    const labelParam = label ? ` (${encodeURIComponent(label)})` : '';

    const url = Platform.OS === 'android'
      ? `geo:${query}?q=${query}${labelParam}`
      : `https://www.openstreetmap.org/directions?to=${destination.latitude}%2C${destination.longitude}`;

    try {
      const supported = await openURL(url);
      if (!supported) {
        throw new LocationServiceError('UNKNOWN_ERROR', 'No se pudo abrir la aplicación de mapas.', true);
      }
    } catch (error) {
      logger.error('[LocationService] Error abriendo direcciones:', error);
      throw new LocationServiceError(
        'UNKNOWN_ERROR',
        'No se pudo abrir las direcciones. Asegúrate de tener una app de mapas instalada.',
        true,
      );
    }
  },

  /**
   * Calcula una region del mapa centrada en coordenadas con un delta ajustable.
   */
  getRegionForCoordinates(coordinates: LocationCoordinates[], padding = 1.5): MapRegion {
    if (!coordinates.length) {
      return DEFAULT_MAP_REGION;
    }

    const minLat = Math.min(...coordinates.map((c) => c.latitude));
    const maxLat = Math.max(...coordinates.map((c) => c.latitude));
    const minLng = Math.min(...coordinates.map((c) => c.longitude));
    const maxLng = Math.max(...coordinates.map((c) => c.longitude));

    const latDelta = (maxLat - minLat) * padding || 0.01;
    const lngDelta = (maxLng - minLng) * padding || 0.01;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  },
};
