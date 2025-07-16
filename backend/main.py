import os
import sys

# Importar la aplicación FastAPI principal
from app_postgres import app

# Esta es la entrada principal para Render
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
