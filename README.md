# ML Traffic Analyzer 🚀

Sistema completo de análisis de tráfico de red en tiempo real usando Machine Learning para detección de amenazas de seguridad.

## 🎯 Características

- ✅ **Captura de tráfico en tiempo real** usando Wireshark/pyshark
- ✅ **Análisis con Machine Learning** para detección de amenazas
- ✅ **Interface React moderna** con dashboard interactivo
- ✅ **Backend FastAPI** con base de datos PostgreSQL
- ✅ **Detección automática de interfaces de red**
- ✅ **79 características de tráfico** analizadas por paquete
- ✅ **8 tipos de amenazas detectadas**: BENIGN, Bot, DDoS, PortScan, BruteForce, DoS, WebAttack, Unknown

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│    Backend      │◄──►│   PostgreSQL    │
│   React + JS    │    │   FastAPI       │    │   Database      │
│   Port: 3000    │    │   Port: 8010    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼─────────────────────────────────┐
                                 │                                 │
                    ┌─────────────▼─────────────┐    ┌─────────────▼─────────────┐
                    │     CICFlowMeter          │    │     ML Model            │
                    │   Feature Extraction     │    │   Threat Detection      │
                    └───────────────────────────┘    └───────────────────────────┘
```

## 📋 Prerrequisitos

### Software Requerido:
- **Python 3.9+** (recomendado 3.11 o superior)
- **Node.js 16+** y npm
- **PostgreSQL 13+**
- **Wireshark/tshark** (para captura de tráfico)
- **Java Runtime Environment 8+** (para CICFlowMeter)
- **Git** para clonar el repositorio

### Sistemas Operativos Soportados:
- ✅ Windows 10/11
- ✅ Linux (Ubuntu 20.04+, CentOS 8+)
- ✅ macOS 10.15+

## 🚀 Instalación Completa

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/Final_ML.git
cd Final_ML
```

### 2. Configurar Backend (Python)

#### 2.1 Crear entorno virtual:
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# Linux/macOS:
source venv/bin/activate
```

#### 2.2 Instalar dependencias:
```bash
pip install -r requirements.txt
```

#### 2.3 Configurar base de datos:
```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=trafic_red
# DB_USER=postgres
# DB_PASSWORD=tu_password
```

#### 2.4 Crear base de datos PostgreSQL:
```sql
-- Conectar a PostgreSQL y ejecutar:
CREATE DATABASE trafic_red;
```

### 3. Configurar Frontend (React)

#### 3.1 Instalar dependencias:
```bash
cd ../frontend-react
npm install
```

#### 3.2 Construir la aplicación:
```bash
npm run build
```

### 4. Instalar Herramientas Adicionales

#### 4.1 Wireshark/tshark:
- **Windows**: Descargar desde https://www.wireshark.org/
- **Linux**: `sudo apt-get install tshark` (Ubuntu) o `sudo yum install wireshark` (CentOS)
- **macOS**: `brew install wireshark`

#### 4.2 Java (para CICFlowMeter):
- **Windows**: Descargar desde https://www.oracle.com/java/technologies/downloads/
- **Linux**: `sudo apt-get install default-jre`
- **macOS**: `brew install openjdk`

## 🎮 Uso

### Iniciar el Sistema

#### Terminal 1 - Backend:
```bash
cd backend
python app_postgres.py
```
> **Backend disponible en**: http://localhost:8010

#### Terminal 2 - Frontend:
```bash
cd frontend-react
node server.js
```
> **Frontend disponible en**: http://localhost:3000

### Usar la Aplicación

1. **Abrir navegador** en `http://localhost:3000`
2. **Configurar análisis**:
   - Duración: 5-60 segundos (slider + input manual)
   - Tipo de conexión: Auto-detectar o manual (WiFi, Ethernet, etc.)
3. **Iniciar captura** y ver resultados en tiempo real
4. **Analizar resultados**:
   - Resumen de amenazas detectadas
   - Total de paquetes analizados
   - Tabla detallada con 79 características
   - Paginación (10 registros por página)

## 📊 Endpoints API

### Backend (http://localhost:8010)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/analyze` | Iniciar análisis de tráfico |
| `GET` | `/database/status` | Estado de la base de datos |
| `GET` | `/network/interfaces` | Detectar interfaces de red |
| `GET` | `/history` | Historial de análisis |

### Ejemplo de uso:
```bash
curl -X POST http://localhost:8010/analyze \
  -H "Content-Type: application/json" \
  -d '{"duration": 20, "connection_type": "auto"}'
```

## 🗂️ Estructura del Proyecto

```
Final_ML/
├── backend/                    # Backend FastAPI
│   ├── services/              # Servicios de captura, procesamiento, predicción
│   ├── ml_models/             # Modelos de Machine Learning
│   ├── app_postgres.py        # Aplicación principal
│   ├── config.py              # Configuración de base de datos
│   ├── requirements.txt       # Dependencias Python
│   └── .env.example          # Variables de entorno ejemplo
│
├── frontend-react/            # Frontend React
│   ├── src/                  # Código fuente React
│   ├── public/               # Archivos públicos
│   ├── build/                # Build de producción
│   ├── package.json          # Dependencias Node.js
│   └── server.js             # Servidor Express
│
└── README.md                 # Este archivo
```

## 🔧 Configuración Avanzada

### Variables de Entorno (.env):
```bash
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trafic_red
DB_USER=postgres
DB_PASSWORD=tu_password

# Servidor
SERVER_PORT=8010
LOG_LEVEL=INFO

# Captura de red
CAPTURE_TIMEOUT=300
DEFAULT_INTERFACE=auto
```

### Puertos Utilizados:
- **Frontend**: 3000
- **Backend**: 8010
- **PostgreSQL**: 5432

## 🐛 Solución de Problemas

### Error "Network Error":
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8010/database/status

# Verificar que el frontend apunte al puerto correcto (8010)
# Revisar App.js línea 6: API_BASE_URL
```

### Error de permisos de captura:
```bash
# Linux: Agregar permisos para captura de red
sudo setcap cap_net_raw,cap_net_admin=eip /usr/bin/dumpcap
```

### Error de base de datos:
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql  # Linux
net start postgresql-x64-13       # Windows
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- CICFlowMeter para extracción de características
- FastAPI y React por los frameworks
- Scikit-learn para machine learning
- Bootstrap para el diseño UI

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Set required environment variables (see `.env.example`)

5. Initialize the database:
   ```bash
   cd backend
   python init_db.py
   ```

## Running the Application

### Using Docker
```bash
docker-compose up
```

### Manual Setup
1. Start the backend:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

## Authentication

- Use the `/token` endpoint to obtain a JWT token
- Include the token in the Authorization header for protected endpoints
- Admin users have access to additional features

## API Endpoints

- POST `/capture/start`: Start network capture
- POST `/capture/process`: Process captured traffic
- GET `/traffic/latest`: Get latest traffic records
- GET `/traffic/stats`: Get traffic statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
=======
# Final_ML
>>>>>>> cbfa93ddd217c3f421498ffc06afacc118147d4f
