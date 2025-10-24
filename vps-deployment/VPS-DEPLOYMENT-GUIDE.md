# Guía de Despliegue en VPS para Dashboard Codexa

## Información del VPS

- **IP**: 31.97.28.4
- **Usuario**: localroot
- **Puerto SSH**: 22
- **Sistema Operativo**: Ubuntu 20.04.6 LTS
- **Dominio**: dashboard.codexa.uy
- **Proxy Reverso**: Traefik con Let's Encrypt

## Prerrequisitos

Antes de comenzar, asegúrate de tener:

1. Acceso SSH al VPS
2. Credenciales del repositorio GitHub
3. Credenciales de Supabase

## Pasos de Despliegue

### 1. Conexión al VPS

```bash
ssh localroot@31.97.28.4
```

### 2. Verificación del Entorno

Una vez conectado, verifica que Docker y Docker Compose estén instalados:

```bash
docker --version
docker-compose --version
```

Verifica que la red Docker para Traefik exista:

```bash
docker network ls | grep oraclelabsnet
```

Si la red no existe, créala:

```bash
docker network create oraclelabsnet
```

### 3. Preparación del Directorio

```bash
sudo mkdir -p /var/www/dashboard.codexa.uy
cd /var/www/dashboard.codexa.uy
```

### 4. Clonación del Repositorio

```bash
git clone https://github.com/kingsportuy-bit/Dashboard .
```

### 5. Configuración de Variables de Entorno

Crea un archivo `.env` basado en el ejemplo:

```bash
cp .env.example .env
nano .env
```

Edita el archivo con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 6. Despliegue con Docker Compose

```bash
docker-compose up -d
```

### 7. Verificación del Despliegue

Verifica que los contenedores estén corriendo:

```bash
docker-compose ps
```

Verifica los logs:

```bash
docker-compose logs
```

## Scripts de Automatización

En el directorio `deploy` encontrarás scripts útiles:

- `setup-vps.sh`: Configura un VPS desde cero
- `deploy.sh`: Automatiza el proceso de despliegue
- `test-connection.sh`: Prueba la conexión al VPS

## Resolución de Problemas

### Problemas Comunes

1. **Permiso denegado al clonar el repositorio**:
   - Verifica las credenciales de GitHub
   - Considera usar un token de acceso personal

2. **Error de red Docker**:
   - Asegúrate de que la red `oraclelabsnet` exista
   - Verifica la configuración de Traefik

3. **Problemas con Let's Encrypt**:
   - Verifica que el dominio apunte a la IP correcta
   - Revisa los logs de Traefik

### Verificación de Logs

Para ver los logs de la aplicación:

```bash
docker-compose logs dashboard
```

Para ver los logs en tiempo real:

```bash
docker-compose logs -f dashboard
```

## Mantenimiento

### Actualización de la Aplicación

Para actualizar la aplicación a la última versión:

```bash
cd /var/www/dashboard.codexa.uy
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Reinicio del Servicio

Para reiniciar el servicio:

```bash
cd /var/www/dashboard.codexa.uy
docker-compose restart
```