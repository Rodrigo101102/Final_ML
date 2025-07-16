#!/usr/bin/env python3
"""
Script de verificación de compatibilidad para ML Traffic Analyzer
Ejecuta este script antes de instalar para verificar que tu sistema es compatible
"""

import sys
import platform

def check_python_version():
    """Verificar versión de Python"""
    version = sys.version_info
    python_version = f"{version.major}.{version.minor}.{version.micro}"
    
    print(f"🐍 Python detectado: {python_version}")
    
    if version.major != 3:
        print("❌ ERROR: Python 3 es requerido")
        return False
    
    if version.minor < 8:
        print("❌ ERROR: Python 3.8+ es requerido")
        return False
    
    if version.minor >= 12:
        print("⚠️  ADVERTENCIA: Python 3.12+ puede causar problemas de compilación")
        print("   Recomendamos usar Python 3.8-3.11")
        print("   ¿Continuar de todas formas? (y/n)")
        response = input().lower()
        if response != 'y':
            return False
    
    print("✅ Versión de Python compatible")
    return True

def check_system():
    """Verificar sistema operativo"""
    system = platform.system()
    print(f"💻 Sistema operativo: {system}")
    
    if system == "Windows":
        print("📝 NOTA: En Windows necesitas WinPcap o Npcap instalado")
        print("   Descargar desde: https://npcap.com/")
    elif system == "Linux":
        print("📝 NOTA: En Linux necesitas libpcap-dev instalado")
        print("   Instalar con: sudo apt-get install libpcap-dev")
    elif system == "Darwin":  # macOS
        print("📝 NOTA: En macOS libpcap viene preinstalado")
    
    return True

def check_java():
    """Verificar Java (requerido para CICFlowMeter)"""
    import subprocess
    try:
        result = subprocess.run(['java', '-version'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Java detectado")
            return True
        else:
            print("❌ Java no encontrado")
            return False
    except FileNotFoundError:
        print("❌ Java no encontrado")
        print("📝 NOTA: Java 8+ es requerido para CICFlowMeter")
        print("   Descargar desde: https://www.java.com/")
        return False

def main():
    print("🔍 Verificación de Compatibilidad - ML Traffic Analyzer")
    print("=" * 55)
    
    checks = [
        ("Python", check_python_version),
        ("Sistema", check_system),
        ("Java", check_java)
    ]
    
    all_passed = True
    for name, check_func in checks:
        print(f"\n📋 Verificando {name}...")
        if not check_func():
            all_passed = False
    
    print("\n" + "=" * 55)
    if all_passed:
        print("🎉 ¡Sistema compatible! Puedes proceder con la instalación")
        print("\n📝 Próximos pasos:")
        print("   1. Instalar PostgreSQL")
        print("   2. Ejecutar: setup.bat (Windows) o ./setup.sh (Linux/Mac)")
        print("   3. Configurar backend/.env con credenciales de base de datos")
    else:
        print("❌ Sistema NO compatible. Por favor resuelve los problemas indicados")
    
    return all_passed

if __name__ == "__main__":
    main()
