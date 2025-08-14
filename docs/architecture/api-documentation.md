# ECE Platform - API Documentation

## Overview

This document provides comprehensive documentation for the ECE (Elite Card Exchange) platform APIs, covering all endpoints, request/response formats, authentication methods, and integration guidelines.

## API Design Principles

### RESTful Architecture
- **Resource-based**: APIs organized around resources (users, cards, trades, etc.)
- **Stateless**: Each request contains all necessary information
- **Uniform Interface**: Consistent use of HTTP methods and status codes

### Security First
- **Authentication**: JWT tokens for secure authentication
- **Authorization**: Role-based and attribute-based access control
- **Rate Limiting**: Protection against abuse and DDoS attacks

## Core API Endpoints

### Authentication APIs

#### POST /api/auth/register
Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "newuser",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /api/auth/login
Authenticate user and obtain access token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### User Management APIs

#### GET /api/users/me
Get current user profile

#### PUT /api/users/me
Update current user profile

#### GET /api/users/{userId}
Get public profile of a specific user

### Card Management APIs

#### GET /api/cards
List all cards with filtering and pagination

#### GET /api/cards/{cardId}
Get detailed information about a specific card

#### POST /api/cards
Create a new card (admin only)

### NFT Integration APIs

#### POST /api/nft/mint
Mint a new NFT for a card

#### GET /api/nft/{tokenId}
Get NFT details

#### POST /api/nft/transfer
Transfer NFT ownership

### Marketplace APIs

#### GET /api/marketplace/listings
Get all active marketplace listings

#### POST /api/marketplace/listings
Create a new marketplace listing

#### DELETE /api/marketplace/listings/{listingId}
Remove a marketplace listing

#### POST /api/marketplace/purchase
Purchase a listed card

### Trading APIs

#### POST /api/trades/offers
Create a new trade offer

#### GET /api/trades/offers
Get trade offers for the current user

#### PUT /api/trades/offers/{offerId}
Accept or reject a trade offer

### Auction APIs

#### POST /api/auctions
Create a new auction

#### GET /api/auctions
Get active auctions

#### POST /api/auctions/{auctionId}/bids
Place a bid on an auction

### Portfolio APIs

#### GET /api/portfolio
Get current user's portfolio

#### GET /api/portfolio/history
Get portfolio value history

### Real-time APIs

#### WebSocket Connection
Connect to real-time updates

**Endpoint:** `wss://api.ece-platform.com/ws`

**Events:**
- `trade.completed`: Notifies when a trade is completed
- `auction.bid`: Notifies when a new bid is placed
- `card.minted`: Notifies when a new card is minted as NFT
- `portfolio.update`: Notifies when portfolio value changes

## Authentication and Authorization

### JWT Token Structure

### Role-based Access Control

#### User Roles
1. **Standard User**: Basic access to platform features
2. **Verified User**: Enhanced features after identity verification
3. **Premium User**: Additional features and benefits
4. **Moderator**: Content moderation and user management
5. **Administrator**: Full system access and configuration

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
  	"message": "Invalid input data"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Authentication required or failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `INTERNAL_ERROR`: Internal server error
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded

## Rate Limiting

### API Rate Limits
- **Anonymous Requests**: 100 requests per hour
- **Authenticated Requests**: 1000 requests per hour
- **Special Endpoints**: 
  - NFT minting: 10 requests per hour
  - Trading: 100 requests per hour

## Versioning

### Current Version
- **Version**: v1
- **Status**: Stable

## Integration Guidelines

For detailed integration examples and SDKs, please refer to the developer portal at https://developers.ece-platform.com
