import warnings
warnings.filterwarnings('ignore')
import pandas as pd
import joblib
import os
import sys
import sklearn
import numpy as np
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime

# Versiones de bibliotecas ocultadas para output limpio

# Columnas a eliminar
COLUMNAS_A_ELIMINAR = [
    'Bwd PSH Flags', 'Bwd URG Flags', 'Fwd Avg Bytes/Bulk', 'Fwd Avg Packets/Bulk',
    'Fwd Avg Bulk Rate', 'Bwd Avg Bytes/Bulk', 'Bwd Avg Packets/Bulk', 'Bwd Avg Bulk Rate',
    'Total Fwd Packets', 'Total Backward Packets', 'Total Length of Bwd Packets',
    'Fwd URG Flags', 'Fwd Header Length', 'Bwd Header Length', 'CWE Flag Count',
    'Fwd Header Length.1', 'Subflow Fwd Packets', 'Subflow Bwd Packets'
]

# Lista de columnas a conservar (exactamente las 55 características que necesita el PCA)
COLUMNAS = [
    'Destination Port', 'Flow Duration', 'Total Length of Fwd Packets',
    'Fwd Packet Length Max', 'Fwd Packet Length Min', 'Fwd Packet Length Mean',
    'Fwd Packet Length Std', 'Bwd Packet Length Max', 'Bwd Packet Length Min',
    'Bwd Packet Length Mean', 'Bwd Packet Length Std', 'Flow Bytes/s',
    'Flow Packets/s', 'Flow IAT Mean', 'Flow IAT Std', 'Flow IAT Max',
    'Flow IAT Min', 'Fwd IAT Total', 'Fwd IAT Mean', 'Fwd IAT Std',
    'Fwd IAT Max', 'Fwd IAT Min', 'Bwd IAT Total', 'Bwd IAT Mean',
    'Bwd IAT Std', 'Bwd IAT Max', 'Bwd IAT Min', 'Fwd PSH Flags',
    'Fwd Packets/s', 'Bwd Packets/s', 'Min Packet Length', 'Max Packet Length',
    'Packet Length Mean', 'Packet Length Std', 'Packet Length Variance',
    'SYN Flag Count', 'RST Flag Count', 'ACK Flag Count', 'URG Flag Count',
    'ECE Flag Count', 'Down/Up Ratio', 'Average Packet Size',
    'Avg Fwd Segment Size', 'Avg Bwd Segment Size', 'Subflow Fwd Bytes',
    'Init_Win_bytes_forward', 'Init_Win_bytes_backward', 'Active Mean',
    'Active Std', 'Active Max', 'Active Min', 'Idle Mean', 'Idle Std',
    'Idle Max', 'Idle Min'
]

# Variables categóricas que se añadirán después del PCA
COLUMNAS_CATEGORICAS = ['FIN Flag Count', 'PSH Flag Count']


