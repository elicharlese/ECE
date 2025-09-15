# Blockchain

This folder contains all blockchain-related code and infrastructure for the ECE platform, supporting multiple blockchain networks and smart contract development.

## Directory Structure

```
blockchain/
├── solana/                 # Solana blockchain programs
│   └── ece-token/         # ECE token program (moved from root)
├── ethereum/              # Ethereum smart contracts (future expansion)
├── shared/                # Shared blockchain utilities and libraries
├── tests/                 # Contract testing suites
├── scripts/               # Deployment and management scripts
└── README.md             # This documentation
```

## Supported Blockchains

### Solana
- **Framework**: Anchor
- **Network**: Devnet for development, Mainnet for production
- **Programs**: ECE Token program for cryptocurrency operations

### Ethereum (Future)
- **Framework**: Hardhat/Truffle
- **Network**: Goerli for testing, Mainnet for production
- **Contracts**: Planned for advanced DeFi features

## Getting Started

### Prerequisites
- **Solana CLI**: `sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"`
- **Anchor**: `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force`
- **Node.js**: Version 18+ for scripts and utilities

### Environment Setup
```bash
# Install Solana CLI
solana --version

# Install Anchor
avm install latest
avm use latest

# Set Solana config to devnet
solana config set --url https://api.devnet.solana.com

# Generate keypair
solana-keygen new
```

### Development Workflow
1. **Local Development**
   ```bash
   # Start local validator
   solana-test-validator

   # In another terminal, build and deploy
   cd blockchain/solana/ece-token
   anchor build
   anchor deploy
   ```

2. **Testing**
   ```bash
   # Run contract tests
   anchor test

   # Run integration tests
   cd blockchain/tests
   npm test
   ```

3. **Deployment**
   ```bash
   # Deploy to devnet
   ./blockchain/scripts/deploy-solana.sh

   # Check deployment
   solana program show <PROGRAM_ID>
   ```

## Project Structure Details

### Solana Programs
Located in `solana/` directory:
- **ece-token/**: Main token program for ECE cryptocurrency
  - `programs/`: Rust source code
  - `tests/`: Anchor test files
  - `migrations/`: Deployment scripts
  - `Anchor.toml`: Anchor configuration

### Shared Utilities
Located in `shared/` directory:
- **Connection helpers**: Standardized blockchain connections
- **Wallet utilities**: Keypair and transaction helpers
- **Common functions**: Reusable blockchain operations
- **Type definitions**: Shared TypeScript interfaces

### Testing Infrastructure
Located in `tests/` directory:
- **Unit tests**: Individual function testing
- **Integration tests**: Cross-contract interactions
- **E2E tests**: Full transaction workflows
- **Load tests**: Performance validation

### Deployment Scripts
Located in `scripts/` directory:
- **deploy-solana.sh**: Automated Solana deployment
- **verify-deployment.sh**: Post-deployment verification
- **migrate-contracts.sh**: Contract migration utilities

## Best Practices

### Development
- Use TypeScript for client-side code
- Follow Anchor framework conventions
- Implement comprehensive error handling
- Write tests for all contract functions

### Security
- Audit contracts before mainnet deployment
- Use multisig for critical operations
- Implement proper access controls
- Regular security updates

### Deployment
- Test thoroughly on devnet before mainnet
- Use migration scripts for upgrades
- Monitor contract performance
- Maintain deployment logs

## Integration with ECE Platform

### API Integration
- Contracts integrate with Next.js API routes
- Real-time updates via WebSocket connections
- Database synchronization for transaction history

### Wallet Integration
- ThirdWeb SDK for wallet connections
- MetaMask, Phantom, and Coinbase Wallet support
- Secure transaction signing and broadcasting

### User Experience
- Seamless blockchain interactions
- Gas fee optimization
- Transaction status tracking
- Error handling and user feedback

## Future Enhancements

### Multi-Chain Support
- Ethereum integration for broader adoption
- Cross-chain bridges for asset transfers
- Multi-chain wallet support

### Advanced Features
- NFT marketplace integration
- Decentralized governance
- Automated yield farming
- Cross-chain DEX integration

### Developer Tools
- Enhanced testing frameworks
- Visual contract explorers
- Automated deployment pipelines
- Performance monitoring dashboards

## Support and Resources

### Documentation
- [Solana Docs](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [ECE Platform Wiki](https://github.com/elicharlese/ECE/wiki)

### Community
- [Solana Discord](https://discord.gg/solana)
- [Anchor Discord](https://discord.gg/anchor)
- [ECE Community Forums](https://ece-platform.com/community)

### Security
- Report vulnerabilities to security@ece-platform.com
- Follow blockchain security best practices
- Regular security audits and updates

## Maintenance

- Keep dependencies updated
- Monitor blockchain network changes
- Update contracts for protocol upgrades
- Maintain comprehensive test coverage

This blockchain infrastructure provides the foundation for ECE's decentralized features and ensures secure, scalable blockchain operations.
