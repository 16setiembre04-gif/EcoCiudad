-- ============================================================================
-- Event Images Storage
-- Migration: 012_event_images_storage.sql
-- ============================================================================

-- Create event-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: authenticated users can upload event images
CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-images');

-- Policy: authenticated users can read event images
CREATE POLICY "Authenticated users can read event images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'event-images');

-- Policy: users can delete their own event images
CREATE POLICY "Users can delete event images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-images');

-- ============================================================================
-- COMPLETED
-- ============================================================================
