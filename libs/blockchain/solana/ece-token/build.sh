#!/bin/bash

# ECE Token Solana Smart Contract Build Script
# Builds, tests, and optionally deploys the ECE token program to Solana

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROGRAM_NAME="ece_token"
KEYPAIR_PATH="./target/deploy/${PROGRAM_NAME}-keypair.json"
PROGRAM_SO_PATH="./target/deploy/${PROGRAM_NAME}.so"

echo -e "${BLUE}🚀 ECE Token Smart Contract Build Pipeline${NC}"
echo "================================================"

# Check if we're in the correct directory
if [ ! -f "Cargo.toml" ]; then
    echo -e "${RED}❌ Error: Cargo.toml not found. Please run from solana-contracts/ece-token directory${NC}"
    exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Error: Solana CLI not found. Please install Solana CLI first.${NC}"
    echo "Install with: sh -c \"\$(curl -sSfL https://release.solana.com/v1.17.0/install)\""
    exit 1
fi

# Check if Anchor is installed (optional but recommended)
if ! command -v anchor &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: Anchor CLI not found. Consider installing for enhanced development experience.${NC}"
fi

echo -e "${BLUE}📋 Build Configuration:${NC}"
echo "Program Name: $PROGRAM_NAME"
echo "Keypair Path: $KEYPAIR_PATH"
echo "Program SO Path: $PROGRAM_SO_PATH"
echo "Solana Version: $(solana --version)"
echo ""

# Step 1: Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
cargo clean
rm -rf target/

# Step 2: Build the program
echo -e "${YELLOW}🔨 Building Solana program...${NC}"
cargo build-bpf --manifest-path=Cargo.toml --bpf-out-dir=target/deploy

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Step 3: Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
cargo test

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Tests failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All tests passed!${NC}"

# Step 4: Verify the program binary
if [ ! -f "$PROGRAM_SO_PATH" ]; then
    echo -e "${RED}❌ Program binary not found at $PROGRAM_SO_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Program binary verified: $PROGRAM_SO_PATH${NC}"

# Step 5: Generate or verify keypair
if [ ! -f "$KEYPAIR_PATH" ]; then
    echo -e "${YELLOW}🔑 Generating new program keypair...${NC}"
    solana-keygen new --no-bip39-passphrase --silent --outfile "$KEYPAIR_PATH"
else
    echo -e "${GREEN}✅ Using existing keypair: $KEYPAIR_PATH${NC}"
fi

# Step 6: Show program ID
PROGRAM_ID=$(solana-keygen pubkey "$KEYPAIR_PATH")
echo -e "${BLUE}📋 Program ID: ${PROGRAM_ID}${NC}"

# Step 7: Deployment options
echo ""
echo -e "${BLUE}🚀 Deployment Options:${NC}"
echo "1. Deploy to Devnet:   ./deploy.sh devnet"
echo "2. Deploy to Testnet:  ./deploy.sh testnet"  
echo "3. Deploy to Mainnet:  ./deploy.sh mainnet-beta"
echo ""

# Step 8: Generate deployment info
cat > deployment-info.json <<EOL
{
  "programName": "$PROGRAM_NAME",
  "programId": "$PROGRAM_ID",
  "keypairPath": "$KEYPAIR_PATH",
  "programPath": "$PROGRAM_SO_PATH",
  "buildTimestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "solanaVersion": "$(solana --version | head -1)",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'N/A')"
}
EOL

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${BLUE}📄 Deployment info saved to: deployment-info.json${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the deployment info above"
echo "2. Set your Solana cluster: solana config set --url <cluster-url>"
echo "3. Ensure your wallet has sufficient SOL for deployment"
echo "4. Run deployment script: ./deploy.sh <cluster>"
echo ""
