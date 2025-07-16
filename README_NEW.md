# ML Traffic Analyzer

Analizador de Tráfico de Red usando Machine Learning para clasificar y detectar tipos de tráfico en tiempo real.

## 🎯 Características

- **Captura en tiempo real**: Análiza tráfico de red usando CICFlowMeter
- **Machine Learning**: Clasificación automática con scikit-learn
- **Base de datos**: Almacenamiento en PostgreSQL
- **API REST**: Backend FastAPI para comunicación con frontend
- **Frontend React**: Interfaz web moderna para visualización

## 📋 Requisitos del Sistema

- **Python 3.8-3.11** (recomendado 3.11 para evitar conflictos)
- **PostgreSQL** instalado y corriendo
- **Node.js 18+** para el frontend
- **Java 8+** (para CICFlowMeter)
- **WinPcap** o **Npcap** en Windows

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd Final_ML
```

### 2. Configurar PostgreSQL
```sql
-- Crear base de datos
CREATE DATABASE trafic_red;
CREATE USER postgres WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE trafic_red TO postgres;
```

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
- ✅ **Usar Python 3.11.x** (las versiones más nuevas pueden causar problemas)
- ✅ **Todas las dependencias están especificadas** con versiones exactas
- ✅ **Los scripts automáticos** instalan todo por ti
- ✅ **La configuración de base de datos** es flexible (local o remota)

## 📄 Licencia

MIT License
