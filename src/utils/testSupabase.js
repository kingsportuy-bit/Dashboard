// Script para probar la conexión a Supabase
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase desde variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Configuración de Supabase:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Configurada' : 'No configurada');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las credenciales de Supabase. Verifica tus variables de entorno.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('\nProbando conexión a Supabase...');
  
  try {
    // Intentar obtener la versión de Supabase
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.log('Conexión establecida, pero no se pudo obtener la versión:', error.message);
    } else {
      console.log('Conexión exitosa. Versión de Supabase:', data);
    }
    
    // Probar listar tablas
    console.log('\nVerificando tablas existentes...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (tablesError) {
      console.log('No se pudieron listar las tablas:', tablesError.message);
    } else {
      console.log('Tablas encontradas:', tables.map(t => t.table_name));
    }
    
  } catch (error) {
    console.error('Error durante la prueba de conexión:', error.message);
  }
}

// Ejecutar la prueba si este archivo se ejecuta directamente
if (import.meta.url === new URL(import.meta.url).href) {
  testConnection();
}

export default testConnection;