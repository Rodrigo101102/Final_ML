import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND_URL from './config';

// Import components
import Header from './components/Layout/Header';
import Alert from './components/Layout/Alert';
import DatabaseStatus from './components/DatabaseStatus';
import AnalysisForm from './components/AnalysisForm';
import ProgressIndicator from './components/ProgressIndicator';
import ThreatSummary from './components/ThreatSummary';

// Configure axios with the backend URL
axios.defaults.baseURL = BACKEND_URL;

function App() {
  const [duration, setDuration] = useState(20);
  const [connectionType, setConnectionType] = useState('auto');
  const [detectedConnection, setDetectedConnection] = useState('Detectando...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ message: '', percentage: 0 });
  const [results, setResults] = useState(null);
  const [alert, setAlert] = useState(null);
  const [databaseStatus, setDatabaseStatus] = useState(null);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Function to detect connection type automatically
  const detectConnectionType = async () => {
    try {
      const response = await axios.get('/network/interfaces');
      const interfaces = response.data;
      
      // Logic to determine the most likely connection type
      let detected = 'auto';
      
      // Look for active interfaces
      const activeInterfaces = interfaces.filter(iface => 
        iface.status === 'up' && !iface.name.includes('loopback')
      );
      
      // Prioritize connections by type
      if (activeInterfaces.some(iface => iface.name.includes('eth') || iface.name.includes('Ethernet'))) {
        detected = 'eth0';
      } else if (activeInterfaces.some(iface => iface.name.includes('wlan') || iface.name.includes('Wi-Fi'))) {
        detected = 'wlan0';
      } else if (activeInterfaces.length > 0) {
        detected = activeInterfaces[0].name;
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

  // Check database status on load
  useEffect(() => {
    checkDatabaseStatus();
    detectConnectionType();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset pagination when results change
  useEffect(() => {
    setCurrentPage(1);
    setShowAllRecords(false);
  }, [results]);

  const checkDatabaseStatus = async () => {
    try {
      const response = await axios.get('/database/status');
      setDatabaseStatus(response.data);
    } catch (error) {
      console.error('Error checking database:', error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const updateProgress = (message, percentage) => {
    setProgress({ message, percentage });
  };

  const startAnalysis = async () => {
    if (!duration || !connectionType) {
      showAlert('Por favor, complete todos los campos.', 'error');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    updateProgress('1. Preparando captura de tráfico...', 20);

    try {
      updateProgress('2. Capturando tráfico de red...', 40);
      
      const response = await axios.post('/analyze', {
        duration: parseInt(duration),
        connection_type: connectionType
      });

      if (response.data.success) {
        updateProgress('3. Procesando con Machine Learning...', 80);
        
        setTimeout(() => {
          updateProgress('✓ Análisis completado con éxito', 100);
          setTimeout(() => {
            setResults(response.data);
            setIsAnalyzing(false);
            showAlert(
              `Análisis completado: ${response.data.summary.total_flows} flujos procesados con ${response.data.summary.columns_count} características`,
              'success'
            );
            // Update database status
            checkDatabaseStatus();
          }, 1000);
        }, 1000);
      } else {
        throw new Error(response.data.error || 'Error desconocido en el análisis');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert(
        `❌ Error en el análisis: ${error.response?.data?.detail || error.message}`,
        'error'
      );
      setIsAnalyzing(false);
      setProgress({ message: '', percentage: 0 });
    }
  };

  // Helper functions for threat display
  const getSummary = (predictions) => {
    const threatCounts = {
      'BENIGN': 0,
      'Bot': 0,
      'DDoS': 0,
      'PortScan': 0,
      'BruteForce': 0,
      'DoS': 0,
      'WebAttack': 0,
      'Unknown': 0
    };
    
    predictions.forEach(pred => {
      if (threatCounts.hasOwnProperty(pred.label)) {
        threatCounts[pred.label]++;
      } else {
        threatCounts['Unknown']++;
      }
    });
    
    return threatCounts;
  };

  const getThreatColor = (threat, count) => {
    if (count === 0) return 'bg-gray-50 text-gray-500 border-gray-200 opacity-60';
    
    switch(threat) {
      case 'BENIGN': return 'bg-green-50 text-green-700 border-green-200 shadow-sm';
      case 'Bot': 
      case 'DDoS': 
      case 'DoS': 
      case 'BruteForce': return 'bg-red-50 text-red-700 border-red-200 shadow-sm';
      case 'PortScan': 
      case 'WebAttack': return 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 shadow-sm';
    }
  };

  const getBadgeColor = (prediction) => {
    switch(prediction) {
      case 'BENIGN': return 'bg-green-100 text-green-800';
      case 'Bot': 
      case 'DDoS': 
      case 'DoS': 
      case 'BruteForce': return 'bg-red-100 text-red-800';
      case 'PortScan': 
      case 'WebAttack': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRowBorder = (prediction) => {
    switch(prediction) {
      case 'BENIGN': return 'border-l-4 border-green-400';
      case 'Bot': 
      case 'DDoS': 
      case 'DoS': 
      case 'BruteForce': return 'border-l-4 border-red-400';
      case 'PortScan': 
      case 'WebAttack': return 'border-l-4 border-yellow-400';
      default: return 'border-l-4 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <Header />
      
      <main className="container py-8 space-y-8">
        <Alert alert={alert} onClose={() => setAlert(null)} />

        {/* Database Status */}
        <DatabaseStatus databaseStatus={databaseStatus} />

        {/* Analysis Form */}
        <AnalysisForm 
          duration={duration}
          setDuration={setDuration}
          connectionType={connectionType}
          setConnectionType={setConnectionType}
          detectedConnection={detectedConnection}
          isAnalyzing={isAnalyzing}
          onStartAnalysis={startAnalysis}
        />

        {/* Progress Indicator */}
        {isAnalyzing && <ProgressIndicator progress={progress} />}

        {/* Results Section */}
        {results && (
          <div className="space-y-8 animate-fade-in">
            {/* Total Packets Summary */}
            <div className="card-modern p-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl mr-6">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">{results.full_data.length}</div>
                      <div className="text-xl">Total de Paquetes Analizados</div>
                    </div>
                  </div>
                  <div className="text-sm opacity-90">
                    {results.summary.columns_count} características por paquete
                  </div>
                </div>
              </div>
            </div>

            {/* Threat Summary */}
            <ThreatSummary 
              predictions={results.predictions}
              getSummary={getSummary}
              getThreatColor={getThreatColor}
            />
      default: return 'border-l-4 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <Header />
      
      <main className="container py-8 space-y-8">
        <Alert alert={alert} onClose={() => setAlert(null)} />

        {/* Database Status */}
        {databaseStatus && (
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3H4c-1.1 0-2 .9-2 2v10" />
                </svg>
                Estado de la Base de Datos
              </h3>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                databaseStatus.status === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${databaseStatus.status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>{databaseStatus.status === 'connected' ? 'Conectado' : 'Error'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {databaseStatus.total_records || 0}
                </div>
                <div className="text-sm text-gray-600">Registros Totales</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {databaseStatus.database || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Base de Datos</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {databaseStatus.host}:{databaseStatus.port}
                </div>
                <div className="text-xs text-gray-500">PostgreSQL</div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Form */}
        <div className="card-modern p-6">
          <div className="flex items-center mb-6">
            <div className="bg-primary-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Configuración del Análisis</h2>
              <p className="text-gray-600">Configure los parámetros para el análisis de tráfico</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Control */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Duración de Captura: {duration} segundos
              </label>
              
              <div className="space-y-2">
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="range-slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5s</span>
                  <span>60s</span>
                </div>
              </div>

              <input
                type="number"
                min="5"
                max="60"
                value={duration}
                onChange={(e) => {
                  const value = Math.min(60, Math.max(5, parseInt(e.target.value) || 5));
                  setDuration(value);
                }}
                className="form-input"
                placeholder="Segundos"
              />
            </div>

            {/* Connection Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                Tipo de Conexión
                {detectedConnection !== 'Detectando...' && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Detectado: {detectedConnection})
                  </span>
                )}
              </label>
              
              <select
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value)}
                className="form-select"
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

          <div className="mt-6 text-center">
            <button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="btn-modern"
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Iniciar Análisis
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        {isAnalyzing && (
          <div className="card-modern p-6 animate-fade-in">
            <div className="text-center">
              <div className="mb-4">
                <div className="bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analizando Tráfico de Red
              </h3>
              
              <p className="text-primary-600 font-medium mb-4">
                {progress.message}
              </p>

              <div className="progress-bar mb-4">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Progreso: {progress.percentage}%</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ML Engine Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8 animate-fade-in">
            {/* Total Packets Summary */}
            <div className="card-modern p-6">
              <div className="text-center">
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{results.full_data.length}</div>
                      <div style={{ fontSize: '1.125rem' }}>Total de Paquetes Analizados</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                    {results.summary.columns_count} características por paquete
                  </div>
                </div>
              </div>
            </div>

            {/* Threat Summary */}
            <div className="card-modern p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Resumen de Amenazas Detectadas
                </h3>
                <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {results.predictions.length} total
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(getSummary(results.predictions)).map(([threat, count]) => (
                  <div
                    key={threat}
                    className={`p-4 rounded-lg border-2 duration-200 hover:scale-105 ${getThreatColor(threat, count)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${count > 0 ? 'bg-white bg-opacity-50' : 'bg-gray-200'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${count === 0 ? 'opacity-50' : ''}`}>
                          {count}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className={`font-semibold text-sm ${count === 0 ? 'opacity-50' : ''}`}>
                        {threat}
                      </h4>
                      <p className={`text-xs ${count === 0 ? 'opacity-50' : 'opacity-75'}`}>
                        {threat === 'BENIGN' ? 'Tráfico seguro' :
                         threat === 'Bot' ? 'Actividad de bots' :
                         threat === 'DDoS' ? 'Ataques distribuidos' :
                         'Actividad sospechosa'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Predictions */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Detalle de Predicciones
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.predictions.map((pred, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 duration-200 hover:scale-105 ${
                      pred.label === 'BENIGN' 
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : ['Bot', 'DDoS', 'DoS', 'BruteForce'].includes(pred.label)
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-sm text-gray-600">Flujo #{index + 1}</div>
                        <div className={`font-bold text-lg`}>
                          {pred.label}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{(pred.confidence * 100).toFixed(1)}%</div>
                        <div className="text-xs opacity-75">Confianza</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Table */}
            {results.full_data && results.full_data.length > 0 && (() => {
              const totalRecords = results.full_data.length;
              const totalPages = Math.ceil(totalRecords / recordsPerPage);
              const startIndex = (currentPage - 1) * recordsPerPage;
              const endIndex = startIndex + recordsPerPage;
              const currentRecords = showAllRecords ? results.full_data : results.full_data.slice(startIndex, endIndex);
              
              // Get all available columns
              const allColumns = results.full_data.length > 0 ? Object.keys(results.full_data[0]).filter(key => key !== 'Confidence') : [];
              
              return (
                <div className="card-modern overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Datos Completos ({results.summary.columns_count} Columnas)
                      </h3>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setShowAllRecords(!showAllRecords)}
                          className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 duration-200 text-sm font-medium"
                        >
                          {showAllRecords ? 'Mostrar paginado' : `Ver todos (${totalRecords})`}
                        </button>
                        
                        {!showAllRecords && totalPages > 1 && (
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 duration-200"
                            >
                              ←
                            </button>
                            <span className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm">
                              {currentPage} / {totalPages}
                            </span>
                            <button 
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 duration-200"
                            >
                              →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto" style={{ maxHeight: showAllRecords ? 'none' : '600px' }}>
                    <table className="table-modern">
                      <thead className="sticky top-0 z-10">
                        <tr>
                          <th className="sticky left-0 bg-gray-800 border-r border-gray-200">#</th>
                          <th className="sticky bg-gray-800 border-r border-gray-200" style={{ left: '48px' }}>Predicción</th>
                          {allColumns.map((column, index) => (
                            <th key={index} style={{ minWidth: '120px' }}>
                              {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.map((row, index) => {
                          const actualIndex = showAllRecords ? index : startIndex + index;
                          return (
                            <tr key={actualIndex} className={`duration-200 ${getRowBorder(row.Prediction)}`}>
                              <td className="sticky left-0 bg-white border-r border-gray-200 font-medium">
                                {actualIndex + 1}
                              </td>
                              <td className="sticky bg-white border-r border-gray-200" style={{ left: '48px' }}>
                                <div className="space-y-1">
                                  <span className={`badge-modern ${getBadgeColor(row.Prediction)}`}>
                                    {row.Prediction}
                                  </span>
                                  <div className="text-xs text-gray-500">
                                    {(row.Confidence * 100).toFixed(1)}% confianza
                                  </div>
                                </div>
                              </td>
                              {allColumns.map((column, colIndex) => (
                                <td key={colIndex}>
                                  {typeof row[column] === 'number' 
                                    ? row[column].toFixed(2) 
                                    : row[column] || 'N/A'}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {!showAllRecords && totalPages > 1 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Mostrando {startIndex + 1} - {Math.min(endIndex, totalRecords)} de {totalRecords} registros
                        </div>
                        
                        <div className="flex space-x-1">
                          {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 text-sm rounded-lg duration-200 ${
                                  currentPage === pageNum
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;