@echo off
echo ========================================
echo ML Traffic Analyzer - Iniciando Servidores
echo ========================================
echo.

REM Verificar que todo esté instalado
if not exist "backend\venv" (
    echo ❌ Entorno virtual no encontrado
    echo 🚀 Ejecuta primero: install.bat
    pause
    exit /b 1
)

if not exist "frontend-react\node_modules" (
    echo ❌ Dependencias de React no encontradas
    echo 🚀 Ejecuta primero: install.bat
    pause
    exit /b 1
)

echo ✅ Verificación completada
echo.

echo [1/2] 🐍 Iniciando Backend (FastAPI)...
start "ML-Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && python app_postgres.py"

echo    ⏳ Esperando que el backend inicie...
timeout /t 5 /nobreak > nul

echo [2/2] ⚛️  Iniciando Frontend (React)...
start "ML-Frontend" cmd /k "cd /d %~dp0frontend-react && node server.js"

echo.
echo ========================================
echo        ✅ SERVIDORES INICIADOS
echo ========================================
echo.
echo 🌐 URLs de la aplicación:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8010
echo.
echo 📋 Para detener:
echo    Cierra las ventanas de terminal que se abrieron
echo.
echo 🔧 Para verificar estado:
echo    Ejecuta: check_system.py
echo.
echo ========================================
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause > nul

start http://localhost:3000
