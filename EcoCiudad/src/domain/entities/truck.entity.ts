export type TruckStatus = 'active' | 'idle' | 'maintenance' | 'offline';

export interface TruckLocation {
  id: string;
  truckId: string;
  routeId?: string;
  latitude: number;
  longitude: number;
  speedKmh?: number;
  heading?: number;
  status: TruckStatus;
  lastSeen: Date;
  updatedAt: Date;
  createdAt: Date;
}

export interface TruckProximityEvent {
  truckId: string;
  distanceMeters: number;
  userLatitude: number;
  userLongitude: number;
  truckLatitude: number;
  truckLongitude: number;
  occurredAt: Date;
}

export interface TruckRoute {
  id: string;
  name: string;
  description?: string;
  schedule?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
