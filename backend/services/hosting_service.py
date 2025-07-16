import os
import subprocess
import platform
import shutil
from pathlib import Path

def get_network_interfaces():
    """
    Detecta interfaces de red disponibles - adaptado para hosting
    """
    interfaces = []
    
    try:
        # En entornos de hosting, usar interfaces estándar
        if os.getenv('ENVIRONMENT') == 'production':
            # Interfaces típicas en servidores Linux
            standard_interfaces = ['eth0', 'ens3', 'ens4', 'enp0s3', 'lo']
            for iface in standard_interfaces:
                if Path(f'/sys/class/net/{iface}').exists():
                    interfaces.append({
                        'name': iface,
                        'description': f'Network interface {iface}',
                        'type': 'ethernet' if iface.startswith(('eth', 'ens', 'enp')) else 'loopback'
                    })
        else:
            # Modo desarrollo local - usar psutil
            try:
                import psutil
                for interface, addrs in psutil.net_if_addrs().items():
                    if any(addr.family == 2 for addr in addrs):  # IPv4
                        interfaces.append({
                            'name': interface,
                            'description': f'Network interface {interface}',
                            'type': 'auto-detected'
                        })
            except ImportError:
                # Fallback si psutil no está disponible
                interfaces = [
                    {'name': 'eth0', 'description': 'Primary ethernet', 'type': 'ethernet'},
                    {'name': 'lo', 'description': 'Loopback', 'type': 'loopback'}
                ]
    except Exception as e:
        print(f"Error detecting interfaces: {e}")
        # Fallback básico
        interfaces = [
            {'name': 'eth0', 'description': 'Default ethernet', 'type': 'ethernet'}
        ]
    
    return interfaces

def check_capture_capabilities():
    """
    Verifica si la captura de red está disponible en el entorno actual
    """
    capabilities = {
        'can_capture': False,
        'has_tshark': False,
        'has_permissions': False,
        'demo_mode': False
    }
    
    try:
        # Verificar si tshark está disponible
        result = subprocess.run(['tshark', '--version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            capabilities['has_tshark'] = True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        capabilities['has_tshark'] = False
    
    # En hosting, activar modo demo automáticamente
    if os.getenv('ENVIRONMENT') == 'production':
        capabilities['demo_mode'] = True
        capabilities['can_capture'] = False
        print("Running in production mode - Network capture disabled, demo mode enabled")
    else:
        # En desarrollo, verificar permisos
        try:
            # Intentar listar interfaces disponibles
            result = subprocess.run(['tshark', '-D'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0 and result.stdout:
                capabilities['has_permissions'] = True
                capabilities['can_capture'] = True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            capabilities['can_capture'] = False
    
    return capabilities

def get_demo_data():
    """
    Genera datos de demostración para cuando la captura real no está disponible
    """
    import random
    import pandas as pd
    from datetime import datetime, timedelta
    
    # Generar datos sintéticos que simulan capturas reales
    demo_data = []
    timestamp = datetime.now()
    
    # Tipos de tráfico para demo
    traffic_types = ['BENIGN', 'DDoS', 'PortScan', 'Bot', 'BruteForce']
    
    for i in range(random.randint(50, 200)):
        demo_data.append({
            'timestamp': timestamp - timedelta(seconds=random.randint(0, 60)),
            'src_ip': f"192.168.1.{random.randint(1, 254)}",
            'dst_ip': f"10.0.0.{random.randint(1, 254)}",
            'src_port': random.randint(1024, 65535),
            'dst_port': random.choice([80, 443, 22, 21, 25, 53, 3389]),
            'protocol': random.choice(['TCP', 'UDP', 'ICMP']),
            'packet_size': random.randint(64, 1500),
            'flow_duration': random.uniform(0.1, 30.0),
            'total_packets': random.randint(1, 100),
            'total_bytes': random.randint(100, 50000),
            'predicted_class': random.choice(traffic_types),
            'confidence': random.uniform(0.7, 0.99)
        })
    
    return pd.DataFrame(demo_data)

class HostingCompatibleCaptureService:
    """
    Servicio de captura adaptado para funcionar en entornos de hosting
    """
    
    def __init__(self):
        self.capabilities = check_capture_capabilities()
        self.demo_mode = self.capabilities['demo_mode']
        
    def start_capture(self, interface='eth0', duration=20, output_file=None):
        """
        Inicia captura de red o modo demo según el entorno
        """
        if self.demo_mode:
            print("Running in demo mode - generating synthetic data")
            return self._demo_capture(duration, output_file)
        else:
            return self._real_capture(interface, duration, output_file)
    
    def _demo_capture(self, duration, output_file):
        """Simula una captura de red para demo"""
        import time
        import tempfile
        
        print(f"Demo: Simulating {duration}s network capture...")
        time.sleep(min(duration, 5))  # Simular tiempo de captura (máx 5s)
        
        # Generar archivo PCAP falso o datos CSV directamente
        if output_file is None:
            output_file = tempfile.mktemp(suffix='.pcap')
        
        # Crear archivo vacío para compatibilidad
        Path(output_file).touch()
        
        return {
            'success': True,
            'file': output_file,
            'demo_mode': True,
            'message': f'Demo capture completed - {duration}s simulated'
        }
    
    def _real_capture(self, interface, duration, output_file):
        """Captura real de red (solo en desarrollo)"""
        if not self.capabilities['can_capture']:
            raise Exception("Real network capture not available in this environment")
        
        if output_file is None:
            output_file = f"capture_{int(time.time())}.pcap"
        
        try:
            cmd = [
                'tshark',
                '-i', interface,
                '-a', f'duration:{duration}',
                '-w', output_file,
                '-q'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=duration + 10)
            
            if result.returncode == 0:
                return {
                    'success': True,
                    'file': output_file,
                    'demo_mode': False,
                    'message': f'Real capture completed - {duration}s on {interface}'
                }
            else:
                raise Exception(f"Capture failed: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            raise Exception("Capture timeout")
        except Exception as e:
            raise Exception(f"Capture error: {str(e)}")
