# Fix: Database Error Creating New User (HTTP 500)

## 🔴 Problema Identificado

**Error:** `Database error creating new user` con status HTTP 500

**Síntomas:**
- Al registrar un usuario desde React Native: `AuthRetryableFetchError`, status 500
- Al crear un usuario desde Supabase Dashboard: `Database error creating new user`
- El error ocurre tanto desde la aplicación como directamente en Supabase

## 📍 Causa Raíz

**Archivo:** `supabase/migrations/001_initial_schema.sql`  
**Líneas:** 402-424 (función `handle_new_user()`)

### El Problema

El trigger `on_auth_user_created` se ejecuta cuando se crea un usuario en `auth.users` y debe insertar registros en:
1. `public.profiles`
2. `public.user_settings`

**Sin embargo:**
- Ambas tablas tienen **RLS (Row Level Security) habilitado**
- **NO existen políticas de INSERT** para ninguna de las dos tablas
- Cuando el trigger intenta insertar, RLS bloquea la operación
- El trigger falla silenciosamente y Supabase retorna HTTP 500

### Evidencia

```sql
-- Línea 470: RLS habilitado en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Línea 484: RLS habilitado en user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Líneas 490-496: Solo políticas SELECT/UPDATE para profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ❌ NO HAY POLÍTICA DE INSERT PARA profiles

-- Líneas 754-760: Solo políticas SELECT/UPDATE para user_settings
CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- ❌ NO HAY POLÍTICA DE INSERT PARA user_settings
```

## ✅ Solución Aplicada

**Archivo:** `supabase/migrations/008_fix_rls_insert_policies.sql`

### Cambios Realizados

#### 1. Agregar Políticas de INSERT

```sql
-- Para profiles
CREATE POLICY "Enable insert for authenticated users only"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Para user_settings
CREATE POLICY "Enable insert for authenticated users only"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
```

**Nota:** `auth.uid() IS NULL` permite que el trigger (con `SECURITY DEFINER`) inserte cuando aún no hay un usuario autenticado en la sesión.

#### 2. Recrear la Función con Mejoras

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
-- ... implementación con manejo de errores
$$ LANGUAGE plpgsql;
```

**Mejoras:**
- ✅ `SET search_path = public` para asegurar que las tablas se encuentren
- ✅ Manejo de errores con `BEGIN...EXCEPTION`
- ✅ Logging con `RAISE LOG`
- ✅ Inserción explícita de todos los campos requeridos

#### 3. Recrear el Trigger

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## 📋 Cómo Aplicar la Solución

### Paso 1: Ejecutar el Script de Diagnóstico (Opcional)

1. Abre **Supabase Dashboard**
2. Ve a **SQL Editor**
3. Copia el contenido de `scripts/diagnose-database-error.sql`
4. Ejecuta el SQL
5. Revisa los resultados para confirmar el problema

**Resultados esperados:**
- `insert_policies_profiles` = 0 (confirma que NO hay políticas de INSERT)
- `insert_policies_user_settings` = 0 (confirma que NO hay políticas de INSERT)

### Paso 2: Aplicar el Parche

1. Abre **Supabase Dashboard**
2. Ve a **SQL Editor**
3. Copia el contenido de `supabase/migrations/008_fix_rls_insert_policies.sql`
4. Ejecuta el SQL
5. Verifica que no haya errores

**Resultados esperados:**
```
✓ Trigger on_auth_user_created existe
✓ Políticas de INSERT existen en profiles y user_settings
```

### Paso 3: Probar el Registro

1. Reinicia la aplicación React Native
2. Intenta registrar un nuevo usuario
3. Verifica que el registro sea exitoso

**Logs esperados:**
```
INFO [AuthService] signUp called { email: "...", displayName: "...", role: "citizen" }
INFO [AuthService] Calling supabase.auth.signUp()
INFO [AuthService] SignUp data prepared { ... }
INFO [AuthService] User signed up successfully { userId: "...", role: "citizen" }
```

### Paso 4: Verificar en Supabase

1. Ve a **Authentication** → **Users**
2. Verifica que el nuevo usuario aparezca en la lista
3. Ve a **Table Editor** → **profiles**
4. Verifica que exista un registro con el ID del usuario
5. Ve a **Table Editor** → **user_settings**
6. Verifica que exista un registro con el user_id del usuario

## 🔍 Verificación Post-Fix

Ejecuta estas consultas en Supabase SQL Editor para verificar:

```sql
-- 1. Verificar que el trigger existe
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar políticas de INSERT en profiles
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- 3. Verificar políticas de INSERT en user_settings
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'user_settings' AND cmd = 'INSERT';

