import React, { useState, useMemo } from 'react';

const ResultsTable = ({ fullData, predictions, summary }) => {
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Memoize expensive calculations
  const { totalRecords, totalPages, currentRecords, allColumns } = useMemo(() => {
    const total = fullData?.length || 0;
    const pages = Math.ceil(total / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const current = showAllRecords ? fullData : fullData?.slice(startIndex, endIndex) || [];
    const columns = fullData?.length > 0 ? Object.keys(fullData[0]).filter(key => key !== 'Confidence') : [];
    
    return {
      totalRecords: total,
      totalPages: pages,
      currentRecords: current,
      allColumns: columns
    };
  }, [fullData, currentPage, recordsPerPage, showAllRecords]);

  // Helper functions for threat display
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

  if (!fullData || fullData.length === 0) {
    return null;
  }

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  return (
    <div className="card-modern overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Datos Completos ({summary.columns_count} Columnas)
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
};

export default React.memo(ResultsTable);