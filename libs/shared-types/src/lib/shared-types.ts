export function sharedTypes(): string {
  return 'shared-types';
}

// Core User Types
export interface User {
  id: string;
  walletAddress: string;
  name?: string;
  email?: string;
  eceBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  name: string;
  userId: string;
  totalValue: number;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

// Trading Card Types
export interface Card {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  rarity: CardRarity;
  price: number;
  category: string;
  valuation?: number;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardSummary {
  id: string;
  name: string;
  imageUrl: string;
  rarity: CardRarity;
  price: number;
  category: string;
  valuation?: number;
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Trade Offer Types
export interface TradeOffer {
  id: string;
  senderId: string;
  receiverId: string;
  status: TradeOfferStatus;
  items: TradeOfferItem[];
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeOfferItem {
  id: string;
  tradeOfferId: string;
  cardId: string;
  role: TradeOfferItemRole;
}

export type TradeOfferStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type TradeOfferItemRole = 'offered' | 'requested';

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: 'ECE' | 'USDC';
  status: TransactionStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export type TransactionType = 'purchase' | 'sale' | 'trade' | 'mint' | 'burn';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

// Marketplace Types
export interface MarketplaceListing {
  id: string;
  cardId: string;
  sellerId: string;
  price: number;
  currency: 'ECE' | 'USDC';
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ListingStatus = 'active' | 'sold' | 'cancelled' | 'expired';

// Bid Types
export interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  amount: number;
  currency: 'ECE' | 'USDC';
  status: BidStatus;
  createdAt: Date;
}

export type BidStatus = 'active' | 'accepted' | 'rejected' | 'withdrawn';
