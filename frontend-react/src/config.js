// Configuración para producción (Vercel + Render)
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ml-traffic-analyzer.onrender.com'  // URL de tu backend en Render
  : 'http://localhost:8010';

export default BACKEND_URL;
