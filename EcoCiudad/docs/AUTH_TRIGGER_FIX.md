# Diagnóstico y Solución del Error HTTP 500 en SignUp

## Problema Identificado

**Error:** HTTP 500 - Authentication failed al registrar usuario

**Causa Raíz:** El trigger `handle_new_user()` en `auth.users` está fallando silenciosamente, causando que Supabase retorne un error 500.

## Archivos Responsables

### 1. Trigger Problemático
**Archivo:** `supabase/migrations/001_initial_schema.sql` (líneas 402-424)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'citizen')
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Problema:** El trigger no tiene manejo de errores adecuado. Si alguna inserción falla, el trigger falla silenciosamente y causa HTTP 500.

### 2. Logging Insuficiente
**Archivo:** `src/services/auth/auth.service.ts` (líneas 39-77)

**Problema:** El logging no mostraba información detallada del error, dificultando el diagnóstico.

## Solución Aplicada

### 1. Migración de Corrección del Trigger
**Archivo:** `supabase/migrations/007_fix_auth_trigger.sql`

**Cambios:**
- ✅ Agregado manejo de errores con `BEGIN...EXCEPTION`
- ✅ Agregado `RAISE NOTICE` para logging en Supabase
- ✅ Agregado `RAISE EXCEPTION` con detalles completos del error
- ✅ Agregado campo `is_email_verified` en la inserción de profiles
- ✅ Separadas las inserciones en bloques independientes

### 2. Logging Mejorado en AuthService
**Archivo:** `src/services/auth/auth.service.ts`

**Cambios:**
- ✅ Logging de datos enviados a `signUp()`
- ✅ Logging completo del error (message, status, name, code, details, hint)
- ✅ Logging de excepciones con stack trace
- ✅ JSON.stringify del error completo

## Pasos para Aplicar la Solución

### Paso 1: Ejecutar la Migración en Supabase

1. Abre el **Supabase Dashboard**
2. Ve a **SQL Editor**
3. Copia el contenido de `supabase/migrations/007_fix_auth_trigger.sql`
4. Ejecuta el SQL
5. Verifica que no haya errores

### Paso 2: Verificar el Trigger

Ejecuta esta consulta en Supabase SQL Editor:

```sql
-- Verificar que el trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Deberías ver el trigger `on_auth_user_created` en la tabla `auth.users`.

### Paso 3: Verificar la Función

```sql
-- Verificar que la función existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
```

Deberías ver la función `handle_new_user` con el nuevo código.

### Paso 4: Probar el Registro

1. Reinicia la aplicación
2. Intenta registrar un nuevo usuario
3. Observa los logs en la consola

**Logs esperados:**
```
INFO [AuthService] signUp called { email: "...", displayName: "...", role: "citizen" }
INFO [AuthService] Calling supabase.auth.signUp()
INFO [AuthService] SignUp data prepared { email: "...", password: "...", options: {...} }
INFO [AuthService] User signed up successfully { userId: "...", role: "citizen" }
```

### Paso 5: Verificar Logs en Supabase

Si el registro falla, ejecuta en Supabase SQL Editor:

```sql
-- Ver logs recientes de la función
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%handle_new_user%' 
ORDER BY total_time DESC 
LIMIT 10;
```

## Diagnóstico Adicional

### Si el Error Persiste

#### 1. Verificar Estructura de Tablas

```sql
-- Verificar estructura de profiles
\d public.profiles

-- Verificar estructura de user_settings
\d public.user_settings
```

#### 2. Verificar Permisos

```sql
-- Verificar que el usuario de Supabase tiene permisos
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'profiles';
```

#### 3. Probar Inserción Manual

```sql
-- Crear un usuario de prueba en auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"display_name": "Test User", "role": "citizen"}'::jsonb
);

-- Verificar si se creó el profile
SELECT * FROM public.profiles WHERE email = 'test@example.com';

-- Verificar si se crearon los settings
SELECT * FROM public.user_settings WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'test@example.com');
```

#### 4. Verificar Constraints

```sql
-- Verificar constraints de profiles
SELECT 
  conname,
  contype,
  pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;
```

## Causas Comunes del HTTP 500

### 1. Violación de Foreign Key
**Síntoma:** Error al insertar en `user_settings` porque `profiles` no se creó
**Solución:** Asegurar que la inserción en `profiles` sea exitosa antes de insertar en `user_settings`

### 2. Tipo de Datos Inválido
**Síntoma:** Error al convertir `role` a `user_role`
**Solución:** Usar `COALESCE` y validación de tipos

### 3. Permisos Insuficientes
**Síntoma:** Error de permisos al insertar en `profiles`
**Solución:** Verificar que el usuario de Supabase tenga permisos de INSERT en `profiles` y `user_settings`

### 4. Constraint Violation
**Síntoma:** Violación de UNIQUE o CHECK constraint
**Solución:** Verificar que los datos cumplan con las constraints

## Verificación Final

Después de aplicar la migración, verifica:

```sql
-- 1. Trigger existe y está activo
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Función tiene el nuevo código
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Permisos correctos
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name IN ('profiles', 'user_settings')
AND privilege_type = 'INSERT';
```

## Resumen

| Componente | Archivo | Cambio |
|------------|---------|--------|
| Trigger | `007_fix_auth_trigger.sql` | Manejo de errores mejorado |
| Logging | `auth.service.ts` | Logging detallado de errores |
| Migración | `007_fix_auth_trigger.sql` | Corrección del trigger |

## Próximos Pasos

1. ✅ Aplicar migración `007_fix_auth_trigger.sql`
2. ✅ Reiniciar aplicación
3. ✅ Probar registro de usuario
4. ✅ Verificar logs en consola
5. ✅ Verificar logs en Supabase (si falla)

---

**Estado:** ✅ Diagnóstico completo, solución lista para aplicar
