-- ============================================================================
-- Script de Diagnóstico REAL del Error "Database error creating new user"
-- Este script NO intenta insertar datos, solo inspecciona la estructura
-- Ejecutar en Supabase SQL Editor
-- ============================================================================

-- 1. Verificar que el trigger existe en auth.users
SELECT 
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement,
  action_timing,
  action_orientation
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Ver la definición completa de la función handle_new_user
SELECT 
  pg_get_functiondef(oid) AS function_definition
FROM pg_proc
WHERE proname = 'handle_new_user'
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 3. Verificar la estructura de la tabla profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Verificar la estructura de la tabla user_settings
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_settings'
ORDER BY ordinal_position;

-- 5. Verificar el tipo ENUM user_role
SELECT 
  e.enumlabel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'user_role'
ORDER BY e.enumsortorder;

-- 6. Verificar constraints de profiles
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- 7. Verificar constraints de user_settings
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.user_settings'::regclass;

-- 8. Verificar todos los triggers en auth.users
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- 9. Verificar todos los triggers en profiles
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table = 'profiles';

-- 10. Verificar todos los triggers en user_settings
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table = 'user_settings';

-- 11. Verificar si RLS está habilitado en profiles
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';

-- 12. Verificar si RLS está habilitado en user_settings
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_settings';

-- 13. Listar todas las políticas RLS de profiles
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 14. Listar todas las políticas RLS de user_settings
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_settings';

-- 15. Verificar el propietario de la función handle_new_user
SELECT 
  p.proname,
  pg_get_userbyid(p.proowner) AS owner,
  p.prosecdef AS is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user'
AND n.nspname = 'public';

-- 16. Verificar el propietario de la tabla profiles
SELECT 
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';

-- 17. Verificar el propietario de la tabla user_settings
SELECT 
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_settings';

-- 18. Verificar si hay errores en las funciones
SELECT 
  proname,
  prosrc
FROM pg_proc
WHERE proname = 'handle_new_user'
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 19. Verificar la configuración de search_path
SHOW search_path;

-- 20. Verificar si la extensión uuid-ossp está instalada
SELECT 
  extname,
  extversion
FROM pg_extension
WHERE extname = 'uuid-ossp';

-- 21. Contar usuarios en auth.users
SELECT COUNT(*) AS total_auth_users FROM auth.users;

-- 22. Contar perfiles en profiles
SELECT COUNT(*) AS total_profiles FROM public.profiles;

-- 23. Contar settings en user_settings
SELECT COUNT(*) AS total_settings FROM public.user_settings;

-- 24. Verificar si hay usuarios en auth.users sin perfil
SELECT 
  au.id,
  au.email,
  au.created_at,
  p.id AS profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC
LIMIT 10;

-- 25. Verificar si hay perfiles sin settings
SELECT 
  p.id,
  p.email,
  p.display_name,
  us.user_id AS settings_id
FROM public.profiles p
LEFT JOIN public.user_settings us ON p.id = us.user_id
WHERE us.user_id IS NULL
ORDER BY p.created_at DESC
LIMIT 10;

-- 26. Ver los últimos 5 usuarios creados con sus perfiles
SELECT 
  au.id,
  au.email,
  au.created_at AS auth_created_at,
  au.raw_user_meta_data,
  p.id AS profile_id,
  p.display_name,
  p.role,
  p.created_at AS profile_created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 5;

-- 27. Verificar si hay índices únicos que puedan causar conflictos
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
AND indexdef LIKE '%UNIQUE%';

-- 28. Verificar si hay índices únicos en user_settings
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'user_settings'
AND indexdef LIKE '%UNIQUE%';

-- ============================================================================
-- ANÁLISIS DE POSIBLES CAUSAS
-- ============================================================================

-- Verificar si raw_user_meta_data puede ser NULL
-- Esto es importante porque la función usa NEW.raw_user_meta_data->>'display_name'
-- Si raw_user_meta_data es NULL, esto retornará NULL, pero COALESCE debería manejarlo

-- Verificar si el tipo de datos de role en profiles coincide con user_role
SELECT 
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name = 'role';

-- Verificar la definición del tipo user_role
SELECT 
  typname,
  typtype,
  typbasetype
FROM pg_type
WHERE typname = 'user_role';

-- ============================================================================
-- FIN DEL DIAGNÓSTICO
-- ============================================================================
