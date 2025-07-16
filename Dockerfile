# Use Python 3.11 slim image
FROM python:3.11-slim

# Install system dependencies for network capture and Java
RUN apt-get update && apt-get install -y \
    tshark \
    wireshark-common \
    default-jre \
    procps \
    net-tools \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . /app/

# Set up permissions for network capture
RUN chmod +x /usr/bin/dumpcap || true

# Create logs directory
RUN mkdir -p /app/backend/logs

# Set environment variables
ENV PYTHONPATH=/app/backend
ENV JAVA_HOME=/usr/lib/jvm/default-java

# Expose port
EXPOSE 8010

# Change to backend directory and start the application
WORKDIR /app/backend
CMD ["python", "app_postgres.py"]
