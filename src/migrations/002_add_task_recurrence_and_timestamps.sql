-- Modificación de la tabla dashboard_items para agregar campos de recurrencia y tiempo
ALTER TABLE dashboard_items 
ADD COLUMN IF NOT EXISTS recurrence_type VARCHAR(20) DEFAULT 'once',
ADD COLUMN IF NOT EXISTS recurrence_days TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Añadir comentario para documentar los valores posibles
COMMENT ON COLUMN dashboard_items.recurrence_type IS 'Tipo de recurrencia: once, daily, weekly, monthly, yearly, custom';
COMMENT ON COLUMN dashboard_items.recurrence_days IS 'Días de la semana para tareas recurrentes personalizadas (0-6, Domingo-Sábado)';