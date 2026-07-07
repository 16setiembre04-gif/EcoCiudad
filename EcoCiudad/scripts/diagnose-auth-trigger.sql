-- ============================================================================
-- Script de Diagnóstico del Trigger handle_new_user
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

-- 2. Verificar que la función existe y ver su definición
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 3. Verificar estructura de la tabla profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Verificar estructura de la tabla user_settings
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_settings'
ORDER BY ordinal_position;

-- 5. Verificar constraints de profiles
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- 6. Verificar constraints de user_settings
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.user_settings'::regclass;

-- 7. Verificar permisos de INSERT en profiles
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'profiles'
AND privilege_type = 'INSERT';

-- 8. Verificar permisos de INSERT en user_settings
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'user_settings'
AND privilege_type = 'INSERT';

-- 9. Verificar tipos ENUM disponibles
SELECT 
  typname AS enum_name,
  enumlabel AS enum_value
FROM pg_type
JOIN pg_enum ON pg_type.oid = pg_enum.enumtypid
WHERE typname = 'user_role'
ORDER BY enumlabel;

-- 10. Contar usuarios en auth.users
SELECT COUNT(*) AS total_auth_users FROM auth.users;

-- 11. Contar perfiles en public.profiles
SELECT COUNT(*) AS total_profiles FROM public.profiles;

-- 12. Contar settings en public.user_settings
SELECT COUNT(*) AS total_settings FROM public.user_settings;

-- 13. Verificar si hay usuarios sin perfil
SELECT 
  au.id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 14. Verificar si hay perfiles sin settings
SELECT 
  p.id,
  p.email,
  p.display_name
FROM public.profiles p
LEFT JOIN public.user_settings us ON p.id = us.user_id
WHERE us.user_id IS NULL;

-- 15. Ver últimos 5 usuarios creados
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.raw_user_meta_data,
  p.id AS profile_id,
  p.display_name,
  p.role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 5;

-- ============================================================================
-- FIN DEL DIAGNÓSTICO
-- ============================================================================
