// Script para verificar la existencia de tablas en Supabase
// Este script está diseñado para ejecutarse desde el navegador (no desde Node.js directamente)

export async function verifyTables(supabase) {
  console.log('=== VERIFICANDO TABLAS EN SUPABASE ===');
  
  const requiredTables = [
    'dashboard_calendars',
    'dashboard_items',
    'dashboard_user_progress'
  ];
  
  const results = {
    existing: [],
    missing: [],
    details: {}
  };
  
  try {
    // Verificar cada tabla requerida
    for (const tableName of requiredTables) {
      console.log(`Verificando tabla: ${tableName}`);
      
      try {
        // Intentar seleccionar un registro de la tabla
        const { data, error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1);
        
        if (error) {
          if (error.code === '42P01') {
            // Tabla no existe
            results.missing.push(tableName);
            results.details[tableName] = 'Tabla no existe';
            console.log(`❌ Tabla ${tableName} no existe`);
          } else {
            // Otro error
            results.missing.push(tableName);
            results.details[tableName] = `Error: ${error.message}`;
            console.log(`❌ Error al acceder a ${tableName}: ${error.message}`);
          }
        } else {
          // Tabla existe
          results.existing.push(tableName);
          results.details[tableName] = 'Tabla existe y es accesible';
          console.log(`✅ Tabla ${tableName} existe y es accesible`);
        }
      } catch (tableError) {
        results.missing.push(tableName);
        results.details[tableName] = `Error de conexión: ${tableError.message}`;
        console.log(`❌ Error al verificar ${tableName}: ${tableError.message}`);
      }
    }
    
    console.log('\n=== RESULTADOS ===');
    console.log('Tablas existentes:', results.existing);
    console.log('Tablas faltantes:', results.missing);
    console.log('Detalles:', results.details);
    
    return results;
  } catch (error) {
    console.error('❌ Error general al verificar tablas:', error);
    return {
      existing: [],
      missing: requiredTables,
      details: { error: error.message },
      generalError: true
    };
  }
}

export default verifyTables;