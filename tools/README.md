# ECE Development Tools

This directory contains command-line tools and utilities for the ECE platform development and management.

## Tool Categories

### App Creation (`app-creation/`)

- **ece-create-app.js**: Universal app scaffolding tool supporting multiple tech stacks
- Supports React/Next.js, React Native, Electron, Vue.js, and backend services
- Includes ECE branding, Beach Monokai theme, and 3D integration templates

### Business Banking & Blockchain (`bbb-system/`)

- **bbb-manager.js**: BBB system management tool
- Token balance checking, transfers, and minting operations
- Blockchain integration utilities

### Financial Analysis (`financials/`)

- **ma-financials.js**: M&A financial analysis tool
- Company valuation calculations
- Deal processing and financial metrics

### Profile Management (`profiles/`)

- **profile-manager.js**: User profile management utilities
- Profile creation, updates, and listing
- User data management operations

### Social Features (`social/`)

- **social-manager.js**: Social interaction management
- Friend connections, messaging, and social feeds
- Community engagement tools

### Trading Cards (`trading-cards/`)

- **trade-manager.js**: Trading card operations
- Card creation, listing, and trade execution
- Marketplace management utilities

## Usage

All tools are executable Node.js scripts. Run with:

```bash
# From project root
node tools/[category]/[tool-name].js [command] [options]

# Examples
node tools/app-creation/ece-create-app.js create my-app next-js
node tools/trading-cards/trade-manager.js list
node tools/financials/ma-financials.js analyze COMP123
```

## Installation

Tools require Node.js dependencies. Install from project root:

```bash
npm install
# or
yarn install
```

## Development

To add new tools:

1. Create appropriate category directory if needed
2. Follow existing tool structure and naming conventions
3. Use commander.js for CLI interface
4. Include proper error handling and validation
5. Update this README with new tool documentation

## Integration

Tools integrate with:
- ECE platform APIs
- Prisma database
- Blockchain services (Solana)
- External services (ThirdWeb, etc.)

All tools respect the ECE platform configuration and environment variables.
