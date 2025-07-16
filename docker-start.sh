#!/bin/bash

echo "🐳 Iniciando ML Traffic Analyzer con Docker..."

# Verificar si PostgreSQL está listo
echo "⏳ Esperando PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ PostgreSQL listo"

# Cambiar al directorio backend
cd /app/backend

# Iniciar servidor backend en segundo plano
echo "🚀 Iniciando servidor backend..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &

# Servir frontend estático
echo "🌐 Iniciando servidor frontend..."
cd /app
python -m http.server 3000 --directory frontend &

# Mantener contenedor activo
echo "✅ Servidores iniciados:"
echo "   📡 Backend API: http://localhost:8000"
echo "   🌐 Frontend: http://localhost:3000"
echo "   📊 Docs API: http://localhost:8000/docs"

# Esperar indefinidamente
wait
