import os
import sys
import time
import logging
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any
from glob import glob

# Carpeta donde buscar el .csv si no se pasa argumento
CREADOS = os.path.join(os.path.dirname(os.path.dirname(__file__)),  "..",'creados')

class ProcessingService:
    def __init__(self):
        """Inicializa el servicio de procesamiento"""
        # Configurar rutas
        self.base_dir = os.path.dirname(os.path.dirname(__file__))
        self.processed_dir = os.path.join(self.base_dir, "..","processed")
        
        # Crear directorio para archivos procesados
        if not os.path.exists(self.processed_dir):
            os.makedirs(self.processed_dir)
            print(f"Directorio creado: {self.processed_dir}")
        
        # Mapeo para renombrar columnas (solo las 79 necesarias)
        self.rename_map = {
            'Dst Port': 'Destination Port',
            'Flow Duration': 'Flow Duration',
            'Tot Fwd Pkts': 'Total Fwd Packets',
            'Tot Bwd Pkts': 'Total Backward Packets',
            'TotLen Fwd Pkts': 'Total Length of Fwd Packets',
            'TotLen Bwd Pkts': 'Total Length of Bwd Packets',
            'Fwd Pkt Len Max': 'Fwd Packet Length Max',
            'Fwd Pkt Len Min': 'Fwd Packet Length Min',
            'Fwd Pkt Len Mean': 'Fwd Packet Length Mean',
            'Fwd Pkt Len Std': 'Fwd Packet Length Std',
            'Bwd Pkt Len Max': 'Bwd Packet Length Max',
            'Bwd Pkt Len Min': 'Bwd Packet Length Min',
            'Bwd Pkt Len Mean': 'Bwd Packet Length Mean',
            'Bwd Pkt Len Std': 'Bwd Packet Length Std',
            'Flow Byts/s': 'Flow Bytes/s',
            'Flow Pkts/s': 'Flow Packets/s',
            'Flow IAT Mean': 'Flow IAT Mean',
            'Flow IAT Std': 'Flow IAT Std',
            'Flow IAT Max': 'Flow IAT Max',
            'Flow IAT Min': 'Flow IAT Min',
            'Fwd IAT Tot': 'Fwd IAT Total',
            'Fwd IAT Mean': 'Fwd IAT Mean',
            'Fwd IAT Std': 'Fwd IAT Std',
            'Fwd IAT Max': 'Fwd IAT Max',
            'Fwd IAT Min': 'Fwd IAT Min',
            'Bwd IAT Tot': 'Bwd IAT Total',
            'Bwd IAT Mean': 'Bwd IAT Mean',
            'Bwd IAT Std': 'Bwd IAT Std',
            'Bwd IAT Max': 'Bwd IAT Max',
            'Bwd IAT Min': 'Bwd IAT Min',
            'Fwd PSH Flags': 'Fwd PSH Flags',
            'Bwd PSH Flags': 'Bwd PSH Flags',
            'Fwd URG Flags': 'Fwd URG Flags',
            'Bwd URG Flags': 'Bwd URG Flags',
            'Fwd Header Len': 'Fwd Header Length',
            'Bwd Header Len': 'Bwd Header Length',
            'Fwd Pkts/s': 'Fwd Packets/s',
            'Bwd Pkts/s': 'Bwd Packets/s',
            'Pkt Len Min': 'Min Packet Length',
            'Pkt Len Max': 'Max Packet Length',
            'Pkt Len Mean': 'Packet Length Mean',
            'Pkt Len Std': 'Packet Length Std',
            'Pkt Len Var': 'Packet Length Variance',
            'FIN Flag Cnt': 'FIN Flag Count',
            'SYN Flag Cnt': 'SYN Flag Count',
            'RST Flag Cnt': 'RST Flag Count',
            'PSH Flag Cnt': 'PSH Flag Count',
            'ACK Flag Cnt': 'ACK Flag Count',
            'URG Flag Cnt': 'URG Flag Count',
            'CWE Flag Count': 'CWE Flag Count',
            'ECE Flag Cnt': 'ECE Flag Count',
            'Down/Up Ratio': 'Down/Up Ratio',
            'Pkt Size Avg': 'Average Packet Size',
            'Fwd Seg Size Avg': 'Avg Fwd Segment Size',
            'Bwd Seg Size Avg': 'Avg Bwd Segment Size',
            'Fwd Byts/b Avg': 'Fwd Avg Bytes/Bulk',
            'Fwd Pkts/b Avg': 'Fwd Avg Packets/Bulk',
            'Fwd Blk Rate Avg': 'Fwd Avg Bulk Rate',
            'Bwd Byts/b Avg': 'Bwd Avg Bytes/Bulk',
            'Bwd Pkts/b Avg': 'Bwd Avg Packets/Bulk',
            'Bwd Blk Rate Avg': 'Bwd Avg Bulk Rate',
            'Subflow Fwd Pkts': 'Subflow Fwd Packets',
            'Subflow Fwd Byts': 'Subflow Fwd Bytes',
            'Subflow Bwd Pkts': 'Subflow Bwd Packets',
            'Subflow Bwd Byts': 'Subflow Bwd Bytes',
            'Init Fwd Win Byts': 'Init_Win_bytes_forward',
            'Init Bwd Win Byts': 'Init_Win_bytes_backward',
            'Fwd Act Data Pkts': 'act_data_pkt_fwd',
            'Fwd Seg Size Min': 'min_seg_size_forward',
            'Active Mean': 'Active Mean',
            'Active Std': 'Active Std',
            'Active Max': 'Active Max',
            'Active Min': 'Active Min',
            'Idle Mean': 'Idle Mean',
            'Idle Std': 'Idle Std',
            'Idle Max': 'Idle Max',
            'Idle Min': 'Idle Min',
            'Label': 'Label'
        }

    def _setup_logging(self):
        """Configurar el sistema de logging"""
        log_file = os.path.join(self.base_dir, 'processing.log')
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[logging.FileHandler(log_file), logging.StreamHandler()]
        )

    def find_latest_csv(self):
        files = glob(os.path.join(CREADOS, '*_Flow.csv'))
        if not files:
            print('No se encontró ningún archivo *_Flow.csv en la carpeta creados.')
            sys.exit(1)
        return max(files, key=os.path.getmtime)

    def process_csv(self, csv_path: str) -> Dict[str, Any]:
        """
        Procesa un archivo CSV de tráfico para prepararlo para predicción
        Args:
            csv_path: Ruta al archivo CSV a procesar
        Returns:
            Diccionario con el resultado de la operación:
            {
                'success': bool,
                'dataframe': DataFrame o None,
                'error': str o None,
                'processed_path': str o None,
                'details': Dict con información adicional
            }
        """
        result = {
            'success': False,
            'dataframe': None,
            'error': None,
            'processed_path': None,
            'details': {'steps': []}
        }

        try:
            # Verificar existencia del archivo
            if not os.path.exists(csv_path):
                error_msg = f"Archivo CSV no encontrado: {csv_path}"
                print(error_msg)
                result['error'] = error_msg
                return result

            # Leer el CSV con reintentos para manejar problemas de permisos
            df = None
            max_retries = 5
            for attempt in range(max_retries):
                try:
                    df = pd.read_csv(csv_path)
                    break
                except PermissionError:
                    if attempt < max_retries - 1:
                        print(f"Reintentando lectura del CSV (intento {attempt + 1}/{max_retries})...")
                        time.sleep(2)  # Esperar 2 segundos antes del siguiente intento
                    else:
                        raise Exception(f"No se pudo leer el archivo CSV después de {max_retries} intentos")
                except Exception as e:
                    raise Exception(f"Error leyendo CSV: {str(e)}")
                    
            if df is None:
                raise Exception("No se pudo cargar el DataFrame")
                
            # Silencioso: columnas originales del CSV
            result['details']['steps'].append({
                'step': 'read_csv',
                'columns': df.columns.tolist(),
                'rows': len(df)
            })

            # Limpiar nombres de columnas
            clean_cols = []
            for col in df.columns:
                clean_col = ''.join(c for c in col if c.isprintable()).strip()
                clean_cols.append(clean_col)
            df.columns = clean_cols
            result['details']['steps'].append({
                'step': 'clean_columns',
                'columns': clean_cols
            })

            # Renombrar columnas según el mapeo
            df = df.rename(columns=self.rename_map)
            result['details']['steps'].append({
                'step': 'rename_columns',
                'columns': df.columns.tolist()
            })

            # Seleccionar solo las 79 columnas necesarias
            required_columns = list(self.rename_map.values())  # Usar los nombres renombrados
            df = df[required_columns]  # Filtrar el DataFrame para solo tener esas columnas

            # Agregar la columna faltante 'Fwd Header Length.1' y asignar cero
            if 'Fwd Header Length.1' not in df.columns:
                df['Fwd Header Length.1'] = 0
                result['details']['steps'].append({
                    'step': 'add_Fwd_Header_Length_1',
                    'added_column': 'Fwd Header Length.1'
                })

            # Verificar que las columnas faltantes estén presentes
            missing_columns = ['FIN Flag Count', 'PSH Flag Count']
            for col in missing_columns:
                if col not in df.columns:
                    df[col] = 0  # Asignar cero si falta la columna
                    result['details']['steps'].append({
                        'step': f'add_{col}',
                        'added_column': col
                    })

            # Guardar DataFrame procesado
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            processed_path = os.path.join(self.processed_dir, f"processed_{timestamp}.csv")
            df.to_csv(processed_path, index=False)

            # Silencioso: número de columnas del DataFrame final

            # Éxito
            result['success'] = True
            result['dataframe'] = df
            result['processed_path'] = processed_path
            
            # Agregar estadísticas finales
            result['details']['final_stats'] = {
                'total_rows': len(df),
                'total_columns': len(df.columns),
                'memory_usage': df.memory_usage(deep=True).sum()
            }
            
            print(f"✓ Datos procesados - {len(df.columns)} columnas, {len(df)} filas")
            print(f"Columnas procesadas: {', '.join(df.columns)}")
            
            return result

        except Exception as e:
            error_msg = f"Error procesando CSV: {str(e)}"
            print(error_msg)
            result['error'] = error_msg
            return result

if __name__ == '__main__':
    service = ProcessingService()
    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
        if not os.path.isfile(csv_file):
            print(f'No existe el archivo: {csv_file}')
            sys.exit(1)
    else:
        csv_file = service.find_latest_csv()
    service.process_csv(csv_file)
