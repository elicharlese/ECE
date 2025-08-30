// Powerup Service - Core powerup operations and business logic
// /apps/ece-web/src/services/powerupService.ts

import { prisma } from '@/lib/db';
import { 
  PowerupType, 
  UserPowerup, 
  CardPowerup, 
  PowerupEffect,
  PowerupCategory,
  PowerupRarity,
  PowerupEffectType,
  ModifierType,
  PowerupSource,
  PowerupAction,
  PowerupHistory
} from '@/types/powerups';

export class PowerupService {
  
  // =======================================
  // POWERUP TYPE MANAGEMENT
  // =======================================
  
  /**
   * Get all available powerup types
   */
  static async getAllPowerupTypes(): Promise<PowerupType[]> {
    return await prisma.powerupType.findMany({
      where: { isActive: true },
      orderBy: [
        { rarity: 'desc' },
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
  }
  
  /**
   * Get powerup types by category and rarity
   */
  static async getPowerupsByFilter(
    category?: PowerupCategory, 
    rarity?: PowerupRarity,
    searchTerm?: string
  ): Promise<PowerupType[]> {
    const where: any = { isActive: true };
    
    if (category) where.category = category;
    if (rarity) where.rarity = rarity;
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { displayName: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }
    
    return await prisma.powerupType.findMany({
      where,
      orderBy: [
        { rarity: 'desc' },
        { name: 'asc' }
      ]
    });
  }
  
  /**
   * Get powerup type by ID with full details
   */
  static async getPowerupTypeById(id: string): Promise<PowerupType | null> {
    return await prisma.powerupType.findUnique({
      where: { id },
      include: {
        userInventory: {
          include: { user: true }
        },
        cardApplications: {
          include: { card: true }
        }
      }
    });
  }
  
  // =======================================
  // USER POWERUP INVENTORY
  // =======================================
  
  /**
   * Get user's powerup inventory
   */
  static async getUserPowerupInventory(userId: string): Promise<UserPowerup[]> {
    return await prisma.userPowerup.findMany({
      where: { userId },
      include: {
        powerupType: true
      },
      orderBy: [
        { powerupType: { rarity: 'desc' } },
        { level: 'desc' },
        { acquiredAt: 'desc' }
      ]
    });
  }
  
  /**
   * Add powerup to user inventory
   */
  static async addPowerupToInventory(
    userId: string,
    powerupId: string,
    quantity: number = 1,
    source: PowerupSource = PowerupSource.PURCHASE,
    sourceId?: string
  ): Promise<UserPowerup> {
    // Check if user already has this powerup
    const existingPowerup = await prisma.userPowerup.findUnique({
      where: {
        userId_powerupId: {
          userId,
          powerupId
        }
      }
    });
    
    if (existingPowerup) {
      // Update quantity
      return await prisma.userPowerup.update({
        where: { id: existingPowerup.id },
        data: {
          quantity: existingPowerup.quantity + quantity
        },
        include: { powerupType: true }
      });
    } else {
      // Create new inventory entry
      const newPowerup = await prisma.userPowerup.create({
        data: {
          userId,
          powerupId,
          quantity,
          acquiredFrom: source,
          sourceId
        },
        include: { powerupType: true }
      });
      
      // Log the acquisition
      await this.logPowerupAction(userId, powerupId, PowerupAction.ACQUIRED, {
        quantity,
        source,
        sourceId
      });
      
      return newPowerup;
    }
  }
  
  /**
   * Remove powerup from user inventory
   */
  static async removePowerupFromInventory(
    userId: string,
    powerupId: string,
    quantity: number = 1
  ): Promise<boolean> {
    const userPowerup = await prisma.userPowerup.findUnique({
      where: {
        userId_powerupId: {
          userId,
          powerupId
        }
      }
    });
    
    if (!userPowerup || userPowerup.quantity < quantity) {
      return false;
    }
    
    const newQuantity = userPowerup.quantity - quantity;
    
    if (newQuantity <= 0) {
      // Remove completely
      await prisma.userPowerup.delete({
        where: { id: userPowerup.id }
      });
    } else {
      // Update quantity
      await prisma.userPowerup.update({
        where: { id: userPowerup.id },
        data: { quantity: newQuantity }
      });
    }
    
    return true;
  }
  
  // =======================================
  // CARD POWERUP APPLICATION
  // =======================================
  
  /**
   * Apply powerup to a card
   */
  static async applyPowerupToCard(
    userId: string,
    cardId: string,
    powerupId: string,
    config?: any
  ): Promise<CardPowerup | null> {
    // Verify user owns the powerup
    const userPowerup = await prisma.userPowerup.findUnique({
      where: {
        userId_powerupId: {
          userId,
          powerupId
        }
      },
      include: { powerupType: true }
    });
    
    if (!userPowerup || userPowerup.quantity < 1) {
      throw new Error('User does not own this powerup');
    }
    
    // Verify user owns the card
    const card = await prisma.card.findFirst({
      where: { id: cardId, ownerId: userId }
    });
    
    if (!card) {
      throw new Error('User does not own this card');
    }
    
    // Check if powerup is already applied (if not stackable)
    if (!userPowerup.powerupType.stackable) {
      const existingApplication = await prisma.cardPowerup.findFirst({
        where: {
          cardId,
          powerupId,
          isActive: true
        }
      });
      
      if (existingApplication) {
        throw new Error('Powerup is already applied to this card');
      }
    }
    
    // Calculate expiration time
    let expiresAt: Date | null = null;
    if (userPowerup.powerupType.duration) {
      expiresAt = new Date(Date.now() + userPowerup.powerupType.duration * 1000);
    }
    
    // Apply powerup to card
    const cardPowerup = await prisma.cardPowerup.create({
      data: {
        cardId,
        powerupId,
        appliedBy: userId,
        expiresAt,
        customConfig: config
      },
      include: {
        powerupType: true,
        card: true
      }
    });
    
    // Create powerup effects
    await this.createPowerupEffects(cardPowerup);
    
    // Remove powerup from inventory (if consumable)
    if (!userPowerup.powerupType.stackable) {
      await this.removePowerupFromInventory(userId, powerupId, 1);
    }
    
    // Log the application
    await this.logPowerupAction(userId, powerupId, PowerupAction.APPLIED, {
      cardId,
      config
    });
    
    return cardPowerup;
  }
  
  /**
   * Remove powerup from card
   */
  static async removePowerupFromCard(
    userId: string,
    cardId: string,
    cardPowerupId: string
  ): Promise<boolean> {
    const cardPowerup = await prisma.cardPowerup.findFirst({
      where: {
        id: cardPowerupId,
        cardId,
        card: { ownerId: userId }
      },
      include: { powerupType: true }
    });
    
    if (!cardPowerup) {
      return false;
    }
    
    // Deactivate powerup
    await prisma.cardPowerup.update({
      where: { id: cardPowerupId },
      data: { isActive: false }
    });
    
    // Deactivate all effects
    await prisma.powerupEffect.updateMany({
      where: { cardPowerupId },
      data: { isActive: false }
    });
    
    // Log the removal
    await this.logPowerupAction(userId, cardPowerup.powerupId, PowerupAction.REMOVED, {
      cardId,
      cardPowerupId
    });
    
    return true;
  }
  
  /**
   * Get all powerups applied to a card
   */
  static async getCardPowerups(cardId: string): Promise<CardPowerup[]> {
    return await prisma.cardPowerup.findMany({
      where: {
        cardId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        powerupType: true,
        effects: {
          where: { isActive: true }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });
  }
  
  // =======================================
  // POWERUP EFFECTS
  // =======================================
  
  /**
   * Create powerup effects from powerup type definition
   */
  private static async createPowerupEffects(cardPowerup: any): Promise<void> {
    const effects = cardPowerup.powerupType.effects as any[];
    
    for (const effectDef of effects) {
      await prisma.powerupEffect.create({
        data: {
          cardId: cardPowerup.cardId,
          cardPowerupId: cardPowerup.id,
          effectType: effectDef.type,
          targetStat: effectDef.targetStat,
          modifier: effectDef.modifier,
          modifierType: effectDef.modifierType || 'ADD',
          endsAt: cardPowerup.expiresAt,
          isPermanent: !cardPowerup.expiresAt,
          triggerCondition: effectDef.triggerCondition,
          triggerValue: effectDef.triggerValue,
          remainingTriggers: effectDef.maxTriggers,
          visualIndicator: effectDef.visualIndicator,
          description: effectDef.description
        }
      });
    }
  }
  
  /**
   * Calculate card stats with powerup effects applied
   */
  static async calculateCardStatsWithPowerups(cardId: string): Promise<any> {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        appliedPowerups: {
          where: { isActive: true },
          include: {
            effects: { where: { isActive: true } }
          }
        }
      }
    });
    
    if (!card) return null;
    
    const baseStats = card.stats as any || {};
    const modifiedStats = { ...baseStats };
    
    // Apply all active effects
    for (const powerup of card.appliedPowerups) {
      for (const effect of powerup.effects) {
        const statValue = modifiedStats[effect.targetStat] || 0;
        
        switch (effect.modifierType) {
          case 'ADD':
            modifiedStats[effect.targetStat] = statValue + effect.modifier;
            break;
          case 'MULTIPLY':
            modifiedStats[effect.targetStat] = statValue * effect.modifier;
            break;
          case 'PERCENT_INCREASE':
            modifiedStats[effect.targetStat] = statValue * (1 + effect.modifier / 100);
            break;
          case 'SET':
            modifiedStats[effect.targetStat] = effect.modifier;
            break;
        }
      }
    }
    
    return {
      baseStats,
      modifiedStats,
      appliedPowerups: card.appliedPowerups
    };
  }
  
  // =======================================
  // POWERUP HISTORY & ANALYTICS
  // =======================================
  
  /**
   * Log powerup action for analytics
   */
  private static async logPowerupAction(
    userId: string,
    powerupId: string,
    action: PowerupAction,
    actionData?: any,
    cardId?: string
  ): Promise<void> {
    await prisma.powerupHistory.create({
      data: {
        userId,
        powerupId,
        cardId,
        action,
        actionData
      }
    });
  }
  
  /**
   * Get user powerup usage analytics
   */
  static async getUserPowerupAnalytics(userId: string): Promise<any> {
    const history = await prisma.powerupHistory.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    
    const analytics = {
      totalActions: history.length,
      recentActions: history.slice(0, 10),
      actionsByType: {} as Record<PowerupAction, number>,
      mostUsedPowerups: {} as Record<string, number>,
      effectivenessScore: 0
    };
    
    // Process analytics
    history.forEach((entry: PowerupHistory & { user: any }) => {
      // Count actions by type
      analytics.actionsByType[entry.action] = 
        (analytics.actionsByType[entry.action] || 0) + 1;
      
      // Count powerup usage
      analytics.mostUsedPowerups[entry.powerupId] = 
        (analytics.mostUsedPowerups[entry.powerupId] || 0) + 1;
    });
    
    return analytics;
  }
  
  // =======================================
  // POWERUP CLEANUP & MAINTENANCE
  // =======================================
  
  /**
   * Clean up expired powerups
   */
  static async cleanupExpiredPowerups(): Promise<number> {
    const now = new Date();
    
    // Deactivate expired card powerups
    const { count: expiredPowerups } = await prisma.cardPowerup.updateMany({
      where: {
        isActive: true,
        expiresAt: { lt: now }
      },
      data: { isActive: false }
    });
    
    // Deactivate related effects
    await prisma.powerupEffect.updateMany({
      where: {
        isActive: true,
        endsAt: { lt: now }
      },
      data: { isActive: false }
    });
    
    return expiredPowerups;
  }
  
  /**
   * Get powerup recommendations for user
   */
  static async getPowerupRecommendations(userId: string): Promise<PowerupType[]> {
    // Get user's cards and current powerups
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownedCards: {
          include: {
            appliedPowerups: {
              where: { isActive: true },
              include: { powerupType: true }
            }
          }
        },
        powerupInventory: {
          include: { powerupType: true }
        }
      }
    });
    
    if (!user) return [];
    
    // Simple recommendation algorithm
    // 1. Find powerups that complement user's cards
    // 2. Exclude powerups user already has
    // 3. Prioritize by rarity and effectiveness
    
    const ownedPowerupIds = user.powerupInventory.map((p: UserPowerup) => p.powerupId);
    const appliedPowerupIds = user.ownedCards
      .flatMap((card: any) => card.appliedPowerups)
      .map((p: CardPowerup) => p.powerupId);
    
    const excludedIds = [...new Set([...ownedPowerupIds, ...appliedPowerupIds])];
    
    return await prisma.powerupType.findMany({
      where: {
        isActive: true,
        id: { notIn: excludedIds }
      },
      orderBy: [
        { rarity: 'desc' },
        { name: 'asc' }
      ],
      take: 10
    });
  }
}
