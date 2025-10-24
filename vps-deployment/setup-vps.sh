#!/bin/bash

# Script de configuración inicial del VPS para Dashboard Codexa
# Este script prepara el entorno en un VPS limpio

echo "Configurando VPS para Dashboard Codexa..."

# Actualizar sistema
echo "Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Docker si no está instalado
if ! command -v docker &> /dev/null
then
    echo "Instalando Docker..."
    sudo apt install docker.io -y
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker ya está instalado"
fi

# Instalar Docker Compose si no está instalado
if ! command -v docker-compose &> /dev/null
then
    echo "Instalando Docker Compose..."
    sudo apt install docker-compose -y
else
    echo "Docker Compose ya está instalado"
fi

# Crear red Docker para Traefik si no existe
if ! docker network ls | grep -q oraclelabsnet
then
    echo "Creando red Docker oraclelabsnet..."
    docker network create oraclelabsnet
else
    echo "La red Docker oraclelabsnet ya existe"
fi

# Crear directorio para la aplicación
sudo mkdir -p /var/www/dashboard.codexa.uy

echo "Configuración inicial completada."
echo "Siguientes pasos:"
echo "1. cd /var/www/dashboard.codexa.uy"
echo "2. git clone https://github.com/kingsportuy-bit/Dashboard ."
echo "3. Configurar .env con tus credenciales"
echo "4. docker-compose up -d"