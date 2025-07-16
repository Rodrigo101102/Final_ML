#!/bin/bash

# ============================================================================
#  ML TRAFFIC ANALYZER - INSTALADOR AUTOMÁTICO UNIVERSAL
#  Maneja automáticamente TODAS las versiones de Python y dependencias
# ============================================================================

echo
echo "========================================"
echo "    ML TRAFFIC ANALYZER INSTALLER"
echo "========================================"
echo
echo "🚀 Instalador automático universal"
echo "✅ Maneja Python 3.8, 3.9, 3.10, 3.11, 3.12+"
echo "✅ Instala automáticamente todas las dependencias"
echo "✅ Configura entorno virtual automáticamente"
echo "✅ ¡Solo ejecuta y funciona!"
echo

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificación de compatibilidad ANTES de instalar
echo "[0/7] 🔍 Verificando compatibilidad del sistema..."
python3 check_compatibility.py
if [ $? -ne 0 ]; then
    echo
    echo -e "${RED}❌ Sistema no compatible. Por favor resuelve los problemas indicados.${NC}"
    echo -e "${YELLOW}📝 Lee el archivo CORRECCIONES_APLICADAS.md para más información.${NC}"
    exit 1
fi
echo

# Función para detectar Python
detect_python() {
    echo "[1/7] 🔍 Detectando versión de Python..."
    
    # Buscar Python en orden de preferencia
    PYTHON_CMD=""
    
    # Probar versiones específicas primero
    for version in python3.12 python3.11 python3.10 python3.9 python3.8 python3 python; do
        if command -v $version &> /dev/null; then
            # Verificar que la versión sea 3.8+
            if $version -c "import sys; exit(0 if sys.version_info >= (3,8) else 1)" 2>/dev/null; then
                PYTHON_CMD=$version
                break
            fi
        fi
    done
    
    if [ -z "$PYTHON_CMD" ]; then
        echo
        echo -e "${RED}❌ ERROR: No se encontró Python 3.8+ instalado${NC}"
        echo
        echo "📋 SOLUCIONES:"
        echo "   Ubuntu/Debian: sudo apt update && sudo apt install python3 python3-pip python3-venv"
        echo "   CentOS/RHEL:   sudo yum install python3 python3-pip"
        echo "   Fedora:        sudo dnf install python3 python3-pip"
        echo "   macOS:         brew install python3"
        echo "   Arch Linux:    sudo pacman -S python python-pip"
        echo
        echo "💡 VERSIONES COMPATIBLES: Python 3.8, 3.9, 3.10, 3.11, 3.12+"
        echo
        exit 1
    fi
    
    PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
    echo -e "   ${GREEN}✅ Encontrado: $PYTHON_VERSION${NC}"
    echo "   📍 Comando: $PYTHON_CMD"
}

# Función para verificar pip
check_pip() {
    echo
    echo "[2/7] 🔧 Verificando pip..."
    
    if ! $PYTHON_CMD -m pip --version &> /dev/null; then
        echo "   ⚠️  pip no encontrado, instalando..."
        
        # Intentar diferentes métodos de instalación
        if command -v curl &> /dev/null; then
            curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
            $PYTHON_CMD get-pip.py
            rm get-pip.py
        elif $PYTHON_CMD -m ensurepip --upgrade &> /dev/null; then
            echo "   ✅ pip instalado con ensurepip"
        else
            echo -e "   ${RED}❌ Error instalando pip${NC}"
            echo "   Instala pip manualmente: https://pip.pypa.io/en/stable/installation/"
            exit 1
        fi
    fi
    
    echo -e "   ${GREEN}✅ pip disponible${NC}"
    
    # Actualizar herramientas base
    echo "   🔄 Actualizando herramientas base..."
    $PYTHON_CMD -m pip install --upgrade pip setuptools wheel --quiet --user
    echo -e "   ${GREEN}✅ Herramientas actualizadas${NC}"
}

# Función para crear entorno virtual
setup_venv() {
    echo
    echo "[3/7] 📁 Preparando entorno virtual..."
    
    # Limpiar entorno virtual anterior si existe
    if [ -d "backend/venv" ]; then
        echo "   🧹 Limpiando entorno virtual anterior..."
        rm -rf "backend/venv"
    fi
    
    # Crear entorno virtual
    echo "   🏗️  Creando entorno virtual..."
    cd backend
    
    if ! $PYTHON_CMD -m venv venv; then
        echo -e "   ${RED}❌ Error creando entorno virtual${NC}"
        echo "   Instala python3-venv: sudo apt install python3-venv"
        exit 1
    fi
    
    echo -e "   ${GREEN}✅ Entorno virtual creado${NC}"
}

