import React, { useState, useEffect } from 'react';
import api from '../services/api';

const HistoryPanel = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getHistory();
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
      setError('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (prediction) => {
    switch(prediction) {
      case 'BENIGN': return 'bg-success-100 text-success-800 border-success-200';
      case 'Bot': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'DDoS': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'PortScan': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'BruteForce': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'DoS': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'WebAttack': return 'bg-warning-100 text-warning-800 border-warning-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThreatIcon = (prediction) => {
    switch(prediction) {
      case 'BENIGN': return 'fa-shield-alt';
      case 'Bot': return 'fa-robot';
      case 'DDoS': return 'fa-bomb';
      case 'PortScan': return 'fa-search';
      case 'BruteForce': return 'fa-hammer';
      case 'DoS': return 'fa-ban';
      case 'WebAttack': return 'fa-globe';
      default: return 'fa-question';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const sortedAndFilteredHistory = React.useMemo(() => {
    let filtered = history;
    
    if (filterType !== 'all') {
      if (filterType === 'threats') {
        filtered = history.filter(item => item.prediction !== 'BENIGN');
      } else if (filterType === 'benign') {
        filtered = history.filter(item => item.prediction === 'BENIGN');
      } else {
        filtered = history.filter(item => item.connection_type === filterType);
      }
    }
    
    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'timestamp') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [history, sortBy, sortOrder, filterType]);

  const getHistoryStats = () => {
    const total = history.length;
    const threats = history.filter(item => item.prediction !== 'BENIGN').length;
    const benign = history.filter(item => item.prediction === 'BENIGN').length;
    const connections = [...new Set(history.map(item => item.connection_type))].length;
    
    return { total, threats, benign, connections };
  };

  const stats = getHistoryStats();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="text-center py-8">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar historial</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadHistory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-history mr-2 text-purple-500"></i>
          Historial de Análisis
        </h3>
        <button
          onClick={loadHistory}
          className="text-gray-500 hover:text-purple-500 transition-colors"
          title="Actualizar historial"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-blue-700">Total Análisis</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.threats}</div>
          <div className="text-xs text-red-700">Amenazas</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.benign}</div>
          <div className="text-xs text-green-700">Tráfico Seguro</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.connections}</div>
          <div className="text-xs text-purple-700">Tipos Conexión</div>
        </div>
      </div>

      {/* Controles de filtrado y ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Todos los análisis</option>
            <option value="threats">Solo amenazas</option>
            <option value="benign">Solo tráfico seguro</option>
            <option value="wifi">Conexiones WiFi</option>
            <option value="ethernet">Conexiones Ethernet</option>
            <option value="auto">Conexiones automáticas</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por:</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="timestamp">Fecha</option>
              <option value="prediction">Predicción</option>
              <option value="connection_type">Tipo de conexión</option>
              <option value="count">Cantidad</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
            >
              <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de historial */}
      {sortedAndFilteredHistory.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-inbox text-gray-400 text-3xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
          <p className="text-gray-600">
            {filterType === 'all' 
              ? 'Aún no se han realizado análisis' 
              : 'No hay registros que coincidan con el filtro seleccionado'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedAndFilteredHistory.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  item.prediction === 'BENIGN' ? 'bg-green-100 text-green-600' :
                  ['Bot', 'DDoS', 'DoS', 'BruteForce'].includes(item.prediction) ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <i className={`fas ${getThreatIcon(item.prediction)}`}></i>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getBadgeClass(item.prediction)}`}>
                      {item.prediction}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.connection_type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(item.timestamp)} • Duración: {item.duration}s
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{item.count}</div>
                <div className="text-xs text-gray-500">registros</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Mostrando {sortedAndFilteredHistory.length} de {history.length} registros</span>
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;