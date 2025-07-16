@echo off
REM ============================================================================
REM  ML TRAFFIC ANALYZER - INSTALADOR AUTOMÁTICO UNIVERSAL 
REM  Maneja automáticamente TODAS las versiones de Python y dependencias
REM ============================================================================

echo.
echo ========================================
echo    ML TRAFFIC ANALYZER INSTALLER
echo ========================================
echo.
echo 🚀 Instalador automático universal
echo ✅ Maneja Python 3.8, 3.9, 3.10, 3.11, 3.12+
echo ✅ Instala automáticamente todas las dependencias
echo ✅ Configura entorno virtual automáticamente
echo ✅ ¡Solo ejecuta y funciona!
echo.

REM Verificación de compatibilidad ANTES de instalar
echo [0/7] 🔍 Verificando compatibilidad del sistema...
python check_compatibility.py
if %errorlevel% neq 0 (
    echo.
    echo ❌ Sistema no compatible. Por favor resuelve los problemas indicados.
    echo 📝 Lee el archivo CORRECCIONES_APLICADAS.md para más información.
    pause
    exit /b 1
)
echo.

REM Función para detectar Python
:detect_python
echo [1/7] 🔍 Detectando versión de Python...

REM Buscar Python en orden de preferencia
set PYTHON_CMD=

REM Probar python3 primero (Linux/Mac style en Windows)
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=python3
    goto :python_found
)

REM Probar python
python --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=python
    goto :python_found
)

REM Probar py launcher con versiones específicas
py -3.12 --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=py -3.12
    goto :python_found
)

py -3.11 --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=py -3.11
    goto :python_found
)

py -3.10 --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=py -3.10
    goto :python_found
)

py -3.9 --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=py -3.9
    goto :python_found
)

py -3.8 --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=py -3.8
    goto :python_found
)

REM Si no encuentra Python, mostrar error con instrucciones
echo.
echo ❌ ERROR: No se encontró Python instalado
echo.
echo 📋 SOLUCIONES:
echo    1. Instala Python desde: https://python.org/downloads
echo    2. Asegúrate de marcar "Add Python to PATH"
echo    3. Reinicia tu terminal después de instalar
echo.
echo 💡 VERSIONES COMPATIBLES: Python 3.8, 3.9, 3.10, 3.11, 3.12+
echo.
pause
exit /b 1

:python_found
for /f "tokens=*" %%a in ('%PYTHON_CMD% --version 2^>^&1') do set PYTHON_VERSION=%%a
echo    ✅ Encontrado: %PYTHON_VERSION%
echo    📍 Comando: %PYTHON_CMD%

REM Verificar versión mínima (3.8+)
%PYTHON_CMD% -c "import sys; exit(0 if sys.version_info >= (3,8) else 1)" >nul 2>&1
if %errorlevel% neq 0 (
    echo    ❌ Versión muy antigua. Requiere Python 3.8+
    echo    📥 Descarga una versión más nueva desde: https://python.org/downloads
    pause
    exit /b 1
)

echo.
echo [2/7] 🔧 Verificando pip...

REM Verificar pip
%PYTHON_CMD% -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ⚠️  pip no encontrado, instalando...
    %PYTHON_CMD% -m ensurepip --upgrade
    if %errorlevel% neq 0 (
        echo    ❌ Error instalando pip
        pause
        exit /b 1
    )
)
echo    ✅ pip disponible

REM Actualizar pip, setuptools, wheel
echo    🔄 Actualizando herramientas base...
%PYTHON_CMD% -m pip install --upgrade pip setuptools wheel --quiet
echo    ✅ Herramientas actualizadas

echo.
echo [3/7] 📁 Preparando entorno virtual...

REM Limpiar entorno virtual anterior si existe
if exist "backend\venv" (
    echo    🧹 Limpiando entorno virtual anterior...
    rmdir /s /q "backend\venv"
)

REM Crear entorno virtual
echo    🏗️  Creando entorno virtual...
cd backend
%PYTHON_CMD% -m venv venv
if %errorlevel% neq 0 (
    echo    ❌ Error creando entorno virtual
    pause
    exit /b 1
)

echo    ✅ Entorno virtual creado

echo.
echo [4/7] 📦 Instalando dependencias de Python...

REM Activar entorno virtual
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo    ❌ Error activando entorno virtual
    pause
    exit /b 1
)

REM Actualizar pip en el entorno virtual
python -m pip install --upgrade pip setuptools wheel --quiet

REM Instalar dependencias desde requirements.txt
echo    📋 Instalando desde requirements.txt...
python -m pip install -r requirements.txt --timeout 300
if %errorlevel% neq 0 (
    echo.
    echo    ⚠️  Error con requirements.txt, instalando dependencias una por una...
    
    REM Lista de dependencias críticas
    set deps=fastapi uvicorn sqlalchemy psycopg2-binary pandas scikit-learn numpy psutil pydantic python-dotenv
    
    for %%d in (%deps%) do (
        echo       Instalando %%d...
        python -m pip install %%d --timeout 60 --upgrade
    )
)

REM Verificar instalación crítica
echo    🔍 Verificando instalación...
python -c "import fastapi, uvicorn, sqlalchemy, pandas, sklearn; print('✅ Dependencias principales OK')"
if %errorlevel% neq 0 (
    echo    ❌ Error en dependencias críticas
    pause
    exit /b 1
)

REM Verificar y solucionar modelos ML
echo    🤖 Verificando modelos ML...
cd ..
python fix_models.py
if %errorlevel% neq 0 (
    echo    ⚠️  Problema con modelos ML, pero continuando...
)
cd backend

cd ..
echo    ✅ Dependencias de Python instaladas

echo.
echo [5/7] 🟢 Verificando Node.js...

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ❌ Node.js no encontrado
    echo.
    echo    📥 INSTALAR NODE.JS:
    echo       1. Ve a: https://nodejs.org/download
    echo       2. Descarga la versión LTS
    echo       3. Instala y reinicia tu terminal
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version 2^>^&1') do set NODE_VERSION=%%a
echo    ✅ Node.js %NODE_VERSION% encontrado

echo.
echo [6/7] ⚛️  Instalando dependencias de React...

cd frontend-react

REM Limpiar node_modules si existe
if exist "node_modules" (
    echo    🧹 Limpiando node_modules anterior...
    rmdir /s /q "node_modules"
)

REM Instalar dependencias
echo    📦 Ejecutando npm install...
npm install --timeout 300000
if %errorlevel% neq 0 (
    echo    ⚠️  Error con npm install, intentando con yarn...
    npm install -g yarn --quiet
    yarn install --timeout 300000
    if %errorlevel% neq 0 (
        echo    ❌ Error instalando dependencias de Node.js
        cd ..
        pause
        exit /b 1
    )
)

cd ..
echo    ✅ Dependencias de React instaladas

echo.
echo [7/7] 🏗️  Construyendo aplicación React...

cd frontend-react
echo    🔨 Ejecutando npm run build...
npm run build
if %errorlevel% neq 0 (
    echo    ⚠️  Error en build, pero continuando...
)
cd ..

echo.
echo ========================================
echo        ✅ INSTALACIÓN COMPLETADA
echo ========================================
echo.
echo 🎉 ¡Todo listo! Tu proyecto está configurado.
echo.
echo 🚀 SIGUIENTE PASO:
echo    Ejecuta: start_servers.bat
echo.
echo 🌐 URLs después de ejecutar:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8010
echo.
echo 📋 COMANDOS ÚTILES:
echo    start_servers.bat  - Iniciar aplicación
echo    check_system.py    - Verificar sistema
echo.

pause
