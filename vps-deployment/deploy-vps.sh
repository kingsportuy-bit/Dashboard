#!/bin/bash

# Script de despliegue completo para Dashboard Codexa en VPS
# Este script automatiza todo el proceso de despliegue

echo "=== Despliegue de Dashboard Codexa ==="

# Verificar si estamos en el VPS correcto
if [ ! -d "/var/www" ]; then
  echo "Error: No parece que estés en el VPS correcto"
  exit 1
fi

echo "1. Creando directorio de la aplicación..."
sudo mkdir -p /var/www/dashboard.codexa.uy

echo "2. Navegando al directorio..."
cd /var/www/dashboard.codexa.uy

echo "3. Copiando archivos de despliegue..."
cp /home/localroot/dashboard-deployment.tar.gz .

echo "4. Extrayendo archivos..."
tar -xzf dashboard-deployment.tar.gz

echo "5. Verificando contenido..."
ls -la

echo "6. Configurando permisos..."
chmod +x deploy.sh
chmod +x setup-vps.sh

echo "7. Ejecutando configuración inicial..."
./setup-vps.sh

echo "8. Creando archivo .env..."
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Por favor editar .env con las credenciales apropiadas"
fi

echo "9. Iniciando servicios con Docker Compose..."
docker-compose up -d

echo "10. Verificando estado de los contenedores..."
docker-compose ps

echo "=== Despliegue completado ==="
echo "La aplicación debería estar disponible en https://dashboard.codexa.uy"