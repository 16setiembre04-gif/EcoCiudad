-- ============================================================================
-- Fix: Database error creating new user - Versión con Logging Mejorado
-- Migration: 009_fix_handle_new_user_with_logging.sql
-- ============================================================================
-- 
-- OBJETIVO:
-- Este script NO asume que el problema es RLS. En su lugar, recrea la función
-- handle_new_user() con logging detallado para identificar la causa EXACTA
-- del error "Database error creating new user".
--
-- CAMBIOS:
-- 1. Recrear handle_new_user() con SET search_path = public
-- 2. Agregar RAISE NOTICE para logging
-- 3. Agregar manejo de errores con BEGIN...EXCEPTION
-- 4. Validar explícitamente valores NULL
-- 5. Insertar todos los campos requeridos explícitamente
--
-- ============================================================================

-- ============================================================================
-- PASO 1: Eliminar trigger y función existentes
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================================================
-- PASO 2: Recrear la función con logging detallado
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display_name_value TEXT;
  role_value TEXT;
  profile_insert_success BOOLEAN := FALSE;
  settings_insert_success BOOLEAN := FALSE;
BEGIN
  -- Logging: Inicio de la función
  RAISE NOTICE '[handle_new_user] Iniciando para usuario % (%)', NEW.id, NEW.email;
  RAISE NOTICE '[handle_new_user] raw_user_meta_data: %', NEW.raw_user_meta_data;
  RAISE NOTICE '[handle_new_user] email_confirmed_at: %', NEW.email_confirmed_at;

  -- Extraer display_name con manejo de NULL
  IF NEW.raw_user_meta_data IS NULL THEN
    display_name_value := split_part(NEW.email, '@', 1);
    RAISE NOTICE '[handle_new_user] raw_user_meta_data es NULL, usando email prefix: %', display_name_value;
  ELSE
    display_name_value := COALESCE(
      NEW.raw_user_meta_data->>'display_name', 
      split_part(NEW.email, '@', 1)
    );
    RAISE NOTICE '[handle_new_user] display_name extraído: %', display_name_value;
  END IF;

  -- Extraer role con manejo de NULL
  IF NEW.raw_user_meta_data IS NULL THEN
    role_value := 'citizen';
    RAISE NOTICE '[handle_new_user] raw_user_meta_data es NULL, usando role default: %', role_value;
  ELSE
    role_value := COALESCE(
      NEW.raw_user_meta_data->>'role', 
      'citizen'
    );
    RAISE NOTICE '[handle_new_user] role extraído: %', role_value;
  END IF;

  -- Validar que role_value sea un valor válido del ENUM user_role
  IF role_value NOT IN ('citizen', 'operator', 'admin') THEN
    RAISE WARNING '[handle_new_user] role_value "%" no es válido, usando citizen', role_value;
    role_value := 'citizen';
  END IF;

  -- Insertar en profiles con manejo de errores
  RAISE NOTICE '[handle_new_user] Intentando insertar en profiles...';
  BEGIN
    INSERT INTO public.profiles (
      id, 
      email, 
      display_name, 
      role, 
      is_email_verified,
      is_active,
      eco_points,
      level,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      display_name_value,
      role_value::user_role,
      NEW.email_confirmed_at IS NOT NULL,
      TRUE,
      0,
      1,
      NOW(),
      NOW()
    );
    
    profile_insert_success := TRUE;
    RAISE NOTICE '[handle_new_user] Inserción en profiles exitosa';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '[handle_new_user] Error al insertar en profiles: % - %', SQLERRM, SQLSTATE;
    RAISE NOTICE '[handle_new_user] Detalle del error: %', pg_exception_detail;
    RAISE NOTICE '[handle_new_user] Contexto del error: %', pg_exception_context;
    RAISE EXCEPTION '[handle_new_user] Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;

  -- Insertar en user_settings con manejo de errores
  IF profile_insert_success THEN
    RAISE NOTICE '[handle_new_user] Intentando insertar en user_settings...';
    BEGIN
      INSERT INTO public.user_settings (
        user_id,
        theme,
        language,
        notifications_enabled,
        email_notifications,
        push_notifications,
        location_enabled,
        timezone,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        'system',
        'en',
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        'UTC',
        NOW(),
        NOW()
      );
      
      settings_insert_success := TRUE;
      RAISE NOTICE '[handle_new_user] Inserción en user_settings exitosa';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '[handle_new_user] Error al insertar en user_settings: % - %', SQLERRM, SQLSTATE;
      RAISE NOTICE '[handle_new_user] Detalle del error: %', pg_exception_detail;
      RAISE NOTICE '[handle_new_user] Contexto del error: %', pg_exception_context;
      RAISE EXCEPTION '[handle_new_user] Failed to create user_settings for user %: %', NEW.id, SQLERRM;
    END;
  ELSE
    RAISE WARNING '[handle_new_user] Omitiendo inserción en user_settings porque profiles falló';
  END IF;

  -- Logging: Fin de la función
  RAISE NOTICE '[handle_new_user] Completado para usuario % (profiles: %, settings: %)', 
    NEW.id, profile_insert_success, settings_insert_success;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PASO 3: Recrear el trigger
-- ============================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PASO 4: Verificar que todo esté correcto
-- ============================================================================

-- Verificar que el trigger existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
    AND event_object_table = 'users'
  ) THEN
    RAISE EXCEPTION 'Trigger on_auth_user_created no existe en auth.users';
  END IF;
  
  RAISE NOTICE '✓ Trigger on_auth_user_created existe en auth.users';
END $$;

-- Verificar que la función tenga search_path configurado
DO $$
DECLARE
  func_config TEXT[];
BEGIN
  SELECT proconfig INTO func_config
  FROM pg_proc
  WHERE proname = 'handle_new_user'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
  
  IF func_config IS NULL OR NOT 'search_path=public' = ANY(func_config) THEN
    RAISE WARNING 'La función handle_new_user no tiene search_path=public configurado';
  ELSE
    RAISE NOTICE '✓ Función handle_new_user tiene search_path=public';
  END IF;
END $$;

-- Verificar que la función sea SECURITY DEFINER
DO $$
DECLARE
  is_sec_def BOOLEAN;
BEGIN
  SELECT prosecdef INTO is_sec_def
  FROM pg_proc
  WHERE proname = 'handle_new_user'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
  
  IF NOT is_sec_def THEN
    RAISE WARNING 'La función handle_new_user no es SECURITY DEFINER';
  ELSE
    RAISE NOTICE '✓ Función handle_new_user es SECURITY DEFINER';
  END IF;
END $$;

-- ============================================================================
-- INSTRUCCIONES PARA DIAGNOSTICAR EL ERROR
-- ============================================================================

-- Después de aplicar este script, intenta registrar un nuevo usuario.
-- Luego, ve a Supabase Dashboard → Database → Logs → Postgres
-- Busca los mensajes que empiezan con [handle_new_user]
-- 
-- Los logs mostrarán exactamente dónde falla la función:
-- - Si falla en la inserción de profiles, verás el error exacto
-- - Si falla en la inserción de user_settings, verás el error exacto
-- - Si hay un problema con los tipos de datos, verás el error exacto
-- - Si hay un problema con los constraints, verás el error exacto
--
-- Con esta información, podremos identificar la causa REAL del error 500.

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
