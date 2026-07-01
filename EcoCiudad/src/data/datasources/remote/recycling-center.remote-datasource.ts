import { type SupabaseClient } from '@supabase/supabase-js';
import {
  type RecyclingCenterDTO,
  type CenterReviewDTO,
  type CenterRatingDTO,
} from '../../dto';

export class RecyclingCenterRemoteDataSource {
  constructor(private readonly client: SupabaseClient) {}

  async getAll(filters?: Record<string, unknown>): Promise<RecyclingCenterDTO[]> {
    let query = this.client.from('recycling_centers').select('*');
    if (filters?.material) {
      query = query.contains('accepted_materials', [filters.material as string]);
    }
    if (filters?.verified !== undefined) {
      query = query.eq('is_verified', filters.verified);
    }
    const { data, error } = await query.order('rating', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as RecyclingCenterDTO[];
  }

  async getById(id: string): Promise<RecyclingCenterDTO> {
    const { data, error } = await this.client
      .from('recycling_centers')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as RecyclingCenterDTO;
  }

  async getNearby(latitude: number, longitude: number, radiusKm: number = 10): Promise<RecyclingCenterDTO[]> {
    const { data, error } = await this.client.rpc('get_nearby_recycling_centers', {
      lat: latitude,
      lng: longitude,
      radius_km: radiusKm,
    });
    if (error) {
      console.warn('RPC get_nearby_recycling_centers failed, falling back to basic query:', error.message);
      const { data: fallbackData, error: fallbackError } = await this.client
        .from('recycling_centers')
        .select('*')
        .order('rating', { ascending: false })
        .limit(20);
      if (fallbackError) throw fallbackError;
      return (fallbackData ?? []) as unknown as RecyclingCenterDTO[];
    }
    return (data ?? []) as unknown as RecyclingCenterDTO[];
  }

  async search(query: string): Promise<RecyclingCenterDTO[]> {
    const { data, error } = await this.client
      .from('recycling_centers')
      .select('*')
      .or(`name.ilike.%${query}%,address.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as RecyclingCenterDTO[];
  }

  async getReviews(centerId: string): Promise<CenterReviewDTO[]> {
    const { data, error } = await this.client
      .from('center_reviews')
      .select('*')
      .eq('center_id', centerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as CenterReviewDTO[];
  }

  async addReview(review: Partial<CenterReviewDTO>): Promise<CenterReviewDTO> {
    const { data, error } = await this.client
      .from('center_reviews')
      .insert(review)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as CenterReviewDTO;
  }

  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await this.client
      .from('center_reviews')
      .delete()
      .eq('id', reviewId);
    if (error) throw error;
  }

  async markReviewHelpful(reviewId: string): Promise<void> {
    const { error } = await this.client.rpc('increment_review_helpful', {
      review_id: reviewId,
    });
    if (error) {
      console.warn('RPC increment_review_helpful failed:', error.message);
      throw error;
    }
  }

  async getRating(centerId: string, userId: string): Promise<CenterRatingDTO | null> {
    const { data, error } = await this.client
      .from('center_ratings')
      .select('*')
      .eq('center_id', centerId)
      .eq('user_id', userId)
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data as unknown as CenterRatingDTO;
  }

  async setRating(centerId: string, userId: string, rating: number): Promise<CenterRatingDTO> {
    const existing = await this.getRating(centerId, userId);
    
    if (existing) {
      const { data, error } = await this.client
        .from('center_ratings')
        .update({ rating })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as CenterRatingDTO;
    } else {
      const { data, error } = await this.client
        .from('center_ratings')
        .insert({ center_id: centerId, user_id: userId, rating })
        .select()
        .single();
      if (error) throw error;
      return data as unknown as CenterRatingDTO;
    }
  }

  async toggleFavorite(centerId: string, userId: string): Promise<boolean> {
    const { data: existing, error: checkError } = await this.client
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('target_id', centerId)
      .eq('target_type', 'recycling_center')
      .single();

    if (!checkError && existing) {
      const { error } = await this.client
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      return false;
    } else {
      const { error } = await this.client
        .from('favorites')
        .insert({
          user_id: userId,
          target_id: centerId,
          target_type: 'recycling_center',
        });
      if (error) throw error;
      return true;
    }
  }

  async getFavorites(userId: string): Promise<RecyclingCenterDTO[]> {
    const { data, error } = await this.client
      .from('favorites')
      .select('target_id')
      .eq('user_id', userId)
      .eq('target_type', 'recycling_center');
    if (error) throw error;

    const centerIds = (data ?? []).map((f: any) => f.target_id);
    if (centerIds.length === 0) return [];

    const { data: centers, error: centersError } = await this.client
      .from('recycling_centers')
      .select('*')
      .in('id', centerIds);
    if (centersError) throw centersError;
    return (centers ?? []) as unknown as RecyclingCenterDTO[];
  }

  async isFavorite(centerId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('target_id', centerId)
      .eq('target_type', 'recycling_center')
      .single();
    if (error && error.code === 'PGRST116') return false;
    if (error) throw error;
    return !!data;
  }
}
