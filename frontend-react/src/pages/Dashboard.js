import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';

// Configure axios with the backend URL
axios.defaults.baseURL = BACKEND_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalThreats: 0,
    lastAnalysis: null,
    recentAnalyses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulated dashboard data - replace with actual API calls
      const response = await axios.get('/database/status');
      
      // Mock data for demonstration
      setStats({
        totalAnalyses: response.data?.total_records || 0,
        totalThreats: Math.floor((response.data?.total_records || 0) * 0.15),
        lastAnalysis: new Date().toLocaleDateString(),
        recentAnalyses: []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600">Resumen del sistema de análisis de tráfico</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-modern p-6 text-center">
          <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalAnalyses}</div>
          <div className="text-sm text-gray-600">Análisis Totales</div>
        </div>

        <div className="card-modern p-6 text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalThreats}</div>
          <div className="text-sm text-gray-600">Amenazas Detectadas</div>
        </div>

        <div className="card-modern p-6 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{Math.max(0, stats.totalAnalyses - stats.totalThreats)}</div>
          <div className="text-sm text-gray-600">Tráfico Limpio</div>
        </div>

        <div className="card-modern p-6 text-center">
          <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.lastAnalysis || 'N/A'}</div>
          <div className="text-sm text-gray-600">Último Análisis</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-modern p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <a 
              href="/analysis" 
              className="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="bg-primary-500 p-2 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Nuevo Análisis</div>
                  <div className="text-sm text-gray-600">Iniciar análisis de tráfico</div>
                </div>
              </div>
            </a>
            
            <button 
              onClick={fetchDashboardData}
              className="block w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="bg-gray-500 p-2 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Actualizar Datos</div>
                  <div className="text-sm text-gray-600">Refrescar estadísticas</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="card-modern p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estado del Sistema
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Backend API</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-green-600 font-medium">Activo</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Base de Datos</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-green-600 font-medium">Conectado</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Machine Learning</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-green-600 font-medium">Disponible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;