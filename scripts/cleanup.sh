#!/bin/bash

echo "ECE Cleanup Script"
echo "Usage: $0 [light|full|cache|logs]"

CLEANUP_TYPE="${1:-light}"

# Function to clean node_modules
clean_node_modules() {
  echo "🧹 Removing node_modules directories..."
  find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
  echo "✅ node_modules cleaned"
}

# Function to clean build artifacts
clean_build_artifacts() {
  echo "🧹 Removing build artifacts..."
  find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
  find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
  find . -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
  find . -name "out" -type d -exec rm -rf {} + 2>/dev/null || true
  echo "✅ Build artifacts cleaned"
}

# Function to clean cache
clean_cache() {
  echo "🧹 Clearing caches..."
  # npm/yarn cache
  npm cache clean --force 2>/dev/null || true
  yarn cache clean 2>/dev/null || true

  # Next.js cache
  find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true

  # Expo cache
  find . -name ".expo" -type d -exec rm -rf {} + 2>/dev/null || true

  # Nx cache
  npx nx reset 2>/dev/null || true

  echo "✅ Caches cleared"
}

# Function to clean logs
clean_logs() {
  echo "🧹 Removing log files..."
  find . -name "*.log" -delete 2>/dev/null || true
  find . -name "npm-debug.log*" -delete 2>/dev/null || true
  find . -name "yarn-error.log*" -delete 2>/dev/null || true
  echo "✅ Logs cleaned"
}

# Function to clean temporary files
clean_temp() {
  echo "🧹 Removing temporary files..."
  find . -name "*.tmp" -delete 2>/dev/null || true
  find . -name "*.temp" -delete 2>/dev/null || true
  find . -name ".DS_Store" -delete 2>/dev/null || true
  find . -name "Thumbs.db" -delete 2>/dev/null || true
  echo "✅ Temporary files cleaned"
}

# Main cleanup logic
case "$CLEANUP_TYPE" in
  light)
    echo "Performing light cleanup..."
    clean_logs
    clean_temp
    ;;
  full)
    echo "Performing full cleanup..."
    clean_logs
    clean_temp
    clean_build_artifacts
    clean_cache
    ;;
  cache)
    echo "Cleaning caches only..."
    clean_cache
    ;;
  logs)
    echo "Cleaning logs only..."
    clean_logs
    ;;
  node_modules)
    echo "Cleaning node_modules only..."
    clean_node_modules
    ;;
  *)
    echo "Invalid cleanup type. Available options:"
    echo "  light     - Clean logs and temp files (default)"
    echo "  full      - Clean everything (logs, temp, builds, cache)"
    echo "  cache     - Clean caches only"
    echo "  logs      - Clean logs only"
    echo "  node_modules - Clean node_modules only"
    exit 1
    ;;
esac

echo ""
echo "✅ Cleanup completed successfully!"
echo ""
echo "💡 Tips:"
echo "  - Run 'npm install' to restore dependencies"
echo "  - Run './scripts/start-all.sh' to restart applications"
echo "  - Use 'npm run build' to rebuild applications"
