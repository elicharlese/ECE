// Database Schema for ECE Trading Cards Platform
// This defines all the data structures for our Tinder-like card trading app

export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  profileImage?: string
  eceBalance: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  badges: ECEBadge[]
  isVerified: boolean
  location?: string
  preferences: UserPreferences
  subscription: UserSubscription
  role: 'user' | 'admin' | 'moderator'
  createdAt: Date
  updatedAt: Date
}

export interface UserSubscription {
  id: string
  userId: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'canceled' | 'expired' | 'trial'
  startDate: Date
  endDate?: Date
  trialEndDate?: Date
  features: SubscriptionFeatures
  usage: SubscriptionUsage
  billingCycle: 'monthly' | 'yearly'
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionFeatures {
  // Pro Features
  earlyMarketplaceAccess: boolean
  realTimeAlerts: boolean
  superLikesPerMonth: number
  boostsPerMonth: number
  enhancedUI: boolean
  dataReports: boolean
  businessStipend: number // ECE amount
  aiSuggestions: boolean
  
  // Enterprise Features
  multiAppAccess: boolean
  priority247Support: boolean
  customIntegrations: boolean
  dedicatedAccountManager: boolean
  customReporting: boolean
  whiteLabeling: boolean
}

export interface SubscriptionUsage {
  userId: string
  month: string // YYYY-MM format
  superLikesUsed: number
  boostsUsed: number
  stipendUsed: number
  alertsReceived: number
  reportsGenerated: number
}

export interface UserPreferences {
  userId: string
  enableBidding: boolean
  enableBetting: boolean
  enableBattling: boolean
  maxBidAmount?: number
  maxBetAmount?: number
  autoBoosts: boolean
  notificationSettings: NotificationSettings
}

export interface NotificationSettings {
  pushNotifications: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  socialUpdates: boolean
  tradingAlerts: boolean
  realTimeAlerts: boolean // Pro feature
  ipoAlerts: boolean // Pro feature
  priceAlerts: boolean
}

export interface Notification {
  id: string
  userId: string
  type: 'market' | 'social' | 'trading' | 'ipo' | 'price_alert' | 'system'
  title: string
  message: string
  data?: any
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requiresSubscription?: 'pro' | 'enterprise'
  createdAt: Date
}

export interface MarketplaceListing {
  id: string
  cardId: string
  sellerId: string
  type: 'sale' | 'auction' | 'ipo' | 'pre_ipo'
  status: 'active' | 'sold' | 'canceled' | 'expired'
  price: number
  startingBid?: number
  currentBid?: number
  buyNowPrice?: number
  endTime?: Date
  isEarlyAccess: boolean // Pro/Enterprise only
  earlyAccessEndTime?: Date
  views: number
  watchers: string[] // user IDs
  bids: Bid[]
  createdAt: Date
  updatedAt: Date
}

export interface Card {
  id: string
  name: string
  description: string
  imageUrl: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  category: string
  company: string
  valuation: number
  marketCap?: number
  volume24h?: number
  priceChange24h?: number
  attributes: CardAttribute[]
  metadata: CardMetadata
  ownerId?: string
  isListed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CardAttribute {
  trait_type: string
  value: string | number
  displayType?: 'boost_number' | 'boost_percentage' | 'number' | 'date'
}

export interface CardMetadata {
  edition?: string
  serialNumber?: number
  totalSupply?: number
  artist?: string
  releaseDate?: Date
  externalUrl?: string
}

export interface ECEBadge {
  id: string
  name: string
  description: string
  iconUrl: string
  color: string
  requirement: string
  earnedAt: Date
  userId: string
}

export interface Listing {
  id: string
  cardId: string
  sellerId: string
  price: number
  currency: 'ECE' | 'USD'
  listingType: 'fixed' | 'auction' | 'bid'
  status: 'active' | 'sold' | 'cancelled' | 'expired'
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Bid {
  id: string
  cardId: string
  listingId?: string
  bidderId: string
  amount: number
  currency: 'ECE' | 'USD'
  status: 'active' | 'accepted' | 'rejected' | 'expired'
  message?: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface Bet {
  id: string
  title: string
  description: string
  category: 'crowdfunding' | 'performance' | 'market' | 'achievement'
  targetCardId?: string
  targetCompany?: string
  condition: string
  targetValue: number
  currentValue?: number
  odds: number
  totalPool: number
  participantCount: number
  creatorId: string
  status: 'active' | 'completed' | 'cancelled'
  resolution?: 'won' | 'lost' | 'draw'
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface BetParticipant {
  id: string
  betId: string
  userId: string
  amount: number
  side: 'for' | 'against'
  odds: number
  potentialPayout: number
  status: 'active' | 'won' | 'lost' | 'refunded'
  createdAt: Date
}

export interface Battle {
  id: string
  title: string
  description: string
  card1Id: string
  card2Id: string
  metric: 'valuation' | 'volume' | 'growth' | 'performance'
  duration: number // in hours
  entryFee: number
  totalPrizePool: number
  participantCount: number
  creatorId: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  winnerId?: string
  results?: BattleResults
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface BattleResults {
  card1Score: number
  card2Score: number
  winnerCardId: string
  finalMetric: number
  participants: BattleParticipant[]
}

export interface BattleParticipant {
  id: string
  battleId: string
  userId: string
  chosenCardId: string
  amount: number
  payout?: number
  status: 'active' | 'won' | 'lost'
  createdAt: Date
}

export interface Transaction {
  id: string
  fromUserId?: string
  toUserId?: string
  cardId?: string
  amount: number
  currency: 'ECE' | 'USD'
  type: 'trade' | 'purchase' | 'bid' | 'bet' | 'battle' | 'boost' | 'deposit' | 'withdrawal'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  reference?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Watchlist {
  id: string
  userId: string
  cardId: string
  priceAlert?: number
  notifyOnListing: boolean
  notes?: string
  createdAt: Date
}

export interface UserInteraction {
  id: string
  userId: string
  cardId: string
  action: 'view' | 'like' | 'pass' | 'boost' | 'super_like'
  metadata?: Record<string, any>
  createdAt: Date
}

export interface SocialFeed {
  id: string
  userId: string
  type: 'trade' | 'purchase' | 'achievement' | 'milestone' | 'battle_win' | 'bet_win'
  content: string
  cardId?: string
  metadata?: Record<string, any>
  likes: number
  comments: SocialComment[]
  isPublic: boolean
  createdAt: Date
}

export interface SocialComment {
  id: string
  feedId: string
  userId: string
  content: string
  likes: number
  createdAt: Date
}

export interface Chat {
  id: string
  participants: string[] // user IDs
  type: 'direct' | 'group' | 'trade_negotiation'
  lastMessage?: string
  lastMessageAt?: Date
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'card_offer' | 'trade_proposal'
  metadata?: Record<string, any>
  readBy: string[] // user IDs who have read this message
  createdAt: Date
}

export interface Boost {
  id: string
  userId: string
  cardId?: string
  type: 'profile' | 'card' | 'discovery'
  duration: number // in hours
  cost: number
  status: 'active' | 'expired' | 'cancelled'
  effects: BoostEffect[]
  activatedAt: Date
  expiresAt: Date
}

export interface BoostEffect {
  type: 'visibility' | 'priority' | 'featured' | 'highlight'
  multiplier: number
  description: string
}

export interface MarketData {
  cardId: string
  currentPrice: number
  volume24h: number
  volume7d: number
  priceChange24h: number
  priceChange7d: number
  marketCap: number
  holders: number
  transactions24h: number
  highestSale: number
  lowestSale: number
  averagePrice: number
  updatedAt: Date
}

export interface QuickOrder {
  id: string
  userId: string
  cardId: string
  type: 'buy' | 'sell'
  quantity: number
  pricePerCard: number
  totalAmount: number
  status: 'pending' | 'partial' | 'completed' | 'cancelled'
  filledQuantity: number
  executedAt?: Date
  expiresAt: Date
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter and Search Types
export interface CardFilters {
  category?: string
  company?: string
  rarity?: string[]
  priceMin?: number
  priceMax?: number
  sortBy?: 'price' | 'rarity' | 'popularity' | 'recent'
  sortOrder?: 'asc' | 'desc'
}

export interface UserFilters {
  tier?: string[]
  location?: string
  hasCards?: boolean
  verified?: boolean
}
