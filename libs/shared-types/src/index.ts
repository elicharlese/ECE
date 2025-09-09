// Core Type Definitions
export * from './lib/shared-types';
export * from './lib/trading';

// API Types (selective export to avoid conflicts)
export type { ApiResponse, ApiError } from './lib/api.types';

// Crypto & Blockchain Types  
export * from './crypto';

// Re-export commonly used Prisma types for convenience
export type {
  User,
  Card,
  Transaction,
  MarketplaceListing,
  Bid
} from '@prisma/client';
