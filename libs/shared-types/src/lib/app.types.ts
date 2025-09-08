// App State Types
export interface AppState {
  user: UserState;
  portfolio: PortfolioState;
  market: MarketState;
  trading: TradingState;
  ui: UIState;
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    trading: boolean;
    marketing: boolean;
  };
  privacy: {
    showPortfolio: boolean;
    showTradingHistory: boolean;
    allowDirectMessages: boolean;
  };
}

export interface PortfolioState {
  portfolios: Portfolio[];
  activePortfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface MarketState {
  cards: TradingCard[];
  marketData: Record<string, MarketData>;
  trendingCards: TradingCard[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  filters: SearchFilters;
}

export interface TradingState {
  activeTrades: Trade[];
  tradeHistory: Trade[];
  pendingOffers: TradeOffer[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface UIState {
  currentScreen: string;
  isNavigating: boolean;
  modals: {
    [key: string]: boolean;
  };
  notifications: Notification[];
  toast: ToastMessage | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: ToastAction[];
}

export interface ToastAction {
  label: string;
  action: () => void;
}

// Navigation Types
export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  params: Record<string, any>;
  history: string[];
}

// Platform-specific Types
export interface PlatformCapabilities {
  hasCamera: boolean;
  hasNFC: boolean;
  hasBiometrics: boolean;
  hasNotifications: boolean;
  hasFileSystem: boolean;
  hasClipboard: boolean;
  hasShare: boolean;
  platform: 'web' | 'mobile' | 'desktop';
}

// Configuration Types
export interface AppConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  features: {
    trading: boolean;
    socialFeatures: boolean;
    analytics: boolean;
    notifications: boolean;
    offlineMode: boolean;
  };
  limits: {
    maxPortfolios: number;
    maxCardsPerPortfolio: number;
    maxTradesPerDay: number;
    maxOfferDuration: number;
  };
}

// Form Types
export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

// Component Props Types
import { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  testId?: string;
  children?: ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export interface ErrorProps extends BaseComponentProps {
  error: string | Error | null;
  onRetry?: () => void;
  showRetry?: boolean;
}

// Event Types
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: string;
  source: 'user' | 'system' | 'external';
}

export interface UserEvent extends AppEvent {
  userId: string;
  sessionId: string;
}

// Storage Types
export interface StorageItem<T = any> {
  key: string;
  value: T;
  expiresAt?: number;
  encrypted?: boolean;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  strategy: 'lru' | 'fifo' | 'ttl';
}

// Sync Types
export interface SyncState {
  isOnline: boolean;
  lastSync: string | null;
  pendingChanges: number;
  syncInProgress: boolean;
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  id: string;
  type: 'user' | 'portfolio' | 'trade';
  localData: any;
  remoteData: any;
  timestamp: string;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: string;
  platform: string;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  errorRate: number;
  crashRate: number;
  memoryUsage: number;
}

// Import types from api.types.ts and trading.ts
import type {
  User,
  Portfolio,
  TradingCard,
  MarketData,
  SearchFilters,
  Trade,
  Notification
} from './api.types';
import type { TradeOffer } from './trading';
