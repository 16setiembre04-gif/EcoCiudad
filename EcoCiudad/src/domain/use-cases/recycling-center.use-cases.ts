import { type RecyclingCenter, type CenterReview, type CenterRating } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from '../repositories/auth.repository';
import { type RecyclingCenterRepository, type RecyclingCenterFilters } from '../repositories/recycling-center.repository';

export class GetRecyclingCentersUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(filters?: RecyclingCenterFilters): Promise<Either<DomainError, RecyclingCenter[]>> {
    return this.repository.getAll(filters);
  }
}

export class GetRecyclingCenterByIdUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(id: string): Promise<Either<DomainError, RecyclingCenter>> {
    return this.repository.getById(id);
  }
}

export class GetNearbyCentersUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(latitude: number, longitude: number, radiusKm?: number): Promise<Either<DomainError, RecyclingCenter[]>> {
    return this.repository.getNearby(latitude, longitude, radiusKm);
  }
}

export class SearchCentersUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(query: string): Promise<Either<DomainError, RecyclingCenter[]>> {
    return this.repository.search(query);
  }
}

export class GetCenterReviewsUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(centerId: string): Promise<Either<DomainError, CenterReview[]>> {
    return this.repository.getReviews(centerId);
  }
}

export class AddCenterReviewUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(review: Omit<CenterReview, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>): Promise<Either<DomainError, CenterReview>> {
    return this.repository.addReview(review);
  }
}

export class DeleteCenterReviewUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(reviewId: string): Promise<Either<DomainError, void>> {
    return this.repository.deleteReview(reviewId);
  }
}

export class MarkReviewHelpfulUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(reviewId: string): Promise<Either<DomainError, void>> {
    return this.repository.markReviewHelpful(reviewId);
  }
}

export class GetCenterRatingUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(centerId: string, userId: string): Promise<Either<DomainError, CenterRating | null>> {
    return this.repository.getRating(centerId, userId);
  }
}

export class SetCenterRatingUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(centerId: string, userId: string, rating: number): Promise<Either<DomainError, CenterRating>> {
    return this.repository.setRating(centerId, userId, rating);
  }
}

export class ToggleCenterFavoriteUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(centerId: string, userId: string): Promise<Either<DomainError, boolean>> {
    return this.repository.toggleFavorite(centerId, userId);
  }
}

export class GetCenterFavoritesUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(userId: string): Promise<Either<DomainError, RecyclingCenter[]>> {
    return this.repository.getFavorites(userId);
  }
}

export class IsCenterFavoriteUseCase {
  constructor(private readonly repository: RecyclingCenterRepository) {}

  async execute(centerId: string, userId: string): Promise<Either<DomainError, boolean>> {
    return this.repository.isFavorite(centerId, userId);
  }
}
