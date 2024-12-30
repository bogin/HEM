# Sensor Data Dashboard

A React application that displays real-time sensor data through WebSocket connections. Built as part of a programming assignment.

## Features Beyond Requirements

While the assignment required showing sensor data for a single person, I extended it to support:
- Multiple person selection (up to 4 persons)
- Easy switching between person dashboards
- Live WebSocket connection management per person
- Clean disconnection when unselecting a person

## Cool Stuff I Added

1. Performance Optimizations:
   - Throttled WebSocket messages to 10Hz to prevent UI freezing
   - Simple memory cache for sensor data (5-second window)
   - Limited stored messages to last 100 samples per person

2. Smart WebSocket Management:
   - Automatic reconnection with exponential backoff
   - Proper cleanup when switching persons
   - Connection status indicators

3. User Experience:
   - Dynamic Y-axis scaling based on data range
   - 10-second rolling window statistics
   - Easy person selection/deselection

## What I'd Add With More Time

1. User Interface:
   - Ability to zoom in/out on charts
   - Pause real-time updates
   - Alert system for value thresholds
   - Data export functionality

2. Backend Features:
   - CRUD operations for persons and sensors
   - Security and rate limiting
   - User authentication
   - Dynamic configuration management (max persons, sample rates, etc.)
   - Redis for better caching
   - Reversed dashboard (view by sensor type across all users)

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Git
- SQLite

### Windows Setup
```bash
# Clone the repo
git clone https://github.com/bogin/HEM.git
cd HEM

# Start backend server
cd server
npm install
npm run start
or
npm run dev

# In a new terminal, start frontend
cd client
npm install
npm run start:windows
```

### Mac Setup
```bash
# Clone the repo
git clone https://github.com/bogin/HEM.git
cd HEM

# Start backend server
cd server
npm install
npm run start

# In a new terminal, start frontend
cd client
npm install
npm run start
```

### Access the App
Open http://localhost:3001 in your browser

### Notes
- Backend runs on port 3000
- Frontend runs on port 3001
- Make sure both ports are available
- If you see CORS errors, check that both servers are running