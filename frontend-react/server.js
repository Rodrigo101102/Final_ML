const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configurar CORS
app.use(cors());

// Servir archivos estáticos de la aplicación React buildada
app.use(express.static(path.join(__dirname, 'build')));

// Para desarrollo, servir desde src si no existe build
const staticPath = path.join(__dirname, 'build');
if (!require('fs').existsSync(staticPath)) {
    console.log('📦 Modo desarrollo - sirviendo desde public');
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Ruta principal que sirve index.html para React
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
} else {
    console.log('🚀 Modo producción - sirviendo desde build');
    
    // Para React Router: todas las rutas devuelven index.html
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Frontend React server running on http://localhost:${PORT}`);
    console.log(`📊 Backend API on http://localhost:8010`);
    console.log(`✅ React Frontend-Backend connection ready!`);
    console.log(`📁 Static files from: ${require('fs').existsSync(path.join(__dirname, 'build')) ? 'build' : 'public'}`);
});

module.exports = app;
