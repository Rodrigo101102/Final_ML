# Multi-stage build para optimizar tamaño
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend-react/package.json ./
RUN npm install --legacy-peer-deps
COPY frontend-react/ ./
RUN npm run build

# Backend con Python
FROM python:3.11-slim

# Install system dependencies for network capture and Java
RUN apt-get update && apt-get install -y \
    tshark \
    wireshark-common \
    default-jre \
    procps \
    net-tools \
    curl \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy the entire backend
COPY backend/ /app/backend/

# Copy frontend construido
COPY --from=frontend-builder /app/frontend/build /app/frontend/

# Set up permissions for network capture
RUN chmod +x /usr/bin/dumpcap || true

# Create necessary directories
RUN mkdir -p /app/backend/logs /app/processed /app/backend/ml_models

# Set environment variables
ENV PYTHONPATH=/app/backend
ENV JAVA_HOME=/usr/lib/jvm/default-java

# Expose ports
EXPOSE 8000 3000

# Copy startup script
COPY docker-start.sh /app/
RUN chmod +x /app/docker-start.sh

# Change to app directory and start
WORKDIR /app
CMD ["./docker-start.sh"]
