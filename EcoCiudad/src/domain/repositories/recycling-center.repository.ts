import { type RecyclingCenter, type CenterReview, type CenterRating, type CenterFavorite } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from './auth.repository';

export interface RecyclingCenterFilters {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  material?: string;
  search?: string;
  verified?: boolean;
}

export interface RecyclingCenterRepository {
  getAll(filters?: RecyclingCenterFilters): Promise<Either<DomainError, RecyclingCenter[]>>;
  getById(id: string): Promise<Either<DomainError, RecyclingCenter>>;
  getNearby(latitude: number, longitude: number, radiusKm?: number): Promise<Either<DomainError, RecyclingCenter[]>>;
  search(query: string): Promise<Either<DomainError, RecyclingCenter[]>>;
  
  getReviews(centerId: string): Promise<Either<DomainError, CenterReview[]>>;
  addReview(review: Omit<CenterReview, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>): Promise<Either<DomainError, CenterReview>>;
  deleteReview(reviewId: string): Promise<Either<DomainError, void>>;
  markReviewHelpful(reviewId: string): Promise<Either<DomainError, void>>;
  
  getRating(centerId: string, userId: string): Promise<Either<DomainError, CenterRating | null>>;
  setRating(centerId: string, userId: string, rating: number): Promise<Either<DomainError, CenterRating>>;
  
  toggleFavorite(centerId: string, userId: string): Promise<Either<DomainError, boolean>>;
  getFavorites(userId: string): Promise<Either<DomainError, RecyclingCenter[]>>;
  isFavorite(centerId: string, userId: string): Promise<Either<DomainError, boolean>>;
}
