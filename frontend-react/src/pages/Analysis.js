import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import BACKEND_URL from '../config';
import Header from '../components/Layout/Header';
import Alert from '../components/Layout/Alert';

function Analysis() {
  const [backendStatus, setBackendStatus] = useState(null);
  // const [history, setHistory] = useState([]);
  const [duration, setDuration] = useState(20);
  const [connectionType, setConnectionType] = useState('wifi');
  // Eliminado: detectedConnection y auto-detección, ya que el backend no expone /network/interfaces
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ message: '', percentage: 0 });
  const [results, setResults] = useState(null);
  const [alert, setAlert] = useState(null);
  const [databaseStatus, setDatabaseStatus] = useState(null);
  // const [showAllRecords, setShowAllRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;


  // Check database status on load
  useEffect(() => {
    // Consultar estado del backend
    axios.get('/api/test').then(res => setBackendStatus(res.data)).catch(() => setBackendStatus(null));
    // Consultar historial
    // axios.get('/history').then(res => setHistory(res.data.history || [])).catch(() => setHistory([]));
    checkDatabaseStatus();
    // Eliminada la auto-detección de interfaces
  }, []);

  // Reset pagination when results change
  useEffect(() => {
    setCurrentPage(1);
    // setShowAllRecords(false);
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
          setResults(response.data);
          setIsAnalyzing(false);
          showAlert(
            `Análisis completado: ${response.data.summary.total_flows} flujos procesados con ${response.data.summary.columns_count} características`,
            'success'
          );
          checkDatabaseStatus(); // Update database status
        }, 1000);
      } else {
        throw new Error(response.data.error || 'Error desconocido en el análisis');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert(`❌ Error en el análisis: ${error.response?.data?.detail || error.message}`, 'error');
      setIsAnalyzing(false);
      setProgress({ message: '', percentage: 0 });
    }
  };

  // Helper functions for result display
  // Ahora cuenta usando el campo 'Prediction' (el que se muestra en la tabla)
  const getSummary = (rows) => {
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
    rows.forEach(row => {
      const label = row.Prediction;
      if (threatCounts.hasOwnProperty(label)) {
        threatCounts[label]++;
      } else {
        threatCounts['Unknown']++;
      }
    });
    return threatCounts;
  };

  return (
    <>
      <Header />
      <div className="container py-8 space-y-8">
      {/* Estado del backend */}
      {backendStatus && (
        <div className="card-modern p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-blue-800">Backend:</span>
            <span className="text-blue-700">{backendStatus.message}</span>
            <span className="text-xs text-blue-500">{backendStatus.timestamp}</span>
          </div>
        </div>
      )}
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
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${databaseStatus.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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


<div className="card-modern w-full max-w-lg mx-auto rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 px-8 py-8 flex flex-col items-start space-y-8">
  <form className="w-full flex flex-col gap-6">

    {/* Duración de captura */}
    <div className="w-full flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700" htmlFor="duration-range">Duración de Captura (Segundos)</label>
      <div className="flex items-center gap-4 w-full">
        <span className="text-sm text-gray-400">5s</span>
        
        {/* Control deslizante */}
        <input
          id="duration-range"
          type="range"
          min="5"
          max="60"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="h-2 flex-1 rounded-lg accent-blue-500"
        />

        <span className="text-sm text-gray-400">60s</span>
        
        {/* Campo de texto */}
        <input
          type="number"
          min="5"
          max="60"
          value={duration}
          onChange={(e) => {
            const value = Math.min(60, Math.max(5, parseInt(e.target.value) || 5));
            setDuration(value);
          }}
          className="form-input text-xs px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 w-16 text-center shadow-sm"
          placeholder="Seg"
        />
      </div>
    </div>

    {/* Tipo de Conexión */}
    <div className="w-full flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700" htmlFor="connection-type">Tipo de Conexión</label>
      <select
        id="connection-type"
        value={connectionType}
        onChange={(e) => setConnectionType(e.target.value)}
        className="form-select text-sm px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 w-full shadow-sm"
      >
        <option value="wifi">WiFi</option>
        <option value="ethernet">Ethernet</option>
        <option value="mobile">Móvil</option>
      </select>
    </div>

    {/* Botón Iniciar Análisis */}
    <div className="w-full mt-6">
      <button
        type="button"
        onClick={startAnalysis}
        disabled={isAnalyzing}
        className={`w-full px-6 py-3 rounded-lg shadow-lg ${isAnalyzing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center`}
        style={{ minHeight: 50 }}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analizando...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Iniciar Análisis
          </div>
        )}
      </button>
    </div>
  </form>
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
          {/* Display Results as Cards */}
          <div className="card-modern p-8 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-8 text-gray-800 tracking-tight text-center">Resultado del Análisis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-4xl mx-auto">
              {[ 
                {
                  key: 'BENIGN',
                  label: 'BENIGN',
                  color: 'bg-green-100 text-green-800 border-green-200',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#22c55e" /><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ),
                  description: 'Tráfico seguro'
                },
                {
                  key: 'Bot',
                  label: 'Bot',
                  color: 'bg-red-100 text-red-800 border-red-200',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ef4444" /><circle cx="9" cy="10" r="1.5" fill="#fff" /><circle cx="15" cy="10" r="1.5" fill="#fff" /><rect x="8" y="14" width="8" height="2" rx="1" fill="#fff" /></svg>
                  ),
                  description: 'Actividad de Bot'
                },
                {
                  key: 'DDoS',
                  label: 'DDoS',
                  color: 'bg-red-100 text-red-800 border-red-200',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ef4444" /><path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                  ),
                  description: 'Ataques distribuidos'
                },
                {
                  key: 'PortScan',
                  label: 'PortScan',
                  color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f59e42" /><path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                  ),
                  description: 'Escaneo de puertos'
                },
                {
                  key: 'BruteForce',
                  label: 'BruteForce',
                  color: 'bg-red-100 text-red-800 border-red-200',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#ef4444" /><path d="M8 16l8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                  ),
                  description: 'Ataques por fuerza bruta'
                },
                {
                  key: 'DoS',
                  label: 'DoS',
                  color: 'bg-red-100 text-red-800 border-red-200',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ef4444" /><rect x="8" y="11" width="8" height="2" rx="1" fill="#fff" /></svg>
                  ),
                  description: 'Ataques de denegación'
                },
                {
                  key: 'WebAttack',
                  label: 'WebAttack',
                  color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f59e42" /><path d="M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                  ),
                  description: 'Ataques web'
                },
                {
                  key: 'Unknown',
                  label: 'Unknown',
                  color: 'bg-gray-200 text-gray-800 border-gray-300',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#6b7280" /><text x="12" y="16" textAnchor="middle" fontSize="8" fill="#fff">?</text></svg>
                  ),
                  description: 'Tipo desconocido'
                }
              ].map(card => {
                const summary = getSummary(results.full_data || []);
                return (
                  <div
                    key={card.key}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${card.color} shadow min-w-[160px] max-w-[210px] w-full transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="flex-shrink-0">{React.cloneElement(card.icon, { className: 'w-8 h-8' })}</div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold tracking-tight">{summary[card.key] || 0}</span>
                        <span className="font-semibold text-xs uppercase tracking-wide">{card.label}</span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">{card.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-base text-gray-600 text-center font-medium">{results.summary.total_flows} flujos procesados &bull; {results.summary.columns_count} características procesadas</div>
          </div>
          {/* Tabla de resultados: profesional y responsiva */}
          {results.full_data && results.full_data.length > 0 && (
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold mb-2">Resultados detallados</h3>
              <div style={{ overflowX: 'auto', maxWidth: '100vw', margin: '0 auto' }}>
                <table className="table-modern w-full text-sm" style={{ minWidth: 900, margin: '0 auto' }}>
                  <thead>
                    <tr>
                      {(() => {
                        // Usar los nombres exactos del backend
                        const backendColOrder = ['Prediction', 'Confidence', 'Flow Duration'];
                        const allCols = Object.keys(results.full_data[0]).filter(col => col.toLowerCase() !== 'label');
                        const ordered = [
                          ...backendColOrder.filter(c => allCols.includes(c)),
                          ...allCols.filter(col => !backendColOrder.includes(col))
                        ];
                        return ordered.map((col) => (
                          <th key={col} className="px-4 py-2 text-center whitespace-nowrap bg-gray-100 border-b border-gray-200">{col}</th>
                        ));
                      })()}
                    </tr>
                  </thead>
                  <tbody>
                    {results.full_data
                      .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                      .map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {(() => {
                            // Usar los nombres exactos del backend
                            const backendColOrder = ['Prediction', 'Confidence', 'Flow Duration'];
                            const allCols = Object.keys(row).filter(key => key.toLowerCase() !== 'label');
                            const ordered = [
                              ...backendColOrder.filter(c => allCols.includes(c)),
                              ...allCols.filter(col => !backendColOrder.includes(col))
                            ];
                            return ordered.map((key, j) => {
                              const val = row[key];
                              if (key === 'Confidence' && typeof val === 'number') {
                                return (
                                  <td key={j} className="px-4 py-2 text-center border-b border-gray-100 whitespace-nowrap">
                                    <span style={{
                                      color: '#111',
                                      fontWeight: 'bold',
                                      fontSize: '1.25rem',
                                      lineHeight: 1.2
                                    }}>
                                      {`${Math.round(val * 100)}%`}
                                    </span>
                                  </td>
                                );
                              }
                              if (key === 'Prediction') {
                                const isBenign = String(val).toUpperCase() === 'BENIGN';
                                return (
                                  <td key={j} className="px-4 py-2 text-center border-b border-gray-100 whitespace-nowrap" style={{color: isBenign ? '#16a34a' : '#dc2626', fontWeight: 'bold'}}>
                                    {val}
                                  </td>
                                );
                              }
                              return (
                                <td key={j} className="px-4 py-2 text-center border-b border-gray-100 whitespace-nowrap">{val}</td>
                              );
                            });
                          })()}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Controles de paginación */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span>Página {currentPage} de {Math.ceil(results.full_data.length / recordsPerPage)}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(Math.ceil(results.full_data.length / recordsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(results.full_data.length / recordsPerPage)}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          {/* Historial de análisis oculto por requerimiento */}
        </div>
      )}
    </div>
    </>
  );
}

export default Analysis;