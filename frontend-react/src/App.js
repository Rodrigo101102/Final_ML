import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configurar axios para usar el backend en puerto 8003
const API_BASE_URL = 'http://localhost:8003';
axios.defaults.baseURL = API_BASE_URL;

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

  // Función para detectar el tipo de conexión automáticamente
  const detectConnectionType = async () => {
    try {
      const response = await axios.get('/network/interfaces');
      const interfaces = response.data;
      
      // Lógica para determinar el tipo de conexión más probable
      let detected = 'auto';
      
      // Buscar interfaces activas
      const activeInterfaces = interfaces.filter(iface => 
        iface.status === 'up' && !iface.name.includes('loopback')
      );
      
      // Priorizar conexiones por tipo
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

  // Verificar estado de la base de datos al cargar
  useEffect(() => {
    checkDatabaseStatus();
    detectConnectionType();
  }, []);

  // Reiniciar paginación cuando cambian los resultados
  useEffect(() => {
    setCurrentPage(1);
    setShowAllRecords(false);
  }, [results]);

  const checkDatabaseStatus = async () => {
    try {
      const response = await axios.get('/database/status');
      setDatabaseStatus(response.data);
    } catch (error) {
      console.error('Error verificando base de datos:', error);
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
      showAlert('Por favor, complete todos los campos.', 'danger');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    updateProgress('1. Preparando captura de tráfico...', 20);

    try {
      const response = await axios.post('/analyze', {
        duration: parseInt(duration),
        connection_type: connectionType
      });

      if (response.data.success) {
        updateProgress('✓ Análisis completado con éxito', 100);
        setTimeout(() => {
          setResults(response.data);
          setIsAnalyzing(false);
          showAlert(
            `Análisis completado: ${response.data.summary.total_flows} flujos procesados con ${response.data.summary.columns_count} características`,
            'success'
          );
          // Actualizar estado de la base de datos
          checkDatabaseStatus();
        }, 1000);
      } else {
        throw new Error(response.data.error || 'Error desconocido en el análisis');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert(
        `❌ Error en el análisis: ${error.response?.data?.detail || error.message}`,
        'danger'
      );
      setIsAnalyzing(false);
    }
  };

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

  const getBadgeClass = (label) => {
    switch(label) {
      case 'BENIGN': return 'bg-success';
      case 'Bot': return 'bg-danger';
      case 'DDoS': return 'bg-danger';
      case 'PortScan': return 'bg-warning';
      case 'BruteForce': return 'bg-danger';
      case 'DoS': return 'bg-danger';
      case 'WebAttack': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getThreatIcon = (label) => {
    switch(label) {
      case 'BENIGN': return 'fa-shield-check';
      case 'Bot': return 'fa-robot';
      case 'DDoS': return 'fa-shield-virus';
      case 'PortScan': return 'fa-search';
      case 'BruteForce': return 'fa-hammer';
      case 'DoS': return 'fa-ban';
      case 'WebAttack': return 'fa-globe';
      default: return 'fa-question';
    }
  };

  const getBackgroundColor = (label) => {
    if (label === 'BENIGN') return 'rgba(34, 197, 94, 0.08)';
    if (['Bot', 'DDoS', 'DoS', 'BruteForce'].includes(label)) return 'rgba(239, 68, 68, 0.08)';
    return 'rgba(245, 158, 11, 0.08)';
  };

  const getTableRowClass = (prediction) => {
    if (prediction === 'BENIGN') return 'table-light border-success';
    if (['Bot', 'DDoS', 'DoS', 'BruteForce'].includes(prediction)) return 'table-light border-danger';
    return 'table-light border-warning';
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            <i className="fas fa-shield-alt me-2"></i>
            ML Traffic Analyzer
          </a>
          <span className="navbar-text">
            <i className="fas fa-brain me-1"></i>
            Análisis Inteligente de Tráfico de Red
          </span>
        </div>
      </nav>

      <div className="container my-4">
        {/* Alert */}
        {alert && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : alert.type === 'danger' ? 'exclamation-circle' : 'info-circle'} me-2`}></i>
            {alert.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert(null)}
            ></button>
          </div>
        )}

        {/* Formulario de Configuración */}
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">
                  <i className="fas fa-cog me-2"></i>
                  Configuración del Análisis
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="duration" className="form-label">
                      <i className="fas fa-clock me-2"></i>
                      Duración de Captura: {duration} segundos
                    </label>
                    <div className="row g-2">
                      <div className="col-8">
                        <input
                          type="range"
                          className="form-range"
                          id="duration"
                          min="5"
                          max="60"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                        />
                      </div>
                      <div className="col-4">
                        <input
                          type="number"
                          className="form-control"
                          min="5"
                          max="60"
                          value={duration}
                          onChange={(e) => {
                            const value = Math.min(60, Math.max(5, parseInt(e.target.value) || 5));
                            setDuration(value);
                          }}
                          placeholder="Segundos"
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">5s</small>
                      <small className="text-muted">60s</small>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="connectionType" className="form-label">
                      <i className="fas fa-wifi me-2"></i>
                      Tipo de Conexión
                      {detectedConnection !== 'Detectando...' && (
                        <small className="text-muted ms-2">
                          (Detectado: {detectedConnection})
                        </small>
                      )}
                    </label>
                    <select
                      className="form-select"
                      id="connectionType"
                      value={connectionType}
                      onChange={(e) => setConnectionType(e.target.value)}
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
                <div className="text-center">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={startAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Analizando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play me-2"></i>
                        Iniciar Análisis
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de la Base de Datos */}
        {databaseStatus && (
          <div className="row mb-4">
            <div className="col-lg-8 mx-auto">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-database me-2"></i>
                    Estado de la Base de Datos
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className={`icon-container ${databaseStatus.status === 'connected' ? 'icon-success' : 'bg-danger'} mx-auto`}>
                          <i className={`fas ${databaseStatus.status === 'connected' ? 'fa-check' : 'fa-times'} fa-lg`}></i>
                        </div>
                        <h6>{databaseStatus.status === 'connected' ? 'Conectado' : 'Error'}</h6>
                        <small className="text-muted">{databaseStatus.database}</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <h3 className="text-primary">{databaseStatus.total_records || 0}</h3>
                        <p className="text-muted">Registros Totales</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <h6>Host: {databaseStatus.host}:{databaseStatus.port}</h6>
                        <small className="text-muted">PostgreSQL</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progreso */}
        {isAnalyzing && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="text-center">
                    <div className="spinner-border mb-3" role="status">
                      <span className="visually-hidden">Analizando...</span>
                    </div>
                    <h5>Analizando Tráfico de Red</h5>
                    <p className="text-primary">{progress.message}</p>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    <small className="text-muted">Progreso: {progress.percentage}%</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {results && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title mb-0">
                    <i className="fas fa-chart-line me-2"></i>
                    Resultados del Análisis
                  </h4>
                </div>
                <div className="card-body">
                  {(() => {
                    const threatCounts = getSummary(results.predictions);
                    return (
                      <div className="mb-4">
                        <h5 className="mb-3">
                          <i className="fas fa-chart-pie me-2"></i>
                          Resumen de Amenazas Detectadas
                        </h5>
                        <div className="row">
                          {Object.entries(threatCounts).map(([threat, count]) => (
                            <div key={threat} className="col-md-6 col-lg-4 col-xl-3 mb-3">
                              <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center">
                                  <div className={`icon-container ${getBadgeClass(threat)} mx-auto mb-2`} style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                  }}>
                                    <i className={`fas ${getThreatIcon(threat)} fa-lg`}></i>
                                  </div>
                                  <h4 className={`mb-1 ${count > 0 ? 'text-primary' : 'text-muted'}`}>{count}</h4>
                                  <h6 className="card-title text-muted mb-0">{threat}</h6>
                                  <small className="text-muted">
                                    {threat === 'BENIGN' ? 'Tráfico seguro' :
                                     threat === 'Bot' ? 'Actividad de bots' :
                                     threat === 'DDoS' ? 'Ataques distribuidos' :
                                     threat === 'PortScan' ? 'Escaneo de puertos' :
                                     threat === 'BruteForce' ? 'Ataques por fuerza bruta' :
                                     threat === 'Infiltration' ? 'Intentos de infiltración' :
                                     threat === 'DoS' ? 'Ataques de denegación' :
                                     threat === 'WebAttack' ? 'Ataques web' :
                                     threat === 'Heartbleed' ? 'Vulnerabilidad SSL' :
                                     'Tipo desconocido'}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Recuadro del Total de Paquetes */}
                  <div className="row mb-4">
                    <div className="col-md-4 mx-auto">
                      <div className="card bg-gradient text-white" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}>
                        <div className="card-body text-center">
                          <i className="fas fa-boxes fa-2x mb-2"></i>
                          <h3 className="mb-1">{results.full_data.length}</h3>
                          <h6 className="mb-0">Total de Paquetes Analizados</h6>
                          <small className="opacity-75">
                            {results.summary.columns_count} características por paquete
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-3">Detalle de Predicciones:</h5>
                  <div className="row">
                    {results.predictions.map((pred, index) => (
                      <div key={index} className="col-md-6 col-lg-4 mb-3">
                        <div
                          className="card border-0"
                          style={{ background: getBackgroundColor(pred.label) }}
                        >
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="card-title">Flujo #{index + 1}</h6>
                                <span className={`badge ${getBadgeClass(pred.label)}`}>
                                  {pred.label}
                                </span>
                              </div>
                              <div className="text-end">
                                <h5 className="mb-0">{(pred.confidence * 100).toFixed(1)}%</h5>
                                <small className="text-muted">Confianza</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tabla de datos completos */}
                  {results.full_data && results.full_data.length > 0 && (() => {
                    const totalRecords = results.full_data.length;
                    const totalPages = Math.ceil(totalRecords / recordsPerPage);
                    const startIndex = (currentPage - 1) * recordsPerPage;
                    const endIndex = startIndex + recordsPerPage;
                    const currentRecords = showAllRecords ? results.full_data : results.full_data.slice(startIndex, endIndex);
                    
                    // Obtener todas las columnas disponibles
                    const allColumns = results.full_data.length > 0 ? Object.keys(results.full_data[0]).filter(key => key !== 'Confidence') : [];
                    
                    return (
                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">
                            <i className="fas fa-table me-2"></i>
                            Datos Completos ({results.summary.columns_count} Columnas)
                          </h5>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setShowAllRecords(!showAllRecords)}
                            >
                              <i className={`fas fa-${showAllRecords ? 'compress' : 'expand'} me-1`}></i>
                              {showAllRecords ? 'Mostrar paginado' : `Ver todos (${totalRecords})`}
                            </button>
                            {!showAllRecords && totalPages > 1 && (
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                  disabled={currentPage === 1}
                                >
                                  <i className="fas fa-chevron-left"></i>
                                </button>
                                <span className="btn btn-sm btn-outline-secondary disabled">
                                  {currentPage} / {totalPages}
                                </span>
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                  disabled={currentPage === totalPages}
                                >
                                  <i className="fas fa-chevron-right"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="results-container">
                          <div className="table-responsive">
                            <table className="table table-hover table-striped">
                              <thead className="table-dark">
                                <tr>
                                  <th style={{position: 'sticky', left: 0, background: '#212529', zIndex: 10}}>#</th>
                                  <th style={{position: 'sticky', left: '50px', background: '#212529', zIndex: 10}}>Predicción</th>
                                  {allColumns.map((column, index) => (
                                    <th key={index} style={{minWidth: '120px'}}>
                                      {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {currentRecords.map((row, index) => {
                                  const actualIndex = showAllRecords ? index : startIndex + index;
                                  return (
                                    <tr key={actualIndex} className={getTableRowClass(row.Prediction)} style={{
                                      borderLeft: `4px solid ${row.Prediction === 'BENIGN' ? '#22c55e' : 
                                                              ['Bot', 'DDoS', 'DoS', 'BruteForce'].includes(row.Prediction) ? '#ef4444' : '#f59e0b'}`
                                    }}>
                                      <td style={{position: 'sticky', left: 0, background: 'inherit', zIndex: 9}}>
                                        <strong>{actualIndex + 1}</strong>
                                      </td>
                                      <td style={{position: 'sticky', left: '50px', background: 'inherit', zIndex: 9}}>
                                        <span className={`badge ${getBadgeClass(row.Prediction)} fs-6`}>
                                          {row.Prediction}
                                        </span>
                                        <br />
                                        <small className="text-muted">
                                          {(row.Confidence * 100).toFixed(1)}%
                                        </small>
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
                          
                          {!showAllRecords && (
                            <div className="d-flex justify-content-between align-items-center mt-3 p-2 bg-light rounded">
                              <small className="text-muted">
                                Mostrando {startIndex + 1} - {Math.min(endIndex, totalRecords)} de {totalRecords} registros
                              </small>
                              <div className="d-flex gap-1">
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
                                      className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-primary'}`}
                                      onClick={() => setCurrentPage(pageNum)}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
