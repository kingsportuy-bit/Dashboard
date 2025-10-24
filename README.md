# Dashboard Codexa

Dashboard funcional con calendario que se conecta a Supabase.

## Descripción

Este proyecto es un dashboard web que incluye:
- Página principal de dashboard
- Sistema de calendario con múltiples pestañas
- Conexión a base de datos Supabase
- Gestión de ítems y progreso diario

## Tecnologías utilizadas

- React
- Vite
- Supabase (base de datos y autenticación)
- Docker (para despliegue)

## Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn
- Docker (para despliegue)
- Cuenta en Supabase

## Instalación

1. Clonar el repositorio:
   ```
   git clone <url-del-repositorio>
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Configurar variables de entorno:
   - Copiar el archivo `.env.example` a `.env`
   - Configurar las credenciales de Supabase

## Desarrollo

Para ejecutar la aplicación en modo desarrollo:
```
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` (o el siguiente puerto disponible)

## Configuración de la base de datos

### Crear tablas en Supabase

1. Accede a la interfaz de Supabase: https://supapers.itmconsulting.es
2. Ve a la sección "SQL Editor"
3. Ejecuta el contenido del archivo `database_schema.sql`:

```sql
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
```

## Despliegue con Docker

1. Construir la imagen de Docker:
   ```
   docker build -t dashboard-codexa .
   ```

2. Ejecutar el contenedor:
   ```
   docker run -d -p 80:80 --name dashboard-codexa dashboard-codexa
   ```

O usar docker-compose:
```
docker-compose up -d
```

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
├── contexts/         # Contextos de React (Supabase)
├── pages/            # Páginas principales de la aplicación
├── utils/            # Utilidades y funciones auxiliares
├── App.jsx           # Componente principal
├── main.jsx          # Punto de entrada de la aplicación
```

## Funcionalidades

### Dashboard
- Página principal con información general

### Calendario
- Sistema de pestañas para diferentes calendarios
- Gestión de ítems por calendario
- Seguimiento de progreso diario
- Marcado de ítems como completados
- Asignación de valores numéricos o textuales
- **Agregar nuevos calendarios** mediante un botón y formulario modal

## Desarrollo futuro

- Implementación de autenticación de usuarios
- Mejora de la interfaz de usuario
- Agregar más tipos de ítems
- Implementar notificaciones
- Añadir estadísticas y gráficos

## Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request