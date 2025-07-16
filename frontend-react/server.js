#!/usr/bin/env node

/**
 * SERVIDOR SIMPLE PARA FRONTEND REACT
 * Ejecutar: node server.js
 * Puerto: 3000
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio build
app.use(express.static(path.join(__dirname, 'build')));

// Manejar todas las rutas y servir el index.html (para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Frontend ejecutándose en: http://localhost:${PORT}`);
  console.log(`📡 Backend debe estar en: http://localhost:8010`);
  console.log('✅ Todo listo para usar el ML Traffic Analyzer');
});

// Manejo de errores
process.on('uncaughtException', (err) => {
  console.error('❌ Error no manejado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada en:', promise, 'razón:', reason);
  process.exit(1);
});
