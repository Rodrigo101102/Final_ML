# 🚨 SOLUCIÓN DE ERRORES COMUNES

Este archivo contiene soluciones para los errores más frecuentes que pueden encontrar las personas al clonar y usar este proyecto.

## 🔴 ERROR: Cython.Compiler.Errors.CompileError sklearn

### **Síntomas:**
```
Cython.Compiler.Errors.CompileError: sklearn/linear_model/_cd_fast.pyx
× Encountered error while generating package metadata.
```

### **Causa:**
- Python 3.12 o 3.13 instalado
- scikit-learn intenta compilarse desde código fuente
- No hay wheels precompilados para Python 3.12+

### **Soluciones:**

#### **Opción 1: Cambiar a Python 3.11 (RECOMENDADO)**
```bash
# Verificar versión actual
python --version

# Si es 3.12+ instalar Python 3.11
# Windows: Descargar desde python.org
# Linux: sudo apt install python3.11 python3.11-venv
# Mac: brew install python@3.11
```

#### **Opción 2: Forzar versión específica con conda**
```bash
conda create -n ml_traffic python=3.11
conda activate ml_traffic
```

#### **Opción 3: Usar pyenv (Linux/Mac)**
```bash
pyenv install 3.11.9
pyenv local 3.11.9
```

---

## 🔴 ERROR: psycopg2 connection failed

### **Síntomas:**
```
psycopg2.OperationalError: could not connect to server
Connection refused
```

### **Causa:**
- PostgreSQL no está corriendo
- Credenciales incorrectas en `.env`
- Base de datos no existe

### **Soluciones:**

#### **Paso 1: Verificar PostgreSQL**
```bash
# Windows
pg_ctl status

# Linux/Mac
sudo systemctl status postgresql
```

#### **Paso 2: Iniciar PostgreSQL**
```bash
# Windows
pg_ctl start

# Linux
sudo systemctl start postgresql

# Mac
brew services start postgresql
```

#### **Paso 3: Crear base de datos**
```sql
-- Conectarse como superuser
psql -U postgres

-- Crear database y usuario
CREATE DATABASE trafic_red;
CREATE USER postgres WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE trafic_red TO postgres;
```

#### **Paso 4: Verificar archivo .env**
```bash
# backend/.env debe contener:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trafic_red
DB_USER=postgres
DB_PASSWORD=tu_password_real
```

---

## 🔴 ERROR: ModuleNotFoundError

### **Síntomas:**
```
ModuleNotFoundError: No module named 'fastapi'
ModuleNotFoundError: No module named 'sklearn'
```

### **Causa:**
- Dependencias no instaladas
- Entorno virtual no activado
- Path de Python incorrecto

### **Soluciones:**

#### **Opción 1: Usar scripts automáticos**
```bash
# Windows
install.bat

# Linux/Mac
chmod +x install.sh
./install.sh
```

#### **Opción 2: Instalación manual**
```bash
cd backend
pip install -r requirements.txt
```

#### **Opción 3: Recrear entorno virtual**
```bash
# Eliminar entorno existente
rm -rf backend/venv

# Crear nuevo
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

---

## 🔴 ERROR: Java not found

### **Síntomas:**
```
FileNotFoundError: [Errno 2] No such file or directory: 'java'
Java is required for CICFlowMeter
```

### **Causa:**
- Java no instalado
- JAVA_HOME no configurado
- Java no en PATH

### **Soluciones:**

#### **Instalar Java**
```bash
# Windows: Descargar de java.com
# Linux: sudo apt install default-jdk
# Mac: brew install openjdk@11
```

#### **Verificar instalación**
```bash
java -version
echo $JAVA_HOME  # Linux/Mac
echo %JAVA_HOME% # Windows
```

#### **Configurar JAVA_HOME (si es necesario)**
```bash
# Linux/Mac (~/.bashrc)
export JAVA_HOME=/usr/lib/jvm/default-java
export PATH=$PATH:$JAVA_HOME/bin

# Windows (Variables de entorno del sistema)
JAVA_HOME=C:\Program Files\Java\jdk-11
PATH=%PATH%;%JAVA_HOME%\bin
```

---

## 🔴 ERROR: WinPcap/Npcap (Windows)

### **Síntomas:**
```
Cannot capture packets: WinPcap driver not found
No suitable device found
```

### **Causa:**
- WinPcap/Npcap no instalado (Windows)
- Permisos insuficientes
- Interfaz de red no detectada

### **Soluciones:**

#### **Instalar Npcap (Windows)**
1. Descargar desde: https://npcap.com/
2. Ejecutar como administrador
3. Marcar "Install Npcap in WinPcap API-compatible Mode"
4. Reiniciar sistema

#### **Linux: Instalar libpcap**
```bash
sudo apt-get install libpcap-dev
# o
sudo yum install libpcap-devel
```

#### **Ejecutar con permisos de administrador**
```bash
# Windows: Ejecutar terminal como administrador
# Linux: sudo python app_postgres.py
```

---

## 🔴 ERROR: Node.js/npm not found

### **Síntomas:**
```
'npm' is not recognized as an internal or external command
'node' is not recognized as an internal or external command
```

### **Causa:**
- Node.js no instalado
- Versión muy antigua

### **Soluciones:**

#### **Instalar Node.js 18+**
```bash
# Windows/Mac: Descargar de nodejs.org
# Linux: 
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### **Verificar instalación**
```bash
node --version  # Debe ser 18.x o superior
npm --version
```

---

## 🔴 ERROR: Puerto ocupado

### **Síntomas:**
```
Error: listen EADDRINUSE :::8010
Port 8010 is already in use
```

### **Causa:**
- Puerto 8010 o 3000 ya en uso
- Proceso anterior no terminado

### **Soluciones:**

#### **Verificar qué usa el puerto**
```bash
# Windows
netstat -ano | findstr :8010
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8010
kill -9 <PID>
```

#### **Usar puerto diferente**
```bash
# Backend: Modificar en app_postgres.py
# Frontend: PORT=3001 npm start
```

---

## 📞 VERIFICACIÓN RÁPIDA

### **Script automático de diagnóstico:**
```bash
python check_compatibility.py
```

### **Verificación manual paso a paso:**
```bash
# 1. Python
python --version  # Debe ser 3.8-3.11

# 2. PostgreSQL
pg_isready        # Debe decir "accepting connections"

# 3. Java
java -version     # Debe mostrar versión

# 4. Node.js
node --version    # Debe ser 18+

# 5. Dependencias Python
cd backend && pip list | grep fastapi

# 6. Base de datos
psql -U postgres -d trafic_red -c "\dt"
```

---

## 🎯 SI NADA FUNCIONA

1. **Eliminar todo y empezar desde cero:**
```bash
# Eliminar directorios de entornos virtuales
rm -rf backend/venv frontend-react/node_modules

# Ejecutar instalador automático
install.bat  # o ./install.sh
```

2. **Usar Docker (alternativo):**
```bash
# Si tienes Docker instalado
docker-compose up
```

3. **Verificar documentación:**
- Leer `README.md` completo
- Revisar `CORRECCIONES_APLICADAS.md`
- Ejecutar `python check_compatibility.py`
