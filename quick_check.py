#!/usr/bin/env python3
"""
🔍 VERIFICACIÓN RÁPIDA DEL SISTEMA
Verifica rápidamente que todo esté funcionando correctamente
"""

import sys
import os
import subprocess
from pathlib import Path

def check_mark(condition):
    return "✅" if condition else "❌"

def main():
    print("🔍 VERIFICACIÓN RÁPIDA DEL SISTEMA")
    print("=" * 50)
    
    # Verificar Python
    print(f"\n🐍 Python:")
    print(f"   Versión: {sys.version.split()[0]} {check_mark(sys.version_info >= (3, 8))}")
    
    # Verificar entorno virtual
    print(f"\n📁 Entorno Virtual:")
    venv_exists = Path("backend/venv").exists()
    print(f"   backend/venv: {check_mark(venv_exists)}")
    
    # Verificar dependencias Python
    print(f"\n📦 Dependencias Python:")
    try:
        import fastapi, uvicorn, sqlalchemy, pandas, sklearn
        print(f"   Dependencias críticas: ✅")
    except ImportError as e:
        print(f"   Dependencias críticas: ❌ ({e})")
    
    # Verificar Node.js
    print(f"\n🟢 Node.js:")
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"   Versión: {result.stdout.strip()} ✅")
        else:
            print(f"   Node.js: ❌")
    except FileNotFoundError:
        print(f"   Node.js: ❌ (No encontrado)")
    
    # Verificar dependencias React
    print(f"\n⚛️  React:")
    node_modules = Path("frontend-react/node_modules").exists()
    print(f"   node_modules: {check_mark(node_modules)}")
    
    # Verificar archivos críticos
    print(f"\n📄 Archivos críticos:")
    files = [
        "backend/app_postgres.py",
        "backend/requirements.txt",
        "frontend-react/package.json",
        "frontend-react/server.js"
    ]
    
    for file in files:
        exists = Path(file).exists()
        print(f"   {file}: {check_mark(exists)}")
    
    # Verificar modelos ML
    print(f"\n🤖 Modelos ML:")
    ml_models = [
        "backend/ml_models/traffic_classifier.joblib",
        "backend/ml_models/scaler.joblib", 
        "backend/ml_models/pca_model.joblib",
        "backend/ml_models/preprocessor_model.joblib"
    ]
    
    models_ok = True
    for model in ml_models:
        exists = Path(model).exists()
        print(f"   {Path(model).name}: {check_mark(exists)}")
        if not exists:
            models_ok = False
    
    # Resumen
    print(f"\n📋 RESUMEN:")
    
    all_good = (
        sys.version_info >= (3, 8) and
        venv_exists and
        node_modules and
        all(Path(f).exists() for f in files) and
        models_ok
    )
    
    if all_good:
        print("   🎉 ¡Todo está listo!")
        print("   🚀 Ejecuta: start_servers.bat (Windows) o ./start_servers.sh (Linux/Mac)")
    else:
        print("   ⚠️  Hay problemas. Ejecuta:")
        print("   🔧 install.bat (Windows) o ./install.sh (Linux/Mac)")
        if not models_ok:
            print("   🤖 Para problemas de modelos ML: python fix_models.py")
    
    print()

if __name__ == "__main__":
    main()
