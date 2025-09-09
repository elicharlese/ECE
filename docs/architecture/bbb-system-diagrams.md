# B&B&B System Architecture Diagrams

## Battle System Flow

```mermaid
flowchart TD
    A[User Initiates Battle] --> B{Validate Card Ownership}
    B -->|Valid| C[Select Opponent]
    B -->|Invalid| D[Error: Card Not Owned]

    C --> E{Opponent Selection}
    E -->|AI Opponent| F[Start AI Battle]
    E -->|Human Opponent| G[Send Battle Challenge]

    G --> H{Opponent Response}
    H -->|Accepted| I[Initialize Battle]
    H -->|Declined| J[Battle Cancelled]
    H -->|Timeout| K[Auto-decline]

    I --> L[Load Battle Environment]
    L --> M[Execute Battle Rounds]
    M --> N{Winner Determined}
    N --> O[Process Rewards]
    N --> P[Record Statistics]

    O --> Q[Update Rankings]
    P --> Q
    Q --> R[Battle Complete]
```

## Betting System Flow

```mermaid
flowchart TD
    A[User Views Betting Markets] --> B[Select Prediction Market]
    B --> C{Validate User Balance}
    C -->|Insufficient| D[Error: Insufficient Funds]
    C -->|Sufficient| E[Choose Prediction Direction]

    E --> F[Calculate Odds & Payout]
    F --> G[Confirm Bet Details]
    G --> H{User Confirms}
    H -->|Yes| I[Place Bet]
    H -->|No| J[Cancel Bet]

    I --> K[Deduct Stake from Balance]
    K --> L[Update Market Odds]
    L --> M[Record Bet Position]

    M --> N[Wait for Market Expiry]
    N --> O{Settlement Time}
    O -->|Reached| P[Determine Outcome]
    P --> Q{Won Bet?}
    Q -->|Yes| R[Calculate Winnings]
    Q -->|No| S[Mark as Loss]

    R --> T[Credit Winnings]
    S --> U[Update Loss Record]
    T --> V[Update Statistics]
    U --> V
    V --> W[Market Closed]
```

## Bidding System Flow

```mermaid
flowchart TD
    A[Seller Creates Auction] --> B{Validate Card Ownership}
    B -->|Valid| C[Set Auction Parameters]
    B -->|Invalid| D[Error: Not Owner]

    C --> E[Starting Price]
    E --> F[Duration]
    F --> G[Reserve Price]
    G --> H[Auto-extend Rules]

    H --> I[Publish Auction]
    I --> J[Notify Watchers]
    J --> K[Auction Goes Live]

    K --> L[Bidders Place Bids]
    L --> M{New Bid > Current Bid}
    M -->|Yes| N[Update Current Bid]
    M -->|No| O[Reject Bid]

    N --> P[Notify Previous Winner]
    P --> Q[Update Bid History]
    Q --> R[Extend Auction if Near End]

    R --> S{Auction End Time}
    S -->|Reached| T[Close Auction]
    S -->|Not Reached| L

    T --> U{Reserve Price Met?}
    U -->|Yes| V[Transfer Card to Winner]
    U -->|No| W[Cancel Auction]

    V --> X[Process Payment]
    X --> Y[Update Ownership]
    Y --> Z[Auction Complete]
```

## Tinder Swipe Deck Flow

```mermaid
flowchart TD
    A[User Opens Swipe Deck] --> B[Load Card Recommendations]
    B --> C[Preload Next Cards]
    C --> D[Display Current Card]

    D --> E{User Swipe Gesture}
    E -->|Right - Accept| F[Record Positive Action]
    E -->|Left - Reject| G[Record Negative Action]
    E -->|Up - Super Like| H[Record Premium Action]
    E -->|Down - Save| I[Save for Later]

    F --> J{Check for Match}
    G --> K[Load Next Card]
    H --> J
    I --> K

    J --> L{Mutual Positive?}
    L -->|Yes| M[Trigger Match Animation]
    L -->|No| K

    M --> N[Show Action Options]
    N --> O{User Choice}
    O -->|Battle| P[Initiate Battle]
    O -->|Trade| Q[Create Trade Offer]
    O -->|Auction| R[Start Auction]
    O -->|Dismiss| K

    P --> S[Navigate to Battle]
    Q --> T[Navigate to Trading]
    R --> U[Navigate to Auctions]
    K --> V{More Cards?}
    V -->|Yes| D
    V -->|No| W[End Session]

    S --> X[Update Preferences]
    T --> X
    U --> X
    W --> X
    X --> Y[Save User Data]
```

## Order Creation and Fulfillment Flow

