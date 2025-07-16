#!/bin/bash

echo "🚀 Iniciando ML Traffic Analyzer en Render..."

# Crear directorios necesarios
mkdir -p backend/logs backend/ml_models processed

# Configurar variables de entorno
export PYTHONPATH=/opt/render/project/src/backend:/opt/render/project/src
export PORT=${PORT:-8000}

# Cambiar al directorio raíz del proyecto
cd /opt/render/project/src

# Iniciar aplicación desde main.py
echo "✅ Iniciando aplicación en puerto $PORT..."
python backend/main.py
