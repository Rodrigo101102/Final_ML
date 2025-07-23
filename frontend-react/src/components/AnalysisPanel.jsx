import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AnalysisPanel = ({ onAnalysisStart, onAnalysisComplete, onAlert }) => {
  const [duration, setDuration] = useState(20);
  const [connectionType, setConnectionType] = useState('auto');
  const [detectedConnection, setDetectedConnection] = useState('Detectando...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ message: '', percentage: 0 });

  useEffect(() => {
    detectConnectionType();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const detectConnectionType = async () => {
    try {
      const response = await api.getNetworkInterfaces();
      const interfaces = response.data;
      
      let detected = 'auto';
      
      if (Array.isArray(interfaces)) {
        const activeInterfaces = interfaces.filter(iface => 
          iface.status === 'up' && !iface.name.includes('loopback')
        );
        
        if (activeInterfaces.some(iface => iface.name.includes('eth') || iface.name.includes('Ethernet'))) {
          detected = 'eth0';
        } else if (activeInterfaces.some(iface => iface.name.includes('wlan') || iface.name.includes('Wi-Fi'))) {
          detected = 'wlan0';
        } else if (activeInterfaces.length > 0) {
          detected = activeInterfaces[0].name;
        }
      }
      
      setDetectedConnection(detected);
      if (connectionType === 'auto') {
        setConnectionType(detected);
      }
    } catch (error) {
      console.error('Error detecting connection type:', error);
      setDetectedConnection('auto');
    }
  };

  const updateProgress = (message, percentage) => {
    setProgress({ message, percentage });
  };

  const startAnalysis = async () => {
    if (!duration || !connectionType) {
      onAlert('Por favor, complete todos los campos.', 'danger');
      return;
    }

    setIsAnalyzing(true);
    onAnalysisStart();
    updateProgress('1. Preparando captura de tráfico...', 20);

    try {
      const response = await api.analyzeTraffic(duration, connectionType);

      if (response.data.success) {
        updateProgress('✓ Análisis completado con éxito', 100);
        setTimeout(() => {
          setIsAnalyzing(false);
          onAnalysisComplete(response.data);
          onAlert(
            `Análisis completado: ${response.data.summary.total_flows} flujos procesados con ${response.data.summary.columns_count} características`,
            'success'
          );
        }, 1000);
      } else {
        throw new Error(response.data.error || 'Error desconocido en el análisis');
      }
    } catch (error) {
      console.error('Error:', error);
      onAlert(
        `❌ Error en el análisis: ${error.response?.data?.detail || error.message}`,
        'danger'
      );
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <div className="flex items-center mb-6">
        <i className="fas fa-cog text-blue-500 text-xl mr-3"></i>
        <h3 className="text-lg font-semibold text-gray-900">Configuración del Análisis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Duración de Captura */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-clock mr-2 text-gray-500"></i>
            Duración de Captura: {duration} segundos
          </label>
          <div className="space-y-3">
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="range"
                  id="duration"
                  min="5"
                  max="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isAnalyzing}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5s</span>
                  <span>60s</span>
                </div>
              </div>
              <div className="w-20">
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={duration}
                  onChange={(e) => {
                    const value = Math.min(60, Math.max(5, parseInt(e.target.value) || 5));
                    setDuration(value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Seg"
                  disabled={isAnalyzing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tipo de Conexión */}
        <div>
          <label htmlFor="connectionType" className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-wifi mr-2 text-gray-500"></i>
            Tipo de Conexión
            {detectedConnection !== 'Detectando...' && (
              <span className="ml-2 text-xs text-gray-500">
                (Detectado: {detectedConnection})
              </span>
            )}
          </label>
          <select
            id="connectionType"
            value={connectionType}
            onChange={(e) => setConnectionType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isAnalyzing}
          >
            <option value="auto">Automático (Detectar)</option>
            <option value="eth0">Ethernet (eth0)</option>
            <option value="wlan0">WiFi (wlan0)</option>
            <option value="wifi">WiFi</option>
            <option value="ethernet">Ethernet</option>
            <option value="mobile">Móvil</option>
          </select>
        </div>
      </div>

      {/* Progreso del Análisis */}
      {isAnalyzing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800 font-medium">Analizando Tráfico de Red</span>
          </div>
          <p className="text-blue-700 text-sm mb-3">{progress.message}</p>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Progreso: {progress.percentage}%</p>
        </div>
      )}

      {/* Botón de Análisis */}
      <div className="text-center">
        <button
          onClick={startAnalysis}
          disabled={isAnalyzing}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            isAnalyzing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transform hover:scale-105'
          }`}
        >
          {isAnalyzing ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Analizando...
            </>
          ) : (
            <>
              <i className="fas fa-play mr-2"></i>
              Iniciar Análisis
            </>
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-info-circle mr-2 text-blue-500"></i>
          Información del Análisis
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Se capturarán paquetes de red durante {duration} segundos</li>
          <li>• Se extraerán características usando flowmeter.js</li>
          <li>• El modelo ML analizará amenazas en tiempo real</li>
          <li>• Los resultados se guardarán en PostgreSQL</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisPanel;