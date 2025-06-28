#!/bin/bash

# ECE Trading Cards - Master Deployment Script
# Orchestrates deployment across all platforms

set -e

echo "🚀 ECE Trading Cards - Master Deployment"
echo "========================================"

PLATFORM="$1"

show_usage() {
    echo "Usage: $0 [platform]"
    echo ""
    echo "Platforms:"
    echo "  web      - Deploy web application to Vercel"
    echo "  desktop  - Package desktop application"
    echo "  mobile   - Deploy mobile apps to app stores"
    echo "  all      - Deploy all platforms"
    echo "  validate - Run full deployment validation"
    echo ""
    echo "Examples:"
    echo "  $0 web"
    echo "  $0 all"
    echo "  $0 validate"
}

if [ -z "$PLATFORM" ]; then
    show_usage
    exit 1
fi

case $PLATFORM in
    "web")
        echo "🌐 Deploying web application..."
        npm run deploy:web
        ;;
    "desktop")
        echo "🖥️ Packaging desktop application..."
        npm run build:desktop
        ;;
    "mobile")
        echo "📱 Deploying mobile applications..."
        bash scripts/mobile/deploy-mobile.sh
        ;;
    "all")
        echo "🚀 Deploying all platforms..."
        bash scripts/deployment/final-deployment-validation.sh
        npm run deploy:web
        npm run build:desktop
        bash scripts/mobile/deploy-mobile.sh
        ;;
    "validate")
        echo "✅ Running deployment validation..."
        bash scripts/deployment/final-deployment-validation.sh
        ;;
    *)
        echo "❌ Unknown platform: $PLATFORM"
        show_usage
        exit 1
        ;;
esac

echo "✅ Deployment complete for: $PLATFORM"
