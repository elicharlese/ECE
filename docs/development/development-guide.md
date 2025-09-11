# ECE Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Rust (for Solana contracts)
- Solana CLI tools

### Development Setup
```bash
# Clone and install dependencies
git clone <repo-url>
cd ECE
npm install

# Set up environment
cp .env.example .env
# Configure DATABASE_URL and other required variables

# Database setup
npx prisma migrate dev
npx prisma generate
npm run seed

# Start all applications
npm run dev:all
```

## Project Structure

```
ECE/
├── apps/                    # Platform applications
│   ├── ece-web/            # Next.js web app (localhost:3000)
│   ├── ece-mobile/         # React Native mobile app
│   └── desktop/            # Electron desktop app
├── libs/                   # Shared libraries
│   ├── shared-ui/          # React components, Tailwind CSS
│   ├── shared-types/       # TypeScript definitions
│   └── shared-business-logic/ # Business logic services
├── solana-contracts/       # Solana smart contracts (Rust)
├── prisma/                 # Database schema and migrations
├── scripts/                # Build and deployment scripts
├── tests/                  # End-to-end testing
└── docs/                   # Documentation
```

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `patch/*`: Bug fixes and improvements

### Code Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **Components**: PascalCase filenames, named exports
- **Services**: Singleton pattern with error handling
- **APIs**: RESTful design with comprehensive validation

### Testing Strategy
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Blockchain tests
cd solana-contracts/ece-token && cargo test
```

## Key Development Areas

### 1. Frontend Development

#### React Components
```typescript
// Example component structure
import { Button, Card } from '@ece-platform/shared-ui';

export const TradingCard: React.FC<TradingCardProps> = ({
  card,
  onTrade
}) => {
  return (
    <Card className="trading-card">
      <h3>{card.name}</h3>
      <Button onClick={() => onTrade(card.id)}>
        Trade for {card.currentPrice} ECE
      </Button>
    </Card>
  );
};
```

#### State Management
- React Context for global state
- Custom hooks for business logic
- Real-time updates via WebSocket/Server-Sent Events

### 2. Backend Development

#### API Route Pattern
```typescript
// /pages/api/cards/[id]/route.ts
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const card = await CardService.getById(params.id);
    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

#### Service Layer Pattern
```typescript
export class CardService {
  static async getById(id: string): Promise<Card> {
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) throw new Error('Card not found');
    return card;
  }
}
```

### 3. Blockchain Development

#### Smart Contract Structure
```rust
// Solana program structure
#[program]
pub mod ece_token {
    use super::*;

    pub fn initialize_treasury(
        ctx: Context<InitializeTreasury>,
        signers: Vec<Pubkey>,
        threshold: u8,
    ) -> Result<()> {
        // Implementation
    }
}
```

#### Client Integration
```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { EceTokenClient } from './client';

const client = new EceTokenClient(connection, programId);
await client.mintTokens(userWallet, usdcAmount);
```

## Database Development

### Schema Management
```bash
# Create migration
npx prisma migrate dev --name "add_treasury_models"

# Generate client
npx prisma generate

# View database
npx prisma studio
```

### Query Patterns
```typescript
// Efficient queries with relations
const userWithCards = await prisma.user.findUnique({
  where: { walletAddress },
  include: {
    ownedCards: {
      include: { listing: true }
    },
    tradingHistory: {
      orderBy: { createdAt: 'desc' },
      take: 10
    }
  }
});
```

## Environment Configuration

### Development Environment
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/ece_dev"
DIRECT_URL="postgresql://user:pass@localhost:5432/ece_dev"

# Blockchain
SOLANA_RPC_URL="https://api.devnet.solana.com"
ECE_TOKEN_PROGRAM_ID="..."

# Admin Access
ECE_ADMIN_WALLETS="admin1,admin2"
ECE_EMERGENCY_SIGNERS="signer1,signer2"
```

### Production Environment
```env
# Secure production settings
DATABASE_URL="postgresql://prod_connection"
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
NODE_ENV="production"
```

## Testing Guidelines

### Unit Testing
```typescript
// Service testing example
describe('ECETreasuryService', () => {
  it('should process weekly payout correctly', async () => {
    const request = {
      revenueAmount: 1000,
      payoutPercentage: 80,
      authorizedSigners: ['signer1']
    };
    
    const result = await ECETreasuryService.processWeeklyPayout(request);
    expect(result.success).toBe(true);
    expect(result.eceConverted).toBe(800);
  });
});
```

### Integration Testing
```typescript
// API testing example
describe('Treasury API', () => {
  it('should require admin access', async () => {
    const response = await fetch('/api/treasury/status', {
      headers: { 'x-wallet-address': 'unauthorized' }
    });
    expect(response.status).toBe(403);
  });
});
```

## Performance Guidelines

### Frontend Optimization
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize bundle size with code splitting
- Use proper caching strategies

### Backend Optimization
- Database query optimization
- Connection pooling
- Response caching
- Rate limiting implementation

### Blockchain Optimization
- Transaction batching
- Efficient account lookups
- Proper error handling
- Gas/fee optimization

## Deployment Process

### Development Deployment
```bash
# Deploy to development environment
npm run deploy:dev
```

### Production Deployment
```bash
# Build and deploy all applications
npm run build
npm run deploy:prod

# Deploy Solana contracts
cd solana-contracts/ece-token
./build.sh && ./deploy.sh mainnet-beta
```

## Troubleshooting

### Common Issues
- **Database Connection**: Check DATABASE_URL and network connectivity
- **Wallet Connection**: Verify ThirdWeb configuration
- **Solana Issues**: Check RPC endpoint and program deployment
- **Build Failures**: Clear node_modules and reinstall dependencies

### Debug Tools
- Next.js DevTools
- React DevTools
- Prisma Studio
- Solana Explorer

## Contributing

### Code Review Checklist
- [ ] TypeScript strict compliance
- [ ] Test coverage >90%
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Performance impact assessed

### Pull Request Template
```markdown
## Description
Brief description of changes

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Security implications reviewed
- [ ] Documentation updated
```

---

*Development Guide Version: 1.5*  
*Last Updated: January 2025*
