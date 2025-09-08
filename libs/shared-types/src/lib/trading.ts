// Trading shared types centralized for Trade Offers

// Aligns with Prisma enums
export type TradeOfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELED' | 'EXPIRED'
export type TradeOfferItemRole = 'FROM_SENDER' | 'FROM_RECEIVER'

// Import CardSummary from shared-types to avoid conflicts
import { CardSummary } from './shared-types';

// Frontend representation of a trade offer
export interface TradeOffer {
  id: string
  offeringUserId: string
  offeringUserName: string
  offeringUserAvatar?: string
  receivingUserId: string
  receivingUserName: string
  receivingUserAvatar?: string
  offeredCard: CardSummary
  requestedCard?: CardSummary
  offeredAmount?: number
  requestedAmount?: number
  status: TradeOfferStatus
  message?: string
  createdAt: string
  expiresAt: string
}

export const TRADE_OFFER_STATUSES: TradeOfferStatus[] = [
  'PENDING',
  'ACCEPTED',
  'DECLINED',
  'CANCELED',
  'EXPIRED',
]
