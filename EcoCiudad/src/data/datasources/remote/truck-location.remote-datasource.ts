import { supabase } from '@/infrastructure/database/supabase.client';
import { TruckLocationDTO } from '@/data/dto/truck-location.dto';

export class TruckLocationRemoteDataSource {
  async getTruckLocations(): Promise<TruckLocationDTO[]> {
    const { data, error } = await supabase
      .from('truck_locations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTruckLocationById(truckId: string): Promise<TruckLocationDTO | null> {
    const { data, error } = await supabase
      .from('truck_locations')
      .select('*')
      .eq('truck_id', truckId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async getTruckLocationsByRoute(routeId: string): Promise<TruckLocationDTO[]> {
    const { data, error } = await supabase
      .from('truck_locations')
      .select('*')
      .eq('route_id', routeId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
