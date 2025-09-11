# NFT Integration in ECE Platform

This document explains the NFT integration implementation in the ECE (Elite Card Exchange) platform, which enables app cards to be represented as unique NFTs with on-chain ownership and metadata.

## Overview

The NFT integration allows users to:
- Mint app cards as NFTs on the Solana blockchain
- View real-time NFT data and ownership information
- Transfer NFTs between wallets
- Access rich metadata stored on-chain

## Architecture

The NFT integration follows a client-server architecture with the following components:

### Backend Services

1. **NFT Service** (`src/services/nft.service.ts`)
   - Core service handling all blockchain interactions
   - Minting new NFTs using Metaplex
   - Syncing ownership between blockchain and database
   - Generating and uploading metadata

2. **NFT API Service** (`src/services/nft-api.service.ts`)
   - Wrapper service exposing NFT functionality via clean API
   - Error handling and logging

3. **API Routes** (`apps/ece-web/src/pages/api/nft/`)
   - RESTful endpoints for frontend integration
   - `/api/nft/[cardId]/mint` - Mint a card as NFT
   - `/api/nft/[cardId]/details` - Get NFT details
   - `/api/nft/[cardId]/sync` - Sync ownership

### Frontend Components

1. **NFT Card Integration** (`apps/ece-web/src/components/cards/NFTCard.integration.tsx`)
   - UI component displaying NFT status and blockchain data
   - Wallet connection integration
   - Minting and data refresh controls

### Data Model

The `Card` model in Prisma schema has been extended with NFT-specific fields:

```prisma
model Card {
  // ... existing fields ...
  
  // NFT Fields
  tokenId        String?   @db.VarChar(255)
  contractAddress String?   @db.VarChar(255)
  mintAddress    String?   @db.VarChar(255)
  blockchain     String?   @db.VarChar(50)
  metadataUri    String?   @db.VarChar(500)
  isMinted       Boolean   @default(false)
}
```

## Implementation Details

### Blockchain Technology

- **Solana**: High-performance blockchain for fast, low-cost transactions
- **Metaplex**: NFT standard and tools for creating and managing NFTs on Solana
- **Wallet Integration**: Solana Wallet Adapter for connecting user wallets

### Key Features

1. **NFT Minting**
   - Generate rich metadata based on card properties
   - Upload metadata to Arweave/IPFS via Bundlr
   - Mint NFT on Solana using Metaplex
   - Store NFT details in database

2. **Ownership Sync**
   - Periodically check blockchain for ownership changes
   - Update database records to match on-chain state
   - Log ownership transfer events

3. **Metadata Management**
   - Generate NFT metadata with card attributes
   - Upload to decentralized storage
   - Retrieve and display on-chain metadata

## Testing

### Backend Testing

A test script is available at `scripts/test-nft-service.ts` to verify functionality:

```bash
npm run test:nft
```

### Manual Testing

1. Connect a Solana wallet (Phantom, Solflare, etc.)
2. Navigate to a card that hasn't been minted
3. Click "Mint NFT" to create the NFT
4. View updated NFT details and ownership information

## Configuration

### Environment Variables

The following environment variables are required (see `.env.example`):

- `SOLANA_RPC_ENDPOINT` - Solana RPC endpoint
- `NFT_MINTING_WALLET_PRIVATE_KEY` - Private key for minting wallet
- `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT` - Public Solana RPC endpoint

## Security Considerations

1. **Private Key Management**
   - Never commit private keys to version control
   - Use secure key management in production
   - Rotate keys regularly

2. **Transaction Signing**
   - All transactions signed server-side for minting
   - User signatures required for transfers

3. **Rate Limiting**
   - API endpoints implement rate limiting
   - Blockchain query limits to prevent abuse

## Future Enhancements

1. **Marketplace Integration**
   - Enable buying/selling NFTs within the platform
   - Integrate with Solana marketplaces

2. **Advanced Metadata**
   - Dynamic metadata based on card performance
   - Rich media content in NFTs

3. **Cross-Chain Support**
   - Support for additional blockchains
   - Bridge functionality for NFT transfers

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure wallet extension is installed and unlocked
   - Check network configuration matches expected chain

2. **Minting Errors**
   - Verify minting wallet has sufficient SOL
   - Check RPC endpoint is accessible

3. **Metadata Not Displaying**
   - Verify metadata URI is accessible
   - Check Arweave/IPFS gateway status

### Support

For issues with NFT integration, contact the development team or check the Solana/Metaplex documentation.
