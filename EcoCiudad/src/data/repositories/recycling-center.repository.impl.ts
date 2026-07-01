import { type RecyclingCenter, type CenterReview, type CenterRating } from '../../domain/entities';
import { type DomainError, UnexpectedError, NotFoundError } from '../../domain/errors';
import { type Either, type RecyclingCenterRepository, type RecyclingCenterFilters } from '../../domain/repositories';
import { type RecyclingCenterRemoteDataSource } from '../datasources/remote';
import { RecyclingCenterMapper, CenterReviewMapper, CenterRatingMapper } from '../mappers';

export class RecyclingCenterRepositoryImpl implements RecyclingCenterRepository {
  constructor(private readonly dataSource: RecyclingCenterRemoteDataSource) {}

  async getAll(filters?: RecyclingCenterFilters): Promise<Either<DomainError, RecyclingCenter[]>> {
    try {
      const dtos = await this.dataSource.getAll(filters as Record<string, unknown>);
      return { right: dtos.map(RecyclingCenterMapper.toDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getById(id: string): Promise<Either<DomainError, RecyclingCenter>> {
    try {
      const dto = await this.dataSource.getById(id);
      return { right: RecyclingCenterMapper.toDomain(dto) };
    } catch {
      return { left: new NotFoundError('Recycling center not found') };
    }
  }

  async getNearby(latitude: number, longitude: number, radiusKm?: number): Promise<Either<DomainError, RecyclingCenter[]>> {
    try {
      const dtos = await this.dataSource.getNearby(latitude, longitude, radiusKm);
      return { right: dtos.map(RecyclingCenterMapper.toDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async search(query: string): Promise<Either<DomainError, RecyclingCenter[]>> {
    try {
      const dtos = await this.dataSource.search(query);
      return { right: dtos.map(RecyclingCenterMapper.toDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getReviews(centerId: string): Promise<Either<DomainError, CenterReview[]>> {
    try {
      const dtos = await this.dataSource.getReviews(centerId);
      return { right: dtos.map(CenterReviewMapper.toDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async addReview(review: Omit<CenterReview, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>): Promise<Either<DomainError, CenterReview>> {
    try {
      const dto = CenterReviewMapper.toDto(review as CenterReview);
      const created = await this.dataSource.addReview(dto);
      return { right: CenterReviewMapper.toDomain(created) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async deleteReview(reviewId: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.deleteReview(reviewId);
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async markReviewHelpful(reviewId: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.markReviewHelpful(reviewId);
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getRating(centerId: string, userId: string): Promise<Either<DomainError, CenterRating | null>> {
    try {
      const dto = await this.dataSource.getRating(centerId, userId);
      return { right: dto ? CenterRatingMapper.toDomain(dto) : null };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async setRating(centerId: string, userId: string, rating: number): Promise<Either<DomainError, CenterRating>> {
    try {
      const dto = await this.dataSource.setRating(centerId, userId, rating);
      return { right: CenterRatingMapper.toDomain(dto) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async toggleFavorite(centerId: string, userId: string): Promise<Either<DomainError, boolean>> {
    try {
      const result = await this.dataSource.toggleFavorite(centerId, userId);
      return { right: result };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getFavorites(userId: string): Promise<Either<DomainError, RecyclingCenter[]>> {
    try {
      const dtos = await this.dataSource.getFavorites(userId);
      return { right: dtos.map(RecyclingCenterMapper.toDomain) };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async isFavorite(centerId: string, userId: string): Promise<Either<DomainError, boolean>> {
    try {
      const result = await this.dataSource.isFavorite(centerId, userId);
      return { right: result };
    } catch {
      return { left: new UnexpectedError() };
    }
  }
}
