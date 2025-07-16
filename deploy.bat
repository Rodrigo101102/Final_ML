@echo off
REM Deploy script for Windows users

echo 🚀 Preparing Final_ML for deployment...

REM Create production environment file
(
echo # Production Environment Variables
echo ENVIRONMENT=production
echo DEBUG=False
echo SERVER_PORT=8010
echo.
echo # Database ^(will be overridden by hosting platform^)
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=railway
echo DB_USER=postgres
echo DB_PASSWORD=your_password_here
echo.
echo # Network capture settings ^(limited in hosting^)
echo CAPTURE_TIMEOUT=60
echo DEFAULT_INTERFACE=eth0
echo DEMO_MODE=True
echo.
echo # Security
echo SECRET_KEY=your_secret_key_here
echo ALLOWED_HOSTS=*
echo.
echo # Logging
echo LOG_LEVEL=INFO
) > backend\.env.production

echo ✅ Deployment files created!
echo.
echo 📋 Next steps:
echo 1. Push to GitHub: git add . ^&^& git commit -m "Deploy setup" ^&^& git push
echo 2. Go to railway.app and connect your repository
echo 3. Add PostgreSQL service
echo 4. Set environment variables from backend\.env.production
echo 5. Deploy! 🚀
echo.
echo 🌐 Your app will be available at: https://your-app.railway.app

pause
