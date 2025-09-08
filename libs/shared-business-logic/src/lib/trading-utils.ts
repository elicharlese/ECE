// Simplified trading utilities with working types
export interface SimpleCard {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  baseValue: number;
  stats: {
    power: number;
    growth: number;
    stability: number;
    innovation: number;
  };
}

export interface SimpleTrade {
  id: string;
  cardId: string;
  sellerId: string;
  buyerId?: string;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SimpleTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  description: string;
  timestamp: string;
  status: string;
}

// Card Utilities
export class CardUtils {
  static calculateRarityMultiplier(rarity: SimpleCard['rarity']): number {
    const multipliers = {
      common: 1,
      uncommon: 1.5,
      rare: 2.5,
      epic: 4,
      legendary: 10
    };
    return multipliers[rarity] || 1;
  }

  static calculateCardValue(card: SimpleCard): number {
    const baseValue = card.baseValue;
    const rarityMultiplier = this.calculateRarityMultiplier(card.rarity);
    const statsBonus = this.calculateStatsBonus(card);
    
    return Math.round(baseValue * rarityMultiplier * (1 + statsBonus));
  }

  private static calculateStatsBonus(card: SimpleCard): number {
    if (!card.stats) return 0;
    
    const { power = 0, growth = 0, stability = 0, innovation = 0 } = card.stats;
    const totalStats = power + growth + stability + innovation;
    
    // Bonus based on total stats (0.1% per stat point)
    return totalStats * 0.001;
  }

  static getCardsByRarity(cards: SimpleCard[], rarity: SimpleCard['rarity']): SimpleCard[] {
    return cards.filter(card => card.rarity === rarity);
  }

  static sortCardsByValue(cards: SimpleCard[]): SimpleCard[] {
    return cards.sort((a, b) => this.calculateCardValue(b) - this.calculateCardValue(a));
  }
}

// Trading Utilities
export class TradingUtils {
  static validateTrade(trade: SimpleTrade): { valid: boolean; error?: string } {
    if (!trade) {
      return { valid: false, error: 'Trade object is required' };
    }

    // Check if trade is still active
    if (trade.status !== 'active') {
      return { valid: false, error: 'Trade is no longer available' };
    }

    // Check if buyer and seller are different
    if (trade.buyerId === trade.sellerId) {
      return { valid: false, error: 'Cannot trade with yourself' };
    }

    // Check minimum price
    if (trade.amount < 0.01) {
      return { valid: false, error: 'Invalid trade price' };
    }

    return { valid: true };
  }

  static calculateTradeFee(amount: number, feePercentage: number = 0.025): number {
    return Math.round(amount * feePercentage * 100) / 100;
  }

  static calculateNetAmount(amount: number, feePercentage: number = 0.025): number {
    const fee = this.calculateTradeFee(amount, feePercentage);
    return amount - fee;
  }
}

// Portfolio Utilities
export class PortfolioUtils {
  static calculatePortfolioValue(cards: SimpleCard[]): number {
    return cards.reduce((total, card) => total + CardUtils.calculateCardValue(card), 0);
  }

  static getPortfolioDistribution(cards: SimpleCard[]): Record<SimpleCard['rarity'], number> {
    const distribution = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };

    cards.forEach(card => {
      distribution[card.rarity]++;
    });

    return distribution;
  }

  static generateTransaction(trade: SimpleTrade, userId: string): SimpleTransaction {
    return {
      id: `txn_${Date.now()}`,
      userId: userId,
      type: 'trade',
      amount: trade.amount,
      description: `Trade: ${trade.cardId}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  }
}

// Analytics Utilities
export class AnalyticsUtils {
  static calculateUserStats(transactions: SimpleTransaction[]): {
    totalTrades: number;
    totalSpent: number;
    totalEarned: number;
    averageTradeValue: number;
  } {
    const trades = transactions.filter(t => t.type === 'trade');
    const spent = trades.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const earned = trades.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTrades: trades.length,
      totalSpent: spent,
      totalEarned: earned,
      averageTradeValue: trades.length > 0 ? (spent + earned) / trades.length : 0
    };
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
