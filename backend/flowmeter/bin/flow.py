import subprocess
import os

def capture_traffic_with_tshark(pcap_file, duration=3, interface="Wi-Fi"):
    """
    Captura tráfico de red usando tshark (Wireshark en línea de comandos) y guarda en un archivo .pcap.
    
    :param pcap_file: Ruta donde se guardará el archivo PCAP.
    :param duration: Duración de la captura en segundos (por defecto, 3 segundos).
    :param interface: Interfaz de red (por defecto, Wi-Fi).
    """
    # Verificar que la interfaz esté disponible con tshark -D
    try:
        result = subprocess.run(["tshark", "-D"], capture_output=True, text=True)
        interfaces = result.stdout.splitlines()

        # Si no se encuentra la interfaz, mostrar un error
        if not any(interface in i for i in interfaces):
            print(f"Error: La interfaz '{interface}' no se encuentra disponible.")
            print("Interfaces disponibles:")
            for i in interfaces:
                print(i)
            return
        
    except Exception as e:
        print(f"Error al verificar las interfaces: {e}")
        return

    # Comando tshark para capturar tráfico durante `duration` segundos
    command = [
        "tshark",         # Comando para ejecutar tshark
        "-i", interface,  # Interfaz de red (Wi-Fi o Ethernet)
        "-a", f"duration:{duration}",  # Duración de la captura
        "-w", pcap_file   # Archivo de salida .pcap
    ]
    
    try:
        print(f"Iniciando captura de tráfico durante {duration} segundos en la interfaz {interface}...")
        subprocess.run(command, check=True)  # Ejecuta el comando
        print(f"Tráfico capturado y guardado en {pcap_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar tshark: {e}")

def process_with_flowmeter(pcap_file):
    """
    Procesa el archivo .pcap con CICFlowMeter (o similar) y genera un archivo .csv con los flujos.
    Luego elimina el archivo .pcap para evitar desperdicio de espacio.
    
    :param pcap_file: Ruta del archivo .pcap a procesar.
    """
    out = pcap_file.replace(".pcap", "_Flow.csv")  # Genera el nombre del archivo .csv
    command = [pcap_file, out]  # El comando para CICFlowMeter (o herramienta similar)

    # Ruta absoluta a 'cfm'
    cfm_path = r"C:\Users\carol\Downloads\Machine_trafic\ML-NIDS\NIDS\src\flowmeter\bin\cfm"
    
    try:
        print(f"Iniciando el procesamiento de {pcap_file} para generar {out}...")
        subprocess.run([cfm_path] + command, check=True, shell=True)
        print(f"Flujos generados y guardados en {out}")
        
        # Eliminar el archivo .pcap después del procesamiento
        os.remove(pcap_file)
        print(f"Archivo {pcap_file} eliminado para liberar espacio.")
    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar CICFlowMeter: {e}")
        os.remove(pcap_file)  # Asegúrate de eliminar el archivo .pcap si hay un error

def main():
    # Paso 1: Capturar tráfico de red y guardar el archivo .pcap
    pcap_file = "captura.pcap"
    capture_traffic_with_tshark(pcap_file, duration=5, interface="Wi-Fi")
    
    # Paso 2: Procesar el archivo .pcap con CICFlowMeter (o herramienta similar) y generar el .csv
    process_with_flowmeter(pcap_file)

# Ejecutar el flujo completo
main()
