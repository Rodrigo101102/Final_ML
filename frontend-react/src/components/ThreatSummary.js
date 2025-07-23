import React from 'react';

const ThreatSummary = ({ predictions, getSummary, getThreatColor }) => {
  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="card-modern p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <svg className="w-6 h-6 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Resumen de Amenazas Detectadas
        </h3>
        <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
          {predictions.length} total
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(getSummary(predictions)).map(([threat, count]) => (
          <div
            key={threat}
            className={`p-4 rounded-lg border-2 duration-200 hover:scale-105 ${getThreatColor(threat, count)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${count > 0 ? 'bg-white bg-opacity-50' : 'bg-gray-200'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {threat === 'BENIGN' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
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
                 threat === 'PortScan' ? 'Escaneo de puertos' :
                 threat === 'BruteForce' ? 'Ataques por fuerza bruta' :
                 threat === 'DoS' ? 'Ataques de denegación' :
                 threat === 'WebAttack' ? 'Ataques web' :
                 'Actividad sospechosa'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatSummary;