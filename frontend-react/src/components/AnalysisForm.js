import React from 'react';

const AnalysisForm = ({ 
  duration, 
  setDuration, 
  connectionType, 
  setConnectionType, 
  detectedConnection,
  isAnalyzing,
  onStartAnalysis 
}) => {
  return (
    <div className="card-modern p-6">
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-3 rounded-xl mr-4">
          <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="mt-8 text-center">
        <button
          onClick={onStartAnalysis}
          disabled={isAnalyzing}
          className="btn-modern px-8 py-3 text-base"
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
  );
};

export default AnalysisForm;