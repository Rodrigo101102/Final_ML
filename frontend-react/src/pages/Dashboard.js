import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';
import Header from '../components/Layout/Header';
import Alert from '../components/Layout/Alert';

function Dashboard() {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/historical');
      setHistoricalData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      showAlert('Error al cargar datos históricos', 'error');
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  // Aquí iría el renderizado de los análisis históricos
  return (
    <>
      <Header />
      {/* Main prominent header */}
      <div className="w-full py-10 shadow-md mb-8 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-4 rounded-2xl shadow-sm">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">ML Traffic Analyzer <span className="font-light">- Random Forest</span></h1>
              <p className="text-cyan-100 text-base mt-1">Historial de análisis de tráfico previos</p>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-[50vh] flex flex-col items-center justify-start py-6 bg-gray-50">
        <Alert alert={alert} onClose={() => setAlert(null)} />
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-5 mb-8 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 p-3 rounded-2xl shadow-sm">
                <svg className="w-9 h-9 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Análisis Históricos</h2>
                <p className="text-gray-500 text-base">Historial de análisis de tráfico previos</p>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-14 h-14 border-4 border-primary border-t-transparent rounded-full mx-auto mb-5"></div>
                <p className="text-lg text-gray-500">Cargando datos históricos...</p>
              </div>
            ) : historicalData.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">No se encontraron análisis históricos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2 w-full justify-items-center">
                {historicalData.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-white rounded-xl shadow border border-gray-100 px-3 py-3 flex flex-col gap-2 hover:shadow-lg transition-all duration-200 mx-auto relative group min-w-[180px] max-w-[220px]"
                  >
                    <div className="flex items-center gap-4 mb-1">
                      <div className="bg-blue-100 rounded-full p-3 shadow-sm">
                        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">{item.title || `Análisis #${idx + 1}`}</div>
                        <div className="text-xs text-gray-400">{item.date || item.timestamp || 'Sin fecha'}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                      <span className="bg-gray-100 rounded px-2 py-1 font-semibold shadow-sm">{item.total_flows || item.flows || 0} flujos</span>
                      <span className="bg-gray-100 rounded px-2 py-1 font-semibold shadow-sm">{item.columns_count || item.features || 0} características</span>
                      {item.connection_type && <span className="bg-gray-100 rounded px-2 py-1 font-semibold shadow-sm">{item.connection_type}</span>}
                      {item.duration && <span className="bg-gray-100 rounded px-2 py-1 font-semibold shadow-sm">{item.duration}s</span>}
                    </div>
                    {item.summary && (
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {Object.entries(item.summary).map(([k, v]) => (
                          <div key={k} className="flex justify-between"><span className="font-semibold">{k}:</span> <span>{v}</span></div>
                        ))}
                      </div>
                    )}
                    {item.notes && <div className="mt-2 text-xs text-gray-400 italic">{item.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
