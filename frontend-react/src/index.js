import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Asegúrate de tener esta importación
import App from './App'; // Tu archivo principal
import './index.css';

ReactDOM.render(
  <BrowserRouter>  {/* Aquí envuelves tu aplicación */}
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
