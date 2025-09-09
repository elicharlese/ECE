import { PrismaClient } from '../../../generated/prisma';
import { BattleMoveType, BattleRoundWinner, BattleStatus } from '../../../generated/prisma';

export interface BattleMove {
  playerId: string;
  cardId: string;
  moveType: BattleMoveType;
  powerupUsed?: string;
  targetCardId?: string;
}

export interface BattleResult {
  winner: BattleRoundWinner;
  damage: number;
  effects: any[];
  roundNumber: number;
}

export interface PowerupEffect {
  effectType: string;
  targetStat: string;
  modifier: number;
  duration?: number;
}

export class BattleEngineService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Execute a battle round with move validation and effects
   */
  async executeBattleRound(battleId: string, move: BattleMove): Promise<BattleResult> {
    // Get battle and current round
    const battle = await this.prisma.mABattle.findUnique({
      where: { id: battleId },
      include: {
        initiatorCard: true,
        targetCard: true,
        battleRounds: {
          orderBy: { roundNumber: 'desc' },
          take: 1
        }
      }
    });

    if (!battle) {
      throw new Error('Battle not found');
    }

    if (battle.status !== BattleStatus.ACTIVE) {
      throw new Error('Battle is not active');
    }

    const currentRoundNumber = battle.battleRounds[0]?.roundNumber || 0;
    const nextRoundNumber = currentRoundNumber + 1;

    // Validate move
    await this.validateMove(battle, move);

    // Calculate move effects
    const moveEffects = await this.calculateMoveEffects(move, battle);

    // Apply powerup effects if any
    const powerupEffects = move.powerupUsed 
      ? await this.applyPowerup(move.cardId, move.powerupUsed)
      : [];

    // Determine round winner and damage
    const roundResult = await this.determineRoundWinner(move, battle, moveEffects);

    // Create battle round record
    await this.prisma.battleRound.create({
      data: {
        battleId,
        roundNumber: nextRoundNumber,
        winner: roundResult.winner,
        damageDealt: roundResult.damage,
        effectsApplied: [...moveEffects, ...powerupEffects],
        startedAt: new Date(),
        endedAt: new Date()
      }
    });

    // Create battle move record
    await this.prisma.battleMove.create({
      data: {
        roundId: '', // Will be set after round creation
        playerId: move.playerId,
        cardId: move.cardId,
        moveType: move.moveType,
        powerupUsed: move.powerupUsed,
        targetCardId: move.targetCardId,
        damage: roundResult.damage,
        effects: moveEffects,
        executedAt: new Date()
      }
    });

    // Check if battle should end
    const shouldEnd = await this.shouldEndBattle(battleId, nextRoundNumber);
    if (shouldEnd) {
      await this.endBattle(battleId);
    }

    return {
      winner: roundResult.winner,
      damage: roundResult.damage,
      effects: [...moveEffects, ...powerupEffects],
      roundNumber: nextRoundNumber
    };
  }

  /**
   * Apply powerup effects to a card
   */
  async applyPowerup(cardId: string, powerupId: string): Promise<PowerupEffect[]> {
    const powerup = await this.prisma.powerupType.findUnique({
      where: { id: powerupId }
    });

    if (!powerup) {
      throw new Error('Powerup not found');
    }

    // Create powerup effect record
    const effectRecord = await this.prisma.powerupEffect.create({
      data: {
        cardId,
        effectType: powerup.effects[0]?.effectType || 'STAT_BOOST',
        targetStat: powerup.effects[0]?.targetStat || 'attack',
        modifier: powerup.effects[0]?.modifier || 1.0,
        modifierType: powerup.effects[0]?.modifierType || 'ADD',
        startedAt: new Date(),
        isActive: true
      }
    });

    return [{
      effectType: effectRecord.effectType,
      targetStat: effectRecord.targetStat,
      modifier: effectRecord.modifier,
      duration: powerup.duration || undefined
    }];
  }

  /**
   * Record comprehensive battle statistics
   */
  async recordBattleStatistics(battleId: string): Promise<void> {
    const battle = await this.prisma.mABattle.findUnique({
      where: { id: battleId },
      include: {
        battleRounds: true,
        battleMoves: true
      }
    });

    if (!battle) return;

    const rounds = battle.battleRounds;
    const moves = battle.battleMoves;

    // Calculate statistics
    const totalRounds = rounds.length;
    const totalDamage = rounds.reduce((sum, round) => sum + round.damageDealt, 0);
    const avgRoundDuration = rounds.length > 0 
      ? rounds.reduce((sum, round) => {
          const duration = round.endedAt && round.startedAt 
            ? round.endedAt.getTime() - round.startedAt.getTime() 
            : 0;
          return sum + duration;
        }, 0) / rounds.length / 1000 // Convert to seconds
      : 0;

    // Player statistics
    const initiatorMoves = moves.filter(m => m.playerId === battle.initiatorUserId);
    const targetMoves = moves.filter(m => m.playerId === battle.targetUserId);

    const initiatorStats = {
      damage: initiatorMoves.reduce((sum, move) => sum + (move.damage || 0), 0),
      moves: initiatorMoves.length,
      powerups: initiatorMoves.filter(m => m.powerupUsed).length
    };

    const targetStats = {
      damage: targetMoves.reduce((sum, move) => sum + (move.damage || 0), 0),
      moves: targetMoves.length,
      powerups: targetMoves.filter(m => m.powerupUsed).length
    };

    // Calculate powerup efficiency
    const totalPowerupsUsed = initiatorStats.powerups + targetStats.powerups;
    const powerupEfficiency = totalPowerupsUsed > 0 ? totalDamage / totalPowerupsUsed : 0;

    // Calculate move accuracy
    const successfulMoves = moves.filter(m => (m.damage || 0) > 0).length;
    const moveAccuracy = moves.length > 0 ? successfulMoves / moves.length : 0;

    // Create statistics record
    await this.prisma.battleStatistics.create({
      data: {
        battleId,
        totalRounds,
        totalDamage,
        avgRoundDuration,
        initiatorStats,
        targetStats,
        powerupEfficiency,
        moveAccuracy
      }
    });
  }

  /**
   * Update battle rankings for a user
   */
  async updateBattleRankings(userId: string): Promise<void> {
    const periods = [
      { type: 'DAILY', days: 1 },
      { type: 'WEEKLY', days: 7 },
      { type: 'MONTHLY', days: 30 },
      { type: 'ALL_TIME', days: null }
    ];

    for (const period of periods) {
      const periodStart = new Date();
      if (period.days) {
        periodStart.setDate(periodStart.getDate() - period.days);
      } else {
        periodStart.setFullYear(2020); // Far in the past for all-time
      }

      // Get user's battles in this period
      const battles = await this.prisma.mABattle.findMany({
        where: {
          OR: [
            { initiatorUserId: userId },
            { targetUserId: userId }
          ],
          createdAt: {
            gte: periodStart
          },
          status: BattleStatus.COMPLETED
        },
        include: {
          battleRounds: true
        }
      });

      if (battles.length === 0) continue;

      // Calculate statistics
      let battlesWon = 0;
      let battlesLost = 0;
      let totalDamage = 0;

      for (const battle of battles) {
        const userRounds = battle.battleRounds.filter(round => {
          // Determine if user won this round
          if (battle.initiatorUserId === userId) {
            return round.winner === BattleRoundWinner.INITIATOR;
          } else {
            return round.winner === BattleRoundWinner.TARGET;
          }
        });

        if (userRounds.length > battle.battleRounds.length / 2) {
          battlesWon++;
        } else {
          battlesLost++;
        }

        totalDamage += battle.battleRounds.reduce((sum, round) => sum + round.damageDealt, 0);
      }

      const totalBattles = battlesWon + battlesLost;
      const winRate = totalBattles > 0 ? battlesWon / totalBattles : 0;
      const averageDamage = totalBattles > 0 ? totalDamage / totalBattles : 0;

      // Calculate ranking points (simple algorithm)
      const rankingPoints = (battlesWon * 100) + (winRate * 50) + (averageDamage * 0.1);

      // Upsert ranking
      await this.prisma.battleRanking.upsert({
        where: {
          userId_periodType_periodStart: {
            userId,
            periodType: period.type as any,
            periodStart
          }
        },
        update: {
          battlesWon,
          battlesLost,
          totalBattles,
          winRate,
          averageDamage,
          rankingPoints
        },
        create: {
          userId,
          periodType: period.type as any,
          periodStart,
          periodEnd: period.days ? new Date() : null,
          battlesWon,
          battlesLost,
          totalBattles,
          winRate,
          averageDamage,
          rankingPoints
        }
      });
    }
  }

  // Private helper methods

  private async validateMove(battle: any, move: BattleMove): Promise<void> {
    // Validate card ownership
    const card = await this.prisma.card.findUnique({
      where: { id: move.cardId }
    });

    if (!card) {
      throw new Error('Card not found');
    }

    if (card.ownerId !== move.playerId) {
      throw new Error('Player does not own this card');
    }

    // Validate move is allowed in current battle state
    // Add more validation logic as needed
  }

  private async calculateMoveEffects(move: BattleMove, battle: any): Promise<any[]> {
    // Basic damage calculation based on move type
    let baseDamage = 0;
    
    switch (move.moveType) {
      case BattleMoveType.ATTACK:
        baseDamage = 50;
        break;
      case BattleMoveType.SPECIAL:
        baseDamage = 75;
        break;
      case BattleMoveType.DEFEND:
        baseDamage = 25;
        break;
      default:
        baseDamage = 0;
    }

    return [{
      type: 'damage',
      value: baseDamage,
      target: move.targetCardId || battle.targetCard.id
    }];
  }

  private async determineRoundWinner(move: BattleMove, battle: any, effects: any[]): Promise<{ winner: BattleRoundWinner, damage: number }> {
    const totalDamage = effects.reduce((sum, effect) => 
      effect.type === 'damage' ? sum + effect.value : sum, 0);

    // Simple win condition: higher damage wins
    const isInitiator = move.playerId === battle.initiatorUserId;
    
    return {
      winner: isInitiator ? BattleRoundWinner.INITIATOR : BattleRoundWinner.TARGET,
      damage: totalDamage
    };
  }

  private async shouldEndBattle(battleId: string, currentRound: number): Promise<boolean> {
    // End battle after 10 rounds or when one player has won 6 rounds
    const rounds = await this.prisma.battleRound.findMany({
      where: { battleId },
      orderBy: { roundNumber: 'desc' },
      take: 10
    });

    if (currentRound >= 10) return true;

    const initiatorWins = rounds.filter(r => r.winner === BattleRoundWinner.INITIATOR).length;
    const targetWins = rounds.filter(r => r.winner === BattleRoundWinner.TARGET).length;

    return initiatorWins >= 6 || targetWins >= 6;
  }

  private async endBattle(battleId: string): Promise<void> {
    // Determine final winner
    const rounds = await this.prisma.battleRound.findMany({
      where: { battleId }
    });

    const initiatorWins = rounds.filter(r => r.winner === BattleRoundWinner.INITIATOR).length;
    const targetWins = rounds.filter(r => r.winner === BattleRoundWinner.TARGET).length;

    const finalWinner = initiatorWins > targetWins ? 'INITIATOR' : 'TARGET';

    // Update battle status
    await this.prisma.mABattle.update({
      where: { id: battleId },
      data: {
        status: BattleStatus.COMPLETED,
        resolved: true
      }
    });

    // Record battle statistics
    await this.recordBattleStatistics(battleId);

    // Update rankings for both players
    const battle = await this.prisma.mABattle.findUnique({
      where: { id: battleId }
    });

    if (battle) {
      await this.updateBattleRankings(battle.initiatorUserId);
      if (battle.targetUserId) {
        await this.updateBattleRankings(battle.targetUserId);
      }
    }
  }
}