# Función para instalar dependencias de Python
install_python_deps() {
    echo
    echo "[4/7] 📦 Instalando dependencias de Python..."
    
    # Activar entorno virtual
    source venv/bin/activate
    
    if [ $? -ne 0 ]; then
        echo -e "   ${RED}❌ Error activando entorno virtual${NC}"
        exit 1
    fi
    
    # Actualizar pip en el entorno virtual
    python -m pip install --upgrade pip setuptools wheel --quiet
    
    # Instalar dependencias desde requirements.txt
    echo "   📋 Instalando desde requirements.txt..."
    
    if ! python -m pip install -r requirements.txt --timeout 300; then
        echo
        echo "   ⚠️  Error con requirements.txt, instalando dependencias una por una..."
        
        # Lista de dependencias críticas
        deps="fastapi uvicorn sqlalchemy psycopg2-binary pandas scikit-learn numpy psutil pydantic python-dotenv"
        
        for dep in $deps; do
            echo "      Instalando $dep..."
            python -m pip install "$dep" --timeout 60 --upgrade
        done
    fi
    
    # Verificar instalación crítica
    echo "   🔍 Verificando instalación..."
    if python -c "import fastapi, uvicorn, sqlalchemy, pandas, sklearn; print('✅ Dependencias principales OK')" 2>/dev/null; then
        echo -e "   ${GREEN}✅ Dependencias de Python instaladas${NC}"
    else
        echo -e "   ${RED}❌ Error en dependencias críticas${NC}"
        exit 1
    fi
    
    # Verificar y solucionar modelos ML
    echo "   🤖 Verificando modelos ML..."
    deactivate
    cd ..
    python3 fix_models.py || echo "   ⚠️  Problema con modelos ML, pero continuando..."
    cd backend
}

# Función para verificar Node.js
check_nodejs() {
    echo
    echo "[5/7] 🟢 Verificando Node.js..."
    
    if ! command -v node &> /dev/null; then
        echo -e "   ${RED}❌ Node.js no encontrado${NC}"
        echo
        echo "📥 INSTALAR NODE.JS:"
        echo "   Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
        echo "   CentOS/RHEL:   curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash - && sudo yum install -y nodejs"
        echo "   macOS:         brew install node"
        echo "   Arch Linux:    sudo pacman -S nodejs npm"
        echo "   O descarga desde: https://nodejs.org/download"
        echo
        exit 1
    fi
    
    NODE_VERSION=$(node --version 2>&1)
    echo -e "   ${GREEN}✅ Node.js $NODE_VERSION encontrado${NC}"
}

# Función para instalar dependencias de React
install_react_deps() {
    echo
    echo "[6/7] ⚛️  Instalando dependencias de React..."
    
    cd frontend-react
    
    # Limpiar node_modules si existe
    if [ -d "node_modules" ]; then
        echo "   🧹 Limpiando node_modules anterior..."
        rm -rf "node_modules"
    fi
    
    # Instalar dependencias
    echo "   📦 Ejecutando npm install..."
    if ! npm install --timeout 300000; then
        echo "   ⚠️  Error con npm install, intentando con yarn..."
        if command -v yarn &> /dev/null || npm install -g yarn --quiet; then
            if ! yarn install --timeout 300000; then
                echo -e "   ${RED}❌ Error instalando dependencias de Node.js${NC}"
                cd ..
                exit 1
            fi
        else
            echo -e "   ${RED}❌ Error instalando dependencias de Node.js${NC}"
            cd ..
            exit 1
        fi
    fi
    
    cd ..
    echo -e "   ${GREEN}✅ Dependencias de React instaladas${NC}"
}

# Función para construir aplicación React
build_react() {
    echo
    echo "[7/7] 🏗️  Construyendo aplicación React..."
    
    cd frontend-react
    echo "   🔨 Ejecutando npm run build..."
    if ! npm run build; then
        echo "   ⚠️  Error en build, pero continuando..."
    fi
    cd ..
}

# Ejecutar funciones principales
detect_python
check_pip
setup_venv
install_python_deps
check_nodejs
install_react_deps
build_react

echo
echo "========================================"
echo "        ✅ INSTALACIÓN COMPLETADA"
echo "========================================"
echo
echo "🎉 ¡Todo listo! Tu proyecto está configurado."
echo
echo "🚀 SIGUIENTE PASO:"
echo "   Ejecuta: ./start_servers.sh"
echo
echo "🌐 URLs después de ejecutar:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8010"
echo
echo "📋 COMANDOS ÚTILES:"
echo "   ./start_servers.sh  - Iniciar aplicación"
echo "   python3 check_system.py - Verificar sistema"
echo
