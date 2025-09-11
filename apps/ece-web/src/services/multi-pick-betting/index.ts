import { PrismaClient } from '@prisma/client'';
import { PrismaClient } from '@prisma/client'';

export interface BetPick {
  marketId: string;
  position: PredictionDirection;
  odds: number;
}

export interface BetCombinationRequest {
  userId: string;
  picks: BetPick[];
  stake: number;
}

export interface CombinationResult {
  combinationId: string;
  totalStake: number;
  totalOdds: number;
  potentialWinnings: number;
  picks: BetPick[];
}

export class MultiPickBettingService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create a multi-pick bet combination (Prize Picks style)
   */
  async createBetCombination(request: BetCombinationRequest): Promise<CombinationResult> {
    const { userId, picks, stake } = request;

    // Validate user has sufficient balance
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.eceBalance < stake) {
      throw new Error('Insufficient balance');
    }

    // Validate all markets exist and are active
    for (const pick of picks) {
      const market = await this.prisma.bettingMarket.findUnique({
        where: { id: pick.marketId }
      });

      if (!market) {
        throw new Error(`Market ${pick.marketId} not found`);
      }

      if (market.status !== MarketStatus.ACTIVE) {
        throw new Error(`Market ${pick.marketId} is not active`);
      }

      if (market.expiryDate && market.expiryDate <= new Date()) {
        throw new Error(`Market ${pick.marketId} has expired`);
      }
    }

    // Calculate total odds and potential winnings
    const totalOdds = this.calculateCombinationOdds(picks);
    const potentialWinnings = stake * totalOdds;

    // Generate unique combination ID
    const combinationId = this.generateCombinationId();

    // Create the combination
    const combination = await this.prisma.betCombination.create({
      data: {
        userId,
        combinationId,
        totalStake: stake,
        totalOdds,
        potentialWinnings,
        status: CombinationStatus.ACTIVE,
        picks: {
          create: picks.map(pick => ({
            marketId: pick.marketId,
            position: pick.position,
            odds: pick.odds,
            settled: false
          }))
        }
      },
      include: {
        picks: true
      }
    });

    // Deduct stake from user balance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        eceBalance: { decrement: stake }
      }
    });

    // Create transaction record
    await this.prisma.transaction.create({
      data: {
        userId,
        amount: stake,
        type: 'PURCHASE',
        currency: 'ECE',
        status: 'COMPLETED',
        description: `Multi-pick bet combination: ${combinationId}`,
        metadata: {
          combinationId,
          picksCount: picks.length,
          totalOdds,
          potentialWinnings
        }
      }
    });

    return {
      combinationId,
      totalStake: stake,
      totalOdds,
      potentialWinnings,
      picks
    };
  }

  /**
   * Calculate odds for a combination of picks
   */
  calculateCombinationOdds(picks: BetPick[]): number {
    // For Prize Picks style, multiply all individual odds
    return picks.reduce((total, pick) => total * pick.odds, 1.0);
  }

  /**
   * Settle a bet combination
   */
  async settleBetCombination(combinationId: string): Promise<void> {
    const combination = await this.prisma.betCombination.findUnique({
      where: { combinationId },
      include: {
        picks: {
          include: {
            market: true
          }
        },
        user: true
      }
    });

    if (!combination) {
      throw new Error('Combination not found');
    }

    if (combination.settled) {
      return; // Already settled
    }

    // Check if all picks are settled
    const unsettledPicks = combination.picks.filter(pick => !pick.settled);
    if (unsettledPicks.length > 0) {
      throw new Error('Not all picks have been settled yet');
    }

    // Determine if combination won
    const won = combination.picks.every(pick => pick.won === true);

    let winnings = 0;
    if (won) {
      winnings = combination.potentialWinnings;
      
      // Credit winnings to user
      await this.prisma.user.update({
        where: { id: combination.userId },
        data: {
          eceBalance: { increment: winnings }
        }
      });

      // Create payout transaction
      await this.prisma.transaction.create({
        data: {
          userId: combination.userId,
          amount: winnings,
          type: 'REWARD',
          currency: 'ECE',
          status: 'COMPLETED',
          description: `Multi-pick bet winnings: ${combinationId}`,
          metadata: {
            combinationId,
            originalStake: combination.totalStake,
            totalOdds: combination.totalOdds
          }
        }
      });
    }

    // Update combination status
    await this.prisma.betCombination.update({
      where: { id: combination.id },
      data: {
        settled: true,
        won,
        actualWinnings: winnings,
        status: CombinationStatus.SETTLED
      }
    });
  }

  /**
   * Settle individual picks when markets resolve
   */
  async settleIndividualPicks(marketId: string): Promise<void> {
    const market = await this.prisma.bettingMarket.findUnique({
      where: { id: marketId },
      include: {
        settlement: true
      }
    });

    if (!market || !market.settlement) {
      throw new Error('Market settlement not found');
    }

    // Get all unsettled picks for this market
    const unsettledPicks = await this.prisma.betPick.findMany({
      where: {
        marketId,
        settled: false
      },
      include: {
        combination: true
      }
    });

    for (const pick of unsettledPicks) {
      // Determine if pick won
      const won = this.determinePickOutcome(pick, market.settlement);

      // Update pick
      await this.prisma.betPick.update({
        where: { id: pick.id },
        data: {
          settled: true,
          won
        }
      });

      // Check if combination can be settled
      await this.checkCombinationSettlement(pick.combinationId);
    }
  }

  /**
   * Get user's active combinations
   */
  async getUserCombinations(userId: string): Promise<any[]> {
    const combinations = await this.prisma.betCombination.findMany({
      where: {
        userId,
        status: CombinationStatus.ACTIVE
      },
      include: {
        picks: {
          include: {
            market: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return combinations.map(combo => ({
      id: combo.id,
      combinationId: combo.combinationId,
      totalStake: combo.totalStake,
      totalOdds: combo.totalOdds,
      potentialWinnings: combo.potentialWinnings,
      picks: combo.picks.map(pick => ({
        marketId: pick.marketId,
        marketTitle: pick.market.title,
        position: pick.position,
        odds: pick.odds,
        settled: pick.settled,
        won: pick.won
      })),
      createdAt: combo.createdAt
    }));
  }

  /**
   * Get combination statistics
   */
  async getCombinationStatistics(userId: string): Promise<any> {
    const combinations = await this.prisma.betCombination.findMany({
      where: { userId },
      include: {
        picks: true
      }
    });

    const totalCombinations = combinations.length;
    const settledCombinations = combinations.filter(c => c.settled);
    const wonCombinations = settledCombinations.filter(c => c.won);

    const totalStaked = combinations.reduce((sum, c) => sum + c.totalStake, 0);
    const totalWon = wonCombinations.reduce((sum, c) => sum + (c.actualWinnings || 0), 0);
    const netProfit = totalWon - totalStaked;

    const winRate = settledCombinations.length > 0 
      ? wonCombinations.length / settledCombinations.length 
      : 0;

    const avgOdds = combinations.length > 0 
      ? combinations.reduce((sum, c) => sum + c.totalOdds, 0) / combinations.length 
      : 0;

    return {
      totalCombinations,
      settledCombinations: settledCombinations.length,
      wonCombinations: wonCombinations.length,
      winRate,
      totalStaked,
      totalWon,
      netProfit,
      avgOdds,
      avgStake: combinations.length > 0 ? totalStaked / combinations.length : 0
    };
  }

  /**
   * Cancel a combination (if allowed)
   */
  async cancelCombination(combinationId: string, userId: string): Promise<void> {
    const combination = await this.prisma.betCombination.findFirst({
      where: {
        combinationId,
        userId,
        settled: false
      }
    });

    if (!combination) {
      throw new Error('Combination not found or already settled');
    }

    // Check if any markets have already expired
    const picks = await this.prisma.betPick.findMany({
      where: { combinationId: combination.id },
      include: { market: true }
    });

    const expiredMarkets = picks.filter(pick => 
      pick.market.expiryDate && pick.market.expiryDate <= new Date()
    );

    if (expiredMarkets.length > 0) {
      throw new Error('Cannot cancel combination with expired markets');
    }

    // Refund stake
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        eceBalance: { increment: combination.totalStake }
      }
    });

    // Update combination status
    await this.prisma.betCombination.update({
      where: { id: combination.id },
      data: {
        status: CombinationStatus.CANCELLED
      }
    });

    // Create refund transaction
    await this.prisma.transaction.create({
      data: {
        userId,
        amount: combination.totalStake,
        type: 'REFUND',
        currency: 'ECE',
        status: 'COMPLETED',
        description: `Cancelled bet combination: ${combinationId}`,
        metadata: { combinationId }
      }
    });
  }

  // Private helper methods

  private generateCombinationId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `MP-${timestamp}-${random}`.toUpperCase();
  }

  private determinePickOutcome(pick: any, settlement: any): boolean {
    // Simple outcome determination based on settlement
    if (settlement.settledValue === null) {
      return false;
    }

    const targetValue = pick.market.predictionTarget;
    const settledValue = settlement.settledValue;

    if (pick.position === PredictionDirection.UP) {
      return settledValue >= targetValue;
    } else {
      return settledValue < targetValue;
    }
  }

  private async checkCombinationSettlement(combinationId: string): Promise<void> {
    const combination = await this.prisma.betCombination.findUnique({
      where: { id: combinationId },
      include: {
        picks: true
      }
    });

    if (!combination || combination.settled) {
      return;
    }

    // Check if all picks are settled
    const allSettled = combination.picks.every(pick => pick.settled);
    
    if (allSettled) {
      await this.settleBetCombination(combination.combinationId);
    }
  }

  /**
   * Get popular market combinations for recommendations
   */
  async getPopularCombinations(): Promise<any[]> {
    // Get most popular pick combinations from recent successful bets
    const recentCombinations = await this.prisma.betCombination.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        },
        won: true
      },
      include: {
        picks: {
          include: {
            market: true
          }
        }
      },
      take: 50
    });

    // Group by pick patterns and count frequency
    const patternCounts: { [key: string]: any } = {};

    for (const combo of recentCombinations) {
      const pattern = combo.picks
        .sort((a, b) => a.marketId.localeCompare(b.marketId))
        .map(pick => `${pick.marketId}:${pick.position}`)
        .join('|');

      if (!patternCounts[pattern]) {
        patternCounts[pattern] = {
          pattern,
          picks: combo.picks,
          count: 0,
          avgOdds: 0,
          totalWinnings: 0
        };
      }

      patternCounts[pattern].count++;
      patternCounts[pattern].avgOdds += combo.totalOdds;
      patternCounts[pattern].totalWinnings += combo.actualWinnings || 0;
    }

    // Return top patterns
    return Object.values(patternCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)
      .map((pattern: any) => ({
        ...pattern,
        avgOdds: pattern.avgOdds / pattern.count,
        successRate: pattern.count / recentCombinations.length
      }));
  }
}
