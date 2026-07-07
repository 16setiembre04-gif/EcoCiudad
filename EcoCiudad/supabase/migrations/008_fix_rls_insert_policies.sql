-- ============================================================================
-- Fix: Database error creating new user (HTTP 500)
-- Migration: 008_fix_rls_insert_policies.sql
-- ============================================================================
-- 
-- PROBLEMA:
-- El trigger handle_new_user() falla al insertar en profiles y user_settings
-- porque estas tablas tienen RLS habilitado sin políticas de INSERT.
--
-- SOLUCIÓN:
-- 1. Agregar políticas de INSERT para profiles y user_settings
-- 2. Recrear la función handle_new_user() con search_path = public
-- 3. Agregar manejo de errores robusto
--
-- ============================================================================

-- ============================================================================
-- PASO 1: Eliminar trigger y función existentes
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================================================
-- PASO 2: Agregar políticas de INSERT para profiles
-- ============================================================================

-- Política para permitir INSERT desde el trigger (usando SECURITY DEFINER)
CREATE POLICY "Enable insert for authenticated users only"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Nota: auth.uid() IS NULL permite que el trigger (SECURITY DEFINER) inserte
-- cuando aún no hay un usuario autenticado en la sesión

-- ============================================================================
-- PASO 3: Agregar políticas de INSERT para user_settings
-- ============================================================================

CREATE POLICY "Enable insert for authenticated users only"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- ============================================================================
-- PASO 4: Recrear la función handle_new_user() con mejoras
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display_name_value TEXT;
  role_value TEXT;
BEGIN
  -- Extraer metadata con valores por defecto
  display_name_value := COALESCE(
    NEW.raw_user_meta_data->>'display_name', 
    split_part(NEW.email, '@', 1)
  );
  
  role_value := COALESCE(
    NEW.raw_user_meta_data->>'role', 
    'citizen'
  );

  -- Insertar en profiles con manejo de errores
  BEGIN
    INSERT INTO public.profiles (
      id, 
      email, 
      display_name, 
      role, 
      is_email_verified,
      is_active,
      eco_points,
      level
    )
    VALUES (
      NEW.id,
      NEW.email,
      display_name_value,
      role_value::user_role,
      NEW.email_confirmed_at IS NOT NULL,
      TRUE,
      0,
      1
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG '[handle_new_user] Error inserting into profiles for user %: % - %', 
      NEW.id, SQLERRM, SQLSTATE;
    RAISE EXCEPTION 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;

  -- Insertar en user_settings con manejo de errores
  BEGIN
    INSERT INTO public.user_settings (
      user_id,
      theme,
      language,
      notifications_enabled,
      email_notifications,
      push_notifications,
      location_enabled,
      timezone
    )
    VALUES (
      NEW.id,
      'system',
      'en',
      TRUE,
      TRUE,
      TRUE,
      TRUE,
      'UTC'
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG '[handle_new_user] Error inserting into user_settings for user %: % - %', 
      NEW.id, SQLERRM, SQLSTATE;
    RAISE EXCEPTION 'Failed to create user_settings for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PASO 5: Recrear el trigger
-- ============================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PASO 6: Verificar que todo esté correcto
-- ============================================================================

-- Verificar que el trigger existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) THEN
    RAISE EXCEPTION 'Trigger on_auth_user_created no existe';
  END IF;
  
  RAISE NOTICE '✓ Trigger on_auth_user_created existe';
END $$;

-- Verificar que las políticas de INSERT existen
DO $$
DECLARE
  profiles_insert_count INTEGER;
  settings_insert_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profiles_insert_count
  FROM pg_policies
  WHERE tablename = 'profiles' AND cmd = 'INSERT';
  
  SELECT COUNT(*) INTO settings_insert_count
  FROM pg_policies
  WHERE tablename = 'user_settings' AND cmd = 'INSERT';
  
  IF profiles_insert_count = 0 THEN
    RAISE EXCEPTION 'No hay políticas de INSERT en profiles';
  END IF;
  
  IF settings_insert_count = 0 THEN
    RAISE EXCEPTION 'No hay políticas de INSERT en user_settings';
  END IF;
  
  RAISE NOTICE '✓ Políticas de INSERT existen en profiles y user_settings';
END $$;

-- ============================================================================
-- FIN DEL FIX
-- ============================================================================
