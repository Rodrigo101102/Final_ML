#!/bin/bash

# Deploy script for hosting platforms
echo "🚀 Preparing Final_ML for deployment..."

# Create production environment file
cat > backend/.env.production << EOL
# Production Environment Variables
ENVIRONMENT=production
DEBUG=False
SERVER_PORT=8010

# Database (will be overridden by hosting platform)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your_password_here

# Network capture settings (limited in hosting)
CAPTURE_TIMEOUT=60
DEFAULT_INTERFACE=eth0
DEMO_MODE=True

# Security
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=*

# Logging
LOG_LEVEL=INFO
EOL

# Create simplified requirements.txt for hosting
cat > requirements-hosting.txt << EOL
fastapi==0.104.1
uvicorn[standard]==0.24.0
pandas==2.1.3
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-multipart==0.0.6
python-dotenv==1.0.0
scikit-learn==1.3.2
numpy==1.24.3
pydantic==2.5.0
EOL

# Create Docker Compose for local testing
cat > docker-compose.yml << EOL
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: trafic_red
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8010:8010"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=trafic_red
      - DB_USER=postgres
      - DB_PASSWORD=password123
      - ENVIRONMENT=production
    depends_on:
      - postgres
    volumes:
      - ./backend:/app/backend

volumes:
  postgres_data:
EOL

echo "✅ Deployment files created!"
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git add . && git commit -m 'Deploy setup' && git push"
echo "2. Go to railway.app and connect your repository"
echo "3. Add PostgreSQL service"
echo "4. Set environment variables from backend/.env.production"
echo "5. Deploy! 🚀"
echo ""
echo "🌐 Your app will be available at: https://your-app.railway.app"
