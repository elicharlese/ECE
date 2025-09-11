#!/bin/bash

echo "Starting all ECE platform applications..."

# Function to handle cleanup on exit
cleanup() {
  echo "Shutting down applications..."
  kill 0
  exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start web application
echo "Starting ECE Web App..."
cd apps/ece-web && npm run dev &
WEB_PID=$!
echo "Web app started with PID: $WEB_PID"

# Wait a moment for web app to initialize
sleep 3

# Start mobile application (if available)
if [ -d "apps/ece-mobile" ]; then
  echo "Starting ECE Mobile App..."
  cd apps/ece-mobile && npm start &
  MOBILE_PID=$!
  echo "Mobile app started with PID: $MOBILE_PID"
else
  echo "Mobile app directory not found, skipping..."
fi

# Wait a moment for mobile app to initialize
sleep 3

# Start desktop application (if available)
if [ -d "apps/desktop" ]; then
  echo "Starting ECE Desktop App..."
  cd apps/desktop && npm run dev &
  DESKTOP_PID=$!
  echo "Desktop app started with PID: $DESKTOP_PID"
else
  echo "Desktop app directory not found, skipping..."
fi

echo ""
echo "✅ All ECE applications are starting up!"
echo ""
echo "Web App: http://localhost:3000"
echo "Mobile App: Check Expo CLI output"
echo "Desktop App: Check Electron window"
echo ""
echo "Press Ctrl+C to stop all applications"

# Wait for all background processes
wait
