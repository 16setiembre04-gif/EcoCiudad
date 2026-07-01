-- ============================================================================
-- Recycling Centers Module - Database Migration
-- ============================================================================

-- Add new columns to recycling_centers table
ALTER TABLE recycling_centers ADD COLUMN IF NOT EXISTS review_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE recycling_centers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE recycling_centers ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- Create center_reviews table
CREATE TABLE IF NOT EXISTS center_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID NOT NULL REFERENCES recycling_centers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  helpful_count INTEGER NOT NULL DEFAULT 0,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(center_id, user_id)
);

-- Create center_ratings table
CREATE TABLE IF NOT EXISTS center_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID NOT NULL REFERENCES recycling_centers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(center_id, user_id)
);

-- Create indexes for center_reviews
CREATE INDEX IF NOT EXISTS idx_center_reviews_center_id ON center_reviews(center_id);
CREATE INDEX IF NOT EXISTS idx_center_reviews_user_id ON center_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_center_reviews_created_at ON center_reviews(created_at DESC);

-- Create indexes for center_ratings
CREATE INDEX IF NOT EXISTS idx_center_ratings_center_id ON center_ratings(center_id);
CREATE INDEX IF NOT EXISTS idx_center_ratings_user_id ON center_ratings(user_id);

-- Enable RLS on center_reviews and center_ratings
ALTER TABLE center_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for center_reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON center_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create own reviews"
  ON center_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON center_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON center_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for center_ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON center_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can create own ratings"
  ON center_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON center_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON center_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Function to increment review helpful count
CREATE OR REPLACE FUNCTION increment_review_helpful(review_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE center_reviews
  SET helpful_count = helpful_count + 1
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update center rating
CREATE OR REPLACE FUNCTION update_center_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recycling_centers
  SET rating = (
    SELECT AVG(rating)::DECIMAL(2,1)
    FROM center_ratings
    WHERE center_id = NEW.center_id
  ),
  review_count = (
    SELECT COUNT(*)
    FROM center_reviews
    WHERE center_id = NEW.center_id
  )
  WHERE id = NEW.center_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update center rating when rating changes
CREATE TRIGGER on_center_rating_change
  AFTER INSERT OR UPDATE OR DELETE ON center_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_center_rating();

-- Trigger to update center rating when review changes
CREATE TRIGGER on_center_review_change
  AFTER INSERT OR UPDATE OR DELETE ON center_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_center_rating();

-- Function to get nearby recycling centers
CREATE OR REPLACE FUNCTION get_nearby_recycling_centers(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 10
)
RETURNS SETOF recycling_centers AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM recycling_centers
  WHERE (
    6371 * acos(
      cos(radians(lat)) * cos(radians(latitude)) *
      cos(radians(longitude) - radians(lng)) +
      sin(radians(lat)) * sin(radians(latitude))
    )
  ) <= radius_km
  ORDER BY rating DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMPLETED
-- ============================================================================
