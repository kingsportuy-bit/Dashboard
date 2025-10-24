# Despliegue del Dashboard Codexa

## Prerrequisitos

1. Acceso al VPS con Ubuntu 20.04.6 LTS
2. Docker y Docker Compose instalados
3. Red Docker 'oraclelabsnet' creada
4. Traefik configurado con Let's Encrypt

## Pasos para el despliegue

1. Conectarse al VPS
2. Crear directorio para la aplicación
3. Clonar el repositorio
4. Configurar variables de entorno
5. Ejecutar docker-compose

## Comandos de despliegue

```bash
# Conectarse al VPS
ssh localroot@31.97.28.4

# Crear directorio
sudo mkdir -p /var/www/dashboard.codexa.uy

# Navegar al directorio
cd /var/www/dashboard.codexa.uy

# Clonar repositorio
git clone https://github.com/kingsportuy-bit/Dashboard .

# Crear archivo .env
cp .env.example .env
# Editar .env con las credenciales apropiadas

# Ejecutar la aplicación
docker-compose up -d
```