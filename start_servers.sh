#!/bin/bash

echo "========================================"
echo "ML Traffic Analyzer - Iniciando Servidores"
echo "========================================"
echo

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que todo esté instalado
if [ ! -d "backend/venv" ]; then
    echo -e "${RED}❌ Entorno virtual no encontrado${NC}"
    echo "🚀 Ejecuta primero: ./install.sh"
    exit 1
fi

if [ ! -d "frontend-react/node_modules" ]; then
    echo -e "${RED}❌ Dependencias de React no encontradas${NC}"
    echo "🚀 Ejecuta primero: ./install.sh"
    exit 1
fi

echo -e "${GREEN}✅ Verificación completada${NC}"
echo

echo "[1/2] 🐍 Iniciando Backend (FastAPI)..."
cd backend
source venv/bin/activate

# Función para limpiar procesos al salir
cleanup() {
    echo
    echo "🛑 Deteniendo servidores..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "✅ Servidores detenidos"
    exit 0
}

# Configurar trap para limpieza
trap cleanup SIGINT SIGTERM

# Iniciar backend en background
python app_postgres.py &
BACKEND_PID=$!

cd ..

echo "   ⏳ Esperando que el backend inicie..."
sleep 5

echo "[2/2] ⚛️  Inicando Frontend (React)..."
cd frontend-react

# Iniciar frontend en background
node server.js &
FRONTEND_PID=$!

cd ..

echo
echo "========================================"
echo "        ✅ SERVIDORES INICIADOS"
echo "========================================"
echo
echo "🌐 URLs de la aplicación:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8010"
echo
echo "📋 Para detener:"
echo "   Presiona Ctrl+C en esta terminal"
echo
echo "🔧 Para verificar estado:"
echo "   Ejecuta: python3 check_system.py"
echo

# Esperar indefinidamente hasta que el usuario presione Ctrl+C
echo "⏳ Servidores ejecutándose... (Ctrl+C para detener)"
while true; do
    # Verificar que los procesos sigan corriendo
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend se detuvo inesperadamente${NC}"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend se detuvo inesperadamente${NC}"
        break
    fi
    sleep 5
done

cleanup
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
