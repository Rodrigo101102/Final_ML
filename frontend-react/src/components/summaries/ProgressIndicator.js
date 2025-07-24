import React from 'react';

const ProgressIndicator = ({ progress }) => {
  return (
    <div className="card-modern p-8 animate-fade-in">
      <div className="text-center">
        <div className="mb-6">
          <div className="bg-primary-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Analizando Tráfico de Red
        </h3>
        
        <p className="text-primary-600 font-medium mb-6 text-lg">
          {progress.message}
        </p>

        <div className="progress-bar mb-6">
          <div 
            className="progress-fill"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-medium">Progreso: {progress.percentage}%</span>
          <span className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ML Engine Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;