```mermaid
flowchart TD
    A[User Initiates Order] --> B[Select Order Type]
    B --> C[CARD_CREATION]
    B --> D[CARD_ENHANCEMENT]
    B --> E[CARD_UPGRADE]

    C --> F[Gather Requirements]
    D --> G[Select Card to Enhance]
    E --> H[Select Upgrade Path]

    F --> I[Calculate Cost]
    G --> I
    H --> I

    I --> J{Validate Balance}
    J -->|Insufficient| K[Error: Low Balance]
    J -->|Sufficient| L[Confirm Order Details]

    L --> M{User Confirms}
    M -->|Yes| N[Create Order Record]
    M -->|No| O[Cancel Order]

    N --> P[Escrow Balance]
    P --> Q[Set Status to PENDING]
    Q --> R[Notify Admins]

    R --> S[Admin Review]
    S --> T{Approval Decision}
    T -->|Approved| U[Assign to Team]
    T -->|Revision Needed| V[Request Clarification]

    V --> W[User Responds]
    W --> S

    U --> X[Development Phase]
    X --> Y[Progress Updates]
    Y --> Z{Quality Checks}
    Z -->|Pass| AA[Prepare Delivery]
    Z -->|Fail| BB[Revision Required]

    BB --> CC[User Feedback]
    CC --> X

    AA --> DD[Deliver Card]
    DD --> EE[Update User Inventory]
    EE --> FF[Release Escrow Balance]
    FF --> GG[Order Complete]
```

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Application]
        B[Mobile Application]
        C[Desktop Application]
    end

    subgraph "API Gateway"
        D[Load Balancer]
        E[API Gateway]
    end

    subgraph "Service Layer"
        F[Battle Service]
        G[Betting Service]
        H[Bidding Service]
        I[Order Service]
        J[Card Service]
    end

    subgraph "Data Layer"
        K[(PostgreSQL)]
        L[(Redis Cache)]
        M[(Solana Blockchain)]
    end

    subgraph "External Services"
        N[WebSocket Server]
        O[File Storage]
        P[Notification Service]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    E --> G
    E --> H
    E --> I
    E --> J

    F --> K
    G --> K
    H --> K
    I --> K
    J --> K

    F --> L
    G --> L
    H --> L
    I --> L
    J --> L

    J --> M
    F --> N
    G --> N
    H --> N

    I --> O
    J --> P
```

## Database Schema Relationships

```mermaid
erDiagram
    User ||--o{ Card : owns
    User ||--o{ AppOrder : creates
    User ||--o{ BettingPosition : places
    User ||--o{ AuctionBid : places
    User ||--o{ MABattle : initiates

    Card ||--o{ MarketplaceListing : listed
    Card ||--o{ CardAuction : auctioned
    Card ||--o{ BettingMarket : bet_on
    Card ||--o{ MABattle : battles_in

    AppOrder ||--o{ OrderRevision : has
    AppOrder ||--o{ OrderCommunication : has
    AppOrder ||--o{ OrderDeliverable : has

    MarketplaceListing ||--o{ Bid : receives
    CardAuction ||--o{ AuctionBid : receives
    CardAuction ||--o{ AuctionHistory : generates

    BettingMarket ||--o{ BettingPosition : has
    BettingMarket ||--o{ BettingPayout : generates

    MABattle ||--o{ BattleProposal : has
    MABattle ||--o{ BattleVoting : receives
    MABattle ||--o{ BattleOutcome : produces
```

## Real-time Communication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant WS as WebSocket Server
    participant BS as Battle Service
    participant BSvc as Betting Service
    participant AS as Auction Service

    U->>WS: Connect to real-time updates
    WS->>U: Connection established

    U->>BS: Join battle room
    BS->>WS: Subscribe to battle updates
    WS->>U: Battle state updates

    U->>BSvc: Place bet
    BSvc->>WS: Broadcast odds change
    WS->>U: Updated odds

    U->>AS: Place bid
    AS->>WS: Broadcast new bid
    WS->>U: Bid update notification

    Note over WS: Real-time updates for<br/>all connected users
```

## Security Architecture

```mermaid
flowchart TD
    A[User Request] --> B{Authentication}
    B -->|Valid| C{Authorization}
    B -->|Invalid| D[401 Unauthorized]

    C -->|Authorized| E{Input Validation}
    C -->|Unauthorized| F[403 Forbidden]

    E -->|Valid| G{Business Logic}
    E -->|Invalid| H[400 Bad Request]

    G --> I{Data Integrity}
    I -->|Valid| J[Process Request]
    I -->|Invalid| K[409 Conflict]

    J --> L{Audit Logging}
    L --> M[Response]

    M --> N{Error Handling}
    N -->|Success| O[200 OK]
    N -->|Error| P[500 Internal Server Error]

    O --> Q[Rate Limiting]
    P --> Q
    Q --> R{Request Complete}
```