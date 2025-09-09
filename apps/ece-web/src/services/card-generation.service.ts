import { CardGenerationType } from '@prisma/client';
import { TechnicalAnalysisService } from './technical-analysis.service';
import { BusinessAnalysisService } from './business-analysis.service';
import { CardArtworkService } from './card-artwork.service';

export interface CardGenerationData {
  name: string;
  description: string;
  rarity: string;
  codebaseHash?: string;
  enhancementLevel: number;
  technicalMetrics: any;
  codebaseStats: any;
  businessMetrics: any;
  basePrice: number;
  marketCap: number;
  imageUrl?: string;
  cardArtwork?: string;
  battleStats: any;
}

export class CardGenerationService {
  
  static calculateGenerationCost(generationType: CardGenerationType): number {
    const baseCosts = {
      CODE_UPLOAD: 50,      // 50 ECE to analyze and generate from existing code
      CARD_ORDER: 100,      // 100 ECE to create a new card from scratch
      CODEBASE_ENHANCE: 150 // 150 ECE to enhance existing code with AI
    };
    return baseCosts[generationType] || 100;
  }

  static async generateFromCodebase(params: {
    sourceCodeUrl: string;
    companyName: string;
    description?: string;
    category: string;
    userId: string;
  }): Promise<CardGenerationData> {
    
    // Analyze the codebase
    const technicalAnalysis = await TechnicalAnalysisService.analyzeRepository(params.sourceCodeUrl);
    const businessAnalysis = await BusinessAnalysisService.analyzeCodebase({
      codebaseStats: technicalAnalysis.stats,
      companyName: params.companyName,
      description: params.description
    });

    // Calculate rarity based on code quality and complexity
    const rarity = this.calculateRarity({
      codeQuality: technicalAnalysis.metrics.quality,
      complexity: technicalAnalysis.metrics.complexity,
      uniqueness: technicalAnalysis.metrics.uniqueness
    });

    // Generate card artwork
    const cardArtwork = await CardArtworkService.generateCardArt({
      companyName: params.companyName,
      category: params.category,
      rarity,
      technicalTheme: technicalAnalysis.dominantLanguages[0] || 'general'
    });

    // Calculate base price from business metrics
    const basePrice = this.calculateBasePrice({
      marketSize: businessAnalysis.marketSize,
      revenueProjection: businessAnalysis.revenueProjection,
      technicalComplexity: technicalAnalysis.metrics.complexity
    });

    return {
      name: `${params.companyName} ${this.getCardTypeTitle(technicalAnalysis.primaryType)}`,
      description: params.description || businessAnalysis.generatedDescription,
      rarity,
      codebaseHash: technicalAnalysis.repoHash,
      enhancementLevel: 0,
      technicalMetrics: technicalAnalysis.metrics,
      codebaseStats: technicalAnalysis.stats,
      businessMetrics: businessAnalysis,
      basePrice,
      marketCap: basePrice * 1000, // Initial market cap estimation
      cardArtwork,
      battleStats: this.generateBattleStats(technicalAnalysis.metrics),
    };
  }

  static async generateNewCard(params: {
    companyName: string;
    description?: string;
    category: string;
    userId: string;
  }): Promise<CardGenerationData> {
    
    // Generate business concept and metrics
    const businessAnalysis = await BusinessAnalysisService.generateBusinessConcept({
      companyName: params.companyName,
      category: params.category,
      description: params.description
    });

    // Create synthetic technical metrics for the new concept
    const syntheticTechMetrics = {
      quality: Math.random() * 40 + 60, // 60-100 range
      complexity: Math.random() * 50 + 25, // 25-75 range
      uniqueness: Math.random() * 30 + 70, // 70-100 range
      scalability: Math.random() * 40 + 60,
      security: Math.random() * 30 + 70
    };

    const rarity = this.calculateRarity(syntheticTechMetrics);

    // Generate card artwork
    const cardArtwork = await CardArtworkService.generateCardArt({
      companyName: params.companyName,
      category: params.category,
      rarity,
      technicalTheme: 'startup'
    });

    const basePrice = this.calculateBasePrice({
      marketSize: businessAnalysis.marketSize,
      revenueProjection: businessAnalysis.revenueProjection,
      technicalComplexity: syntheticTechMetrics.complexity
    });

    return {
      name: `${params.companyName} Startup Card`,
      description: businessAnalysis.description,
      rarity,
      enhancementLevel: 0,
      technicalMetrics: syntheticTechMetrics,
      codebaseStats: {
        linesOfCode: 0,
        languages: [],
        dependencies: [],
        filesCount: 0,
        isNewProject: true
      },
      businessMetrics: businessAnalysis,
      basePrice,
      marketCap: basePrice * 500, // Lower initial market cap for new cards
      cardArtwork,
      battleStats: this.generateBattleStats(syntheticTechMetrics),
    };
  }

