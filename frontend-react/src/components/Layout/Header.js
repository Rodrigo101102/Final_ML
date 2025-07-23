import React from 'react';

const Header = () => {
  return (
    <header className="header-gradient">
      <div className="container py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-500 p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ML Traffic Analyzer</h1>
              <p className="text-gray-300 text-sm">Análisis Inteligente de Tráfico de Red</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium">Powered by Machine Learning</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Sistema Activo</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;