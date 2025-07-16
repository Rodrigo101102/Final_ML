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

## 🚀 INSTALACIÓN 

### **Opción 1: Instalación Normal (Desarrollo)**

**Windows:**
```cmd
git clone https://github.com/melisa176/Final_ML.git
cd Final_ML
install.bat
start_servers.bat
```

**Linux/Mac:**
```bash
git clone https://github.com/melisa176/Final_ML.git
cd Final_ML
./install.sh
./start_servers.sh
```

### **Opción 2: Docker (Producción/Demo)**

**Windows:**
```cmd
git clone https://github.com/melisa176/Final_ML.git
cd Final_ML
docker-run.bat
```

**Linux/Mac:**
```bash
git clone https://github.com/melisa176/Final_ML.git
cd Final_ML
./docker-run.sh
```

## 🌐 **Acceso a la Aplicación**

| Servicio | URL Normal | URL Docker |
|----------|------------|------------|
| **Frontend** | http://localhost:3000 | http://localhost:3000 |
| **Backend API** | http://localhost:8010 | http://localhost:8000 |
| **Documentación** | http://localhost:8010/docs | http://localhost:8000/docs |

## 📋 **Para quien Clona el Proyecto**

### 🎯 **Instrucciones Simples**

1. **Clona el proyecto:**
   ```bash
   git clone https://github.com/melisa176/Final_ML.git
   cd Final_ML
   ```

2. **Elige tu método preferido:**
   
   **🖥️ Instalación Local (más rápida para desarrollo):**
   - Windows: Doble clic en `install.bat` → `start_servers.bat`
   - Linux/Mac: `./install.sh` → `./start_servers.sh`
   
   **🐳 Docker (funciona en cualquier lado):**
   - Windows: Doble clic en `docker-run.bat`
   - Linux/Mac: `./docker-run.sh`

3. **¡Listo!** Abre tu navegador en las URLs de arriba

### 🛠️ **Solución de Problemas**

**Si la instalación normal falla:**
```bash
quick_check.bat  # Windows
./quick_check.sh # Linux/Mac
```

**Si Docker falla:**
```bash
docker-compose down
docker-compose up --build
```

## ✨ ¡Eso es todo!

El instalador maneja automáticamente:

✅ **Detección inteligente de Python** (3.8, 3.9, 3.10, 3.11, 3.12+)  
✅ **Instalación automática de pip** si no está disponible  
✅ **Creación de entorno virtual** limpio  
✅ **Instalación de todas las dependencias** Python y Node.js  
✅ **Construcción del frontend** React  
✅ **Verificación completa** del sistema  

## 🔧 Verificación rápida

Para verificar que todo esté funcionando:
```bash
python quick_check.py
```

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

## 📋 Compatibilidad

### Python:
- ✅ Python 3.8+
- ✅ Detecta automáticamente: `python3`, `python`, `py -3.X`
- ✅ Maneja múltiples instalaciones de Python
- ✅ Instala pip automáticamente si falta

### Sistemas Operativos:
- ✅ Windows 10/11
- ✅ Linux (Ubuntu, CentOS, Fedora, Arch)
- ✅ macOS 10.15+

### Node.js:
- ✅ Node.js 16+
- ✅ Instalación automática de dependencias

## 📁 Estructura del Proyecto

```
Final_ML/
├── 🚀 install.bat/install.sh      # Instalación automática
├── ▶️  start_servers.bat/.sh       # Iniciar aplicación
├── 🔍 quick_check.py              # Verificación rápida
├── 📋 README.md                   # Esta documentación
├── 🐍 backend/
│   ├── app_postgres.py            # Aplicación principal FastAPI
│   ├── requirements.txt           # Dependencias Python
│   ├── services/                  # Servicios de ML y captura
│   └── ml_models/                 # Modelos entrenados
└── ⚛️  frontend-react/
    ├── package.json               # Dependencias React
    ├── server.js                  # Servidor frontend
    └── src/                       # Código fuente React
```

## 🎮 Uso de la Aplicación

1. **Ejecuta los servidores**: `start_servers.bat` o `./start_servers.sh`
2. **Abre el navegador**: http://localhost:3000
3. **Selecciona interfaz de red** desde el dashboard
4. **Inicia captura de tráfico** con el botón "Analizar"
5. **Observa las predicciones** en tiempo real

## 🛠️ Comandos Útiles

```bash
# Verificar sistema
python quick_check.py

# Verificar dependencias detallado
python check_system.py

# Iniciar solo el backend
cd backend && venv/Scripts/activate && python app_postgres.py

# Iniciar solo el frontend  
cd frontend-react && node server.js
```

## 🚀 Despliegue en Producción

Para desplegar en Railway, Heroku u otras plataformas:

```bash
# Windows
deploy.bat

# Linux/Mac
./deploy.sh
```

Ver [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) para instrucciones detalladas.

## 🐛 Solución de Problemas

### Python no encontrado:
- **Windows**: Descarga desde https://python.org/downloads
- **Linux**: `sudo apt install python3 python3-pip`
- **Mac**: `brew install python3`

### Node.js no encontrado:
- **Windows**: Descarga desde https://nodejs.org/download
- **Linux**: `sudo apt install nodejs npm`
- **Mac**: `brew install node`

### Error de modelos ML (scikit-learn):
```bash
# Solución automática
python fix_models.py

# O reinstalar todo
rm -rf backend/venv frontend-react/node_modules
./install.sh  # o install.bat en Windows
```

### Error de dependencias incompatibles (numpy, pandas, etc.):
```bash
# Solución automática para tu versión de Python
python fix_dependencies.py

# O manualmente según tu Python:
# Python 3.12+: pip install numpy>=1.26.0 pandas>=2.0.0 scikit-learn>=1.3.0
# Python 3.11: pip install numpy>=1.24.0 pandas>=1.5.0 scikit-learn>=1.2.0  
# Python 3.10: pip install numpy>=1.21.0 pandas>=1.4.0 scikit-learn>=1.1.0
```

### Error en dependencias:
```bash
# Reinstalar todo
rm -rf backend/venv frontend-react/node_modules
./install.sh  # o install.bat en Windows
```

## 📞 Soporte

Si tienes problemas:
1. Ejecuta `python quick_check.py` para diagnóstico
2. Revisa que tengas Python 3.8+ y Node.js 16+
3. Ejecuta el instalador nuevamente: `install.bat` o `./install.sh`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para detalles.

---

**¡Disfruta analizando tráfico de red con Machine Learning!** 🎉