  static async enhanceExistingCodebase(params: {
    sourceCodeUrl: string;
    companyName: string;
    description?: string;
    category: string;
    userId: string;
  }): Promise<CardGenerationData> {
    
    // First analyze the existing codebase
    const baseCardData = await this.generateFromCodebase(params);
    
    // Apply AI enhancements
    const enhancedMetrics = {
      ...baseCardData.technicalMetrics,
      quality: Math.min(100, baseCardData.technicalMetrics.quality * 1.3),
      scalability: Math.min(100, baseCardData.technicalMetrics.scalability * 1.4),
      security: Math.min(100, baseCardData.technicalMetrics.security * 1.2),
      performance: Math.min(100, (baseCardData.technicalMetrics.performance || 70) * 1.25)
    };

    // Enhanced business projections
    const enhancedBusiness = {
      ...baseCardData.businessMetrics,
      revenueProjection: baseCardData.businessMetrics.revenueProjection * 1.5,
      marketSize: baseCardData.businessMetrics.marketSize * 1.2,
      growthRate: (baseCardData.businessMetrics.growthRate || 15) * 1.3
    };

    // Recalculate rarity and price with enhancements
    const newRarity = this.calculateRarity(enhancedMetrics);
    const enhancedPrice = this.calculateBasePrice({
      marketSize: enhancedBusiness.marketSize,
      revenueProjection: enhancedBusiness.revenueProjection,
      technicalComplexity: enhancedMetrics.complexity
    });

    return {
      ...baseCardData,
      name: `${params.companyName} Enhanced ${this.getCardTypeTitle('enhanced')}`,
      rarity: newRarity,
      enhancementLevel: 1,
      technicalMetrics: enhancedMetrics,
      businessMetrics: enhancedBusiness,
      basePrice: enhancedPrice,
      marketCap: enhancedPrice * 1200, // Higher market cap for enhanced cards
      battleStats: this.generateBattleStats(enhancedMetrics),
    };
  }

  private static calculateRarity(metrics: { quality: number; complexity: number; uniqueness: number }): string {
    const score = (metrics.quality + metrics.complexity + metrics.uniqueness) / 3;
    
    if (score >= 90) return 'MYTHIC';
    if (score >= 80) return 'LEGENDARY';
    if (score >= 70) return 'EPIC';
    if (score >= 60) return 'RARE';
    return 'COMMON';
  }

  private static calculateBasePrice(params: {
    marketSize: number;
    revenueProjection: number;
    technicalComplexity: number;
  }): number {
    // Base price calculation in ECE
    const marketFactor = Math.log10(params.marketSize / 1000000) * 100; // Market size factor
    const revenueFactor = Math.log10(params.revenueProjection / 10000) * 50; // Revenue factor
    const techFactor = params.technicalComplexity * 2; // Technical complexity factor
    
    return Math.max(50, Math.floor(marketFactor + revenueFactor + techFactor));
  }

  private static generateBattleStats(technicalMetrics: any): any {
    return {
      attack: Math.floor(technicalMetrics.quality * 0.8 + technicalMetrics.complexity * 0.2),
      defense: Math.floor(technicalMetrics.security * 0.7 + technicalMetrics.scalability * 0.3),
      speed: Math.floor((technicalMetrics.performance || 70) * 0.6 + technicalMetrics.quality * 0.4),
      special: Math.floor(technicalMetrics.uniqueness * 0.9),
      overall: Math.floor(Object.values(technicalMetrics).reduce((sum: number, val: any) => sum + val, 0) / Object.keys(technicalMetrics).length)
    };
  }

  private static getCardTypeTitle(type: string): string {
    const titles = {
      'web': 'Web Platform',
      'mobile': 'Mobile App',
      'ai': 'AI Solution',
      'blockchain': 'Blockchain Platform',
      'api': 'API Service',
      'enhanced': 'Enhanced Solution',
      'general': 'Tech Solution'
    };
    return titles[type] || 'Tech Card';
  }
}
