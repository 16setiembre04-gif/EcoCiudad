-- ============================================================================
-- Estabilización del flujo de reportes
-- ============================================================================

-- Añadir valores faltantes al enum de estados usados por operarios y admins.
ALTER TYPE public.report_status ADD VALUE IF NOT EXISTS 'assigned';
ALTER TYPE public.report_status ADD VALUE IF NOT EXISTS 'in_progress';

-- Añadir columnas faltantes en reports que el dominio/DTO ya envían.
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS severity TEXT;

-- ============================================================================
-- Storage para imágenes de reportes
-- ============================================================================

-- Crear bucket público para imágenes de reportes.
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-images', 'report-images', true)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS sobre objects (ya viene habilitado por defecto en Supabase,
-- pero se deja explícito para claridad).
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso al bucket report-images.
-- Para el MVP se permite a usuarios autenticados subir/ver imágenes.
-- La ruta de cada objeto sigue el patrón: "<report_id>/<timestamp>.<ext>".
CREATE POLICY "Authenticated users can upload report images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'report-images');

CREATE POLICY "Authenticated users can read report images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'report-images');

CREATE POLICY "Users can delete images from their own reports"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'report-images'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.reports WHERE reporter_id = auth.uid()
    )
  );
