// Script para probar la funcionalidad de calendarios
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase desde variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCalendarFunctionality() {
  console.log('Probando funcionalidad de calendarios...');
  
  try {
    // Crear un calendario de prueba
    console.log('Creando calendario de prueba...');
    const { data: calendar, error: calendarError } = await supabase
      .from('dashboard_calendars')
      .insert([
        {
          name: 'Calendario de Prueba',
          description: 'Calendario creado para pruebas'
        }
      ])
      .select()
      .single();
    
    if (calendarError) {
      console.error('Error al crear calendario:', calendarError.message);
      return;
    }
    
    console.log('Calendario creado exitosamente:', calendar);
    
    // Crear algunos ítems para el calendario
    console.log('Creando ítems de prueba...');
    const { data: items, error: itemsError } = await supabase
      .from('dashboard_items')
      .insert([
        {
          calendar_id: calendar.id,
          title: 'Tarea de prueba 1',
          description: 'Primera tarea de prueba',
          position: 1
        },
        {
          calendar_id: calendar.id,
          title: 'Tarea de prueba 2',
          description: 'Segunda tarea de prueba',
          position: 2
        }
      ])
      .select();
    
    if (itemsError) {
      console.error('Error al crear ítems:', itemsError.message);
      return;
    }
    
    console.log('Ítems creados exitosamente:', items);
    
    // Registrar progreso para un ítem
    console.log('Registrando progreso de prueba...');
    const { data: progress, error: progressError } = await supabase
      .from('dashboard_user_progress')
      .insert([
        {
          item_id: items[0].id,
          user_id: 'test-user-id', // En una implementación real, sería el ID del usuario autenticado
          progress_value: 'checked',
          progress_date: new Date().toISOString().split('T')[0]
        }
      ])
      .select()
      .single();
    
    if (progressError) {
      console.error('Error al registrar progreso:', progressError.message);
      return;
    }
    
    console.log('Progreso registrado exitosamente:', progress);
    
    // Listar todos los calendarios
    console.log('Listando calendarios...');
    const { data: allCalendars, error: allCalendarsError } = await supabase
      .from('dashboard_calendars')
      .select('*');
    
    if (allCalendarsError) {
      console.error('Error al listar calendarios:', allCalendarsError.message);
      return;
    }
    
    console.log('Calendarios encontrados:', allCalendars);
    
  } catch (error) {
    console.error('Error durante la prueba:', error.message);
  }
}

// Ejecutar la prueba si este archivo se ejecuta directamente
if (import.meta.url === new URL(import.meta.url).href) {
  testCalendarFunctionality();
}

export default testCalendarFunctionality;