#!/bin/bash

# ECE Trading Cards - Start All Projects Script
# This script starts all ECE applications concurrently

set -e

echo "🚀 Starting ECE Trading Cards Platform..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Port $port is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to kill processes on specific ports
cleanup_ports() {
    echo -e "${YELLOW}Cleaning up ports...${NC}"
    pkill -f "nx serve" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "electron" 2>/dev/null || true
    pkill -f "react-native" 2>/dev/null || true
    sleep 2
}

# Cleanup function for graceful shutdown
cleanup() {
    echo -e "\n${YELLOW}Shutting down all services...${NC}"
    cleanup_ports
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Clean up any existing processes
cleanup_ports

# Check required ports
echo -e "${BLUE}Checking ports...${NC}"
if ! check_port 3000; then
    echo -e "${RED}Port 3000 (ece-web) is busy. Cleaning up...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

if ! check_port 8081; then
    echo -e "${RED}Port 8081 (ece-mobile) is busy. Cleaning up...${NC}"
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Get the root directory
ROOT_DIR=$(pwd)

# Start ECE Web (Next.js) - Port 3000
echo -e "${GREEN}Starting ECE Web Application...${NC}"
cd "$ROOT_DIR/apps/ece-web" && npm run dev &
WEB_PID=$!

# Wait for web app to start
sleep 3

# Start ECE Mobile (Expo/React Native) - Port 8081
echo -e "${GREEN}Starting ECE Mobile Application...${NC}"
cd "$ROOT_DIR"
# Check if Expo is installed
if ! command -v expo &> /dev/null; then
    echo -e "${YELLOW}Installing Expo CLI...${NC}"
    npm install -g @expo/cli
fi
# Use npx to run nx from the workspace root
npx nx serve ece-mobile &
MOBILE_PID=$!

# Wait for mobile app to start
sleep 3

# Start Desktop App (Electron)
echo -e "${GREEN}Starting ECE Desktop Application...${NC}"
cd "$ROOT_DIR/apps/desktop"
# Install electron if not present
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Desktop dependencies...${NC}"
    npm install
fi
npm run dev &
DESKTOP_PID=$!

# Display running services
echo -e "\n${GREEN}✅ All ECE applications started successfully!${NC}"
echo "=========================================="
echo -e "${BLUE}🌐 ECE Web:${NC}     http://localhost:3000"
echo -e "${BLUE}📱 ECE Mobile:${NC}  http://localhost:8081"
echo -e "${BLUE}🖥️  ECE Desktop:${NC} Electron app running"
echo "=========================================="
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for all background processes
wait $WEB_PID $MOBILE_PID $DESKTOP_PID
