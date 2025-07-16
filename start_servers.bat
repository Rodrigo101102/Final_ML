@echo off
echo ========================================
echo ML Traffic Analyzer - Iniciando Servidores
echo ========================================
echo.

echo Iniciando Backend (FastAPI)...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python app_postgres.py"

timeout /t 3 /nobreak > nul

echo Iniciando Frontend (React)...
start "Frontend" cmd /k "cd frontend-react && node server.js"

echo.
echo ========================================
echo SERVIDORES INICIADOS:
echo ========================================
echo Backend:  http://localhost:8010
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause > nul

start http://localhost:3000
