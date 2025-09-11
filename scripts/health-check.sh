#!/bin/bash

echo "ECE Health Check & Monitoring Script"
echo "Usage: $0 [web|mobile|database|all]"

TARGET="${1:-all}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check web application
check_web() {
  echo "🌐 Checking Web Application..."
  if curl -f --max-time 10 http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Web app is healthy${NC}"
    return 0
  else
    echo -e "${RED}❌ Web app is not responding${NC}"
    return 1
  fi
}

# Function to check mobile application
check_mobile() {
  echo "📱 Checking Mobile Application..."
  if curl -f --max-time 10 http://localhost:19006 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Mobile app dev server is healthy${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️  Mobile app dev server not responding (might be normal if not started)${NC}"
    return 0
  fi
}

# Function to check database
check_database() {
  echo "🗄️  Checking Database..."
  if [ -f "prisma/dev.db" ]; then
    echo -e "${GREEN}✅ Database file exists${NC}"

    # Check database size
    DB_SIZE=$(stat -f%z "prisma/dev.db" 2>/dev/null || stat -c%s "prisma/dev.db" 2>/dev/null || echo "0")
    echo "   Database size: $(($DB_SIZE / 1024)) KB"

    return 0
  else
    echo -e "${RED}❌ Database file missing${NC}"
    return 1
  fi
}

# Function to check system resources
check_system() {
  echo "💻 Checking System Resources..."
  echo "   CPU Usage: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')"
  echo "   Memory Usage: $(free | grep Mem | awk '{printf "%.0f%%", $3/$2 * 100.0}')"
  echo "   Disk Usage: $(df / | tail -1 | awk '{print $5}')"
}

# Function to check API endpoints
check_api() {
  echo "🔗 Checking API Endpoints..."
  # Add specific API checks here
  echo -e "${YELLOW}⚠️  API endpoint checks not yet implemented${NC}"
}

# Main health check logic
case "$TARGET" in
  web)
    check_web
    ;;
  mobile)
    check_mobile
    ;;
  database)
    check_database
    ;;
  system)
    check_system
    ;;
  api)
    check_api
    ;;
  all)
    check_web
    check_mobile
    check_database
    check_system
    ;;
  *)
    echo "Invalid target. Use: web, mobile, database, system, api, or all"
    exit 1
    ;;
esac

echo ""
echo "🏥 Health check completed!"
echo ""
echo "💡 Quick actions:"
echo "  - Start apps: ./scripts/start-all.sh"
echo "  - Run tests: ./scripts/run-all-tests.sh"
echo "  - Clean up: ./scripts/cleanup.sh"
