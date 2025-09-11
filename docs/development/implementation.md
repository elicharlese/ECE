# ECE Platform - Batch 4 Implementation Specification

## Overview

This document provides detailed technical specifications for the Batch 4 implementation of the ECE (Elite Card Exchange) platform. Batch 4 focuses on advanced marketplace features including auctions, bidding systems, portfolio management, and basic analytics to enhance the platform's capabilities as a sophisticated digital asset marketplace.

## Batch 4 Features

### 1. Advanced Trading Options
- **Auction System**: Time-based auctions for cards with bidding functionality
- **Trade Offers**: Direct negotiation between users for card exchanges
- **Bidding System**: Complex bidding mechanisms for various trading scenarios

### 2. Portfolio Management
- **Asset Tracking**: Comprehensive tracking of user's card collections
- **Valuation Algorithms**: Automated valuation of card portfolios
- **Risk Assessment**: Risk analysis for portfolio diversification

### 3. Basic Analytics
- **Price History**: Tracking of card price movements over time
- **Market Trends**: Analysis of market-wide trends and patterns
- **User Performance**: Individual user trading performance metrics

## System Architecture

### Component Diagram
```
Frontend UI Layer
    ↓ (API Calls)
API Controllers
    ↓ (Service Calls)
Business Logic Services
    ↓ (Database Operations)
Prisma ORM ←→ PostgreSQL Database
    ↓ (Real-time Updates)
WebSocket Server
```

### Key Components

#### 1. Frontend Components
- **Auction Components**: Auction listing, detail, and creation interfaces
- **Bidding Components**: Trade offer management and negotiation interfaces
- **Portfolio Components**: Asset tracking and analytics dashboards
- **Analytics Components**: Price history charts and market trend visualizations

#### 2. Backend Services
- **Auction Service**: Auction creation, management, and bidding logic
- **Trade Offer Service**: Trade offer creation, negotiation, and execution
- **Portfolio Service**: Asset tracking, valuation, and risk assessment
- **Analytics Service**: Price history tracking and market analysis

#### 3. Database Integration
- **Auction Models**: Auction listings, bids, and related data
- **Trade Offer Models**: Trade offers, negotiations, and execution history
- **Portfolio Models**: Asset holdings, valuations, and risk metrics
- **Analytics Models**: Price history, market trends, and performance data

## Data Model

