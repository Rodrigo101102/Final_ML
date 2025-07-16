# Vercel Deployment Guide - Frontend

## 🚀 **Pasos para Subir Frontend a Vercel**

### 1. **Ir a Vercel**
- Ve a https://vercel.com
- Login con GitHub
- Click **"New Project"**

### 2. **Configurar Proyecto**
```
Repository: melisa176/Final_ML
Framework Preset: Create React App
Root Directory: frontend-react
```

### 3. **Build Settings**
```
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### 4. **Environment Variables**
```
NODE_ENV = production
REACT_APP_API_URL = https://ml-traffic-analyzer.onrender.com
```

### 5. **Deploy**
- Click **"Deploy"**
- ⏳ Esperar ~2-3 minutos
- ✅ URL lista: `https://ml-traffic-analyzer-frontend.vercel.app`

## 🔧 **Configuración CORS en Backend**

**Importante:** Agregar URL de Vercel a CORS en Render:

```python
# En tu backend (app_postgres.py)
origins = [
    "http://localhost:3000",
    "https://ml-traffic-analyzer-frontend.vercel.app",  # ← Agregar esta
    "https://your-custom-domain.com"  # Si tienes dominio custom
]
```

## 🌐 **URLs Finales**
```
Frontend: https://ml-traffic-analyzer-frontend.vercel.app
Backend:  https://ml-traffic-analyzer.onrender.com
API Docs: https://ml-traffic-analyzer.onrender.com/docs
```

## 🎯 **Ventajas de esta Configuración**
- ✅ Frontend súper rápido (CDN global de Vercel)
- ✅ Backend estable (Render)
- ✅ Deploy automático desde GitHub
- ✅ HTTPS gratis en ambos
- ✅ Dominios custom fáciles
