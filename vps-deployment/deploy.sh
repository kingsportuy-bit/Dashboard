#!/bin/bash

# Script de despliegue para Dashboard Codexa
# Este script automatiza el despliegue en el VPS

echo "Iniciando despliegue del Dashboard Codexa..."

# Verificar si estamos en el VPS correcto
if [ ! -d "/var/www" ]; then
  echo "Error: No parece que estés en el VPS correcto"
  exit 1
fi

# Crear directorio si no existe
sudo mkdir -p /var/www/dashboard.codexa.uy

# Navegar al directorio
cd /var/www/dashboard.codexa.uy

# Si el directorio no está vacío, hacer pull, de lo contrario clonar
if [ -d ".git" ]; then
  echo "Actualizando repositorio..."
  git pull origin main
else
  echo "Clonando repositorio..."
  git clone https://github.com/kingsportuy-bit/Dashboard .
fi

# Verificar si existe .env, si no copiar de ejemplo
if [ ! -f ".env" ]; then
  echo "Creando archivo .env desde ejemplo..."
  cp .env.example .env
  echo "Por favor editar .env con las credenciales apropiadas"
fi

# Construir y ejecutar con docker-compose
echo "Iniciando servicios con Docker Compose..."
docker-compose up -d

echo "Despliegue completado. La aplicación debería estar disponible en https://dashboard.codexa.uy"