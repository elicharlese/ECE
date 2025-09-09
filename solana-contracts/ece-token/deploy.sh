#!/bin/bash

# ECE Token Solana Smart Contract Deployment Script
# Deploys the ECE token program to specified Solana cluster

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

# Default cluster
CLUSTER=${1:-devnet}

echo -e "${BLUE}🚀 ECE Token Smart Contract Deployment${NC}"
echo "========================================"
echo "Target Cluster: $CLUSTER"
echo ""

# Validate cluster input
case $CLUSTER in
    devnet|testnet|mainnet-beta)
        ;;
    *)
        echo -e "${RED}❌ Invalid cluster: $CLUSTER${NC}"
        echo "Valid clusters: devnet, testnet, mainnet-beta"
        exit 1
        ;;
esac

# Check if build artifacts exist
if [ ! -f "$PROGRAM_SO_PATH" ]; then
    echo -e "${RED}❌ Program binary not found: $PROGRAM_SO_PATH${NC}"
    echo "Please run ./build.sh first"
    exit 1
fi

if [ ! -f "$KEYPAIR_PATH" ]; then
    echo -e "${RED}❌ Program keypair not found: $KEYPAIR_PATH${NC}"
    echo "Please run ./build.sh first"
    exit 1
fi

# Get program ID
PROGRAM_ID=$(solana-keygen pubkey "$KEYPAIR_PATH")
echo -e "${BLUE}📋 Program ID: ${PROGRAM_ID}${NC}"

# Set Solana cluster
echo -e "${YELLOW}🌐 Setting Solana cluster to $CLUSTER...${NC}"
solana config set --url https://api.$CLUSTER.solana.com

# Check wallet balance
echo -e "${YELLOW}💰 Checking wallet balance...${NC}"
BALANCE=$(solana balance --lamports)
MIN_BALANCE=5000000 # 0.005 SOL in lamports

if [ "$BALANCE" -lt "$MIN_BALANCE" ]; then
    echo -e "${RED}❌ Insufficient balance: $BALANCE lamports${NC}"
    echo "Minimum required: $MIN_BALANCE lamports (0.005 SOL)"
    
    if [ "$CLUSTER" = "devnet" ]; then
        echo -e "${YELLOW}💡 Getting devnet SOL...${NC}"
        solana airdrop 2
        sleep 5
        BALANCE=$(solana balance --lamports)
        echo -e "${GREEN}✅ New balance: $BALANCE lamports${NC}"
    else
        echo "Please fund your wallet with SOL for $CLUSTER"
        exit 1
    fi
fi

# Check if program is already deployed
echo -e "${YELLOW}🔍 Checking if program is already deployed...${NC}"
if solana account "$PROGRAM_ID" &>/dev/null; then
    echo -e "${YELLOW}⚠️  Program already exists on $CLUSTER${NC}"
    echo "Program ID: $PROGRAM_ID"
    
    read -p "Do you want to upgrade the existing program? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🔄 Upgrading program...${NC}"
        solana program deploy "$PROGRAM_SO_PATH" --program-id "$PROGRAM_ID"
    else
        echo -e "${BLUE}ℹ️  Deployment cancelled${NC}"
        exit 0
    fi
else
    # Deploy new program
    echo -e "${YELLOW}🚀 Deploying new program...${NC}"
    solana program deploy "$PROGRAM_SO_PATH" --keypair "$KEYPAIR_PATH"
fi

# Verify deployment
echo -e "${YELLOW}✅ Verifying deployment...${NC}"
if solana account "$PROGRAM_ID" &>/dev/null; then
    echo -e "${GREEN}✅ Program successfully deployed!${NC}"
    
    # Get program info
    PROGRAM_INFO=$(solana account "$PROGRAM_ID" --output json-compact)
    EXECUTABLE=$(echo "$PROGRAM_INFO" | jq -r '.account.executable')
    OWNER=$(echo "$PROGRAM_INFO" | jq -r '.account.owner')
    
    echo ""
    echo -e "${BLUE}📋 Deployment Summary:${NC}"
    echo "Cluster: $CLUSTER"
    echo "Program ID: $PROGRAM_ID"
    echo "Executable: $EXECUTABLE"
    echo "Owner: $OWNER"
    echo "RPC URL: https://api.$CLUSTER.solana.com"
    
    # Update deployment info
    cat > deployment-info.json <<EOL
{
  "programName": "$PROGRAM_NAME",
  "programId": "$PROGRAM_ID",
  "cluster": "$CLUSTER",
  "rpcUrl": "https://api.$CLUSTER.solana.com",
  "keypairPath": "$KEYPAIR_PATH",
  "programPath": "$PROGRAM_SO_PATH",
  "deploymentTimestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "executable": $EXECUTABLE,
  "owner": "$OWNER",
  "status": "deployed"
}
EOL
    
    echo -e "${GREEN}✅ Deployment info updated: deployment-info.json${NC}"
    
    # Show explorer links
    case $CLUSTER in
        devnet)
            EXPLORER_URL="https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
            ;;
        testnet)
            EXPLORER_URL="https://explorer.solana.com/address/$PROGRAM_ID?cluster=testnet"
            ;;
        mainnet-beta)
            EXPLORER_URL="https://explorer.solana.com/address/$PROGRAM_ID"
            ;;
    esac
    
    echo ""
    echo -e "${BLUE}🔗 Explorer Link:${NC}"
    echo "$EXPLORER_URL"
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    
else
    echo -e "${RED}❌ Deployment verification failed${NC}"
    exit 1
fi

# Optional: Initialize program state (if needed)
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "1. Update your frontend with the new program ID"
echo "2. Initialize treasury state (if not done yet)"
echo "3. Set up monitoring and alerting"
echo "4. Run integration tests"
echo ""

# Save environment variables for easy access
cat > .env.deployment <<EOL
# ECE Token Program Deployment Info
ECE_TOKEN_PROGRAM_ID=$PROGRAM_ID
SOLANA_CLUSTER=$CLUSTER
SOLANA_RPC_URL=https://api.$CLUSTER.solana.com
DEPLOYMENT_TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOL

echo -e "${BLUE}📄 Environment variables saved to: .env.deployment${NC}"
