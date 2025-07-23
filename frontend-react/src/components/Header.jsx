import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <i className="fas fa-shield-alt text-blue-600 text-xl"></i>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">ML Traffic Analyzer</h1>
              <p className="text-blue-100 text-sm">Análisis Inteligente de Tráfico de Red</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-blue-100">
              <i className="fas fa-brain"></i>
              <span className="text-sm">Machine Learning en Tiempo Real</span>
            </div>
            
            <div className="bg-blue-700 px-3 py-1 rounded-full">
              <span className="text-blue-100 text-xs font-medium">v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;