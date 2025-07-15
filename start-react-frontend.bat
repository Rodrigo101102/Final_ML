@echo off
echo ==============================================
echo    ML Traffic Analyzer - React Frontend
echo ==============================================
echo.
echo Instalando dependencias...
cd /d "C:\Final_ML\frontend-react"
call npm install

echo.
echo Construyendo aplicacion React...
call npm run build

echo.
echo Iniciando servidor React en puerto 3000...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8003
echo.
call npm run serve

pause
