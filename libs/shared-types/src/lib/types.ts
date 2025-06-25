// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Trading Card Types
export interface TradingCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  series: string;
  category: string;
  price: number;
  stats?: CardStats;
  attributes?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardStats {
  attack?: number;
  defense?: number;
  speed?: number;
  health?: number;
  mana?: number;
}

// Wallet and Token Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  tokens: number;
  currency: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'trade' | 'reward' | 'deposit' | 'withdrawal';
  amount: number;
  cardId?: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
}

// Subscription and Plan Types
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  features: string[];
}

// Business Analytics Types
export interface AnalyticsData {
  revenue: RevenueData;
  performance: PerformanceData;
  market: MarketData;
  users: UserData;
}

export interface RevenueData {
  total: number;
  monthly: number;
  growth: number;
  breakdown: RevenueBreakdown[];
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface PerformanceData {
  activeUsers: number;
  conversionRate: number;
  retentionRate: number;
  engagementScore: number;
  kpis: KPI[];
}

export interface KPI {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface MarketData {
  competitors: Competitor[];
  trends: MarketTrend[];
  insights: string[];
}

export interface Competitor {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
}

export interface MarketTrend {
  name: string;
  growth: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

export interface UserData {
  total: number;
  active: number;
  new: number;
  churn: number;
  demographics: Demographics;
}

export interface Demographics {
  ageGroups: Record<string, number>;
  locations: Record<string, number>;
  devices: Record<string, number>;
}

// Trading and Marketplace Types
export interface Trade {
  id: string;
  sellerId: string;
  buyerId?: string;
  cardId: string;
  price: number;
  status: 'open' | 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

export interface Bid {
  id: string;
  tradeId: string;
  bidderId: string;
  amount: number;
  status: 'active' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'trade' | 'payment' | 'reward' | 'system' | 'marketing';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form and UI Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: string | number;
  message: string;
}

// Theme and Design Types
export interface Theme {
  name: string;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  animations: Animations;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Typography {
  fontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, number>;
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface Animations {
  duration: Record<string, string>;
  easing: Record<string, string>;
  keyframes: Record<string, Record<string, string>>;
}
