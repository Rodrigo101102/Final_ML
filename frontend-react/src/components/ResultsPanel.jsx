import React, { useState } from 'react';

const ResultsPanel = ({ results }) => {
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  if (!results) {
    return null;
  }

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
      case 'BENIGN': return 'bg-success-500 text-white';
      case 'Bot': return 'bg-danger-500 text-white';
      case 'DDoS': return 'bg-danger-600 text-white';
      case 'PortScan': return 'bg-warning-500 text-white';
      case 'BruteForce': return 'bg-danger-700 text-white';
      case 'DoS': return 'bg-danger-500 text-white';
      case 'WebAttack': return 'bg-warning-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getThreatIcon = (label) => {
    switch(label) {
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

  const getBackgroundColor = (label) => {
    if (label === 'BENIGN') return 'bg-success-50 border-success-200';
    if (['Bot', 'DDoS', 'DoS', 'BruteForce'].includes(label)) return 'bg-danger-50 border-danger-200';
    return 'bg-warning-50 border-warning-200';
  };

  const threatCounts = getSummary(results.predictions);
  const totalRecords = results.full_data?.length || 0;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = showAllRecords ? results.full_data : results.full_data?.slice(startIndex, endIndex) || [];
  const allColumns = results.full_data?.length > 0 ? Object.keys(results.full_data[0]).filter(key => key !== 'Confidence') : [];

  return (
    <div className="space-y-6">
      {/* Encabezado de Resultados */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            <i className="fas fa-chart-line mr-2 text-blue-500"></i>
            Resultados del Análisis
          </h3>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleString()}
          </div>
        </div>

        {/* Total de Paquetes */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 max-w-sm mx-auto">
            <i className="fas fa-boxes text-3xl mb-3"></i>
            <div className="text-3xl font-bold mb-1">{totalRecords}</div>
            <div className="text-blue-100">Total de Paquetes Analizados</div>
            <div className="text-xs text-blue-200 mt-1">
              {results.summary?.columns_count} características por paquete
            </div>
          </div>
        </div>

        {/* Resumen de Amenazas */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4">
            <i className="fas fa-chart-pie mr-2 text-purple-500"></i>
            Resumen de Amenazas Detectadas
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(threatCounts).map(([threat, count]) => (
              <div key={threat} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                    threat === 'BENIGN' ? 'bg-success-100 text-success-600' :
                    ['Bot', 'DDoS', 'DoS', 'BruteForce'].includes(threat) ? 'bg-danger-100 text-danger-600' :
                    'bg-warning-100 text-warning-600'
                  }`}>
                    <i className={`fas ${getThreatIcon(threat)} fa-lg`}></i>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${count > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                    {count}
                  </div>
                  <div className="text-sm font-medium text-gray-700">{threat}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {threat === 'BENIGN' ? 'Tráfico seguro' :
                     threat === 'Bot' ? 'Actividad de bots' :
                     threat === 'DDoS' ? 'Ataques distribuidos' :
                     threat === 'PortScan' ? 'Escaneo de puertos' :
                     threat === 'BruteForce' ? 'Ataques por fuerza bruta' :
                     threat === 'DoS' ? 'Ataques de denegación' :
                     threat === 'WebAttack' ? 'Ataques web' :
                     'Tipo desconocido'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detalle de Predicciones */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h4 className="text-md font-medium text-gray-800 mb-4">Detalle de Predicciones</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.predictions.map((pred, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getBackgroundColor(pred.label)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Flujo #{index + 1}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass(pred.label)}`}>
                    {pred.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{(pred.confidence * 100).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Confianza</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de Datos Completos */}
      {results.full_data && results.full_data.length > 0 && (
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-800">
              <i className="fas fa-table mr-2 text-green-500"></i>
              Datos Completos ({results.summary?.columns_count} Columnas)
            </h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowAllRecords(!showAllRecords)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className={`fas fa-${showAllRecords ? 'compress' : 'expand'} mr-1`}></i>
                {showAllRecords ? 'Paginado' : `Ver todos (${totalRecords})`}
              </button>
              {!showAllRecords && totalPages > 1 && (
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <span className="px-3 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                    {currentPage} / {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-12 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predicción
                  </th>
                  {allColumns.map((column, index) => (
                    <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map((row, index) => {
                  const actualIndex = showAllRecords ? index : startIndex + index;
                  return (
                    <tr key={actualIndex} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {actualIndex + 1}
                      </td>
                      <td className="sticky left-12 z-10 bg-white px-4 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass(row.Prediction)}`}>
                          {row.Prediction}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {(row.Confidence * 100).toFixed(1)}%
                        </div>
                      </td>
                      {allColumns.map((column, colIndex) => (
                        <td key={colIndex} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
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
            <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50 rounded-lg">
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
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;