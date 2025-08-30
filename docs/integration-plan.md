# Frontend-Backend Integration Plan

## Executive Summary
This document outlines all missing connections between frontend, backend, and middleware layers in the ECE Trading Cards Platform, with a prioritized action plan for implementation.

## Critical Issues Identified

### 1. Database Layer Issues
**Status:** 🔴 **Critical**

#### Problems:
- Database connection is completely mocked (`src/lib/db/index.ts` line 35: `export const db = null`)
- Prisma client is commented out and not initialized
- All data operations use in-memory mock storage
- No data persistence across server restarts

#### Required Actions:
- [ ] Enable Prisma client initialization in `src/lib/db/index.ts`
- [ ] Run Prisma migrations to create database schema
- [ ] Replace all mock database calls with Prisma queries
- [ ] Implement proper connection pooling

### 2. Authentication System
**Status:** 🔴 **Critical**

#### Problems:
- Auth routes use placeholder JWT tokens (no actual signing/verification)
- No session management or token refresh logic
- User credentials not validated against database
- Missing auth middleware for protected routes

#### Required Actions:
- [ ] Implement JWT token generation with proper secret key
- [ ] Add token verification middleware
- [ ] Create session management system
- [ ] Implement password hashing (bcrypt)
- [ ] Add auth guards to protected API routes

### 3. API Routes Database Integration
**Status:** 🔴 **Critical**

#### Problems:
- Cards API (`/api/cards/route.ts`) uses mock database
- Marketplace APIs not connected to Prisma
- User APIs not persisting data
- Transaction APIs not recording to database

#### Required Actions:
- [ ] Update cards API to use Prisma queries
- [ ] Connect marketplace routes to database
- [ ] Implement user CRUD operations with Prisma
- [ ] Add transaction recording to database

### 4. Missing Middleware Layers
**Status:** 🟡 **High Priority**

#### Problems:
- No authentication middleware
- Missing error handling middleware
- No request validation middleware
- No rate limiting
- No logging middleware

#### Required Actions:
- [ ] Create auth middleware (`src/middleware/auth.ts`)
- [ ] Add error handling middleware
- [ ] Implement request validation (Zod)
- [ ] Add rate limiting for API routes
- [ ] Set up structured logging (Winston/Pino)

### 5. Environment Configuration
**Status:** 🟡 **High Priority**

#### Problems:
- Database URL may not be correctly configured
- JWT secret not defined in environment
- API keys for third-party services missing
- No environment validation

#### Required Actions:
- [ ] Verify DATABASE_URL in `.env`
- [ ] Add JWT_SECRET to environment
- [ ] Configure all required API keys
- [ ] Add environment variable validation on startup

### 6. Frontend API Integration
**Status:** 🟡 **High Priority**

#### Problems:
- Frontend components may not be calling correct API endpoints
- Missing error handling in API calls
- No loading states for async operations
- No optimistic updates

#### Required Actions:
- [ ] Audit all frontend API calls
- [ ] Add proper error handling with user feedback
- [ ] Implement loading states
- [ ] Add retry logic for failed requests

### 7. WebSocket/Real-time Features
**Status:** 🟠 **Medium Priority**

#### Problems:
- No WebSocket implementation for real-time updates
- Missing live auction updates
- No real-time battle status
- No live notifications

#### Required Actions:
- [ ] Implement Socket.io or similar
- [ ] Add real-time auction updates
- [ ] Implement live battle tracking
- [ ] Create notification system

### 8. File Upload/Storage
**Status:** 🟠 **Medium Priority**

#### Problems:
- No file upload handling for card images
- Missing cloud storage integration
- No image optimization

#### Required Actions:
- [ ] Implement file upload API
- [ ] Integrate cloud storage (S3/Cloudinary)
- [ ] Add image optimization pipeline

## Implementation Priority Order

### Phase 1: Core Infrastructure (Week 1)
1. **Enable Prisma Database Connection**
   - Uncomment and fix Prisma client initialization
   - Run migrations
   - Test database connectivity

2. **Implement Authentication System**
   - JWT token generation and verification
   - Password hashing
   - Session management

3. **Create Essential Middleware**
   - Auth middleware
   - Error handling
   - Request validation

### Phase 2: API Integration (Week 2)
4. **Connect APIs to Database**
   - Cards API
   - Auth API
   - User API
   - Marketplace APIs

5. **Environment Configuration**
   - Validate all environment variables
   - Set up proper secrets
   - Configure development vs production

### Phase 3: Frontend Integration (Week 3)
6. **Update Frontend API Calls**
   - Audit and fix all API endpoints
   - Add error handling
   - Implement loading states

7. **Testing & Validation**
   - End-to-end testing
   - API integration tests
   - Frontend component tests

### Phase 4: Enhanced Features (Week 4)
8. **Real-time Features**
   - WebSocket implementation
   - Live updates

9. **File Handling**
   - Upload system
   - Cloud storage

## Code Changes Required

### 1. Fix Database Connection (`apps/ece-web/src/lib/db/index.ts`)
```typescript
// BEFORE (line 35):
export const db = null

// AFTER:
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}
```

### 2. Create Auth Middleware (`apps/ece-web/src/middleware/auth.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    // Attach user to request
    return NextResponse.next()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

### 3. Update Cards API (`apps/ece-web/src/app/api/cards/route.ts`)
```typescript
// Replace mock database calls with Prisma
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const cards = await db.card.findMany({
    where: filters,
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit
  })
  
  return NextResponse.json({ cards })
}
```

## Testing Checklist

### Unit Tests
- [ ] Database connection tests
- [ ] Auth middleware tests
- [ ] API route tests
- [ ] Utility function tests

### Integration Tests
- [ ] Frontend to API communication
- [ ] Database operations
- [ ] Auth flow end-to-end
- [ ] File upload flow

### E2E Tests
- [ ] User registration and login
- [ ] Card creation and listing
- [ ] Marketplace operations
- [ ] Battle and betting flows

## Success Metrics
- ✅ All API routes connected to database
- ✅ Authentication working end-to-end
- ✅ Frontend successfully communicating with backend
- ✅ Data persisting across sessions
- ✅ All tests passing
- ✅ No console errors in production

## Next Steps
1. Review this plan with the team
2. Create feature branches for each phase
3. Begin Phase 1 implementation
4. Daily progress updates
5. Weekly integration testing

## Notes
- Prioritize security in auth implementation
- Ensure backward compatibility during migration
- Maintain mock data for testing purposes
- Document all API changes