### Auction Models
```prisma
model Auction {
  id              String     @id @default(uuid())
  cardId          String
  sellerId        String
  startingPrice   Float
  currentPrice    Float      @default(0)
  reservePrice    Float?
  startTime       DateTime   @default(now())
  endTime         DateTime
  status          String     @default("ACTIVE") // ACTIVE, COMPLETED, CANCELLED
  winnerId        String?
  
  card            Card       @relation(fields: [cardId], references: [id])
  seller          User       @relation(fields: [sellerId], references: [id])
  winner          User?      @relation(fields: [winnerId], references: [id])
  bids            Bid[]
  
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model Bid {
  id          String   @id @default(uuid())
  auctionId   String
  bidderId    String
  amount      Float
  timestamp   DateTime @default(now())
  
  auction     Auction  @relation(fields: [auctionId], references: [id])
  bidder      User     @relation(fields: [bidderId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Trade Offer Models
```prisma
model TradeOffer {
  id              String     @id @default(uuid())
  offererId       String
  receiverId      String
  status          String     @default("PENDING") // PENDING, ACCEPTED, REJECTED, CANCELLED
  expirationDate  DateTime?
  
  offerer         User       @relation(fields: [offererId], references: [id])
  receiver        User       @relation(fields: [receiverId], references: [id])
  offeredCards    TradeCard[] @relation("OfferedCards")
  requestedCards  TradeCard[] @relation("RequestedCards")
  
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model TradeCard {
  id            String   @id @default(uuid())
  tradeOfferId  String
  cardId        String
  type          String   // OFFERED, REQUESTED
  
  tradeOffer    TradeOffer @relation(fields: [tradeOfferId], references: [id])
  card          Card     @relation(fields: [cardId], references: [id])
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Portfolio Models
```prisma
model Portfolio {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  
  user        User     @relation(fields: [userId], references: [id])
  assets      PortfolioAsset[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PortfolioAsset {
  id          String   @id @default(uuid())
  portfolioId String
  cardId      String
  quantity    Int      @default(1)
  purchasePrice Float?
  purchaseDate DateTime?
  
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id])
  card        Card     @relation(fields: [cardId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Analytics Models
```prisma
model PriceHistory {
  id        String   @id @default(uuid())
  cardId    String
  price     Float
  timestamp DateTime @default(now())
  
  card      Card     @relation(fields: [cardId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model MarketTrend {
  id        String   @id @default(uuid())
  metric    String
  value     Float
  timestamp DateTime @default(now())
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

### Auction Operations

#### Create Auction
- **Endpoint**: `POST /api/auctions`
- **Description**: Creates a new auction for a card
- **Parameters**:
  - Body: `cardId`, `startingPrice`, `reservePrice`, `durationHours`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "auctionId": "uuid",
      "cardId": "uuid",
      "startingPrice": 100.0,
      "endTime": "2023-12-31T23:59:59Z"
    }
  }
  ```

#### Place Bid
- **Endpoint**: `POST /api/auctions/[auctionId]/bids`
- **Description**: Places a bid on an auction
- **Parameters**:
  - Path: `auctionId` (string)
  - Body: `bidderId`, `amount`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "bidId": "uuid",
      "auctionId": "uuid",
      "amount": 150.0,
      "bidderId": "uuid"
    }
  }
  ```

#### Get Auction Details
- **Endpoint**: `GET /api/auctions/[auctionId]`
- **Description**: Retrieves detailed information about an auction
- **Parameters**:
  - Path: `auctionId` (string)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "auction": {
        "id": "uuid",
        "card": { /* card details */ },
        "currentPrice": 150.0,
        "endTime": "2023-12-31T23:59:59Z",
        "bids": [ /* bid history */ ]
      }
    }
  }
  ```

### Trade Offer Operations

#### Create Trade Offer
- **Endpoint**: `POST /api/trade-offers`
- **Description**: Creates a new trade offer
- **Parameters**:
  - Body: `offererId`, `receiverId`, `offeredCardIds`, `requestedCardIds`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "tradeOfferId": "uuid",
      "offererId": "uuid",
      "receiverId": "uuid"
    }
  }
  ```

#### Accept Trade Offer
- **Endpoint**: `POST /api/trade-offers/[tradeOfferId]/accept`
- **Description**: Accepts a trade offer
- **Parameters**:
  - Path: `tradeOfferId` (string)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "tradeOfferId": "uuid",
      "status": "ACCEPTED"
    }
  }
  ```

### Portfolio Operations

#### Create Portfolio
- **Endpoint**: `POST /api/portfolios`
- **Description**: Creates a new portfolio
- **Parameters**:
  - Body: `userId`, `name`, `description`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "portfolioId": "uuid",
      "userId": "uuid",
      "name": "My Collection"
    }
  }
  ```

#### Add Asset to Portfolio
- **Endpoint**: `POST /api/portfolios/[portfolioId]/assets`
- **Description**: Adds an asset to a portfolio
- **Parameters**:
  - Path: `portfolioId` (string)
  - Body: `cardId`, `quantity`, `purchasePrice`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "assetId": "uuid",
      "portfolioId": "uuid",
      "cardId": "uuid"
    }
  }
  ```

### Analytics Operations

#### Get Price History
- **Endpoint**: `GET /api/analytics/price-history/[cardId]`
- **Description**: Retrieves price history for a card
- **Parameters**:
  - Path: `cardId` (string)
  - Query: `days` (number, default: 30)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "cardId": "uuid",
      "prices": [
        { "timestamp": "2023-12-01T00:00:00Z", "price": 100.0 },
        { "timestamp": "2023-12-02T00:00:00Z", "price": 110.0 }
      ]
    }
  }
  ```

