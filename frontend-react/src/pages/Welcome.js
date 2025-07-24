import React from 'react';
import Header from '../components/Layout/Header';
import wiresharkImg from '../assets/images/wireshark.png'; 
import flometerImg from '../assets/images/flometer.png'; 
import preprocesadorImg from '../assets/images/preprocesador.png'; 
import pcaImg from '../assets/images/pca.png'; 
import modeloImg from '../assets/images/modelo_random_forest.png'; 

function Welcome() {
  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-gray-900 to-gray-700 py-16 px-6">
        <section className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-5xl p-8">
          
          {/* Título */}
          <h1 className="text-3xl font-semibold text-white mb-6 text-center">
             Proceso de detección
          </h1>

          {/* Descripción */}
          <p className="text-lg text-gray-300 mb-8 text-center max-w-xl leading-relaxed">
            Este diagrama representa el flujo del proceso de Machine Learning con las siguientes tecnologías:
            <span className="font-semibold text-blue-400">Random Forest, PCA y Redes Neuronales</span>.
          </p>

          {/* Diagrama de secuencia vertical */}
          <div className="flex flex-col items-center justify-center space-y-12">

            {/* Paso 1 - Captura con Wireshark */}
            <div className="flex flex-col items-center">
              <img
                src={wiresharkImg}
                alt="Wireshark"
                style={{ width: '96px', height: '96px', objectFit: 'contain' }} // Tamaño consistente para todas las imágenes
                className="mb-6"
              />
              <p className="text-white text-center">Captura red con Wireshark</p>
            </div>

            {/* Flecha */}
            <div className="flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2L12 22M12 22L7 17M12 22L17 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Paso 2 - Flometer */}
            <div className="flex flex-col items-center">
              <img
                src={flometerImg}
                alt="Flometer"
                style={{ width: '96px', height: '96px', objectFit: 'contain' }} // Tamaño consistente para todas las imágenes
                className="mb-6"
              />
              <p className="text-white text-center">Flometer (.pcap)</p>
            </div>

            {/* Flecha */}
            <div className="flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2L12 22M12 22L7 17M12 22L17 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Paso 3 - Selección de columnas */}
            <div className="flex flex-col items-center">
              <img
                src={preprocesadorImg}
                alt="Selección de Columna"
                style={{ width: '96px', height: '96px', objectFit: 'contain' }} // Tamaño consistente para todas las imágenes
                className="mb-6"
              />
              <p className="text-white text-center">Selección de Columnas</p>
            </div>

            {/* Flecha */}
            <div className="flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2L12 22M12 22L7 17M12 22L17 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Paso 4 - Preprocesamiento */}
            <div className="flex flex-col items-center">
              <img
                src={pcaImg}
                alt="PCA"
                style={{ width: '96px', height: '96px', objectFit: 'contain' }} // Tamaño consistente para todas las imágenes
                className="mb-6"
              />
              <p className="text-white text-center">PCA .joblib</p>
            </div>

            {/* Flecha */}
            <div className="flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2L12 22M12 22L7 17M12 22L17 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Paso 5 - Modelo Random Forest */}
            <div className="flex flex-col items-center">
              <img
                src={modeloImg}
                alt="Modelo Random Forest"
                style={{ width: '96px', height: '96px', objectFit: 'contain' }} // Tamaño consistente para todas las imágenes
                className="mb-6"
              />
              <p className="text-white text-center">Modelo Random Forest .joblib</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-8 mt-8 w-full">
            <a
              href="/analysis"
              className="px-8 py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              aria-label="Nuevo Análisis"
            >
              Nuevo Análisis
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export default Welcome;
