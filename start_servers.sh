#!/bin/bash

echo "========================================"
echo "ML Traffic Analyzer - Iniciando Servidores"
echo "========================================"
echo

echo "Iniciando Backend (FastAPI)..."
cd backend
source venv/bin/activate
python app_postgres.py &
BACKEND_PID=$!

cd ..

echo "Esperando 3 segundos..."
sleep 3

echo "Iniciando Frontend (React)..."
cd frontend-react
node server.js &
FRONTEND_PID=$!

cd ..

echo
echo "========================================"
echo "SERVIDORES INICIADOS:"
echo "========================================"
echo "Backend:  http://localhost:8010 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo "========================================"
echo
echo "Presiona Ctrl+C para detener ambos servidores"
echo

# Función para limpiar procesos al salir
cleanup() {
    echo
    echo "Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Servidores detenidos."
    exit 0
}

# Capturar señal de interrupción
trap cleanup INT

# Mantener el script corriendo
wait
