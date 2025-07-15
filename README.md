<<<<<<< HEAD
# Network Traffic Analysis System

This project is a full-stack web application for real-time network traffic analysis and attack detection.

## Features

- Real-time network traffic capture using Wireshark/tshark
- Traffic analysis and attack detection using machine learning
- User authentication and authorization
- Interactive dashboard with real-time updates
- Historical data visualization
- Integration with Power BI for advanced analytics

## Architecture

### Backend (FastAPI)
- REST API endpoints for traffic capture and analysis
- PostgreSQL database for storing traffic data
- Machine learning model integration
- Authentication and authorization

### Frontend (React)
- Real-time traffic monitoring dashboard
- User authentication interface
- Traffic analysis visualization
- Alerts for detected attacks

## Prerequisites

- Python 3.9+
- Node.js 14+
- PostgreSQL 13+
- Wireshark/tshark
- Java Runtime Environment (for CICFlowMeter)
- Docker and Docker Compose (optional)

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Set required environment variables (see `.env.example`)

5. Initialize the database:
   ```bash
   cd backend
   python init_db.py
   ```

## Running the Application

### Using Docker
```bash
docker-compose up
```

### Manual Setup
1. Start the backend:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

## Authentication

- Use the `/token` endpoint to obtain a JWT token
- Include the token in the Authorization header for protected endpoints
- Admin users have access to additional features

## API Endpoints

- POST `/capture/start`: Start network capture
- POST `/capture/process`: Process captured traffic
- GET `/traffic/latest`: Get latest traffic records
- GET `/traffic/stats`: Get traffic statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
=======
# Final_ML
>>>>>>> cbfa93ddd217c3f421498ffc06afacc118147d4f
