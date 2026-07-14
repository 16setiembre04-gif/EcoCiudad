import { Either } from '@/domain/repositories';
import { TruckLocation } from '@/domain/entities/truck.entity';

export interface ITruckLocationRepository {
  getTruckLocations(): Promise<Either<Error, TruckLocation[]>>;
  getTruckLocationById(truckId: string): Promise<Either<Error, TruckLocation | null>>;
  getTruckLocationsByRoute(routeId: string): Promise<Either<Error, TruckLocation[]>>;
}
