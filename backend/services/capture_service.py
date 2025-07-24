import os
import subprocess
import tempfile
import time

class CaptureService:
    def __init__(self):
        # Rutas base
        self.flowmeter_path = os.path.join(os.path.dirname(__file__), "flowmeter.js")
        self.creados_dir = os.path.join(os.path.dirname(__file__), "..", "creados")
        
        # Crear directorio creados si no existe
        if not os.path.exists(self.creados_dir):
            os.makedirs(self.creados_dir)
            
        print(f"Ruta de flowmeter: {self.flowmeter_path}")
        print(f"Directorio creados: {self.creados_dir}")

    def capture_traffic(self, duration: int = 20) -> str:
        """Capturar tráfico de red y guardar en archivo PCAP"""
        try:
            # Crear archivo temporal para el PCAP
            with tempfile.NamedTemporaryFile(suffix='.pcap', dir=self.creados_dir, delete=False) as temp_pcap:
                pcap_file = temp_pcap.name
                
            print(f"Iniciando captura por {duration} segundos...")
            
            # Iniciar captura con tshark
            process = subprocess.Popen(
                [
                    "tshark",
                    "-i", "Wi-Fi",
                    "-a", f"duration:{duration}",
                    "-w", pcap_file
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Monitorear el progreso de la captura
            start_time = time.time()
            while process.poll() is None:
                elapsed_time = time.time() - start_time
                progress = min(100, (elapsed_time / duration) * 100)
                print(f"Progreso: {progress:.1f}%")
                time.sleep(1)
                if elapsed_time >= duration:
                    process.terminate()
                    break

            stdout, stderr = process.communicate()
            
            if process.returncode != 0 and not os.path.exists(pcap_file):
                print(f"Error en tshark: {stderr.decode()}")
                return None

            print(f"Archivo PCAP guardado en: {pcap_file}")
            return pcap_file
            
            
        except Exception as e:
            if 'pcap_file' in locals() and os.path.exists(pcap_file):
                os.unlink(pcap_file)
            raise Exception(f"Error en la captura de tráfico: {str(e)}")

    def process_with_flowmeter(self, pcap_file: str) -> str:
        """Procesar archivo PCAP con flowmeter.js y retornar la ruta del CSV generado"""
        try:
            # Ejecutar flowmeter.js
            process = subprocess.Popen(
                ["node", self.flowmeter_path, pcap_file],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            stdout, stderr = process.communicate()
            
            if process.returncode != 0:
                raise Exception(f"Error procesando con flowmeter: {stderr.decode()}")
            
            # Buscar el archivo CSV generado
            csv_files = [f for f in os.listdir(self.creados_dir) if f.endswith('_Flow.csv')]
            if not csv_files:
                raise Exception("No se encontró el archivo CSV generado por flowmeter")
            
            # Tomar el archivo CSV más reciente
            csv_file = max([os.path.join(self.creados_dir, f) for f in csv_files], 
                         key=os.path.getmtime)
            
            return csv_file
            
        except Exception as e:
            raise Exception(f"Error procesando con flowmeter: {str(e)}")


