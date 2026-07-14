import { TruckLocation, type TruckStatus } from '@/domain/entities/truck.entity';
import { TruckLocationDTO } from '@/data/dto/truck-location.dto';

export class TruckLocationMapper {
  static toDomain(dto: TruckLocationDTO): TruckLocation {
    return {
      id: dto.id,
      truckId: dto.truck_id,
      routeId: dto.route_id,
      latitude: dto.latitude,
      longitude: dto.longitude,
      speedKmh: dto.speed_kmh,
      heading: dto.heading,
      status: dto.status as TruckStatus,
      lastSeen: new Date(dto.last_seen),
      updatedAt: new Date(dto.updated_at),
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(domain: TruckLocation): TruckLocationDTO {
    return {
      id: domain.id,
      truck_id: domain.truckId,
      route_id: domain.routeId,
      latitude: domain.latitude,
      longitude: domain.longitude,
      speed_kmh: domain.speedKmh,
      heading: domain.heading,
      status: domain.status,
      last_seen: domain.lastSeen.toISOString(),
      updated_at: domain.updatedAt.toISOString(),
      created_at: domain.createdAt.toISOString(),
    };
  }
}
