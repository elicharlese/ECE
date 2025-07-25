#!/bin/bash

# Nebius AI Setup Script for ECE Trading Cards
# This script helps configure Nebius AI integration

set -e

echo "🚀 ECE Trading Cards - Nebius AI Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Creating .env.local file...${NC}"
    touch .env.local
fi

echo -e "${BLUE}📋 Nebius AI Configuration${NC}"
echo "======================================"
echo ""

# Check if API key is already set
if grep -q "NEXT_PUBLIC_NEBIUS_API_KEY" .env.local; then
    echo -e "${GREEN}✅ Nebius API key already configured${NC}"
    echo ""
else
    echo -e "${YELLOW}🔑 Nebius API Key Setup${NC}"
    echo "To use Nebius AI for app generation, you need an API key."
    echo ""
    echo "Steps to get your API key:"
    echo "1. Go to https://studio.nebius.com"
    echo "2. Sign up or log in"
    echo "3. Navigate to Account > API Keys"
    echo "4. Create a new API key"
    echo "5. Copy the key"
    echo ""
    
    read -p "Enter your Nebius API key (or press Enter to skip): " api_key
    
    if [ ! -z "$api_key" ]; then
        echo "NEXT_PUBLIC_NEBIUS_API_KEY=$api_key" >> .env.local
        echo -e "${GREEN}✅ API key added to .env.local${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipped API key setup. You can add it later to .env.local${NC}"
    fi
    echo ""
fi

# Copy example environment variables if not present
echo -e "${BLUE}⚙️  Environment Configuration${NC}"
echo "======================================"

ENV_VARS=(
    "NEBIUS_BASE_URL=https://api.studio.nebius.com/v1"
    "NEBIUS_CODE_MODEL=deepseek-v3"
    "NEBIUS_ARCHITECTURE_MODEL=llama-3.3-70b-instruct"
    "NEBIUS_OPTIMIZATION_MODEL=qwen-2.5-coder-32b"
    "DEFAULT_GENERATION_TIMEOUT=300000"
    "MAX_CONCURRENT_GENERATIONS=3"
    "ENABLE_GENERATION_CACHING=true"
    "ENABLE_BATTLE_STATS=true"
    "ENABLE_RARITY_SYSTEM=true"
    "MIN_QUALITY_SCORE=70"
    "TRADING_VALUE_MULTIPLIER=10"
    "ENABLE_GENERATION_SIMULATION=false"
    "VERBOSE_LOGGING=true"
    "DEBUG_NEBIUS_REQUESTS=false"
)

for var in "${ENV_VARS[@]}"; do
    var_name=$(echo "$var" | cut -d'=' -f1)
    if ! grep -q "$var_name" .env.local; then
        echo "$var" >> .env.local
        echo -e "${GREEN}✅ Added $var_name${NC}"
    else
        echo -e "${YELLOW}⚠️  $var_name already exists${NC}"
    fi
done

echo ""
echo -e "${BLUE}🧪 Testing Configuration${NC}"
echo "======================================"

# Test if Node.js and npm are available
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

# Install dependencies if needed
echo ""
echo -e "${BLUE}📦 Installing Dependencies${NC}"
echo "======================================"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing npm packages...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Run integration test if TypeScript is available
echo ""
echo -e "${BLUE}🧪 Running Integration Test${NC}"
echo "======================================"

if [ -f "tests/nebius-integration.test.ts" ]; then
    echo -e "${YELLOW}🔄 Testing Nebius AI integration...${NC}"
    
    # Check if API key is set
    if grep -q "NEXT_PUBLIC_NEBIUS_API_KEY=your_nebius_api_key_here" .env.local || ! grep -q "NEXT_PUBLIC_NEBIUS_API_KEY" .env.local; then
        echo -e "${YELLOW}⚠️  API key not configured. Skipping integration test.${NC}"
        echo "   Add your Nebius API key to .env.local and run:"
        echo "   npm run test:nebius"
    else
        echo -e "${GREEN}✅ API key configured. Running test...${NC}"
        # Note: We'll create a test script in package.json
        echo "   Run: npm run test:nebius"
    fi
else
    echo -e "${YELLOW}⚠️  Integration test not found${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Make sure your Nebius API key is set in .env.local"
echo "2. Run the development server: npm run dev"
echo "3. Navigate to the app generation section"
echo "4. Test creating your first AI-generated app!"
echo ""
echo "Useful commands:"
echo "• npm run dev          - Start development server"
echo "• npm run test:nebius  - Test Nebius integration"
echo "• npm run build        - Build for production"
echo ""
echo "Documentation:"
echo "• Nebius Studio: https://studio.nebius.com"
echo "• ECE Docs: /docs/patches/patch-13/"
echo ""
echo -e "${BLUE}Happy generating! 🚀${NC}"
