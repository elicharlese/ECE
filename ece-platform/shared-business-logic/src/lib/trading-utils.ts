import { TradingCard, User, Transaction, Trade } from '@ece-platform/shared-types';

// Card Utilities
export class CardUtils {
  static calculateRarityMultiplier(rarity: TradingCard['rarity']): number {
    const multipliers = {
      common: 1,
      uncommon: 1.5,
      rare: 2.5,
      epic: 4,
      legendary: 10
    };
    return multipliers[rarity];
  }

  static calculateCardValue(card: TradingCard): number {
    const baseValue = card.price;
    const rarityMultiplier = this.calculateRarityMultiplier(card.rarity);
    const statsBonus = this.calculateStatsBonus(card);
    
    return baseValue * rarityMultiplier * (1 + statsBonus);
  }

  static calculateStatsBonus(card: TradingCard): number {
    if (!card.stats) return 0;
    
    const { attack = 0, defense = 0, speed = 0, health = 0, mana = 0 } = card.stats;
    const totalStats = attack + defense + speed + health + mana;
    
    // Bonus based on total stats (0.1% per stat point)
    return Math.min(totalStats * 0.001, 0.5); // Cap at 50% bonus
  }

  static getCardsByRarity(cards: TradingCard[], rarity: TradingCard['rarity']): TradingCard[] {
    return cards.filter(card => card.rarity === rarity);
  }

  static sortCardsByValue(cards: TradingCard[]): TradingCard[] {
    return [...cards].sort((a, b) => this.calculateCardValue(b) - this.calculateCardValue(a));
  }
}

// Trading Logic
export class TradingEngine {
  static validateTrade(trade: Trade, seller: User, buyer?: User): { valid: boolean; error?: string } {
    // Check if seller exists
    if (!seller) {
      return { valid: false, error: 'Seller not found' };
    }

    // Check if trade is still open
    if (trade.status !== 'open') {
      return { valid: false, error: 'Trade is no longer available' };
    }

    // Check if buyer is not the seller
    if (buyer && buyer.id === seller.id) {
      return { valid: false, error: 'Cannot buy your own card' };
    }

    // Check minimum price
    if (trade.price < 0.01) {
      return { valid: false, error: 'Invalid trade price' };
    }

    return { valid: true };
  }

  static calculateTradeFee(price: number, plan: 'free' | 'pro' | 'enterprise' = 'free'): number {
    const feeRates = {
      free: 0.05,      // 5%
      pro: 0.03,       // 3%
      enterprise: 0.01 // 1%
    };
    
    return price * feeRates[plan];
  }

  static calculateNetAmount(price: number, plan: 'free' | 'pro' | 'enterprise' = 'free'): number {
    const fee = this.calculateTradeFee(price, plan);
    return price - fee;
  }
}

// Wallet Management
export class WalletManager {
  static canAfford(wallet: { balance: number }, amount: number): boolean {
    return wallet.balance >= amount;
  }

  static calculateNewBalance(currentBalance: number, transaction: Transaction): number {
    switch (transaction.type) {
      case 'deposit':
      case 'sale':
      case 'reward':
        return currentBalance + transaction.amount;
      
      case 'withdrawal':
      case 'purchase':
        return currentBalance - transaction.amount;
      
      case 'trade':
        // Trade amount can be positive or negative depending on context
        return currentBalance + transaction.amount;
      
      default:
        return currentBalance;
    }
  }

  static validateTransaction(transaction: Transaction, currentBalance: number): { valid: boolean; error?: string } {
    // Check for negative amounts (except trades which can be negative)
    if (transaction.amount < 0 && transaction.type !== 'trade') {
      return { valid: false, error: 'Transaction amount cannot be negative' };
    }

    // Check sufficient balance for debit transactions
    const debitTypes = ['withdrawal', 'purchase'];
    if (debitTypes.includes(transaction.type) && currentBalance < transaction.amount) {
      return { valid: false, error: 'Insufficient balance' };
    }

    // Check minimum transaction amount
    if (Math.abs(transaction.amount) < 0.01) {
      return { valid: false, error: 'Transaction amount too small' };
    }

    return { valid: true };
  }
}

// Analytics Utilities
export class AnalyticsUtils {
  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  static calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return (part / total) * 100;
  }

  static calculateMovingAverage(values: number[], period: number): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < values.length; i++) {
      if (i < period - 1) {
        result.push(values[i]);
        continue;
      }
      
      const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
    
    return result;
  }

  static findTrend(values: number[]): 'up' | 'down' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const first = values[0];
    const last = values[values.length - 1];
    const threshold = 0.05; // 5% threshold for stability
    
    const change = (last - first) / first;
    
    if (Math.abs(change) < threshold) return 'stable';
    return change > 0 ? 'up' : 'down';
  }
}

// Validation Utilities
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUsername(username: string): boolean {
    // Username: 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  static isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateCardName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Card name is required' };
    }
    
    if (name.length > 100) {
      return { valid: false, error: 'Card name too long (max 100 characters)' };
    }
    
    return { valid: true };
  }

  static validatePrice(price: number): { valid: boolean; error?: string } {
    if (price < 0) {
      return { valid: false, error: 'Price cannot be negative' };
    }
    
    if (price > 1000000) {
      return { valid: false, error: 'Price too high (max $1,000,000)' };
    }
    
    return { valid: true };
  }
}

// Date and Time Utilities
export class DateUtils {
  static formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  }

  static isRecent(date: Date, hours: number = 24): boolean {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffInHours <= hours;
  }

  static getDateRange(days: number): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    return { start, end };
  }
}
