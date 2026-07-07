-- ============================================================================
-- Script de Diagnóstico del Error "Database error creating new user"
-- Ejecutar en Supabase SQL Editor
-- ============================================================================

-- 1. Verificar que el trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar la función handle_new_user
SELECT 
  routine_name,
  routine_type,
  routine_definition,
  security_type,
  is_deterministic
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 3. Verificar si RLS está habilitado en profiles
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- 4. Verificar si RLS está habilitado en user_settings
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'user_settings';

-- 5. Listar todas las políticas de profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 6. Listar todas las políticas de user_settings
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_settings';

-- 7. Verificar si existe alguna política de INSERT en profiles
SELECT COUNT(*) AS insert_policies_profiles
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- 8. Verificar si existe alguna política de INSERT en user_settings
SELECT COUNT(*) AS insert_policies_user_settings
FROM pg_policies
WHERE tablename = 'user_settings' AND cmd = 'INSERT';

-- 9. Verificar la definición completa del trigger
SELECT 
  pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 10. Verificar la definición completa de la función
SELECT 
  pg_get_functiondef(oid) AS function_definition
FROM pg_proc
WHERE proname = 'handle_new_user';

-- 11. Verificar si hay errores en los logs recientes
SELECT 
  pid,
  datname,
  usename,
  application_name,
  state,
  query,
  wait_event_type,
  wait_event,
  query_start
FROM pg_stat_activity
WHERE state = 'active'
AND query LIKE '%handle_new_user%'
ORDER BY query_start DESC
LIMIT 5;

-- 12. Probar inserción manual en profiles (simulando el trigger)
-- Esto debería fallar si el problema es RLS
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
BEGIN
  -- Intentar insertar en profiles
  INSERT INTO public.profiles (id, email, display_name, role, is_email_verified)
  VALUES (
    test_user_id,
    'test@example.com',
    'Test User',
    'citizen',
    TRUE
  );
  
  RAISE NOTICE 'Inserción exitosa - El problema NO es RLS';
  
  -- Limpiar
  DELETE FROM public.profiles WHERE id = test_user_id;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Inserción falló - El problema es RLS o permisos: % - %', SQLERRM, SQLSTATE;
END $$;

-- 13. Verificar permisos del usuario autenticado
SELECT 
  current_user,
  session_user;

-- 14. Verificar si el usuario tiene permisos de INSERT en profiles
SELECT 
  has_table_privilege(current_user, 'public.profiles', 'INSERT') AS can_insert_profiles;

-- 15. Verificar si el usuario tiene permisos de INSERT en user_settings
SELECT 
  has_table_privilege(current_user, 'public.user_settings', 'INSERT') AS can_insert_user_settings;

-- ============================================================================
-- FIN DEL DIAGNÓSTICO
-- ============================================================================
