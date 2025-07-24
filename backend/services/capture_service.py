import os
import subprocess
import tempfile
import time

class CaptureService:
    def __init__(self, interface=None):
        # Permitir configurar la ruta de tshark por variable de entorno
        self.tshark_path = os.environ.get('TSHARK_PATH', 'tshark')

        # Rutas base
        self.flowmeter_path = os.path.join(os.path.dirname(__file__), "flowmeter.js")
        self.creados_dir = os.path.join(os.path.dirname(__file__), "..", "creados")
        
        # Crear directorio creados si no existe
        if not os.path.exists(self.creados_dir):
            os.makedirs(self.creados_dir)
        
        # Permitir configurar la interfaz por variable de entorno o parámetro
        self.interface = interface or os.environ.get('TSHARK_INTERFACE') or self._get_default_interface()
        print(f"Interfaz de red para captura: {self.interface}")
        print(f"Ruta de flowmeter: {self.flowmeter_path}")
        print(f"Directorio creados: {self.creados_dir}")

    def _get_default_interface(self):
        """Detecta la primera interfaz disponible usando tshark -D"""
        try:
            result = subprocess.run([self.tshark_path, "-D"], capture_output=True, text=True, check=True)
            lines = result.stdout.strip().split('\n')
            if not lines:
                raise Exception("No se detectaron interfaces de red con tshark.")
            # Extrae el nombre después del número y punto
            first_line = lines[0]
            if '.' in first_line:
                return first_line.split('.', 1)[1].strip()
            return first_line.strip()
        except Exception as e:
            raise Exception(f"No se pudo detectar la interfaz de red automáticamente: {e}\n¿Está tshark instalado y en el PATH?")

    def capture_traffic(self, duration: int = 20) -> str:
        """Capturar tráfico de red y guardar en archivo PCAP"""
        try:
            # Crear archivo temporal para el PCAP
            with tempfile.NamedTemporaryFile(suffix='.pcap', dir=self.creados_dir, delete=False) as temp_pcap:
                pcap_file = temp_pcap.name
                
            print(f"Iniciando captura por {duration} segundos en interfaz '{self.interface}'...")
            
            # Iniciar captura con tshark
            process = subprocess.Popen(
                [
                    self.tshark_path,
                    "-i", self.interface,
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
                error_msg = stderr.decode() if stderr else 'Error desconocido ejecutando tshark.'
                print(f"Error en tshark: {error_msg}")
                raise Exception(f"tshark falló: {error_msg}\n¿Está tshark instalado y la interfaz '{self.interface}' existe?")

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