-- 4. Verificar que la función tenga search_path
SELECT proname, proconfig
FROM pg_proc
WHERE proname = 'handle_new_user';
```

## 📊 Resumen de Archivos

| Tipo | Archivo | Descripción |
|------|---------|-------------|
| **Diagnóstico** | `scripts/diagnose-database-error.sql` | Script para diagnosticar el problema |
| **Parche** | `supabase/migrations/008_fix_rls_insert_policies.sql` | Migración para corregir el problema |
| **Documentación** | `docs/DATABASE_ERROR_FIX.md` | Este documento |

## 🎯 Resultado Esperado

Después de aplicar la migración `008_fix_rls_insert_policies.sql`:

✅ El registro de usuarios funciona correctamente  
✅ No más errores HTTP 500  
✅ Se crean automáticamente registros en `profiles` y `user_settings`  
✅ El trigger maneja errores de forma robusta  
✅ Los logs muestran información detallada si algo falla  

## 🔬 Explicación Técnica Detallada

### ¿Por Qué Ocurre el HTTP 500?

1. **Flujo Normal:**
   ```
   Cliente → Supabase Auth → auth.users INSERT → Trigger → profiles INSERT → user_settings INSERT → Respuesta 200
   ```

2. **Flujo con Error (antes del fix):**
   ```
   Cliente → Supabase Auth → auth.users INSERT → Trigger → profiles INSERT (BLOQUEADO POR RLS) → HTTP 500
   ```

3. **Flujo Corregido (después del fix):**
   ```
   Cliente → Supabase Auth → auth.users INSERT → Trigger → profiles INSERT (POLÍTICA PERMITE) → user_settings INSERT (POLÍTICA PERMITE) → Respuesta 200
   ```

### ¿Por Qué `auth.uid() IS NULL`?

Cuando el trigger se ejecuta:
- El usuario **aún no está autenticado** en la sesión actual
- `auth.uid()` retorna `NULL` porque no hay sesión activa
- La política `auth.uid() = id OR auth.uid() IS NULL` permite la inserción en ambos casos:
  - Cuando el usuario se inserta a sí mismo (`auth.uid() = id`)
  - Cuando el trigger inserta (`auth.uid() IS NULL`)

### ¿Por Qué `SECURITY DEFINER`?

- `SECURITY DEFINER` hace que la función se ejecute con los permisos del propietario de la función
- Esto permite que la función acceda a tablas que normalmente estarían restringidas
- Combinado con las políticas de INSERT, permite que el trigger funcione correctamente

## 🚨 Troubleshooting

### Si el Error Persiste

#### 1. Verificar que la Migración se Ejecutó

```sql
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 5;
```

Deberías ver `008_fix_rls_insert_policies` en la lista.

#### 2. Verificar que las Políticas Existen

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'user_settings')
AND cmd = 'INSERT';
```

Deberías ver 2 políticas (una para cada tabla).

#### 3. Verificar los Logs de Supabase

1. Ve a **Database** → **Logs** → **Postgres**
2. Busca errores relacionados con `handle_new_user`
3. Los logs deberían mostrar el error exacto si algo falla

#### 4. Probar Inserción Manual

```sql
-- Crear un usuario de prueba
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_user_meta_data
)
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
SELECT * FROM public.user_settings WHERE user_id = (
  SELECT id FROM public.profiles WHERE email = 'test@example.com'
);

-- Limpiar
DELETE FROM auth.users WHERE email = 'test@example.com';
```

## 📚 Recursos Adicionales

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)
- [Supabase Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks)

---

**Estado:** ✅ Diagnóstico completo, solución lista para aplicar

**Próximo Paso:** Ejecutar `supabase/migrations/008_fix_rls_insert_policies.sql` en Supabase SQL Editor
