import { BaseEntity } from './base.entity';

export interface RecyclingCenter extends BaseEntity {
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  openingHours: Record<string, string>;
  acceptedMaterials: string[];
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  galleryImages?: string[];
}

export interface CenterReview extends BaseEntity {
  centerId: string;
  userId: string;
  rating: number;
  comment?: string;
  images?: string[];
  helpfulCount: number;
  userName: string;
  userAvatar?: string;
}

export interface CenterRating {
  id: string;
  centerId: string;
  userId: string;
  rating: number;
  createdAt: Date;
}

export interface CenterFavorite {
  id: string;
  centerId: string;
  userId: string;
  createdAt: Date;
}
