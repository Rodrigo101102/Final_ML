import os
from dotenv import load_dotenv
from urllib.parse import urlparse

# Cargar variables de entorno desde .env
load_dotenv()

class DatabaseConfig:
    """Configuración de la base de datos PostgreSQL"""
    
    @classmethod
    def get_database_url(cls):
        """Obtiene URL de base de datos desde variables de entorno"""
        # Priorizar DATABASE_URL si está disponible (más flexible)
        database_url = os.getenv('DATABASE_URL')
        if database_url:
            return database_url
        
        # Para desarrollo local usa variables individuales
        HOST = os.getenv('DB_HOST', 'localhost')
        PORT = int(os.getenv('DB_PORT', 5432))
        NAME = os.getenv('DB_NAME', 'trafic_red')
        USER = os.getenv('DB_USER', 'postgres')
        PASSWORD = os.getenv('DB_PASSWORD', '')
        
        return f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}"
    
    @classmethod
    def get_connection_string(cls):
        """Obtiene la cadena de conexión para SQLAlchemy async"""
        url = cls.get_database_url()
        # Convertir a async si es necesario
        if url.startswith('postgresql://'):
            url = url.replace('postgresql://', 'postgresql+asyncpg://', 1)
        return url
    
    @classmethod
    def get_sync_connection_string(cls):
        """Obtiene la cadena de conexión para SQLAlchemy sync"""
        url = cls.get_database_url()
        # Asegurar que sea sync
        if url.startswith('postgresql+asyncpg://'):
            url = url.replace('postgresql+asyncpg://', 'postgresql://', 1)
        return url
    
    # Pool configuration
    POOL_SIZE = int(os.getenv('DB_POOL_SIZE', 5))
    MAX_OVERFLOW = int(os.getenv('DB_MAX_OVERFLOW', 10))

class ServerConfig:
    """Configuración del servidor"""
    HOST = os.getenv('SERVER_HOST', '0.0.0.0')
    PORT = int(os.getenv('SERVER_PORT', 8010))
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

class CaptureConfig:
    """Configuración de captura de tráfico"""
    TIMEOUT = int(os.getenv('CAPTURE_TIMEOUT', 300))
    DEFAULT_INTERFACE = os.getenv('DEFAULT_INTERFACE', 'auto')
    MIN_DURATION = int(os.getenv('MIN_CAPTURE_DURATION', 5))
    MAX_DURATION = int(os.getenv('MAX_CAPTURE_DURATION', 60))
    
    @classmethod
    def get_sync_connection_string(cls):
        return f"postgresql+psycopg2://{cls.USER}:{cls.PASSWORD}@{cls.HOST}:{cls.PORT}/{cls.NAME}"
    
    @classmethod
    def get_async_connection_string(cls):
        return f"postgresql+asyncpg://{cls.USER}:{cls.PASSWORD}@{cls.HOST}:{cls.PORT}/{cls.NAME}"

class Config:
    # Environment
    ENV = os.getenv('ENVIRONMENT', 'development')
    DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')
    
    # Database
    DB = DatabaseConfig
