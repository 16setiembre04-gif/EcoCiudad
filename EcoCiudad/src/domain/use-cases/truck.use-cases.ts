import { ITruckLocationRepository } from '@/domain/repositories/truck-location.repository';
import { TruckLocation, TruckProximityEvent } from '@/domain/entities/truck.entity';
import { calculateDistance } from '@/infrastructure/maps/geo.utils';
import { type LocationCoordinates } from '@/infrastructure/maps/location.service';

export class GetTruckLocationsUseCase {
  constructor(private repository: ITruckLocationRepository) {}

  async execute() {
    return this.repository.getTruckLocations();
  }
}

export class GetTruckLocationByIdUseCase {
  constructor(private repository: ITruckLocationRepository) {}

  async execute(truckId: string) {
    return this.repository.getTruckLocationById(truckId);
  }
}

export class GetTruckLocationsByRouteUseCase {
  constructor(private repository: ITruckLocationRepository) {}

  async execute(routeId: string) {
    return this.repository.getTruckLocationsByRoute(routeId);
  }
}

/**
 * Preparado para futuro: calcula proximidad entre usuario y camiones.
 * No envia notificaciones; solo devuelve eventos de proximidad ordenados.
 */
export class CalculateTruckProximityUseCase {
  async execute(
    userLocation: LocationCoordinates,
    trucks: TruckLocation[],
    thresholdMeters = 500,
  ): Promise<TruckProximityEvent[]> {
    const events: TruckProximityEvent[] = [];

    trucks.forEach((truck) => {
      const distanceKm = calculateDistance(userLocation, truck);
      const distanceMeters = distanceKm * 1000;

      if (distanceMeters <= thresholdMeters) {
        events.push({
          truckId: truck.truckId,
          distanceMeters: Math.round(distanceMeters),
          userLatitude: userLocation.latitude,
          userLongitude: userLocation.longitude,
          truckLatitude: truck.latitude,
          truckLongitude: truck.longitude,
          occurredAt: new Date(),
        });
      }
    });

    return events.sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}
