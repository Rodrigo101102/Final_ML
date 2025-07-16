#!/usr/bin/env python3
"""
🚀 SOLUCIONADOR RÁPIDO DE DEPENDENCIAS
Detecta automáticamente la versión de Python e instala las dependencias compatibles
"""

import sys
import subprocess
import importlib.util

def get_python_version():
    """Obtener versión de Python"""
    return f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"

def check_package(package_name):
    """Verificar si un paquete está instalado"""
    spec = importlib.util.find_spec(package_name)
    return spec is not None

def install_compatible_packages():
    """Instalar paquetes compatibles según la versión de Python"""
    
    python_version = sys.version_info
    python_str = get_python_version()
    
    print(f"🐍 Python detectado: {python_str}")
    
    # Definir versiones compatibles según Python
    if python_version >= (3, 12):
        print("📦 Instalando paquetes para Python 3.12+...")
        packages = [
            "numpy>=1.26.0",
            "pandas>=2.0.0", 
            "scikit-learn>=1.3.0",
            "fastapi>=0.100.0",
            "uvicorn[standard]>=0.22.0",
            "sqlalchemy>=2.0.0",
            "psycopg2-binary>=2.9.0",
            "joblib>=1.3.0",
            "psutil>=5.9.0",
            "pydantic>=2.0.0",
            "python-dotenv>=1.0.0",
            "pyshark>=0.6.0"
        ]
    elif python_version >= (3, 11):
        print("📦 Instalando paquetes para Python 3.11...")
        packages = [
            "numpy>=1.24.0",
            "pandas>=1.5.0",
            "scikit-learn>=1.2.0", 
            "fastapi>=0.95.0",
            "uvicorn[standard]>=0.20.0",
            "sqlalchemy>=1.4.0",
            "psycopg2-binary>=2.9.0",
            "joblib>=1.2.0",
            "psutil>=5.9.0",
            "pydantic>=1.10.0",
            "python-dotenv>=0.19.0",
            "pyshark>=0.6.0"
        ]
    elif python_version >= (3, 10):
        print("📦 Instalando paquetes para Python 3.10...")
        packages = [
            "numpy>=1.21.0",
            "pandas>=1.4.0",
            "scikit-learn>=1.1.0",
            "fastapi>=0.85.0", 
            "uvicorn[standard]>=0.18.0",
            "sqlalchemy>=1.4.0",
            "psycopg2-binary>=2.8.0",
            "joblib>=1.1.0",
            "psutil>=5.8.0",
            "pydantic>=1.8.0",
            "python-dotenv>=0.19.0",
            "pyshark>=0.5.0"
        ]
    else:  # Python 3.8, 3.9
        print("📦 Instalando paquetes para Python 3.8-3.9...")
        packages = [
            "numpy>=1.19.0,<1.25.0",
            "pandas>=1.3.0,<2.0.0",
            "scikit-learn>=1.0.0,<1.3.0",
            "fastapi>=0.70.0",
            "uvicorn[standard]>=0.15.0",
            "sqlalchemy>=1.4.0,<2.0.0",
            "psycopg2-binary>=2.8.0",
            "joblib>=1.0.0",
            "psutil>=5.7.0",
            "pydantic>=1.8.0,<2.0.0",
            "python-dotenv>=0.19.0",
            "pyshark>=0.5.0"
        ]
    
    print(f"🔧 Instalando {len(packages)} paquetes...")
    
    failed_packages = []
    
    for package in packages:
        try:
            print(f"   📦 {package}...")
            result = subprocess.run([
                sys.executable, "-m", "pip", "install", 
                package, "--upgrade", "--timeout", "120"
            ], capture_output=True, text=True, timeout=180)
            
            if result.returncode == 0:
                print(f"      ✅ {package.split('>=')[0]} - OK")
            else:
                print(f"      ❌ {package} - Error")
                failed_packages.append(package)
                
        except Exception as e:
            print(f"      ❌ {package} - Error: {e}")
            failed_packages.append(package)
    
    if failed_packages:
        print(f"\n⚠️  {len(failed_packages)} paquetes fallaron:")
        for pkg in failed_packages:
            print(f"   • {pkg}")
        print("\n💡 Intenta instalarlos manualmente:")
        for pkg in failed_packages:
            print(f"pip install {pkg}")
        return False
    else:
        print(f"\n✅ ¡Todos los paquetes instalados exitosamente para Python {python_str}!")
        return True

def main():
    """Función principal"""
    print("🚀 SOLUCIONADOR DE DEPENDENCIAS AUTOMÁTICO")
    print("=" * 50)
    
    # Verificar pip
    try:
        subprocess.run([sys.executable, "-m", "pip", "--version"], check=True, capture_output=True)
    except:
        print("❌ pip no encontrado. Instala pip primero.")
        return False
    
    # Instalar paquetes compatibles
    success = install_compatible_packages()
    
    if success:
        print("\n🎉 ¡Instalación completada!")
        print("🚀 Ahora puedes ejecutar: python fix_models.py")
        print("📍 Y luego: start_servers.bat o ./start_servers.sh")
    else:
        print("\n⚠️  Algunos paquetes fallaron. Revisa los errores arriba.")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
