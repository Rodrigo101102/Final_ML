from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import sys
import subprocess
import time
import pandas as pd
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import create_engine, text
import psycopg2
from config import DatabaseConfig

# Agregar el directorio padre al path para importar los servicios
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.capture_service import CaptureService
from services.processing_service import ProcessingService
from services.prediction_service import PredictionService

app = FastAPI(title="ML Traffic Analyzer", description="Análisis de Tráfico de Red con Machine Learning")

# Configurar CORS para permitir el frontend React en puerto 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Modelo para la petición
class AnalysisRequest(BaseModel):
    duration: int = 20
    connection_type: str = "wifi"

# Configuración de la base de datos PostgreSQL
engine = create_engine(DatabaseConfig.get_sync_connection_string())

def init_database():
    """Inicializa la base de datos PostgreSQL con la tabla trafico_predic"""
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS trafico_predic (
                    id SERIAL PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    connection_type VARCHAR(50),
                    duration INTEGER,
                    
                    -- Características de tráfico (78 columnas)
                    destination_port REAL,
                    flow_duration REAL,
                    total_fwd_packets REAL,
                    total_backward_packets REAL,
                    total_length_fwd_packets REAL,
                    total_length_bwd_packets REAL,
                    fwd_packet_length_max REAL,
                    fwd_packet_length_min REAL,
                    fwd_packet_length_mean REAL,
                    fwd_packet_length_std REAL,
                    bwd_packet_length_max REAL,
                    bwd_packet_length_min REAL,
                    bwd_packet_length_mean REAL,
                    bwd_packet_length_std REAL,
                    flow_bytes_s REAL,
                    flow_packets_s REAL,
                    flow_iat_mean REAL,
                    flow_iat_std REAL,
                    flow_iat_max REAL,
                    flow_iat_min REAL,
                    fwd_iat_total REAL,
                    fwd_iat_mean REAL,
                    fwd_iat_std REAL,
                    fwd_iat_max REAL,
                    fwd_iat_min REAL,
                    bwd_iat_total REAL,
                    bwd_iat_mean REAL,
                    bwd_iat_std REAL,
                    bwd_iat_max REAL,
                    bwd_iat_min REAL,
                    fwd_psh_flags REAL,
                    bwd_psh_flags REAL,
                    fwd_urg_flags REAL,
                    bwd_urg_flags REAL,
                    fwd_header_length REAL,
                    bwd_header_length REAL,
                    fwd_packets_s REAL,
                    bwd_packets_s REAL,
                    min_packet_length REAL,
                    max_packet_length REAL,
                    packet_length_mean REAL,
                    packet_length_std REAL,
                    packet_length_variance REAL,
                    fin_flag_count REAL,
                    syn_flag_count REAL,
                    rst_flag_count REAL,
                    psh_flag_count REAL,
                    ack_flag_count REAL,
                    urg_flag_count REAL,
                    cwe_flag_count REAL,
                    ece_flag_count REAL,
                    down_up_ratio REAL,
                    average_packet_size REAL,
                    avg_fwd_segment_size REAL,
                    avg_bwd_segment_size REAL,
                    fwd_avg_bytes_bulk REAL,
                    fwd_avg_packets_bulk REAL,
                    fwd_avg_bulk_rate REAL,
                    bwd_avg_bytes_bulk REAL,
                    bwd_avg_packets_bulk REAL,
                    bwd_avg_bulk_rate REAL,
                    subflow_fwd_packets REAL,
                    subflow_fwd_bytes REAL,
                    subflow_bwd_packets REAL,
                    subflow_bwd_bytes REAL,
                    init_win_bytes_forward REAL,
                    init_win_bytes_backward REAL,
                    act_data_pkt_fwd REAL,
                    min_seg_size_forward REAL,
                    active_mean REAL,
                    active_std REAL,
                    active_max REAL,
                    active_min REAL,
                    idle_mean REAL,
                    idle_std REAL,
                    idle_max REAL,
                    idle_min REAL,
                    label_original VARCHAR(100),
                    fwd_header_length_1 REAL,
                    
                    -- Predicción (columna 79)
                    prediction VARCHAR(100)
                )
            """))
            conn.commit()
        
        print("✓ Base de datos PostgreSQL inicializada correctamente")
        
    except Exception as e:
        print(f"Error inicializando base de datos PostgreSQL: {e}")
        raise

def impute_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Imputa valores faltantes, infinitos y nulos con la mediana de cada columna"""
    try:
        df_clean = df.copy()
        
        # Iterar por cada columna numérica
        for column in df_clean.columns:
            if df_clean[column].dtype in ['float64', 'int64', 'float32', 'int32']:
                # Reemplazar infinitos con NaN
                df_clean[column] = df_clean[column].replace([float('inf'), float('-inf')], pd.NA)
                
                # Calcular mediana de valores no nulos
                median_value = df_clean[column].median()
                
                # Si no hay valores válidos para calcular mediana, usar 0
                if pd.isna(median_value):
                    median_value = 0.0
                
                # Imputar valores faltantes con la mediana
                df_clean[column] = df_clean[column].fillna(median_value)
                
                print(f"📊 Columna '{column}': {df[column].isna().sum() + (df[column] == float('inf')).sum() + (df[column] == float('-inf')).sum()} valores imputados con mediana {median_value:.4f}")
        
        return df_clean
        
    except Exception as e:
        print(f"Error en imputación: {e}")
        return df

