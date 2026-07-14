export interface TruckLocationDTO {
  id: string;
  truck_id: string;
  route_id?: string;
  latitude: number;
  longitude: number;
  speed_kmh?: number;
  heading?: number;
  status: string;
  last_seen: string;
  updated_at: string;
  created_at: string;
}
