export interface RecyclingCenterDTO {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  opening_hours: Record<string, string>;
  accepted_materials: string[];
  is_verified: boolean;
  rating?: number;
  review_count?: number;
  image_url?: string;
  gallery_images?: string[];
  created_at: string;
  updated_at: string;
}

export interface CenterReviewDTO {
  id: string;
  center_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  images?: string[];
  helpful_count: number;
  user_name: string;
  user_avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface CenterRatingDTO {
  id: string;
  center_id: string;
  user_id: string;
  rating: number;
  created_at: string;
}

export interface CenterFavoriteDTO {
  id: string;
  center_id: string;
  user_id: string;
  created_at: string;
}
