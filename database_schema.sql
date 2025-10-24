-- Tabla con los calendarios configurables
CREATE TABLE dashboard_calendars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ítems o consignas que pertenecen a cada calendario
CREATE TABLE dashboard_items (
    id SERIAL PRIMARY KEY,
    calendar_id INT NOT NULL REFERENCES dashboard_calendars(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    position INT DEFAULT 0, -- Para ordenamiento personalizado
    recurrence_type VARCHAR(20) DEFAULT 'once', -- Tipo de recurrencia: once, daily, weekly, monthly, yearly, custom
    recurrence_days TEXT, -- Días de la semana para tareas recurrentes personalizadas (0-6, Domingo-Sábado)
    is_active BOOLEAN DEFAULT true, -- Si la tarea está activa
    start_date DATE, -- Fecha de inicio para tareas recurrentes
    end_date DATE, -- Fecha de fin para tareas recurrentes
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Registro diario del estado o valor de cada ítem por usuario
CREATE TABLE dashboard_user_progress (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL REFERENCES dashboard_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Asume gestión de usuarios en Supabase Auth
    progress_value VARCHAR(50), -- Puede ser "checked", valor numérico, texto, etc.
    progress_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(item_id, user_id, progress_date) -- Un solo registro por ítem y día
);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar automáticamente updated_at
CREATE TRIGGER update_dashboard_calendars_updated_at 
    BEFORE UPDATE ON dashboard_calendars 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_items_updated_at 
    BEFORE UPDATE ON dashboard_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_user_progress_updated_at 
    BEFORE UPDATE ON dashboard_user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();