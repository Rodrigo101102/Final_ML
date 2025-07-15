@echo off
echo ========================================
echo LIMPIANDO ARCHIVOS Y CARPETAS NO USADOS
echo ========================================

echo.
echo [1/4] Eliminando frontend duplicado...
if exist "frontend" rmdir /s /q "frontend"

echo [2/4] Eliminando carpetas temporales...
REM if exist "creados" rmdir /s /q "creados" -- CONSERVADO
if exist "processed" rmdir /s /q "processed"
if exist "logs" rmdir /s /q "logs"

echo [3/4] Limpiando backend...
cd backend
if exist "api" rmdir /s /q "api"
if exist "middleware" rmdir /s /q "middleware"
if exist "models" rmdir /s /q "models"
if exist "scripts" rmdir /s /q "scripts"
REM if exist "creados" rmdir /s /q "creados" -- CONSERVADO
if exist "processed" rmdir /s /q "processed"

if exist "app.py" del /q "app.py"
REM if exist "main.py" del /q "main.py" -- CONSERVADO
if exist "database.py" del /q "database.py"
if exist "models.py" del /q "models.py"
if exist "schemas.py" del /q "schemas.py"
if exist "setup_database.py" del /q "setup_database.py"
if exist "traffic_predictions.db" del /q "traffic_predictions.db"
if exist "Dockerfile" del /q "Dockerfile"
if exist "package-lock.json" del /q "package-lock.json"

cd ..

echo [4/4] Limpiando frontend-react...
cd frontend-react
REM if exist "src" rmdir /s /q "src" -- CONSERVADO
REM if exist "package-frontend.json" del /q "package-frontend.json" -- CONSERVADO
cd ..

if exist "docker-compose.yml" del /q "docker-compose.yml"

echo.
echo ========================================
echo LIMPIEZA COMPLETADA
echo ========================================
echo.
echo ARCHIVOS CONSERVADOS IMPORTANTES:
echo - backend/app_postgres.py (servidor principal)
echo - backend/main.py (CONSERVADO)
echo - backend/services/ (servicios ML)
echo - backend/ml_models/ (modelos entrenados)
echo - backend/flowmeter/ (captura de tráfico)
echo - backend/creados/ (CONSERVADO)
echo - creados/ (CONSERVADO)
echo - frontend-react/server.js (servidor frontend)
echo - frontend-react/public/frontend.html (interfaz)
echo - frontend-react/src/ (CONSERVADO)
echo - frontend-react/package-frontend.json (CONSERVADO)
echo.
pause
