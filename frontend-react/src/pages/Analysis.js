import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';

// Import components
import Alert from '../layouts/Alert';
import DatabaseStatus from '../components/DatabaseStatus';
import AnalysisForm from '../components/AnalysisForm';
import ProgressIndicator from '../components/ProgressIndicator';

// Lazy load heavy components for better performance
const ThreatSummary = React.lazy(() => import('../components/ThreatSummary'));
const ResultsTable = React.lazy(() => import('../components/ResultsTable'));

// Configure axios with the backend URL
axios.defaults.baseURL = BACKEND_URL;

const Analysis = () => {
  const [duration, setDuration] = useState(20);
  const [connectionType, setConnectionType] = useState('auto');
  const [detectedConnection, setDetectedConnection] = useState('Detectando...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ message: '', percentage: 0 });
  const [results, setResults] = useState(null);
  const [alert, setAlert] = useState(null);
  const [databaseStatus, setDatabaseStatus] = useState(null);

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

  return (
    <div className="container py-8 space-y-8">
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

          {/* Lazy-loaded components for better performance */}
          <Suspense fallback={
            <div className="card-modern p-8">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          }>
            {/* Threat Summary */}
            <ThreatSummary predictions={results.predictions} />

            {/* Results Table */}
            <ResultsTable fullData={results.full_data} predictions={results.predictions} summary={results.summary} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default Analysis;