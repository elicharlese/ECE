# ECE Web App Database

This folder contains the Prisma configuration and database files specifically for the ECE web application.

## Contents

- `schema.prisma` - Complete Prisma schema with all ECE models
- `dev.db` - SQLite development database with sample data

## Schema Features

### Core Models
- **User**: Wallet-based authentication, subscriptions, social features
- **Card**: Trading cards with metadata, NFT integration, powerups
- **Transaction**: Payment processing, history tracking

### Marketplace Models
- **MarketplaceListing**: Card listings with pricing
- **Bid**: Auction bidding system
- **TradeOffer**: Peer-to-peer trading
- **Auction**: Time-based auctions

### Advanced Features
- **BettingMarket**: Prediction markets for card performance
- **MABattle**: M&A battle system with proposals and voting
- **Powerup**: Card enhancement system
- **Notification**: Real-time notifications and alerts

### Social Features
- **SocialFeed**: User posts and interactions
- **Follow**: User following system
- **BattleVoting**: Community voting on M&A proposals

## Database Setup

### Development
- Uses SQLite for fast local development
- Includes sample data for testing
- Hot-reload compatible with Next.js

### Production
- PostgreSQL for scalability and performance
- Optimized indexes and constraints
- Connection pooling for high traffic

## Commands

### Schema Management
```bash
# Generate Prisma client
npx prisma generate

# Update database schema
npx prisma db push

# Create migration
npx prisma migrate dev --name <migration-name>
```

### Database Operations
```bash
# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Data Management
```bash
# Seed database
npx prisma db seed

# Export data
npx prisma db pull

# Import data
npx prisma db push
```

## Environment Configuration

Ensure `.env` contains:
```
DATABASE_URL="file:./prisma/apps/ece-web/dev.db"
```

For production:
```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

## Best Practices

### Schema Design
- Use meaningful model and field names
- Add proper relations and constraints
- Include indexes for query performance
- Document complex business logic

### Development Workflow
- Always run migrations for schema changes
- Test queries in Prisma Studio
- Use transactions for multi-step operations
- Monitor query performance

### Production Considerations
- Regular backups of production data
- Monitor database performance metrics
- Plan for schema migrations during deployments
- Use connection pooling for scalability

## Troubleshooting

### Common Issues
- **Schema sync**: Run `npx prisma db push` after schema changes
- **Client generation**: Run `npx prisma generate` after schema updates
- **Migration conflicts**: Review migration history and resolve conflicts
- **Performance**: Add indexes for slow queries

### Debug Mode
```bash
DEBUG="*" npx prisma studio
```

## Integration

This database configuration integrates with:
- Next.js API routes
- Authentication system
- Wallet integration
- Real-time features
- Admin dashboard
