# ECE Trading Cards API Documentation

## Overview
This directory contains comprehensive API documentation for the ECE Trading Cards application. The API follows RESTful principles and provides endpoints for all core functionality across web, mobile, and desktop platforms.

## API Structure

### Authentication
All API endpoints except public ones require authentication via JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Base URL
- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging-api.ece-trading.com/api`
- **Production**: `https://api.ece-trading.com/api`

## Core Endpoints

### Authentication & Users
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /users/profile` - Update user profile
- `DELETE /users/account` - Delete user account

### Trading Cards
- `GET /cards` - List all cards with filtering
- `GET /cards/:id` - Get specific card details
- `POST /cards` - Create new card (admin only)
- `PUT /cards/:id` - Update card (admin only)
- `DELETE /cards/:id` - Delete card (admin only)
- `GET /cards/search` - Search cards

### Marketplace
- `GET /marketplace/listings` - Get marketplace listings
- `POST /marketplace/create-listing` - Create new listing
- `PUT /marketplace/listings/:id` - Update listing
- `DELETE /marketplace/listings/:id` - Delete listing
- `POST /marketplace/purchase` - Purchase card
- `GET /marketplace/my-listings` - User's listings

### Wallet & Transactions
- `GET /wallet/balance` - Get wallet balance
- `GET /wallet/transactions` - Transaction history
- `POST /wallet/deposit` - Deposit funds
- `POST /wallet/withdraw` - Withdraw funds
- `POST /wallet/transfer` - Transfer between users

### Social Features
- `GET /social/profiles` - Browse user profiles
- `POST /social/match` - Create profile match
- `GET /social/matches` - Get user matches
- `POST /social/message` - Send message
- `GET /social/messages` - Get messages

### Betting & Crowdfunding
- `GET /betting/events` - Get betting events
- `POST /betting/place-bet` - Place a bet
- `GET /betting/my-bets` - User's betting history
- `POST /crowdfunding/create-campaign` - Create campaign
- `POST /crowdfunding/contribute` - Contribute to campaign

## Response Format
All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Error Handling
Error responses include appropriate HTTP status codes and detailed error messages:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

## Rate Limiting
- **Public endpoints**: 100 requests per 15 minutes
- **Authenticated endpoints**: 1000 requests per 15 minutes
- **Admin endpoints**: 5000 requests per 15 minutes

## Documentation Files

### Detailed Specifications
- `authentication.md` - Authentication flows and security
- `cards.md` - Trading card endpoints and schemas
- `marketplace.md` - Marketplace functionality
- `wallet.md` - Financial transaction endpoints
- `social.md` - Social features and matching
- `betting.md` - Betting and gambling features
- `crowdfunding.md` - Crowdfunding campaign management
- `admin.md` - Administrative endpoints
- `webhooks.md` - Webhook notifications
- `schemas.md` - Complete data schemas

### Integration Guides
- `getting-started.md` - Quick start guide for developers
- `postman-collection.md` - Postman collection setup
- `sdk-documentation.md` - Official SDK documentation
- `testing.md` - API testing strategies

---

For complete API specifications, see the individual endpoint documentation files in this directory.
