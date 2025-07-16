#!/bin/bash

echo "========================================"
echo "ML Traffic Analyzer - Setup Script"
echo "========================================"
echo

echo "[1/6] Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 no está instalado."
    echo "Ubuntu/Debian: sudo apt-get install python3 python3-pip python3-venv"
    echo "CentOS/RHEL: sudo yum install python3 python3-pip"
    echo "macOS: brew install python3"
    exit 1
fi
python3 --version

echo "[2/6] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado."
    echo "Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "CentOS/RHEL: curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo yum install -y nodejs"
    echo "macOS: brew install node"
    exit 1
fi
node --version

echo "[3/6] Configurando Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
fi

echo "Activando entorno virtual..."
source venv/bin/activate

echo "Instalando dependencias de Python..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Copiando archivo de configuración..."
    cp .env.example .env
    echo
    echo "IMPORTANTE: Edita el archivo backend/.env con tus credenciales de PostgreSQL"
    echo
fi

cd ..

echo "[4/6] Configurando Frontend..."
cd frontend-react

echo "Instalando dependencias de Node.js..."
npm install

echo "Construyendo aplicación React..."
npm run build

cd ..

echo "[5/6] Verificando servicios requeridos..."
echo "Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    psql --version
else
    echo "ADVERTENCIA: PostgreSQL no está instalado o no está en el PATH."
    echo "Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "CentOS/RHEL: sudo yum install postgresql postgresql-server"
    echo "macOS: brew install postgresql"
fi

echo "[6/6] Setup completado!"
echo
echo "========================================"
echo "PRÓXIMOS PASOS:"
echo "========================================"
echo "1. Edita backend/.env con tus credenciales de PostgreSQL"
echo "2. Crea la base de datos 'trafic_red' en PostgreSQL"
echo "3. Ejecuta ./start_servers.sh para iniciar la aplicación"
echo "========================================"
echo

chmod +x start_servers.sh