#### Get Market Trends
- **Endpoint**: `GET /api/analytics/market-trends`
- **Description**: Retrieves current market trends
- **Parameters**:
  - Query: `metric` (string, optional)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "trends": [
        { "metric": "average_price", "value": 150.0, "change": 5.0 },
        { "metric": "trading_volume", "value": 1000, "change": -2.0 }
      ]
    }
  }
  ```

## Service Layer Implementation

### Auction Service (`src/services/auction.service.ts`)

#### Key Methods

##### Create Auction
```typescript
async createAuction(data: CreateAuctionInput): Promise<Auction> {
  const { cardId, sellerId, startingPrice, reservePrice, durationHours } = data;
  
  // Validate that the seller owns the card
  const card = await prisma.card.findUnique({
    where: { id: cardId }
  });
  
  if (!card || card.ownerId !== sellerId) {
    throw new Error('Seller does not own the card');
  }
  
  // Create the auction
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + durationHours);
  
  const auction = await prisma.auction.create({
    data: {
      cardId,
      sellerId,
      startingPrice,
      reservePrice,
      endTime,
      currentPrice: startingPrice
    }
  });
  
  // Emit real-time update
  this.emitAuctionUpdate(auction.id, 'CREATED');
  
  return auction;
}
```

##### Place Bid
```typescript
async placeBid(data: PlaceBidInput): Promise<Bid> {
  const { auctionId, bidderId, amount } = data;
  
  // Validate auction is active
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId }
  });
  
  if (!auction || auction.status !== 'ACTIVE') {
    throw new Error('Auction is not active');
  }
  
  if (new Date() > auction.endTime) {
    throw new Error('Auction has ended');
  }
  
  if (amount <= auction.currentPrice) {
    throw new Error('Bid must be higher than current price');
  }
  
  // Create the bid
  const bid = await prisma.bid.create({
    data: {
      auctionId,
      bidderId,
      amount
    }
  });
  
  // Update auction current price
  await prisma.auction.update({
    where: { id: auctionId },
    data: { currentPrice: amount }
  });
  
  // Emit real-time update
  this.emitAuctionUpdate(auctionId, 'BID_PLACED', { bid });
  
  return bid;
}
```

### Trade Offer Service (`src/services/trade-offer.service.ts`)

#### Key Methods

##### Create Trade Offer
```typescript
async createTradeOffer(data: CreateTradeOfferInput): Promise<TradeOffer> {
  const { offererId, receiverId, offeredCardIds, requestedCardIds } = data;
  
  // Validate ownership of offered cards
  const offeredCards = await prisma.card.findMany({
    where: { id: { in: offeredCardIds } }
  });
  
  const invalidOffers = offeredCards.filter(card => card.ownerId !== offererId);
  if (invalidOffers.length > 0) {
    throw new Error('Offerer does not own all offered cards');
  }
  
  // Validate ownership of requested cards
  const requestedCards = await prisma.card.findMany({
    where: { id: { in: requestedCardIds } }
  });
  
  const invalidRequests = requestedCards.filter(card => card.ownerId !== receiverId);
  if (invalidRequests.length > 0) {
    throw new Error('Receiver does not own all requested cards');
  }
  
  // Create the trade offer
  const tradeOffer = await prisma.tradeOffer.create({
    data: {
      offererId,
      receiverId,
      offeredCards: {
        create: offeredCardIds.map(cardId => ({
          cardId,
          type: 'OFFERED'
        }))
      },
      requestedCards: {
        create: requestedCardIds.map(cardId => ({
          cardId,
          type: 'REQUESTED'
        }))
      }
    },
    include: {
      offeredCards: true,
      requestedCards: true
    }
  });
  
  // Emit real-time update
  this.emitTradeOfferUpdate(tradeOffer.id, 'CREATED');
  
  return tradeOffer;
}
```

### Portfolio Service (`src/services/portfolio.service.ts`)

#### Key Methods

##### Calculate Portfolio Value
```typescript
async calculatePortfolioValue(portfolioId: string): Promise<number> {
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
    include: {
      assets: {
        include: {
          card: true
        }
      }
    }
  });
  
  if (!portfolio) {
    throw new Error('Portfolio not found');
  }
  
  let totalValue = 0;
  
  for (const asset of portfolio.assets) {
    // Get current card value (from price history or other valuation method)
    const currentValue = await this.getCurrentCardValue(asset.cardId);
    totalValue += currentValue * asset.quantity;
  }
  
  return totalValue;
}
```

### Analytics Service (`src/services/analytics.service.ts`)

#### Key Methods

##### Record Price
```typescript
async recordPrice(cardId: string, price: number): Promise<PriceHistory> {
  // Record the price
  const priceHistory = await prisma.priceHistory.create({
    data: {
      cardId,
      price
    }
  });
  
  // Emit real-time update
  this.emitPriceUpdate(cardId, price);
  
  return priceHistory;
}
```

## Frontend Implementation

### Auction Components

#### Auction List Component
```tsx
const AuctionList: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadAuctions();
  }, []);
  
  const loadAuctions = async () => {
    try {
      const response = await fetch('/api/auctions');
      const data = await response.json();
      if (data.success) {
        setAuctions(data.data);
      }
    } catch (error) {
      console.error('Failed to load auctions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="auction-list">
      {auctions.map(auction => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
};
```

#### Auction Detail Component
```tsx
const AuctionDetail: React.FC<{ auctionId: string }> = ({ auctionId }) => {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  
  useEffect(() => {
    loadAuction();
  }, [auctionId]);
  
  const loadAuction = async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}`);
      const data = await response.json();
      if (data.success) {
        setAuction(data.data.auction);
      }
    } catch (error) {
      console.error('Failed to load auction:', error);
    }
  };
  
  const placeBid = async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bidderId: currentUser.id,
          amount: parseFloat(bidAmount)
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh auction data
        loadAuction();
        setBidAmount('');
      }
    } catch (error) {
      console.error('Failed to place bid:', error);
    }
  };
  
  if (!auction) return <div>Loading...</div>;
  
  return (
    <div className="auction-detail">
      <h2>{auction.card.name} Auction</h2>
      <div className="auction-info">
        <p>Current Price: {auction.currentPrice}</p>
        <p>Ends: {auction.endTime.toString()}</p>
      </div>
      
      <div className="bid-section">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter bid amount"
        />
        <button onClick={placeBid}>Place Bid</button>
      </div>
      
      <div className="bid-history">
        <h3>Bid History</h3>
        {auction.bids.map(bid => (
          <div key={bid.id} className="bid-item">
            <span>{bid.bidder.name}: {bid.amount}</span>
            <span>{bid.timestamp.toString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Real-time Updates

### WebSocket Integration
```typescript
// Client-side WebSocket connection
const useAuctionUpdates = (auctionId: string) => {
  const [auction, setAuction] = useState<Auction | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001/auctions/${auctionId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'AUCTION_UPDATE':
          setAuction(data.payload);
          break;
        case 'BID_PLACED':
          // Update auction with new bid
          setAuction(prev => ({
            ...prev,
            bids: [...prev.bids, data.payload.bid],
            currentPrice: data.payload.bid.amount
          }));
          break;
      }
    };
    
    return () => {
      ws.close();
    };
  }, [auctionId]);
  
  return auction;
};
```

## Security Considerations

### Authentication & Authorization
- **Role-Based Access**: Ensure users can only interact with their own auctions and trades
- **Input Validation**: Validate all user inputs to prevent injection attacks
- **Rate Limiting**: Prevent abuse of bidding and trading functionality

### Data Protection
- **Encryption**: Encrypt sensitive data in transit and at rest
- **Access Control**: Implement proper access controls for portfolio data
- **Audit Logging**: Log all trading activities for compliance

## Testing Strategy

### Unit Tests
- Service method testing for all business logic
- API endpoint validation
- Data model integrity checks

### Integration Tests
- End-to-end auction workflows
- Trade offer negotiation and execution
- Portfolio valuation calculations
- Analytics data recording and retrieval

### Real-time Testing
- WebSocket connection and message handling
- Real-time auction updates
- Bid notification systems

## Performance Optimization

### Database Optimization
- **Indexing**: Proper indexing for auction, bid, and trade offer queries
- **Query Optimization**: Efficient queries for large datasets
- **Caching**: Cache frequently accessed data

### Real-time Performance
- **Connection Management**: Efficient WebSocket connection handling
- **Message Batching**: Batch updates to reduce network traffic
- **Load Balancing**: Distribute real-time connections across multiple servers

## Monitoring and Observability

### Key Metrics
- **Auction Success Rate**: Percentage of auctions that complete successfully
- **Trade Completion Rate**: Percentage of trade offers that are accepted
- **Portfolio Valuation Accuracy**: Accuracy of portfolio value calculations
- **Real-time Update Latency**: Time to deliver real-time updates

### Logging
- **Activity Logging**: Complete logging of all trading activities
- **Error Logging**: Detailed error logging for troubleshooting
- **Performance Logging**: Performance metrics for optimization

## Deployment Considerations

### Environment Configuration
- **Development**: Local development with mock data
- **Staging**: Staging environment with test users
- **Production**: Production environment with real users

### CI/CD Pipeline
- **Testing**: Automated tests for all Batch 4 functionality
- **Deployment**: Environment-specific configuration
- **Rollback**: Procedures for reverting Batch 4 changes

## Future Enhancements

### Short-term Roadmap
1. **Advanced Bidding**: Automatic bidding and sniping protection
2. **Portfolio Analytics**: Advanced portfolio analysis and recommendations
3. **Market Making**: Automated market maker for liquidity

### Long-term Vision
1. **AI-Powered Trading**: Machine learning-based trading recommendations
2. **Cross-Platform Trading**: Integration with external marketplaces
3. **Advanced Analytics**: Predictive analytics and market forecasting

## Conclusion

The Batch 4 implementation provides a comprehensive set of advanced marketplace features that will significantly enhance the ECE platform's capabilities as a digital asset marketplace. The architecture is designed to be scalable, secure, and performant, with clear separation of concerns between frontend, API, and service layers.

The implementation follows modern best practices for real-time web applications, with comprehensive error handling, testing strategies, and monitoring capabilities. The system is designed to support the platform's growth and provides a solid foundation for future enhancements to the ECE platform's trading capabilities.
