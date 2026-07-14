-- ============================================================================
-- Smart Map Module
-- Migration: 010_map_module.sql
-- ============================================================================

-- ============================================================================
-- COMMUNITIES GEOLOCATION
-- ============================================================================

ALTER TABLE public.communities
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS address TEXT;

CREATE INDEX IF NOT EXISTS idx_communities_location
  ON public.communities USING gist (ll_to_earth(latitude, longitude))
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================================
-- TRUCK LOCATIONS (prepared for future real-time tracking)
-- ============================================================================

CREATE TYPE truck_status AS ENUM ('active', 'idle', 'maintenance', 'offline');

CREATE TABLE public.truck_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  truck_id TEXT NOT NULL UNIQUE,
  route_id UUID,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed_kmh DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  status truck_status NOT NULL DEFAULT 'offline',
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_truck_locations_truck_id ON public.truck_locations(truck_id);
CREATE INDEX idx_truck_locations_route_id ON public.truck_locations(route_id);
CREATE INDEX idx_truck_locations_status ON public.truck_locations(status);
CREATE INDEX idx_truck_locations_location
  ON public.truck_locations USING gist (ll_to_earth(latitude, longitude));

-- Update timestamp trigger
CREATE TRIGGER update_truck_locations_updated_at
  BEFORE UPDATE ON public.truck_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE public.truck_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Truck locations are viewable by authenticated users"
  ON public.truck_locations FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- COMPLETED
-- ============================================================================
