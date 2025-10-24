import React, { useContext, useState } from 'react';
import { SupabaseContext } from '../contexts/SupabaseContext';
import { verifyTables } from '../utils/verifyTables';
import Footer from '../components/Footer';
import './TestSupabase.css';

const TestSupabase = () => {
  const { supabase } = useContext(SupabaseContext);
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (message, isSuccess = true) => {
    setTestResults(prev => [...prev, { message, isSuccess, timestamp: new Date().toLocaleTimeString() }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testConnection = async () => {
    clearResults();
    setIsTesting(true);
    
    try {
      addResult('Iniciando prueba de conexión a Supabase...');
      
      // Verificar que el cliente esté disponible
      if (!supabase) {
        addResult('❌ Cliente de Supabase no disponible', false);
        return;
      }
      
      addResult('✅ Cliente de Supabase disponible');
      
      // 1. Probar conexión básica
      addResult('1. Probando conexión básica...');
      const { data, error } = await supabase
        .from('dashboard_calendars')
        .select('id')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01') {
          addResult('✅ Conexión exitosa (tabla no existe aún, esto es normal)');
        } else {
          addResult(`❌ Error en conexión: ${error.message}`, false);
          return;
        }
      } else {
        addResult('✅ Conexión exitosa');
      }
      
      // 2. Verificar tablas
      addResult('2. Verificando tablas requeridas...');
      const tableResults = await verifyTables(supabase);
      
      if (tableResults.generalError) {
        addResult('❌ Error general al verificar tablas', false);
      } else {
        tableResults.existing.forEach(table => {
          addResult(`✅ Tabla ${table} existe`);
        });
        
        tableResults.missing.forEach(table => {
          addResult(`❌ Tabla ${table} no existe`, false);
        });
      }
      
      // 3. Probar inserción (solo si las tablas existen)
      if (tableResults.missing.length === 0 || tableResults.missing.includes('dashboard_calendars')) {
        addResult('3. Probando inserción de calendario de prueba...');
        const testCalendar = {
          name: 'Calendario de Prueba - Test de Conexión',
          description: 'Calendario creado para verificar la funcionalidad de inserción'
        };
        
        addResult(`Datos a insertar: ${JSON.stringify(testCalendar)}`);
        
        const { data: insertData, error: insertError } = await supabase
          .from('dashboard_calendars')
          .insert([testCalendar])
          .select()
          .single();
        
        if (insertError) {
          addResult(`❌ Error al insertar calendario: ${insertError.message}`, false);
          addResult(`Detalles del error: Code=${insertError.code}, Details=${insertError.details}`, false);
          return;
        }
        
        addResult(`✅ Calendario insertado exitosamente: ID=${insertData.id}`);
        
        // 4. Probar eliminación del calendario de prueba
        addResult('4. Eliminando calendario de prueba...');
        const { error: deleteError } = await supabase
          .from('dashboard_calendars')
          .delete()
          .eq('id', insertData.id);
        
        if (deleteError) {
          addResult(`❌ Error al eliminar calendario de prueba: ${deleteError.message}`, false);
        } else {
          addResult('✅ Calendario de prueba eliminado exitosamente');
        }
      }
      
      addResult('=== PRUEBA COMPLETADA CON ÉXITO ===');
      
    } catch (error) {
      addResult(`❌ Error durante la prueba: ${error.message}`, false);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="test-supabase">
      <h2>Prueba de Conexión a Supabase</h2>
      <div className="test-controls">
        <button onClick={testConnection} disabled={isTesting}>
          {isTesting ? 'Probando...' : 'Iniciar Prueba'}
        </button>
        <button onClick={clearResults} disabled={testResults.length === 0}>
          Limpiar Resultados
        </button>
      </div>
      
      <div className="test-results">
        <h3>Resultados de la Prueba</h3>
        {testResults.length === 0 ? (
          <p>No hay resultados aún. Haz clic en "Iniciar Prueba" para comenzar.</p>
        ) : (
          <div className="results-list">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`result-item ${result.isSuccess ? 'success' : 'error'}`}
              >
                <span className="timestamp">[{result.timestamp}]</span>
                <span className="message">{result.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TestSupabase;