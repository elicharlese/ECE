#!/bin/bash

echo "ECE Logging Utility Script"
echo "Usage: $0 [info|success|warning|error] [message]"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p scripts/logs

# Function to log messages
log_info() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}" | tee -a scripts/logs/ece.log
}

log_success() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}" | tee -a scripts/logs/ece.log
}

log_warning() {
  echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a scripts/logs/ece.log
}

log_error() {
  echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a scripts/logs/ece.log
}

# Function to show log file
show_logs() {
  echo "Recent logs:"
  tail -20 scripts/logs/ece.log
}

# Function to clean logs
clean_logs() {
  echo "Cleaning old logs..."
  find scripts/logs -name "*.log" -mtime +7 -delete
  echo "Old logs cleaned"
}

# Main logic
case "$1" in
  info)
    shift
    log_info "$*"
    ;;
  success)
    shift
    log_success "$*"
    ;;
  warning)
    shift
    log_warning "$*"
    ;;
  error)
    shift
    log_error "$*"
    ;;
  show)
    show_logs
    ;;
  clean)
    clean_logs
    ;;
  *)
    echo "ECE Logging Utility"
    echo "Usage: $0 [command] [message]"
    echo ""
    echo "Commands:"
    echo "  info [message]    - Log info message"
    echo "  success [message] - Log success message"
    echo "  warning [message] - Log warning message"
    echo "  error [message]   - Log error message"
    echo "  show              - Show recent logs"
    echo "  clean             - Clean old logs (>7 days)"
    echo ""
    echo "Logs are saved to scripts/logs/ece.log"
    exit 1
    ;;
esac
