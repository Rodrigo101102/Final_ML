import { useState } from 'react';
import { fetchNetworkInterfaces, fetchDatabaseStatus, analyzeTraffic } from '../services/api';

const useAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState({ message: '', percentage: 0 });
  const [alert, setAlert] = useState(null);
  const [databaseStatus, setDatabaseStatus] = useState(null);

  // Detectar el tipo de conexión
  const detectConnectionType = async () => {
    try {
      const interfaces = await fetchNetworkInterfaces();
      let detected = 'auto';
      const activeInterfaces = interfaces.filter(iface => 
        iface.status === 'up' && !iface.name.includes('loopback')
      );

      if (activeInterfaces.some(iface => iface.name.includes('eth') || iface.name.includes('Ethernet'))) {
        detected = 'eth0';
      } else if (activeInterfaces.some(iface => iface.name.includes('wlan') || iface.name.includes('Wi-Fi'))) {
        detected = 'wlan0';
      } else if (activeInterfaces.length > 0) {
        detected = activeInterfaces[0].name;
      }
      
      return detected;
    } catch (error) {
      console.error('Error detecting connection type:', error);
      return 'auto';
    }
  };

  // Verificar el estado de la base de datos
  const checkDatabaseStatus = async () => {
    try {
      const status = await fetchDatabaseStatus();
      setDatabaseStatus(status);
    } catch (error) {
      console.error('Error checking database status:', error);
    }
  };

  // Iniciar análisis de tráfico
  const startAnalysis = async (duration, connectionType) => {
    if (!duration || !connectionType) {
      setAlert({ message: 'Por favor, complete todos los campos.', type: 'error' });
      return;
    }
    setIsAnalyzing(true);
    setResults(null);
    setProgress({ message: 'Preparando captura...', percentage: 20 });

    try {
      setProgress({ message: 'Capturando tráfico...', percentage: 40 });
      const response = await analyzeTraffic(duration, connectionType);

      if (response.success) {
        setProgress({ message: 'Procesando con Machine Learning...', percentage: 80 });
        setTimeout(() => {
          setProgress({ message: 'Análisis completado con éxito', percentage: 100 });
          setResults(response);
          setIsAnalyzing(false);
          setAlert({ message: `Análisis completado: ${response.summary.total_flows} flujos procesados`, type: 'success' });
          checkDatabaseStatus();
        }, 1000);
      } else {
        throw new Error(response.error || 'Error desconocido');
      }
    } catch (error) {
      setAlert({ message: `Error en el análisis: ${error.message}`, type: 'error' });
      setIsAnalyzing(false);
      setProgress({ message: '', percentage: 0 });
    }
  };

  return { isAnalyzing, results, progress, alert, databaseStatus, startAnalysis, checkDatabaseStatus, detectConnectionType };
};

export default useAnalysis;
