import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://supapers.itmconsulting.es';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.qPYvk4GYIxKU-fVHDbTD3TYHo5eTsGp17EszifM2n2Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para crear las tablas
export async function createTables() {
  try {
    // Verificar si las tablas ya existen
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['dashboard_calendars', 'dashboard_items', 'dashboard_user_progress']);

    if (tablesError) {
      console.error('Error checking existing tables:', tablesError);
      return;
    }

    // Si las tablas ya existen, no hacer nada
    if (tables && tables.length === 3) {
      console.log('Las tablas ya existen en la base de datos');
      return;
    }

    // Crear tabla dashboard_calendars
    const { error: calendarsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS dashboard_calendars (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `
    });

    if (calendarsError) {
      console.error('Error creating dashboard_calendars table:', calendarsError);
    } else {
      console.log('Tabla dashboard_calendars creada exitosamente');
    }

    // Crear tabla dashboard_items
    const { error: itemsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS dashboard_items (
          id SERIAL PRIMARY KEY,
          calendar_id INT NOT NULL REFERENCES dashboard_calendars(id) ON DELETE CASCADE,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          position INT DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `
    });

    if (itemsError) {
      console.error('Error creating dashboard_items table:', itemsError);
    } else {
      console.log('Tabla dashboard_items creada exitosamente');
    }

    // Crear tabla dashboard_user_progress
    const { error: progressError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS dashboard_user_progress (
          id SERIAL PRIMARY KEY,
          item_id INT NOT NULL REFERENCES dashboard_items(id) ON DELETE CASCADE,
          user_id UUID NOT NULL,
          progress_value VARCHAR(50),
          progress_date DATE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now(),
          UNIQUE(item_id, user_id, progress_date)
        );
      `
    });

    if (progressError) {
      console.error('Error creating dashboard_user_progress table:', progressError);
    } else {
      console.log('Tabla dashboard_user_progress creada exitosamente');
    }

    // Crear función y triggers para actualizar updated_at
    const { error: functionError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `
    });

    if (functionError) {
      console.error('Error creating update function:', functionError);
    }

    // Crear triggers
    const triggerSQLs = [
      `CREATE TRIGGER update_dashboard_calendars_updated_at 
         BEFORE UPDATE ON dashboard_calendars 
         FOR EACH ROW 
         EXECUTE FUNCTION update_updated_at_column();`,
      `CREATE TRIGGER update_dashboard_items_updated_at 
         BEFORE UPDATE ON dashboard_items 
         FOR EACH ROW 
         EXECUTE FUNCTION update_updated_at_column();`,
      `CREATE TRIGGER update_dashboard_user_progress_updated_at 
         BEFORE UPDATE ON dashboard_user_progress 
         FOR EACH ROW 
         EXECUTE FUNCTION update_updated_at_column();`
    ];

    for (const triggerSQL of triggerSQLs) {
      const { error: triggerError } = await supabase.rpc('execute_sql', {
        sql: triggerSQL
      });

      if (triggerError) {
        console.error('Error creating trigger:', triggerError);
      }
    }

    console.log('Todos los triggers creados exitosamente');

  } catch (error) {
    console.error('Error general en la creación de tablas:', error);
  }
}

// Función para insertar datos de ejemplo
export async function insertSampleData() {
  try {
    // Insertar calendario de ejemplo
    const { data: calendar, error: calendarError } = await supabase
      .from('dashboard_calendars')
      .insert([
        {
          name: 'Calendario de Ejemplo',
          description: 'Este es un calendario de ejemplo para demostrar la funcionalidad'
        }
      ])
      .select()
      .single();

    if (calendarError) {
      console.error('Error inserting sample calendar:', calendarError);
      return;
    }

    console.log('Calendario de ejemplo creado:', calendar);

    // Insertar ítems de ejemplo
    const { data: items, error: itemsError } = await supabase
      .from('dashboard_items')
      .insert([
        {
          calendar_id: calendar.id,
          title: 'Tarea 1',
          description: 'Primera tarea de ejemplo',
          position: 1
        },
        {
          calendar_id: calendar.id,
          title: 'Tarea 2',
          description: 'Segunda tarea de ejemplo',
          position: 2
        },
        {
          calendar_id: calendar.id,
          title: 'Tarea 3',
          description: 'Tercera tarea de ejemplo',
          position: 3
        }
      ])
      .select();

    if (itemsError) {
      console.error('Error inserting sample items:', itemsError);
      return;
    }

    console.log('Ítems de ejemplo creados:', items);

  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Ejecutar la configuración si este archivo se ejecuta directamente
if (import.meta.url === new URL(import.meta.url).href) {
  createTables().then(() => {
    insertSampleData();
  });
}