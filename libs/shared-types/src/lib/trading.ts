// Trading shared types centralized for Trade Offers

// Aligns with Prisma enums
export type TradeOfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELED' | 'EXPIRED'
export type TradeOfferItemRole = 'FROM_SENDER' | 'FROM_RECEIVER'

// Card summary used by trading UI
export interface CardSummary {
  id: string
  name: string
  category: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'
  imageUrl: string
  valuation: number
}

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
