import { Either, left, right } from '@/domain/repositories';
import { TruckLocation } from '@/domain/entities/truck.entity';
import { ITruckLocationRepository } from '@/domain/repositories/truck-location.repository';
import { TruckLocationRemoteDataSource } from '@/data/datasources/remote/truck-location.remote-datasource';
import { TruckLocationMapper } from '@/data/mappers/truck-location.mapper';

export class TruckLocationRepository implements ITruckLocationRepository {
  constructor(private dataSource: TruckLocationRemoteDataSource) {}

  async getTruckLocations(): Promise<Either<Error, TruckLocation[]>> {
    try {
      const dtos = await this.dataSource.getTruckLocations();
      return right(dtos.map(TruckLocationMapper.toDomain));
    } catch (error) {
      return left(error as Error);
    }
  }

  async getTruckLocationById(truckId: string): Promise<Either<Error, TruckLocation | null>> {
    try {
      const dto = await this.dataSource.getTruckLocationById(truckId);
      return right(dto ? TruckLocationMapper.toDomain(dto) : null);
    } catch (error) {
      return left(error as Error);
    }
  }

  async getTruckLocationsByRoute(routeId: string): Promise<Either<Error, TruckLocation[]>> {
    try {
      const dtos = await this.dataSource.getTruckLocationsByRoute(routeId);
      return right(dtos.map(TruckLocationMapper.toDomain));
    } catch (error) {
      return left(error as Error);
    }
  }
}