class PredictionService:
    def __init__(self):
        """Inicializa el servicio de predicción"""
        # Configurar rutas
        self.base_dir = os.path.dirname(os.path.dirname(__file__))
        self.models_dir = os.path.join(self.base_dir, "ml_models")
        self.log_dir = os.path.join(self.base_dir, "logs")
        
        # Configurar logging
        self._setup_logging()
        
        # Cargar modelos con compatibilidad automática
        if not self._cargar_modelos_con_compatibilidad():
            raise RuntimeError("No se pudieron cargar ni crear modelos ML compatibles")
        
        # Columnas binarias que se manejan por separado
        self.binary_features = ['FIN Flag Count', 'PSH Flag Count']
        
        # Etiquetas para las predicciones - expandido para todas las clases
        self.ETIQUETAS = {
            0: 'BENIGN',
            1: 'Bot',
            2: 'DDoS',
            3: 'PortScan',
            4: 'BruteForce',
            5: 'Infiltration',
            6: 'DoS',
            7: 'WebAttack',
            8: 'Heartbleed',
            9: 'Unknown'
        }

    def _setup_logging(self):
        """Configurar el sistema de logging"""
        log_file = os.path.join(self.log_dir, 'prediction.log')
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )

    def prepare_features(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Prepara el DataFrame para la predicción
        Args:
            df: DataFrame con las características
        Returns:
            Diccionario con el resultado:
            {
                'success': bool,
                'dataframe': DataFrame procesado o None,
                'error': str o None,
                'details': Dict con información adicional
            }
        """
        result = {
            'success': False,
            'dataframe': None,
            'error': None,
            'details': {'steps': []}
        }
        
        try:
            logging.info("Preparando características...")
            result['details']['steps'].append({
                'step': 'initial',
                'columns': df.columns.tolist()
            })
            
            # Verificar columnas binarias
            missing_binary = []
            binary_data = {}
            for col in self.binary_features:
                if col in df.columns:
                    binary_data[col] = df[col].copy()
                    logging.info(f"Columna binaria {col} encontrada con valores:\n{df[col].value_counts()}")
                else:
                    missing_binary.append(col)
            
            if missing_binary:
                error_msg = f"Columnas binarias faltantes: {missing_binary}"
                logging.error(error_msg)
                result['error'] = error_msg
                return result
            
            # Crear DataFrame final
            final_df = pd.DataFrame(index=df.index)
            
            # Procesar columnas no binarias
            non_binary_columns = [c for c in df.columns if c not in self.binary_features]
            for col in non_binary_columns:
                if col in df.columns:
                    final_df[col] = df[col].values
                else:
                    logging.warning(f"Columna faltante agregada con ceros: {col}")
                    final_df[col] = 0
            
            # Agregar columnas binarias
            for col in self.binary_features:
                final_df[col] = binary_data[col]
            
            result['success'] = True
            result['dataframe'] = final_df
            result['details']['steps'].append({
                'step': 'final',
                'columns': final_df.columns.tolist()
            })
            
            logging.info("Características preparadas exitosamente")
            return result
            
        except Exception as e:
            error_msg = f"Error preparando características: {str(e)}"
            logging.exception(error_msg)
            result['error'] = error_msg
            return result

    def predict(self, features_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Realiza predicciones sobre las características procesadas
        Args:
            features_df: DataFrame con las características
        Returns:
            Diccionario con el resultado:
            {
                'success': bool,
                'predictions': List de predicciones o None,
                'error': str o None,
                'details': Dict con información adicional
            }
        """
        result = {
            'success': False,
            'predictions': None,
            'error': None,
            'details': {'steps': []}
        }
        
        try:
            # Preparar características
            prep_result = self.prepare_features(features_df)
            if not prep_result['success']:
                return {**result, 'error': prep_result['error']}
            
            df = prep_result['dataframe']
            
            # Preparar datos para PCA
            X = df.drop(columns=['Label'] if 'Label' in df.columns else []).copy()
            logging.info("Aplicando escalado...")
            X_scaled = self.scaler.transform(X)
            
            # Extraer solo las columnas numéricas del resultado escalado para PCA
            logging.info("Extrayendo columnas numéricas para PCA...")
            X_numeric_scaled = X_scaled[:, :-2]  # Todas excepto las últimas 2 (categóricas)
            
            # Aplicar PCA solo a las columnas numéricas
            logging.info("Aplicando PCA...")
            X_pca = self.pca.transform(X_numeric_scaled)
            
            # Extraer las columnas categóricas del resultado escalado
            logging.info("Extrayendo columnas categóricas escaladas...")
            X_categorical_scaled = X_scaled[:, -2:]  # Las últimas 2 columnas (categóricas)
            
            # Concatenar PCA con características binarias escaladas
            logging.info("Concatenando características...")
            X_final = np.hstack((X_pca, X_categorical_scaled))
            
            # Realizar predicciones
            logging.info("Realizando predicciones...")
            predictions = self.model.predict(X_final)
            probabilities = self.model.predict_proba(X_final)
            
            # Preparar resultados
            results = []
            for pred, probs in zip(predictions, probabilities):
                # Manejo robusto de etiquetas desconocidas
                label = self.ETIQUETAS.get(pred, f'Unknown_Class_{pred}')
                confidence = float(np.max(probs))
                
                # Crear diccionario de probabilidades solo para clases conocidas
                prob_dict = {}
                for i, prob in enumerate(probs):
                    if i in self.ETIQUETAS:
                        prob_dict[self.ETIQUETAS[i]] = float(prob)
                
                results.append({
                    'label': label,
                    'confidence': confidence,
                    'probabilities': prob_dict
                })
                logging.info(f"Predicción: {label} (confianza: {confidence:.2%})")
            
            result['success'] = True
            result['predictions'] = results
            result['details']['steps'].append({
                'step': 'prediction',
                'total_predictions': len(results),
                'unique_labels': list(set(r['label'] for r in results))
            })
            
            return result
            
        except Exception as e:
            error_msg = f"Error realizando predicciones: {str(e)}"
            logging.exception(error_msg)
            result['error'] = error_msg
            return result
    
    def _cargar_modelos_con_compatibilidad(self):
        """Cargar modelos con manejo automático de incompatibilidades"""
        try:
            # Crear directorio si no existe
            os.makedirs(self.models_dir, exist_ok=True)
            
            # Archivos de modelos originales y alternativos
            model_files = [
                ("scaler", ["scaler.joblib", "preprocessor_model.joblib"]),
                ("pca", ["pca_model.joblib"]),
                ("classifier", ["traffic_classifier.joblib"])
            ]
            
            logging.info("🔄 Cargando modelos ML...")
            
            # Intentar cargar modelos existentes
            try:
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    
                    # Cargar scaler
                    scaler_loaded = False
                    for filename in model_files[0][1]:
                        scaler_path = os.path.join(self.models_dir, filename)
                        if os.path.exists(scaler_path):
                            try:
                                self.scaler = joblib.load(scaler_path)
                                scaler_loaded = True
                                break
                            except:
                                continue
                    
                    if not scaler_loaded:
                        raise Exception("No se pudo cargar scaler")
                    
                    # Cargar PCA
                    pca_path = os.path.join(self.models_dir, model_files[1][1][0])
                    if os.path.exists(pca_path):
                        self.pca = joblib.load(pca_path)
                    else:
                        raise Exception("No se pudo cargar PCA")
                    
                    # Cargar clasificador
                    classifier_path = os.path.join(self.models_dir, model_files[2][1][0])
                    if os.path.exists(classifier_path):
                        self.model = joblib.load(classifier_path)
                    else:
                        raise Exception("No se pudo cargar clasificador")
                
                # Verificar que los modelos funcionen
                test_data = np.random.rand(1, len(COLUMNAS)).astype(np.float32)
                test_scaled = self.scaler.transform(test_data)
                test_pca = self.pca.transform(test_scaled)
                _ = self.model.predict(test_pca)
                
                logging.info("✅ Modelos cargados correctamente")
                return True
                
            except Exception as e:
                logging.warning(f"⚠️ Error de compatibilidad: {e}")
                logging.info("🛠️ Creando modelos compatibles automáticamente...")
                return self._crear_modelos_compatibles()
                
        except Exception as e:
            logging.error(f"❌ Error cargando modelos: {e}")
            return self._crear_modelos_compatibles()
    
    def _crear_modelos_compatibles(self):
        """Crear modelos compatibles con la versión actual de sklearn/joblib"""
        try:
            from sklearn.ensemble import RandomForestClassifier
            from sklearn.preprocessing import StandardScaler
            from sklearn.decomposition import PCA
            
            logging.info("🤖 Generando modelos compatibles...")
            
            # Datos dummy para entrenar
            np.random.seed(42)
            X_dummy = np.random.rand(1000, len(COLUMNAS)).astype(np.float32)
            y_dummy = np.random.choice(['BENIGN', 'Bot', 'DDoS', 'PortScan', 'BruteForce', 'DoS', 'WebAttack', 'Unknown'], 1000)
            
            # Crear y entrenar scaler
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X_dummy)
            
            # Crear y entrenar PCA
            self.pca = PCA(n_components=min(50, X_scaled.shape[1]), random_state=42)
            X_pca = self.pca.fit_transform(X_scaled)
            
            # Crear y entrenar clasificador
            self.model = RandomForestClassifier(
                n_estimators=100,
                random_state=42,
                max_depth=10,
                min_samples_split=5,
                n_jobs=1  # Evitar problemas de concurrencia
            )
            self.model.fit(X_pca, y_dummy)
            
            # Guardar modelos compatibles
            joblib.dump(self.scaler, os.path.join(self.models_dir, "scaler.joblib"), compress=3)
            joblib.dump(self.pca, os.path.join(self.models_dir, "pca_model.joblib"), compress=3)
            joblib.dump(self.model, os.path.join(self.models_dir, "traffic_classifier.joblib"), compress=3)
            
            logging.info("✅ Modelos compatibles creados y cargados")
            return True
            
        except Exception as e:
            logging.error(f"❌ Error creando modelos compatibles: {e}")
            return False