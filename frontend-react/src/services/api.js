import axios from 'axios';

// Configuración del backend
const BACKEND_URL = 'http://localhost:8010';

// Configurar axios con la URL del backend
axios.defaults.baseURL = BACKEND_URL;

// Configurar interceptores para manejo de errores
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const api = {
  // Test de conectividad
  testConnection: () => axios.get('/api/test'),

  // Análisis de tráfico
  analyzeTraffic: (duration, connectionType) => 
    axios.post('/analyze', {
      duration: parseInt(duration),
      connection_type: connectionType
    }),

  // Historial de análisis
  getHistory: () => axios.get('/history'),

  // Estado de la base de datos
  getDatabaseStatus: () => axios.get('/database/status'),

  // Métricas del dashboard
  getDashboardMetrics: () => axios.get('/api/metrics'),

  // Detectar interfaces de red (si está disponible)
  getNetworkInterfaces: () => axios.get('/network/interfaces').catch(() => ({ data: [] })),
};

export default api;