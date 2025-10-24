// Script para inicializar la base de datos
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase desde variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las credenciales de Supabase. Verifica tus variables de entorno.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function initializeDatabase() {
  console.log('Iniciando inicialización de la base de datos...');
  
  try {
    // Verificar si podemos conectar a Supabase
    const { data, error } = await supabase.from('dashboard_calendars').select('id').limit(1);
    
    if (error && error.code !== '42P01') { // 42P01 = tabla no existe
      console.error('Error de conexión a Supabase:', error);
      return;
    }
    
    console.log('Conexión a Supabase establecida correctamente');
    
    // Crear las tablas usando RPC si es posible
    console.log('Creando tablas...');
    
    // Nota: En un entorno real, esto se haría con migraciones o directamente en la interfaz de Supabase
    // Por ahora, vamos a verificar si las tablas existen e informar al usuario
    
    const tables = ['dashboard_calendars', 'dashboard_items', 'dashboard_user_progress'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('id').limit(1);
        if (error) {
          if (error.code === '42P01') {
            console.log(`La tabla ${table} no existe. Debes crearla manualmente en la interfaz de Supabase.`);
          } else {
            console.log(`Error al verificar la tabla ${table}:`, error.message);
          }
        } else {
          console.log(`La tabla ${table} existe y está accesible.`);
        }
      } catch (err) {
        console.error(`Error al verificar la tabla ${table}:`, err.message);
      }
    }
    
    console.log('\nInstrucciones para crear las tablas manualmente:');
    console.log('1. Accede a la interfaz de Supabase en:', supabaseUrl);
    console.log('2. Ve a la sección "Table Editor"');
    console.log('3. Crea las siguientes tablas usando el SQL proporcionado en database_schema.sql:');
    console.log('   - dashboard_calendars');
    console.log('   - dashboard_items');
    console.log('   - dashboard_user_progress');
    console.log('\nAlternativamente, puedes ejecutar el archivo database_schema.sql en el Editor SQL de Supabase.');
    
  } catch (error) {
    console.error('Error durante la inicialización:', error.message);
  }
}

// Ejecutar la inicialización si este archivo se ejecuta directamente
if (import.meta.url === new URL(import.meta.url).href) {
  initializeDatabase();
}

export default initializeDatabase;