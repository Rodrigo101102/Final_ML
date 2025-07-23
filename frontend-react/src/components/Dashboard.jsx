import React, { useState } from 'react';
import AnalysisPanel from './AnalysisPanel';
import ResultsPanel from './ResultsPanel';
import HistoryPanel from './HistoryPanel';
import StatusPanel from './StatusPanel';

const Dashboard = () => {
  const [results, setResults] = useState(null);
  const [alert, setAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleAnalysisStart = () => {
    setResults(null);
    setActiveTab('analysis');
  };

  const handleAnalysisComplete = (analysisResults) => {
    setResults(analysisResults);
    setActiveTab('results');
  };

  const tabs = [
    { id: 'analysis', label: 'Análisis', icon: 'fa-play-circle' },
    { id: 'results', label: 'Resultados', icon: 'fa-chart-line', disabled: !results },
    { id: 'history', label: 'Historial', icon: 'fa-history' },
    { id: 'status', label: 'Estado', icon: 'fa-server' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Alert */}
        {alert && (
          <div className={`mb-6 p-4 rounded-lg border ${
            alert.type === 'success' 
              ? 'bg-success-50 border-success-200 text-success-800' 
              : alert.type === 'danger' 
              ? 'bg-danger-50 border-danger-200 text-danger-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className={`fas ${
                  alert.type === 'success' ? 'fa-check-circle' : 
                  alert.type === 'danger' ? 'fa-exclamation-circle' : 
                  'fa-info-circle'
                } mr-3`}></i>
                <span>{alert.message}</span>
              </div>
              <button
                onClick={() => setAlert(null)}
                className="text-current opacity-75 hover:opacity-100 transition-opacity"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-soft p-2">
            <nav className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : tab.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <i className={`fas ${tab.icon} mr-2`}></i>
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalysisPanel
                  onAnalysisStart={handleAnalysisStart}
                  onAnalysisComplete={handleAnalysisComplete}
                  onAlert={showAlert}
                />
              </div>
              <div>
                <StatusPanel />
              </div>
            </div>
          )}

          {activeTab === 'results' && results && (
            <ResultsPanel results={results} />
          )}

          {activeTab === 'history' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HistoryPanel />
              </div>
              <div>
                <StatusPanel />
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusPanel />
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                  Información del Sistema
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Versión Frontend</span>
                    <span className="text-sm font-medium text-gray-900">React 18 + Tailwind CSS</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Backend</span>
                    <span className="text-sm font-medium text-gray-900">FastAPI + PostgreSQL</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Machine Learning</span>
                    <span className="text-sm font-medium text-gray-900">Modelo entrenado personalizado</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Análisis de Tráfico</span>
                    <span className="text-sm font-medium text-gray-900">Flowmeter.js + Captura en tiempo real</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Características extraídas</span>
                    <span className="text-sm font-medium text-gray-900">78 características por flujo</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    <i className="fas fa-lightbulb mr-2"></i>
                    Tipos de Amenazas Detectables
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                    <div>• Tráfico BENIGN</div>
                    <div>• Actividad de Bots</div>
                    <div>• Ataques DDoS</div>
                    <div>• Escaneo de Puertos</div>
                    <div>• Ataques BruteForce</div>
                    <div>• Ataques DoS</div>
                    <div>• Ataques Web</div>
                    <div>• Otros tipos</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>ML Traffic Analyzer - Análisis Inteligente de Tráfico de Red con Machine Learning</p>
          <p className="mt-1">Desarrollado con React 18, Tailwind CSS, FastAPI y PostgreSQL</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;