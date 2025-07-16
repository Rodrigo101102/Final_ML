#!/usr/bin/env python3
"""
Script de verificación del sistema ML Traffic Analyzer
Verifica que todas las dependencias y servicios estén correctamente instalados.
"""

import sys
import subprocess
import importlib
import os
from pathlib import Path

def check_python_version():
    """Verificar versión de Python"""
    print("🐍 Verificando Python...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 9:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"   ❌ Python {version.major}.{version.minor}.{version.micro} - Requiere Python 3.9+")
        return False

def check_python_packages():
    """Verificar paquetes de Python requeridos"""
    print("📦 Verificando paquetes de Python...")
    required_packages = [
        'fastapi', 'uvicorn', 'sqlalchemy', 'psycopg2', 'pandas', 
        'sklearn', 'numpy', 'psutil', 'pydantic', 'python-dotenv'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            importlib.import_module(package.replace('-', '_'))
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} - No instalado")
            missing_packages.append(package)
    
    return len(missing_packages) == 0

def check_nodejs():
    """Verificar Node.js"""
    print("🟢 Verificando Node.js...")
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"   ✅ Node.js {version} - OK")
            return True
        else:
            print("   ❌ Node.js no encontrado")
            return False
    except FileNotFoundError:
        print("   ❌ Node.js no instalado")
        return False

def check_postgresql():
    """Verificar PostgreSQL"""
    print("🐘 Verificando PostgreSQL...")
    try:
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"   ✅ {version} - OK")
            return True
        else:
            print("   ❌ PostgreSQL no encontrado en PATH")
            return False
    except FileNotFoundError:
        print("   ❌ PostgreSQL no instalado o no está en PATH")
        return False

def check_tshark():
    """Verificar tshark/Wireshark"""
    print("🦈 Verificando tshark...")
    try:
        result = subprocess.run(['tshark', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.split('\n')[0]
            print(f"   ✅ {version} - OK")
            return True
        else:
            print("   ❌ tshark no encontrado")
            return False
    except FileNotFoundError:
        print("   ❌ tshark no instalado")
        return False

def check_java():
    """Verificar Java"""
    print("☕ Verificando Java...")
    try:
        result = subprocess.run(['java', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stderr.split('\n')[0] if result.stderr else result.stdout.split('\n')[0]
            print(f"   ✅ {version} - OK")
            return True
        else:
            print("   ❌ Java no encontrado")
            return False
    except FileNotFoundError:
        print("   ❌ Java no instalado")
        return False

def check_files():
    """Verificar archivos de configuración"""
    print("📁 Verificando archivos...")
    
    required_files = [
        'backend/requirements.txt',
        'backend/app_postgres.py',
        'backend/config.py',
        'frontend-react/package.json',
        'frontend-react/server.js',
        'frontend-react/src/App.js'
    ]
    
    missing_files = []
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ {file_path} - No encontrado")
            missing_files.append(file_path)
    
    return len(missing_files) == 0

def check_env_file():
    """Verificar archivo .env"""
    print("🔧 Verificando configuración...")
    env_file = 'backend/.env'
    if os.path.exists(env_file):
        print(f"   ✅ {env_file} existe")
        return True
    elif os.path.exists('backend/.env.example'):
        print(f"   ⚠️  {env_file} no existe, pero .env.example está disponible")
        print("      Copia .env.example a .env y configura tus credenciales")
        return False
    else:
        print(f"   ❌ {env_file} y .env.example no encontrados")
        return False

def main():
    """Función principal"""
    print("="*50)
    print("🚀 ML TRAFFIC ANALYZER - VERIFICACIÓN DEL SISTEMA")
    print("="*50)
    print()
    
    checks = [
        check_python_version(),
        check_python_packages(),
        check_nodejs(),
        check_postgresql(),
        check_tshark(),
        check_java(),
        check_files(),
        check_env_file()
    ]
    
    print()
    print("="*50)
    print("📊 RESUMEN")
    print("="*50)
    
    passed = sum(checks)
    total = len(checks)
    
    if passed == total:
        print(f"✅ Todas las verificaciones pasaron ({passed}/{total})")
        print("🎉 ¡El sistema está listo para usar!")
        print()
        print("Para iniciar la aplicación:")
        print("  Windows: start_servers.bat")
        print("  Linux/macOS: ./start_servers.sh")
    else:
        print(f"❌ {total - passed} verificaciones fallaron ({passed}/{total})")
        print("⚠️  Por favor instala las dependencias faltantes antes de continuar")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
