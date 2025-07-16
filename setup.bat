@echo off
echo ========================================
echo ML Traffic Analyzer - Setup Script
echo ========================================
echo.

echo [1/6] Verificando Python...
python --version
if errorlevel 1 (
    echo ERROR: Python no está instalado. Por favor instala Python 3.9+ desde https://python.org
    pause
    exit /b 1
)

echo [2/6] Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

echo [3/6] Configurando Backend...
cd backend
if not exist "venv" (
    echo Creando entorno virtual...
    python -m venv venv
)

echo Activando entorno virtual...
call venv\Scripts\activate.bat

echo Instalando dependencias de Python...
pip install -r requirements.txt

if not exist ".env" (
    echo Copiando archivo de configuración...
    copy .env.example .env
    echo.
    echo IMPORTANTE: Edita el archivo backend\.env con tus credenciales de PostgreSQL
    echo.
)

cd ..

echo [4/6] Configurando Frontend...
cd frontend-react

echo Instalando dependencias de Node.js...
npm install

echo Construyendo aplicación React...
npm run build

cd ..

echo [5/6] Verificando servicios requeridos...
echo Verificando PostgreSQL...
psql --version
if errorlevel 1 (
    echo ADVERTENCIA: PostgreSQL no está en el PATH. Asegúrate de que esté instalado.
)

echo [6/6] Setup completado!
echo.
echo ========================================
echo PRÓXIMOS PASOS:
echo ========================================
echo 1. Edita backend\.env con tus credenciales de PostgreSQL
echo 2. Crea la base de datos 'trafic_red' en PostgreSQL
echo 3. Ejecuta start_servers.bat para iniciar la aplicación
echo ========================================
echo.
pause
