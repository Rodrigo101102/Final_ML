import React, { useState, useEffect } from 'react';
import api from '../services/api';

const StatusPanel = () => {
  const [databaseStatus, setDatabaseStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [dbResponse, metricsResponse] = await Promise.all([
        api.getDatabaseStatus(),
        api.getDashboardMetrics()
      ]);
      
      setDatabaseStatus(dbResponse.data);
      setMetrics(metricsResponse.data);
    } catch (error) {
      console.error('Error loading status data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-server mr-2 text-blue-500"></i>
          Estado del Sistema
        </h3>
        <button
          onClick={loadData}
          className="text-gray-500 hover:text-blue-500 transition-colors"
          title="Actualizar"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {/* Estado de la Base de Datos */}
      {databaseStatus && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Base de Datos PostgreSQL</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                databaseStatus.status === 'connected' 
                  ? 'bg-success-100 text-success-600' 
                  : 'bg-danger-100 text-danger-600'
              }`}>
                <i className={`fas ${databaseStatus.status === 'connected' ? 'fa-check' : 'fa-times'} fa-lg`}></i>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {databaseStatus.status === 'connected' ? 'Conectado' : 'Error'}
              </p>
              <p className="text-xs text-gray-500">{databaseStatus.database}</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {databaseStatus.total_records || 0}
              </div>
              <p className="text-sm text-gray-600">Registros Totales</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {databaseStatus.host}:{databaseStatus.port}
              </p>
              <p className="text-xs text-gray-500">Servidor</p>
            </div>
          </div>
        </div>
      )}

      {/* Métricas del Sistema */}
      {metrics && metrics.status === 'success' && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Métricas en Tiempo Real</h4>
          
          {/* Amenazas Recientes */}
          {Object.keys(metrics.recent_threats).length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <i className="fas fa-exclamation-triangle text-orange-500 mr-2"></i>
                <span className="text-sm font-medium text-orange-800">
                  Amenazas Detectadas (Últimas 24h)
                </span>
              </div>
              <div className="space-y-1">
                {Object.entries(metrics.recent_threats).map(([threat, count]) => (
                  <div key={threat} className="flex justify-between text-xs">
                    <span className="text-orange-700">{threat}</span>
                    <span className="font-medium text-orange-800">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estadísticas de Conexión */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Tipos de Conexión</p>
              <div className="space-y-1">
                {Object.entries(metrics.connection_stats).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-xs">
                    <span className="capitalize">{type}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Top Predicciones</p>
              <div className="space-y-1">
                {Object.entries(metrics.predictions_distribution)
                  .slice(0, 4)
                  .map(([prediction, count]) => (
                    <div key={prediction} className="flex justify-between text-xs">
                      <span className={prediction === 'BENIGN' ? 'text-green-600' : 'text-red-600'}>
                        {prediction}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Última actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default StatusPanel;