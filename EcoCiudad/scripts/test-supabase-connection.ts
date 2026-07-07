/**
 * Script de diagnóstico para verificar la conexión con Supabase
 * Ejecutar con: npx ts-node scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('=== Diagnóstico de Conexión Supabase ===\n');

console.log('1. Variables de entorno:');
console.log('   URL:', supabaseUrl || '❌ NO DEFINIDA');
console.log('   Key:', supabaseAnonKey ? '✅ Definida' : '❌ NO DEFINIDA');
console.log('');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Variables de entorno faltantes');
  process.exit(1);
}

console.log('2. Validación de URL:');
try {
  const url = new URL(supabaseUrl);
  console.log('   ✅ URL válida');
  console.log('   Protocolo:', url.protocol);
  console.log('   Hostname:', url.hostname);
  console.log('   Path:', url.pathname);
} catch (error: any) {
  console.error('   ❌ URL inválida:', error.message);
  process.exit(1);
}
console.log('');

console.log('3. Creando cliente Supabase...');
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
console.log('   ✅ Cliente creado');
console.log('');

console.log('4. Probando conexión...');
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('   ❌ Error de conexión:', error.message);
      console.error('   Código:', error.code);
      process.exit(1);
    }
    
    console.log('   ✅ Conexión exitosa');
    console.log('   Sesión actual:', data.session ? 'Activa' : 'Sin sesión');
    console.log('');
    
    console.log('5. Probando consulta a la base de datos...');
    const { error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (dbError) {
      console.error('   ❌ Error de base de datos:', dbError.message);
      console.error('   Código:', dbError.code);
    } else {
      console.log('   ✅ Base de datos accesible');
    }
    
    console.log('\n=== Diagnóstico Completado ===');
    process.exit(0);
  } catch (error: any) {
    console.error('   ❌ Error inesperado:', error.message);
    process.exit(1);
  }
})();
