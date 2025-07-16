# Render Deployment Guide - ML Traffic Analyzer

## 🚀 **Pasos para Subir a Render**

### 1. **Preparar Repositorio**
```bash
git add .
git commit -m "🚀 Add Render deployment config"
git push origin main
```

### 2. **Crear Cuenta en Render**
- Ve a https://render.com
- Registrate con GitHub
- Conecta tu repositorio `Final_ML`

### 3. **Crear Web Service**

**En Render Dashboard:**

1. **New → Web Service**
2. **Connect Repository:** `melisa176/Final_ML`
3. **Configuración:**
   ```
   Name: ml-traffic-analyzer
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python main.py
   ```

4. **Variables de Entorno:**
   ```
   PORT=8000
   ```

### 4. **Configurar Base de Datos (PostgreSQL)**

**En Render Dashboard:**

1. **New → PostgreSQL**
2. **Configuración:**
   ```
   Name: ml-traffic-db
   Database Name: traffic_analyzer
   User: admin
   ```
3. **Copiar Internal Database URL**
4. **Agregar a Web Service:**
   ```
   DATABASE_URL=<Internal Database URL>
   ```

### 5. **Deploy**
- Click **"Create Web Service"**
- Render automáticamente detectará y deployará

### 6. **URLs Finales**
```
🌐 App: https://ml-traffic-analyzer.onrender.com
📊 API Docs: https://ml-traffic-analyzer.onrender.com/docs
🗄️ Database: Automáticamente conectada
```

## 🔧 **Configuración Adicional**

### **Si necesitas persistencia de archivos:**
```bash
# En Render, agregar Disk Storage:
Mount Path: /opt/render/project/src/processed
```

### **Para logs persistentes:**
```bash
# Usar Render Logging o external service
LOG_LEVEL=INFO
```

## 🚨 **Limitaciones de Render Free Tier**
- ⏰ **Sleep después de 15 min inactivo**
- 💾 **512MB RAM**
- ⚡ **Arranque lento (cold start)**
- 🔄 **Sin persistent storage**

## 🎯 **Alternativas por Costo**

### **Gratis:**
- ✅ **Render** (recomendado)
- ✅ **Railway** (500 horas/mes)
- ✅ **Heroku** (limitado)

### **Pago ($5-10/mes):**
- 💰 **DigitalOcean App Platform**
- 💰 **AWS Lightsail**
- 💰 **Google Cloud Run**

## 📝 **Después del Deploy**

1. **Probar endpoints:**
   ```bash
   curl https://ml-traffic-analyzer.onrender.com/health
   ```

2. **Ver logs:**
   - Render Dashboard → Service → Logs

3. **Configurar dominio custom** (opcional):
   - Render Dashboard → Settings → Custom Domains
