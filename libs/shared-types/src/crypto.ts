// ECE Token Payment System Types

export interface ECETokenContract {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  totalSupply: string;
  chainId: number;
}

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  provider: string; // 'metamask' | 'walletconnect' | 'coinbase'
  balance: string;
  eceBalance: string;
}

export interface CryptoTransaction {
  id: string;
  hash?: string;
  from: string;
  to: string;
  amount: string;
  currency: 'ECE' | 'ETH' | 'USDC' | 'USDT';
  type: 'payment' | 'purchase' | 'withdrawal' | 'deposit' | 'conversion';
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  blockNumber?: number;
  gasUsed?: string;
  gasFee?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  amount: string;
  currency: 'ECE' | 'USD';
  description: string;
  recipientAddress?: string;
  expiresAt?: Date;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  paymentMethod: 'crypto' | 'fiat' | 'mixed';
  createdAt: Date;
}

export interface ConversionRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: Date;
  source: string; // 'chainlink' | 'coingecko' | 'manual'
  volatilityIndex?: number;
}

export interface FiscalLimit {
  id: string;
  userId: string;
  limitType: 'daily' | 'weekly' | 'monthly' | 'per_transaction';
  currency: string;
  amount: number;
  currentUsage: number;
  resetDate?: Date;
  isActive: boolean;
}

export interface KYCData {
  id: string;
  userId: string;
  level: 'basic' | 'intermediate' | 'advanced';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  documents: {
    type: 'passport' | 'drivers_license' | 'id_card' | 'proof_of_address';
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  verificationDate?: Date;
  expiryDate?: Date;
  riskScore?: number;
}

export interface SecuritySettings {
  id: string;
  userId: string;
  twoFactorEnabled: boolean;
  multiSigEnabled: boolean;
  withdrawalWhitelist: string[];
  sessionTimeout: number;
  maxDailyTransactions: number;
  requiresApprovalAbove: number;
  coldWalletThreshold: number;
}

export interface AdminCryptoOverview {
  totalECECirculating: string;
  totalUSDValue: number;
  dailyVolume: number;
  activeWallets: number;
  pendingTransactions: number;
  averageTransactionSize: number;
  topHolders: {
    address: string;
    balance: string;
    percentage: number;
  }[];
  priceHistory: {
    timestamp: Date;
    price: number;
    volume: number;
  }[];
}

export interface SwapQuote {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  slippage: number;
  priceImpact: number;
  gasEstimate: string;
  route: string[];
  validUntil: Date;
  provider: string;
}

export interface StakingPosition {
  id: string;
  userId: string;
  amount: string;
  currency: string;
  stakingPool: string;
  apr: number;
  lockPeriod: number; // days
  startDate: Date;
  maturityDate: Date;
  rewards: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
}

// Webhook types for external integrations
export interface WebhookPayload {
  type: 'payment_confirmed' | 'payment_failed' | 'kyc_approved' | 'limit_exceeded';
  data: Record<string, any>;
  timestamp: Date;
  signature: string;
}

// Error types
export class CryptoPaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'CryptoPaymentError';
  }
}

export const CRYPTO_ERROR_CODES = {
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  KYC_REQUIRED: 'KYC_REQUIRED',
  LIMIT_EXCEEDED: 'LIMIT_EXCEEDED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  SLIPPAGE_EXCEEDED: 'SLIPPAGE_EXCEEDED'
} as const;
