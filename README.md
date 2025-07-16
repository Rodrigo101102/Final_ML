# 🚀 ML Traffic Analyzer

Sistema de análisis de tráfico de red con Machine Learning - **INSTALACIÓN SÚPER SIMPLE**

## ⚡ INSTALACIÓN RÁPIDA

### 📋 **Requisitos:**
- Python 3.8-3.11 (⚠️ NO 3.12+)
- PostgreSQL
- Node.js 18+

### 🔧 **Instalar:**
```bash
# 1. Backend
cd backend
pip install -r requirements.txt

# 2. Frontend
cd ../frontend-react  
npm install && npm run build

# 3. Configurar .env (ver INSTALACION_SIMPLE.md)
```

### ▶️ **Ejecutar:**
```bash
# Terminal 1 - Backend
cd backend && python app_postgres.py

# Terminal 2 - Frontend  
cd frontend-react && node server.js
```

### 🌐 **Acceder:**
- **App:** http://localhost:3000
- **API:** http://localhost:8010

---

## 📖 **GUÍA COMPLETA:** 
👉 **[INSTALACION_SIMPLE.md](INSTALACION_SIMPLE.md)** ← LEE ESTO PRIMERO

---

## 🎯 **Características:**
- ✅ Análisis de tráfico de red en tiempo real
- ✅ Clasificación ML de paquetes  
- ✅ Interfaz web moderna
- ✅ Captura de paquetes automática
- ✅ Reportes y visualizaciones
- ✅ Base de datos PostgreSQL
- ✅ API REST completa

## 📁 **Estructura:**
```
Final_ML/
├── backend/           # FastAPI + ML Models
├── frontend-react/    # React UI
└── flowmeter/        # Network Analysis Tools
```

## 🆘 **¿Problemas?**
1. Lee **[INSTALACION_SIMPLE.md](INSTALACION_SIMPLE.md)**
2. Verifica versión Python: `python --version` 
3. Revisa PostgreSQL funcionando
4. Ejecuta: `pip install -r requirements.txt`

**¡Listo para usar!** 🎉

### 3. Configurar variables de entorno
Crear archivo `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trafic_red
DB_USER=postgres
DB_PASSWORD=tu_password
```

### 4. Instalar dependencias del backend
```bash
cd backend
pip install -r requirements.txt
```

### 5. Instalar dependencias del frontend
```bash
cd frontend-react
npm install
```

## 🏃‍♂️ Uso

### Opción 1: Scripts automáticos (Recomendado)

**Windows:**
```bash
# Instalar todo
.\setup.bat

# Iniciar ambos servidores
.\start_servers.bat
```

**Linux/Mac:**
```bash
# Instalar todo
chmod +x setup.sh
./setup.sh

# Iniciar ambos servidores
chmod +x start_servers.sh
./start_servers.sh
```

### Opción 2: Manual

**Iniciar Backend:**
```bash
cd backend
python app_postgres.py
```
Backend disponible en: http://localhost:8010

**Iniciar Frontend:**
```bash
cd frontend-react
npm start
```
Frontend disponible en: http://localhost:3000

## 📁 Estructura del Proyecto

```
Final_ML/
├── backend/                 # API FastAPI
│   ├── services/           # Servicios de captura y ML
│   ├── ml_models/          # Modelos entrenados
│   ├── flowmeter/          # CICFlowMeter
│   └── requirements.txt    # Dependencias Python
├── frontend-react/         # Interfaz React
│   ├── src/               # Código fuente
│   └── package.json       # Dependencias Node.js
└── processed/             # Archivos procesados
```

## ⚙️ Versiones Compatibles (Probadas y Funcionando)

| Componente | Versión | Motivo |
|------------|---------|---------|
| Python | 3.11.x | Recomendado para evitar conflictos con scikit-learn |
| scikit-learn | 1.3.0 | Versión estable con wheels precompilados |
| numpy | 1.24.4 | Compatible con scikit-learn 1.3.0 |
| pandas | 2.0.3 | Versión estable para procesamiento |
| fastapi | 0.104.1 | API moderna y rápida |
| psycopg2-binary | 2.9.9 | Driver PostgreSQL sin compilación |

## 🔌 API Endpoints

- `GET /` - Estado del sistema
- `POST /analyze` - Iniciar análisis de tráfico
- `GET /models/status` - Estado de modelos ML
- `GET /predictions` - Obtener predicciones recientes
- `GET /database/status` - Estado de la base de datos

## 🤖 Modelos de Machine Learning

- **traffic_classifier.joblib** - Clasificador principal
- **scaler.joblib** - Normalizador de características  
- **pca_model.joblib** - Reductor de dimensionalidad
- **preprocessor_model.joblib** - Preprocesador de datos

## 🐛 Solución de Problemas

### Error: "ModuleNotFoundError"
```bash
cd backend
pip install -r requirements.txt
```

### Error: "psycopg2 connection failed"
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `backend/.env`
- Verificar que la base de datos `trafic_red` exista

### Error: "Java not found"
- Instalar Java 8 o superior
- Verificar variable JAVA_HOME

### Error: "WinPcap driver"
- En Windows: Instalar Npcap desde https://npcap.com/
- En Linux: `sudo apt-get install libpcap-dev`

### Error de versiones de Python
- Usar Python 3.11.x (no 3.12 o 3.13)
- Verificar: `python --version`

## 🤝 Para Otras Personas que Quieran Usar el Proyecto

### Lo que necesitas hacer:

1. **Clonar el repositorio**
2. **Instalar PostgreSQL** y crear la base de datos
3. **Configurar el archivo .env** con tus credenciales
4. **Ejecutar setup.bat** (Windows) o **setup.sh** (Linux/Mac)
5. **Ejecutar start_servers.bat** (Windows) o **start_servers.sh** (Linux/Mac)

### Importante:
- ✅ **Usar Python 3.8-3.11** (las versiones más nuevas pueden causar problemas)
- ✅ **Todas las dependencias están especificadas** con versiones compatibles
- ✅ **Los scripts automáticos** verifican compatibilidad e instalan todo
- ✅ **La configuración de base de datos** es flexible (local o remota)

## 🆘 Ayuda y Solución de Problemas

### **Si tienes errores durante la instalación o uso:**

📖 **Documentación de ayuda disponible:**
- `CORRECCIONES_APLICADAS.md` - Qué se corrigió y por qué
- `SOLUCION_ERRORES.md` - Soluciones paso a paso para errores comunes
- `python check_compatibility.py` - Verificación automática de compatibilidad

### **Errores más comunes y sus soluciones:**
- ❌ **Error de compilación Cython/scikit-learn** → Usar Python 3.8-3.11
- ❌ **psycopg2 connection failed** → Verificar PostgreSQL y credenciales
- ❌ **ModuleNotFoundError** → Ejecutar `install.bat` o `./install.sh`
- ❌ **Java not found** → Instalar Java 8+ y configurar JAVA_HOME

## 📄 Licencia

MIT License
