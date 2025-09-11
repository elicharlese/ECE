#!/bin/bash

echo "ECE Deployment Script"
echo "Usage: $0 [web|mobile|desktop|all]"

TARGET="${1:-all}"

# Function to deploy web app
deploy_web() {
  echo "🚀 Deploying ECE Web App..."
  cd apps/ece-web

  # Build the application
  echo "Building web app..."
  npm run build

  # Deploy to Vercel (or your preferred platform)
  if command -v vercel &> /dev/null; then
    echo "Deploying to Vercel..."
    npx vercel --prod
  else
    echo "Vercel CLI not found. Please install or configure deployment manually."
  fi

  cd ../..
}

# Function to deploy mobile app
deploy_mobile() {
  echo "📱 Deploying ECE Mobile App..."
  cd apps/ece-mobile

  # Build for both platforms
  echo "Building for iOS..."
  npx expo build --platform ios

  echo "Building for Android..."
  npx expo build --platform android

  # Submit to stores (manual step)
  echo "📋 Manual steps required:"
  echo "  - Submit iOS build to App Store Connect"
  echo "  - Submit Android build to Google Play Console"

  cd ../..
}

# Function to deploy desktop app
deploy_desktop() {
  echo "💻 Deploying ECE Desktop App..."
  cd apps/desktop

  # Build the application
  echo "Building desktop app..."
  npm run build

  # Package for distribution
  if command -v electron-builder &> /dev/null; then
    echo "Packaging with electron-builder..."
    npx electron-builder --publish=never
  else
    echo "electron-builder not found. Please install or configure packaging manually."
  fi

  cd ../..
}

# Main deployment logic
case "$TARGET" in
  web)
    deploy_web
    ;;
  mobile)
    deploy_mobile
    ;;
  desktop)
    deploy_desktop
    ;;
  all)
    deploy_web
    deploy_mobile
    deploy_desktop
    ;;
  *)
    echo "Invalid target. Use: web, mobile, desktop, or all"
    exit 1
    ;;
esac

echo "✅ Deployment process completed!"
echo ""
echo "📝 Next steps:"
echo "  - Verify deployments in respective platforms"
echo "  - Test deployed applications"
echo "  - Update version numbers if needed"
echo "  - Notify stakeholders of new release"
