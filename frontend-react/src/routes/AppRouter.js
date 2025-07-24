import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page components
import Welcome from '../pages/Welcome';
import Dashboard from '../pages/Dashboard';
import Analysis from '../pages/Analysis';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analysis" element={<Analysis />} />
      {/* Puedes agregar más rutas aquí */}
    </Routes>
  );
}

export default AppRoutes;