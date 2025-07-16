#!/bin/bash

echo "🐳 Iniciando ML Traffic Analyzer con Docker..."
echo

echo "⏬ Construyendo contenedores..."
docker-compose build

echo
echo "🚀 Iniciando servicios..."
docker-compose up -d

echo
echo "✅ Servicios iniciados:"
echo "   📡 Backend API: http://localhost:8000"
echo "   🌐 Frontend: http://localhost:3000"
echo "   📊 API Docs: http://localhost:8000/docs"
echo "   🗄️ PostgreSQL: localhost:5432"
echo

echo "📋 Comandos útiles:"
echo "   Ver logs: docker-compose logs -f"
echo "   Parar: docker-compose down"
echo "   Reiniciar: docker-compose restart"

read -p "Presiona Enter para continuar..."