def save_to_database(df: pd.DataFrame, predictions: List[dict], connection_type: str, duration: int):
    """Guarda los datos y predicciones en la base de datos PostgreSQL"""
    try:
        # Preparar datos para inserción
        data_to_insert = []
        
        for i, (_, row) in enumerate(df.iterrows()):
            if i < len(predictions):
                prediction = predictions[i]['label']
                
                # Mapear nombres de columnas a nombres de base de datos (snake_case)
                column_mapping = {
                    'Destination Port': 'destination_port',
                    'Flow Duration': 'flow_duration',
                    'Total Fwd Packets': 'total_fwd_packets',
                    'Total Backward Packets': 'total_backward_packets',
                    'Total Length of Fwd Packets': 'total_length_fwd_packets',
                    'Total Length of Bwd Packets': 'total_length_bwd_packets',
                    'Fwd Packet Length Max': 'fwd_packet_length_max',
                    'Fwd Packet Length Min': 'fwd_packet_length_min',
                    'Fwd Packet Length Mean': 'fwd_packet_length_mean',
                    'Fwd Packet Length Std': 'fwd_packet_length_std',
                    'Bwd Packet Length Max': 'bwd_packet_length_max',
                    'Bwd Packet Length Min': 'bwd_packet_length_min',
                    'Bwd Packet Length Mean': 'bwd_packet_length_mean',
                    'Bwd Packet Length Std': 'bwd_packet_length_std',
                    'Flow Bytes/s': 'flow_bytes_s',
                    'Flow Packets/s': 'flow_packets_s',
                    'Flow IAT Mean': 'flow_iat_mean',
                    'Flow IAT Std': 'flow_iat_std',
                    'Flow IAT Max': 'flow_iat_max',
                    'Flow IAT Min': 'flow_iat_min',
                    'Fwd IAT Total': 'fwd_iat_total',
                    'Fwd IAT Mean': 'fwd_iat_mean',
                    'Fwd IAT Std': 'fwd_iat_std',
                    'Fwd IAT Max': 'fwd_iat_max',
                    'Fwd IAT Min': 'fwd_iat_min',
                    'Bwd IAT Total': 'bwd_iat_total',
                    'Bwd IAT Mean': 'bwd_iat_mean',
                    'Bwd IAT Std': 'bwd_iat_std',
                    'Bwd IAT Max': 'bwd_iat_max',
                    'Bwd IAT Min': 'bwd_iat_min',
                    'Fwd PSH Flags': 'fwd_psh_flags',
                    'Bwd PSH Flags': 'bwd_psh_flags',
                    'Fwd URG Flags': 'fwd_urg_flags',
                    'Bwd URG Flags': 'bwd_urg_flags',
                    'Fwd Header Length': 'fwd_header_length',
                    'Bwd Header Length': 'bwd_header_length',
                    'Fwd Packets/s': 'fwd_packets_s',
                    'Bwd Packets/s': 'bwd_packets_s',
                    'Min Packet Length': 'min_packet_length',
                    'Max Packet Length': 'max_packet_length',
                    'Packet Length Mean': 'packet_length_mean',
                    'Packet Length Std': 'packet_length_std',
                    'Packet Length Variance': 'packet_length_variance',
                    'FIN Flag Count': 'fin_flag_count',
                    'SYN Flag Count': 'syn_flag_count',
                    'RST Flag Count': 'rst_flag_count',
                    'PSH Flag Count': 'psh_flag_count',
                    'ACK Flag Count': 'ack_flag_count',
                    'URG Flag Count': 'urg_flag_count',
                    'CWE Flag Count': 'cwe_flag_count',
                    'ECE Flag Count': 'ece_flag_count',
                    'Down/Up Ratio': 'down_up_ratio',
                    'Average Packet Size': 'average_packet_size',
                    'Avg Fwd Segment Size': 'avg_fwd_segment_size',
                    'Avg Bwd Segment Size': 'avg_bwd_segment_size',
                    'Fwd Avg Bytes/Bulk': 'fwd_avg_bytes_bulk',
                    'Fwd Avg Packets/Bulk': 'fwd_avg_packets_bulk',
                    'Fwd Avg Bulk Rate': 'fwd_avg_bulk_rate',
                    'Bwd Avg Bytes/Bulk': 'bwd_avg_bytes_bulk',
                    'Bwd Avg Packets/Bulk': 'bwd_avg_packets_bulk',
                    'Bwd Avg Bulk Rate': 'bwd_avg_bulk_rate',
                    'Subflow Fwd Packets': 'subflow_fwd_packets',
                    'Subflow Fwd Bytes': 'subflow_fwd_bytes',
                    'Subflow Bwd Packets': 'subflow_bwd_packets',
                    'Subflow Bwd Bytes': 'subflow_bwd_bytes',
                    'Init_Win_bytes_forward': 'init_win_bytes_forward',
                    'Init_Win_bytes_backward': 'init_win_bytes_backward',
                    'act_data_pkt_fwd': 'act_data_pkt_fwd',
                    'min_seg_size_forward': 'min_seg_size_forward',
                    'Active Mean': 'active_mean',
                    'Active Std': 'active_std',
                    'Active Max': 'active_max',
                    'Active Min': 'active_min',
                    'Idle Mean': 'idle_mean',
                    'Idle Std': 'idle_std',
                    'Idle Max': 'idle_max',
                    'Idle Min': 'idle_min',
                    'Label': 'label_original',
                    'Fwd Header Length.1': 'fwd_header_length_1'
                }
                
                # Preparar datos para inserción
                row_data = {
                    'connection_type': connection_type,
                    'duration': duration,
                    'prediction': prediction
                }
                
                # Agregar todas las características
                for orig_col, db_col in column_mapping.items():
                    if orig_col in row:
                        value = row[orig_col]
                        # Convertir a float, los valores ya están imputados
                        if isinstance(value, str):
                            try:
                                value = float(value)
                            except (ValueError, TypeError):
                                value = 0.0
                        else:
                            value = float(value) if value is not None else 0.0
                        row_data[db_col] = value
                
                data_to_insert.append(row_data)
        
        # Insertar usando pandas to_sql (más eficiente para múltiples registros)
        if data_to_insert:
            df_insert = pd.DataFrame(data_to_insert)
            df_insert.to_sql('trafico_predic', engine, if_exists='append', index=False, method='multi')
            print(f"✓ {len(data_to_insert)} registros guardados en PostgreSQL")
        
    except Exception as e:
        print(f"Error guardando en PostgreSQL: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Inicializar la base de datos al arrancar la aplicación"""
    init_database()

@app.get("/")
async def read_root():
    """Servir la página principal"""
    frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "index.html")
    if os.path.exists(frontend_path):
        return FileResponse(frontend_path)
    else:
        return {"message": "ML Traffic Analyzer API", "frontend": "no encontrado"}

