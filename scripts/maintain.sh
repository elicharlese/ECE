#!/bin/bash

# ECE Trading Cards - Master Maintenance Script
# Orchestrates maintenance tasks across all platforms

set -e

echo "🔧 ECE Trading Cards - Master Maintenance"
echo "========================================"

TASK="$1"

show_usage() {
    echo "Usage: $0 [task]"
    echo ""
    echo "Tasks:"
    echo "  test     - Run comprehensive testing suite"
    echo "  monitor  - Set up monitoring systems"
    echo "  optimize - Optimize codebase for production"
    echo "  fix      - Fix configuration issues"
    echo "  sync     - Test cross-platform sync"
    echo "  health   - Check system health"
    echo ""
    echo "Examples:"
    echo "  $0 test"
    echo "  $0 monitor"
    echo "  $0 health"
}

if [ -z "$TASK" ]; then
    show_usage
    exit 1
fi

case $TASK in
    "test")
        echo "🧪 Running comprehensive testing suite..."
        bash scripts/maintenance/maintenance-testing-suite.sh
        ;;
    "monitor")
        echo "📊 Setting up monitoring systems..."
        bash scripts/maintenance/setup-monitoring.sh
        ;;
    "optimize")
        echo "⚡ Optimizing codebase..."
        bash scripts/maintenance/optimize-for-deployment.sh
        ;;
    "fix")
        echo "🔧 Fixing configuration issues..."
        bash scripts/development/fix-config-files.sh
        ;;
    "sync")
        echo "🔄 Testing cross-platform sync..."
        bash scripts/development/test-sync.sh
        ;;
    "health")
        echo "💚 Checking system health..."
        bash scripts/deployment/validate-production-builds.sh
        ;;
    *)
        echo "❌ Unknown task: $TASK"
        show_usage
        exit 1
        ;;
esac

echo "✅ Maintena