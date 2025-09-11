#!/bin/bash

echo "Deploying ECE Solana Contracts"
echo "================================"

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
  echo "❌ Anchor CLI not found. Please install Anchor first:"
  echo "   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
  echo "   avm install latest && avm use latest"
  exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
  echo "❌ Solana CLI not found. Please install Solana CLI first:"
  echo "   sh -c \"\$(curl -sSfL https://release.solana.com/v1.18.4/install)\""
  exit 1
fi

# Set Solana config to devnet if not already
CURRENT_CLUSTER=$(solana config get | grep "RPC URL" | awk '{print $3}')
if [[ "$CURRENT_CLUSTER" != *"devnet"* ]]; then
  echo "🔄 Setting Solana config to devnet..."
  solana config set --url https://api.devnet.solana.com
fi

# Navigate to contract directory
cd solana/ece-token || {
  echo "❌ ECE token directory not found"
  exit 1
}

# Build the contract
echo "🔨 Building ECE token contract..."
if ! anchor build; then
  echo "❌ Build failed"
  exit 1
fi

# Deploy to devnet
echo "🚀 Deploying to Solana devnet..."
if ! anchor deploy --provider.cluster devnet; then
  echo "❌ Deployment failed"
  exit 1
fi

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/ece_token-keypair.json)
echo "✅ Deployment successful!"
echo "📋 Program ID: $PROGRAM_ID"
echo "🔗 Devnet Explorer: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"

# Save deployment info
echo "Saving deployment information..."
mkdir -p ../../../deployments
echo "{
  \"programId\": \"$PROGRAM_ID\",
  \"cluster\": \"devnet\",
  \"deployedAt\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"deployer\": \"$(solana address)\"
}" > ../../../deployments/ece-token-devnet.json

echo ""
echo "🎉 ECE Token contract deployed successfully!"
echo "📝 Deployment info saved to deployments/ece-token-devnet.json"
echo ""
echo "Next steps:"
echo "1. Verify contract on Solana Explorer"
echo "2. Run tests: anchor test"
echo "3. Update client configurations with new program ID"
