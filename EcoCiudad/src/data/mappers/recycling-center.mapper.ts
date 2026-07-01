import {
  type RecyclingCenter,
  type CenterReview,
  type CenterRating,
  type CenterFavorite,
} from '../../domain/entities';
import {
  type RecyclingCenterDTO,
  type CenterReviewDTO,
  type CenterRatingDTO,
  type CenterFavoriteDTO,
} from '../dto';

export class RecyclingCenterMapper {
  static toDomain(dto: RecyclingCenterDTO): RecyclingCenter {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      phone: dto.phone,
      email: dto.email,
      website: dto.website,
      openingHours: dto.opening_hours ?? {},
      acceptedMaterials: dto.accepted_materials ?? [],
      isVerified: dto.is_verified,
      rating: dto.rating,
      reviewCount: dto.review_count,
      imageUrl: dto.image_url,
      galleryImages: dto.gallery_images,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDto(entity: RecyclingCenter): RecyclingCenterDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      latitude: entity.latitude,
      longitude: entity.longitude,
      phone: entity.phone,
      email: entity.email,
      website: entity.website,
      opening_hours: entity.openingHours,
      accepted_materials: entity.acceptedMaterials,
      is_verified: entity.isVerified,
      rating: entity.rating,
      review_count: entity.reviewCount,
      image_url: entity.imageUrl,
      gallery_images: entity.galleryImages,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}

export class CenterReviewMapper {
  static toDomain(dto: CenterReviewDTO): CenterReview {
    return {
      id: dto.id,
      centerId: dto.center_id,
      userId: dto.user_id,
      rating: dto.rating,
      comment: dto.comment,
      images: dto.images,
      helpfulCount: dto.helpful_count,
      userName: dto.user_name,
      userAvatar: dto.user_avatar,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDto(entity: CenterReview): CenterReviewDTO {
    return {
      id: entity.id,
      center_id: entity.centerId,
      user_id: entity.userId,
      rating: entity.rating,
      comment: entity.comment,
      images: entity.images,
      helpful_count: entity.helpfulCount,
      user_name: entity.userName,
      user_avatar: entity.userAvatar,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}

export class CenterRatingMapper {
  static toDomain(dto: CenterRatingDTO): CenterRating {
    return {
      id: dto.id,
      centerId: dto.center_id,
      userId: dto.user_id,
      rating: dto.rating,
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(entity: CenterRating): CenterRatingDTO {
    return {
      id: entity.id,
      center_id: entity.centerId,
      user_id: entity.userId,
      rating: entity.rating,
      created_at: entity.createdAt.toISOString(),
    };
  }
}

export class CenterFavoriteMapper {
  static toDomain(dto: CenterFavoriteDTO): CenterFavorite {
    return {
      id: dto.id,
      centerId: dto.center_id,
      userId: dto.user_id,
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(entity: CenterFavorite): CenterFavoriteDTO {
    return {
      id: entity.id,
      center_id: entity.centerId,
      user_id: entity.userId,
      created_at: entity.createdAt.toISOString(),
    };
  }
}
