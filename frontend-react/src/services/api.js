import axios from 'axios';
import BACKEND_URL from '../config';

axios.defaults.baseURL = BACKEND_URL;

export const fetchNetworkInterfaces = async () => {
  try {
    const response = await axios.get('/network/interfaces');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching network interfaces');
  }
};

export const fetchDatabaseStatus = async () => {
  try {
    const response = await axios.get('/database/status');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching database status');
  }
};

export const analyzeTraffic = async (duration, connectionType) => {
  try {
    const response = await axios.post('/analyze', {
      duration: parseInt(duration),
      connection_type: connectionType
    });
    return response.data;
  } catch (error) {
    throw new Error('Error analyzing traffic');
  }
};