@app.get("/api/test")
async def test_connection():
    """Endpoint de prueba para verificar conectividad"""
    return {
        "status": "success",
        "message": "Backend conectado correctamente",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze")
async def analyze_traffic(request: AnalysisRequest):
    """Endpoint principal para análisis de tráfico"""
    try:
        print(f"🚀 INICIANDO ANÁLISIS DE TRÁFICO DE RED")
        print(f"Duración: {request.duration}s, Tipo: {request.connection_type}")
        
        # 1. Captura de tráfico
        print("\n1. Capturando tráfico de red...")
        capture_service = CaptureService()
        pcap_path = capture_service.capture_traffic(duration=request.duration)
        
        if not pcap_path or not os.path.exists(pcap_path):
            raise HTTPException(status_code=500, detail="Error en la captura de tráfico")
        print("✓ Captura completada")
        
        # 2. Procesando con flowmeter
        print("\n2. Extrayendo características...")
        flowmeter_path = os.path.join(os.path.dirname(__file__), 'services', 'flowmeter.js')
        
        if not os.path.exists(flowmeter_path):
            raise HTTPException(status_code=500, detail="Flowmeter no encontrado")
        
        try:
            process = subprocess.run(['node', flowmeter_path, pcap_path], 
                                  check=True, capture_output=True, text=True, timeout=300)
            
            base_name = os.path.splitext(os.path.basename(pcap_path))[0]
            csv_path = os.path.join(os.path.dirname(__file__), 'creados', f"{base_name}_Flow.csv")
            
            # Esperar a que el archivo CSV sea generado
            retries = 10
            while not os.path.exists(csv_path) and retries > 0:
                time.sleep(2)
                retries -= 1
            
            if not os.path.exists(csv_path):
                raise HTTPException(status_code=500, detail="No se generó el archivo CSV")
            
            print("✓ Características extraídas")
            
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=500, detail="Timeout en flowmeter")
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=500, detail=f"Error en flowmeter: {e.stderr}")
        
        # 3. Procesamiento de datos
        print("\n3. Procesando datos...")
        processing_service = ProcessingService()
        
        try:
            processed_result = processing_service.process_csv(csv_path)
            
            if isinstance(processed_result, dict):
                if not processed_result.get('success', False):
                    raise HTTPException(status_code=500, detail=f"Error en procesamiento: {processed_result.get('error')}")
                df = processed_result.get('dataframe')
            else:
                df = processed_result
            
            if df is None or df.empty:
                raise HTTPException(status_code=500, detail="DataFrame vacío")
            
            print(f"✓ Datos procesados - {len(df.columns)} columnas, {len(df)} filas")
            
            # Aplicar imputación de valores faltantes e infinitos
            print("\n3.5. Imputando valores faltantes e infinitos...")
            df = impute_missing_values(df)
            print("✓ Imputación completada")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error procesando datos: {str(e)}")
        
        # 4. Predicción
        print("\n4. Analizando tráfico...")
        prediction_service = PredictionService()
        
        try:
            prediction_result = prediction_service.predict(df)
            
            if isinstance(prediction_result, dict):
                if not prediction_result.get('success', False):
                    raise HTTPException(status_code=500, detail=f"Error en predicción: {prediction_result.get('error')}")
                predictions = prediction_result.get('predictions', [])
            else:
                predictions = prediction_result
            
            if not predictions:
                raise HTTPException(status_code=500, detail="No se obtuvieron predicciones")
            
            print(f"✓ Análisis completado - {len(predictions)} registros analizados")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error en predicciones: {str(e)}")
        
        # 5. Guardar en base de datos PostgreSQL
        print("\n5. Guardando en base de datos PostgreSQL...")
        try:
            save_to_database(df, predictions, request.connection_type, request.duration)
        except Exception as e:
            print(f"Advertencia: Error guardando en BD: {e}")
        
        # 6. Preparar datos completos para el frontend (79 columnas)
        full_data = []
        for i, (_, row) in enumerate(df.iterrows()):
            if i < len(predictions):
                row_dict = row.to_dict()
                row_dict['Prediction'] = predictions[i]['label']
                row_dict['Confidence'] = predictions[i]['confidence']
                full_data.append(row_dict)
        
        # 7. Limpiar archivos temporales
        try:
            if os.path.exists(pcap_path):
                os.remove(pcap_path)
            if os.path.exists(csv_path):
                os.remove(csv_path)
        except:
            pass
        
        print("✓ Proceso completado exitosamente\n")
        
        return {
            "success": True,
            "predictions": predictions,
            "full_data": full_data,
            "summary": {
                "total_flows": len(predictions),
                "duration": request.duration,
                "connection_type": request.connection_type,
                "columns_count": len(df.columns) + 1  # +1 por la predicción
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")

@app.get("/history")
async def get_history(start: str = Query(None), end: str = Query(None)):
    """Obtener historial de análisis desde la base de datos PostgreSQL, filtrando por rango de fechas si se especifica."""
    try:
        with engine.connect() as conn:
            query = """
                SELECT timestamp, connection_type, duration, prediction, COUNT(*) as count
                FROM trafico_predic
            """
            filters = []
            params = {}
            if start:
                filters.append("timestamp >= :start")
                params['start'] = start
            if end:
                filters.append("timestamp <= :end")
                params['end'] = end
            if filters:
                query += " WHERE " + " AND ".join(filters)
            query += " GROUP BY timestamp, connection_type, duration, prediction"
            query += " ORDER BY timestamp DESC LIMIT 100"
            result = conn.execute(text(query), params)
            history = []
            for row in result:
                history.append({
                    "timestamp": row.timestamp.isoformat() if row.timestamp else None,
                    "connection_type": row.connection_type,
                    "duration": row.duration,
                    "prediction": row.prediction,
                    "count": row.count
                })
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo historial: {str(e)}")

@app.get("/database/status")
async def get_database_status():
    """Verificar estado de la base de datos PostgreSQL"""
    try:
        with engine.connect() as conn:
            # Verificar conexión
            conn.execute(text("SELECT 1"))
            
            # Contar registros
            result = conn.execute(text("SELECT COUNT(*) as total FROM trafico_predic"))
            total_records = result.fetchone().total
            
            # Últimos registros
            result = conn.execute(text("""
                SELECT timestamp, connection_type, duration, prediction 
                FROM trafico_predic 
                ORDER BY timestamp DESC 
                LIMIT 5
            """))
            recent_records = []
            for row in result:
                recent_records.append({
                    "timestamp": row.timestamp.isoformat() if row.timestamp else None,
                    "connection_type": row.connection_type,
                    "duration": row.duration,
                    "prediction": row.prediction
                })
        
        return {
            "status": "connected",
            "database": DatabaseConfig.NAME,
            "host": DatabaseConfig.HOST,
            "port": DatabaseConfig.PORT,
            "total_records": total_records,
            "recent_records": recent_records
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "database": DatabaseConfig.NAME,
            "host": DatabaseConfig.HOST,
            "port": DatabaseConfig.PORT
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010)