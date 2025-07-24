import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-indigo-900 via-blue-900 to-blue-700 shadow-lg">
      <div className="container py-2">
        <nav className="flex items-center justify-between min-h-[48px]">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="bg-primary-500 p-1.5 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide mb-0.5">Análisis de Tráfico de Red</h1>
                <p className="text-gray-300 text-xs">Random Forest</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-5">
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive('/')
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-blue-500 hover:bg-opacity-70'
                }`}
                style={{ minWidth: 80, textAlign: 'center' }}
              >
                Home
              </Link>
              <Link
                to="/analysis"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive('/analysis')
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-blue-500 hover:bg-opacity-70'
                }`}
                style={{ minWidth: 80, textAlign: 'center' }}
              >
                Análisis
              </Link>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-blue-500 hover:bg-opacity-70'
                }`}
                style={{ minWidth: 100, textAlign: 'center' }}
              >
                Dashboard
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            </div>

            {/* Powered by ML badge removed as requested */}
            
            <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Activo</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;