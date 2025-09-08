// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  role: 'user' | 'admin' | 'moderator';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

// Trading Card Types
export interface TradingCard {
  id: string;
  companyId: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'tech' | 'finance' | 'healthcare' | 'energy' | 'retail' | 'other';
  marketCap: number;
  dealValue?: number;
  dealType?: 'acquisition' | 'merger' | 'ipo' | 'spinoff';
  dealDate?: string;
  stats: {
    power: number;
    growth: number;
    stability: number;
    innovation: number;
  };
  metadata: {
    ceo: string;
    founded: string;
    headquarters: string;
    employees: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  cards: PortfolioCard[];
  totalValue: number;
  performance: {
    dailyChange: number;
    weeklyChange: number;
    monthlyChange: number;
    allTimeChange: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioCard {
  cardId: string;
  quantity: number;
  averageCost: number;
  currentValue: number;
  acquiredAt: string;
}

// Trading Types
export interface Trade {
  id: string;
  sellerId: string;
  buyerId?: string;
  cardId: string;
  quantity: number;
  pricePerCard: number;
  totalPrice: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  type: 'buy' | 'sell';
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// TradeOffer interface moved to trading.ts to avoid conflicts

// Market Types
export interface MarketData {
  cardId: string;
  currentPrice: number;
  priceHistory: PricePoint[];
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  lastUpdated: string;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'trade' | 'offer' | 'system' | 'achievement';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string[];
  rarity?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'name' | 'price' | 'rarity' | 'marketCap' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchResults<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  filters: SearchFilters;
}

// Analytics Types
export interface UserAnalytics {
  userId: string;
  totalPortfolioValue: number;
  totalTrades: number;
  successfulTrades: number;
  averageTradeValue: number;
  favoriteCategories: string[];
  tradingStreak: number;
  achievements: Achievement[];
  performanceMetrics: {
    roi: number;
    winRate: number;
    avgHoldTime: number;
    bestPerformingCard: string;
    worstPerformingCard: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'price_update' | 'trade_update' | 'notification' | 'user_online' | 'user_offline';
  data: any;
  timestamp: string;
}

export interface PriceUpdateMessage {
  cardId: string;
  newPrice: number;
  change: number;
  changePercent: number;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
