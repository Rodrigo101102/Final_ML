import React from 'react';

const DatabaseStatus = ({ databaseStatus }) => {
  if (!databaseStatus) return null;

  return (
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
  );
};

export default DatabaseStatus;