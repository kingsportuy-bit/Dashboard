#!/bin/bash

# Script para probar la conexión al VPS

echo "Probando conexión al VPS..."

# Probar conexión SSH
echo "Probando conexión SSH..."
ssh -o ConnectTimeout=10 localroot@31.97.28.4 "echo 'Conexión SSH exitosa'"

if [ $? -eq 0 ]; then
    echo "✓ Conexión SSH establecida correctamente"
else
    echo "✗ No se pudo establecer conexión SSH"
    exit 1
fi

# Probar si Docker está instalado
echo "Verificando Docker en el VPS..."
ssh localroot@31.97.28.4 "docker --version"

if [ $? -eq 0 ]; then
    echo "✓ Docker está instalado en el VPS"
else
    echo "✗ Docker no está instalado en el VPS"
fi

# Probar si Docker Compose está instalado
echo "Verificando Docker Compose en el VPS..."
ssh localroot@31.97.28.4 "docker-compose --version"

if [ $? -eq 0 ]; then
    echo "✓ Docker Compose está instalado en el VPS"
else
    echo "✗ Docker Compose no está instalado en el VPS"
fi

# Verificar si la red oraclelabsnet existe
echo "Verificando red Docker oraclelabsnet..."
ssh localroot@31.97.28.4 "docker network ls | grep oraclelabsnet"

if [ $? -eq 0 ]; then
    echo "✓ La red Docker oraclelabsnet existe"
else
    echo "✗ La red Docker oraclelabsnet no existe"
fi

echo "Prueba de conexión completada."