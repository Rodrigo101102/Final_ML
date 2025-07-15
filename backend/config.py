import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

class DatabaseConfig:
    HOST = os.getenv('DB_HOST', 'localhost')
    PORT = int(os.getenv('DB_PORT', 5432))
    NAME = os.getenv('DB_NAME', 'traffic_db')
    USER = os.getenv('DB_USER', 'postgres')
    PASSWORD = os.getenv('DB_PASSWORD', '')
    
    # Pool configuration
    POOL_SIZE = int(os.getenv('DB_POOL_SIZE', 5))
    MAX_OVERFLOW = int(os.getenv('DB_MAX_OVERFLOW', 10))
    
    @classmethod
    def get_connection_string(cls):
        return f"postgresql://{cls.USER}:{cls.PASSWORD}@{cls.HOST}:{cls.PORT}/{cls.NAME}"
    
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
