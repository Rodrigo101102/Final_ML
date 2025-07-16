# 🚀 ML Traffic Analyzer - INSTALACIÓN SIMPLE

## ⚡ PASOS SÚPER SIMPLES

### 1️⃣ **Requisitos (instalar primero):**
- **Python 3.8-3.11** (⚠️ NO usar 3.12+)
- **PostgreSQL** 
- **Node.js 18+**

### 2️⃣ **Clonar proyecto:**
```bash
git clone <tu-repositorio>
cd Final_ML
```

### 3️⃣ **Instalar dependencias del backend:**
```bash
cd backend
pip install -r requirements.txt
```

### 4️⃣ **Instalar dependencias del frontend:**
```bash
cd ../frontend-react
npm install
npm run build
```

### 5️⃣ **Configurar base de datos:**

**Crear archivo `backend/.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trafic_red
DB_USER=postgres
DB_PASSWORD=tu_password
```

**Crear base de datos en PostgreSQL:**
```sql
CREATE DATABASE trafic_red;
```

### 6️⃣ **Ejecutar el proyecto:**

**Terminal 1 - Backend:**
```bash
cd backend
python app_postgres.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend-react
node server.js
```

## ✅ **LISTO!**

- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:8010

---

## 🔧 **SI HAY PROBLEMAS:**

### ❌ **Error: Python 3.12+ no compatible**
```bash
# Verificar versión
python --version

# Debe mostrar 3.8.x - 3.11.x
# Si muestra 3.12+ instalar Python 3.11
```

### ❌ **Error: psycopg2 connection failed**
```bash
# Verificar PostgreSQL corriendo
# Windows: servicios > PostgreSQL
# Linux: sudo systemctl status postgresql
```

### ❌ **Error: ModuleNotFoundError**
```bash
cd backend
pip install -r requirements.txt
```

### ❌ **Error: npm not found**
```bash
# Instalar Node.js desde nodejs.org
node --version  # Verificar instalación
```

---

## 📁 **ESTRUCTURA FINAL:**
```
Final_ML/
├── backend/
│   ├── requirements.txt     # ← TODAS las dependencias aquí
│   ├── app_postgres.py      # ← Ejecutar con: python app_postgres.py
│   └── .env                 # ← Configurar base de datos
└── frontend-react/
    ├── server.js            # ← Ejecutar con: node server.js
    └── package.json         # ← npm install + npm run build
```

## 🎯 **RESUMEN:**
1. `pip install -r requirements.txt` (backend)
2. `npm install && npm run build` (frontend)  
3. `python app_postgres.py` (backend)
4. `node server.js` (frontend)

**¡Y funciona!** 🎉
