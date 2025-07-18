// Powerup Type Definitions
// /apps/ece-web/src/types/powerups.ts

// =======================================
// CORE POWERUP TYPES
// =======================================

export interface PowerupType {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: PowerupCategory;
  rarity: PowerupRarity;
  
  // Visual & Effects
  iconUrl?: string;
  animationUrl?: string;
  effectColor?: string;
  glowEffect: boolean;
  particleEffect?: string;
  
  // Gameplay Effects
  effects: PowerupEffectDefinition[];
  duration?: number; // seconds, null = permanent
  cooldown?: number; // seconds
  stackable: boolean;
  maxStacks: number;
  
  // Acquisition & Economics
  baseCost?: number;
  craftable: boolean;
  tradeable: boolean;
  
  // Metadata
  version: string;
  isActive: boolean;
  releaseDate: Date;
  deprecatedAt?: Date;
  
  // Relations
  userInventory?: UserPowerup[];
  cardApplications?: CardPowerup[];
  craftingRecipes?: PowerupRecipe[];
  marketListings?: PowerupMarketListing[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerupEffectDefinition {
  type: PowerupEffectType;
  targetStat: string;
  modifier: number;
  modifierType: ModifierType;
  description?: string;
  visualIndicator?: string;
  triggerCondition?: string;
  triggerValue?: number;
  maxTriggers?: number;
}

// =======================================
// USER POWERUP INVENTORY
// =======================================

export interface UserPowerup {
  id: string;
  userId: string;
  powerupId: string;
  quantity: number;
  
  // Acquisition
  acquiredAt: Date;
  acquiredFrom: PowerupSource;
  sourceId?: string;
  
  // Enhancement & Progression
  level: number;
  experience: number;
  masteryLevel: number;
  
  // Metadata
  isLocked: boolean;
  notes?: string;
  tags: string[];
  
  // Relations
  user?: any; // User type
  powerupType?: PowerupType;
  
  createdAt: Date;
  updatedAt: Date;
}

// =======================================
// CARD POWERUP APPLICATION
// =======================================

export interface CardPowerup {
  id: string;
  cardId: string;
  powerupId: string;
  appliedBy: string;
  
  // Application Details
  appliedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  
  // Powerup State
  level: number;
  stackCount: number;
  effectiveness: number;
  
  // Cooldown Management
  lastActivated?: Date;
  cooldownEnds?: Date;
  usageCount: number;
  maxUsages?: number;
  
  // Custom Configuration
  customConfig?: any;
  
  // Relations
  card?: any; // Card type
  powerupType?: PowerupType;
  effects?: PowerupEffect[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerupEffect {
  id: string;
  cardId: string;
  cardPowerupId: string;
  
  // Effect Definition
  effectType: PowerupEffectType;
  targetStat: string;
  modifier: number;
  modifierType: ModifierType;
  
  // Timing & Duration
  startedAt: Date;
  endsAt?: Date;
  isActive: boolean;
  isPermanent: boolean;
  
  // Conditional Effects
  triggerCondition?: string;
  triggerValue?: number;
  remainingTriggers?: number;
  
  // Visual & Feedback
  visualIndicator?: string;
  description?: string;
  
  // Relations
  card?: any; // Card type
  cardPowerup?: CardPowerup;
  
  createdAt: Date;
  updatedAt: Date;
}

// =======================================
// POWERUP MARKETPLACE
// =======================================

export interface PowerupMarketListing {
  id: string;
  sellerId: string;
  powerupId: string;
  
  // Listing Details
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  listingType: PowerupListingType;
  
  // Auction Details
  auctionEnd?: Date;
  currentBid?: number;
  bidIncrement?: number;
  reservePrice?: number;
  
  // Status
  status: PowerupListingStatus;
  viewCount: number;
  watcherCount: number;
  
  // Relations
  powerupType?: PowerupType;
  purchases?: PowerupPurchase[];
  trades?: PowerupTrade[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerupPurchase {
  id: string;
  buyerId: string;
  listingId?: string;
  powerupId: string;
  
  // Purchase Details
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  paymentMethod: string;
  
  // Status
  status: PurchaseStatus;
  completedAt?: Date;
  
  // Relations
  buyer?: any; // User type
  listing?: PowerupMarketListing;
  powerupType?: PowerupType;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerupTrade {
  id: string;
  initiatorId: string;
  receiverId: string;
  listingId?: string;
  
  // Trade Details
  initiatorOffer: TradeOffer[];
  receiverOffer: TradeOffer[];
  eceOffered: number;
  eceRequested: number;
  
  // Status
  status: TradeStatus;
  acceptedAt?: Date;
  completedAt?: Date;
  canceledAt?: Date;
  
  // Negotiation
  messages?: any;
  counterOffers?: any;
  
  // Relations
  initiator?: any; // User type
  listing?: PowerupMarketListing;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeOffer {
  powerupId: string;
  quantity: number;
}

// =======================================
// POWERUP CRAFTING
// =======================================

export interface PowerupRecipe {
  id: string;
  resultId: string;
  name: string;
  description?: string;
  
  // Recipe Requirements
  ingredients: CraftingIngredient[];
  eceRequired: number;
  
  // Crafting Mechanics
  craftTime: number;
  successRate: number;
  maxPerDay?: number;
  
  // Access Control
  requiredLevel: number;
  requiredBadge?: string;
  isActive: boolean;
  
  // Analytics
  craftCount: number;
  successCount: number;
  
  // Relations
  result?: PowerupType;
  crafts?: PowerupCraft[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CraftingIngredient {
  powerupId: string;
  quantity: number;
}

export interface PowerupCraft {
  id: string;
  userId: string;
  recipeId: string;
  
  // Crafting Session
  startedAt: Date;
  completedAt?: Date;
  successful?: boolean;
  
  // Resources Used
  ingredientsUsed: CraftingIngredient[];
  eceSpent: number;
  
  // Results
  resultPowerupId?: string;
  bonusRewards?: any;
  
  // Relations
  user?: any; // User type
  recipe?: PowerupRecipe;
}

// =======================================
// ANALYTICS & INSIGHTS
// =======================================

export interface PowerupHistory {
  id: string;
  userId: string;
  cardId?: string;
  powerupId: string;
  
  // Action Details
  action: PowerupAction;
  actionData?: any;
  timestamp: Date;
  
  // Context
  contextType?: PowerupContext;
  contextId?: string;
  
  // Performance Tracking
  effectiveness?: number;
  outcomeData?: any;
  
  // Relations
  user?: any; // User type
  card?: any; // Card type
}

export interface PowerupAnalytics {
  id: string;
  powerupId: string;
  
  // Usage Statistics
  totalApplications: number;
  activeApplications: number;
  successRate: number;
  
  // Market Data
  averagePrice: number;
  marketVolume: number;
  demandScore: number;
  popularityRank?: number;
  
  // Performance Metrics
  effectivenessScore: number;
  userSatisfaction: number;
  retentionRate: number;
  
  // Time Period
  periodStart: Date;
  periodEnd: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// =======================================
// UI COMPONENT TYPES
// =======================================

export interface PowerupCardProps {
  powerup: PowerupType;
  quantity?: number;
  isOwned?: boolean;
  onApply?: (powerupId: string) => void;
  onPurchase?: (powerupId: string) => void;
  className?: string;
}

export interface PowerupSlotProps {
  cardId: string;
  slotIndex: number;
  appliedPowerup?: CardPowerup;
  onPowerupApply?: (powerupId: string) => void;
  onPowerupRemove?: (cardPowerupId: string) => void;
  className?: string;
}

export interface PowerupInventoryProps {
  userId: string;
  powerups: UserPowerup[];
  onPowerupSelect?: (powerup: UserPowerup) => void;
  onPowerupApply?: (powerupId: string, cardId: string) => void;
  className?: string;
}

export interface CardStatsWithPowerups {
  baseStats: Record<string, number>;
  modifiedStats: Record<string, number>;
  appliedPowerups: CardPowerup[];
}

// =======================================
// API RESPONSE TYPES
// =======================================

export interface PowerupApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}

export interface PowerupFilterParams {
  category?: PowerupCategory;
  rarity?: PowerupRarity;
  search?: string;
  userId?: string;
  cardId?: string;
}

// =======================================
// ENUMS
// =======================================

export enum PowerupCategory {
  COMBAT = 'COMBAT',
  DEFENSE = 'DEFENSE',
  UTILITY = 'UTILITY',
  SPECIAL = 'SPECIAL',
  LEGENDARY = 'LEGENDARY',
  TEMPORAL = 'TEMPORAL',
  ELEMENTAL = 'ELEMENTAL',
  MYSTICAL = 'MYSTICAL',
  TECHNOLOGICAL = 'TECHNOLOGICAL',
  ECONOMIC = 'ECONOMIC'
}

export enum PowerupRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
  MYTHIC = 'MYTHIC',
  ARTIFACT = 'ARTIFACT'
}

export enum PowerupSource {
  PURCHASE = 'PURCHASE',
  CRAFT = 'CRAFT',
  TRADE = 'TRADE',
  REWARD = 'REWARD',
  ACHIEVEMENT = 'ACHIEVEMENT',
  EVENT = 'EVENT',
  QUEST = 'QUEST',
  AIRDROP = 'AIRDROP',
  GENESIS = 'GENESIS'
}

export enum PowerupEffectType {
  STAT_BOOST = 'STAT_BOOST',
  DAMAGE_AMPLIFY = 'DAMAGE_AMPLIFY',
  DEFENSE_BOOST = 'DEFENSE_BOOST',
  SPEED_INCREASE = 'SPEED_INCREASE',
  CRITICAL_CHANCE = 'CRITICAL_CHANCE',
  REGENERATION = 'REGENERATION',
  SHIELD = 'SHIELD',
  STEALTH = 'STEALTH',
  TELEPORT = 'TELEPORT',
  TIME_MANIPULATION = 'TIME_MANIPULATION',
  ELEMENT_INFUSION = 'ELEMENT_INFUSION',
  MIND_CONTROL = 'MIND_CONTROL',
  REALITY_WARP = 'REALITY_WARP',
  DUPLICATION = 'DUPLICATION',
  PHASE_SHIFT = 'PHASE_SHIFT',
  OMNISCIENCE = 'OMNISCIENCE'
}

export enum ModifierType {
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  SET = 'SET',
  PERCENT_INCREASE = 'PERCENT_INCREASE',
  PERCENT_DECREASE = 'PERCENT_DECREASE'
}

export enum PowerupAction {
  ACQUIRED = 'ACQUIRED',
  APPLIED = 'APPLIED',
  REMOVED = 'REMOVED',
  UPGRADED = 'UPGRADED',
  CRAFTED = 'CRAFTED',
  TRADED = 'TRADED',
  SOLD = 'SOLD',
  PURCHASED = 'PURCHASED',
  ACTIVATED = 'ACTIVATED',
  EXPIRED = 'EXPIRED'
}

export enum PowerupContext {
  BATTLE = 'BATTLE',
  TRADE = 'TRADE',
  MARKETPLACE = 'MARKETPLACE',
  CRAFTING = 'CRAFTING',
  QUEST = 'QUEST',
  EVENT = 'EVENT',
  TRAINING = 'TRAINING',
  TOURNAMENT = 'TOURNAMENT'
}

export enum PowerupListingType {
  FIXED_PRICE = 'FIXED_PRICE',
  AUCTION = 'AUCTION',
  TRADE_ONLY = 'TRADE_ONLY',
  BUNDLE = 'BUNDLE'
}

export enum PowerupListingStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  RESERVED = 'RESERVED'
}

export enum PurchaseStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum TradeStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED'
}

// =======================================
// UTILITY TYPES
// =======================================

export type PowerupFilter = Partial<{
  category: PowerupCategory[];
  rarity: PowerupRarity[];
  priceRange: [number, number];
  tradeable: boolean;
  craftable: boolean;
  owned: boolean;
}>;

export type PowerupSortBy = 
  | 'name'
  | 'rarity'
  | 'price'
  | 'popularity'
  | 'effectiveness'
  | 'createdAt';

export type PowerupSortOrder = 'asc' | 'desc';
