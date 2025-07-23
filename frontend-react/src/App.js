import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout components
import Header from './layouts/Header';

// Page components
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br">
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;