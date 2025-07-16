# Guía de Despliegue en Railway 🚀

## ¿Qué es Railway?
Railway es una plataforma de hosting moderna que permite desplegar aplicaciones fácilmente. **Es PERFECTO para tu proyecto** porque:

- ✅ Soporte completo para Python/FastAPI
- ✅ Base de datos PostgreSQL incluida
- ✅ SSL automático (HTTPS)
- ✅ Dominio gratuito (.railway.app)
- ✅ Escalamiento automático
- ✅ $5/mes por servicio

## 🎯 URL Final para Usuarios
Después del despliegue, tu aplicación estará disponible en:
```
https://tu-proyecto.railway.app
```

## 📋 Pasos para Desplegar

### 1. Crear Cuenta en Railway
1. Ve a https://railway.app
2. Regístrate con GitHub (recomendado)
3. Conecta tu repositorio `Final_ML`

### 2. Crear Nuevo Proyecto
1. Click "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Elige tu repositorio `melisa176/Final_ML`

### 3. Configurar Variables de Entorno
En Railway Dashboard, ve a Variables y agrega:

```bash
# Base de datos (Railway PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database
DB_HOST=host_generado_por_railway
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=password_generado

# Configuración de producción
ENVIRONMENT=production
DEBUG=False
SERVER_PORT=8010

# Configuración de red (limitada en hosting)
CAPTURE_TIMEOUT=60
DEFAULT_INTERFACE=eth0
```

### 4. Agregar Base de Datos PostgreSQL
1. En tu proyecto Railway, click "Add Service"
2. Selecciona "PostgreSQL"
3. Copia las credenciales generadas a las variables de entorno

### 5. Configurar Dominio Personalizado (Opcional)
1. Ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones

## ⚠️ Limitaciones en Railway

### 🚨 **IMPORTANTE**: Captura de Red Limitada
Railway (como la mayoría de hostings) NO permite:
- Acceso directo a interfaces de red
- Captura de paquetes en tiempo real
- Uso completo de Wireshark/tshark

### 💡 **SOLUCIÓN**: Modo Demostración
El proyecto se adaptará automáticamente para funcionar en modo "demo":
- Los usuarios pueden subir archivos PCAP
- Procesamiento de archivos pre-capturados
- Simulación de análisis de tráfico

## 🔄 Despliegue Automático
Railway se conecta a tu repositorio GitHub:
- Cada `git push` despliega automáticamente
- Builds y logs en tiempo real
- Rollback automático si hay errores

## 💰 Costos Estimados
- **Aplicación**: $5/mes
- **Base de datos PostgreSQL**: $5/mes
- **Total**: ~$10/mes
- **Tráfico**: Incluido hasta 100GB/mes

## 🌐 Acceso para Usuarios Finales
Los usuarios simplemente van a tu URL y:
1. Ven la interfaz React profesional
2. Configuran análisis de tráfico
3. Suben archivos PCAP o usan modo demo
4. Obtienen resultados de ML en tiempo real

## 🔧 Monitoreo y Logs
Railway Dashboard te permite:
- Ver logs en tiempo real
- Monitorear uso de recursos
- Configurar alertas
- Analizar métricas de rendimiento

---

**🎉 Resultado Final**: Una aplicación web profesional accesible desde cualquier navegador, sin que los usuarios vean código.**
