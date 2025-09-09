export interface BusinessAnalysisResult {
  marketSize: number;
  revenueProjection: number;
  growthRate: number;
  competitiveAdvantage: string;
  riskFactors: string[];
  opportunityScore: number;
  description: string;
  generatedDescription: string;
  targetMarket: string;
  businessModel: string;
  monetizationStrategy: string[];
}

export class BusinessAnalysisService {
  
  static async analyzeCodebase(params: {
    codebaseStats: any;
    companyName: string;
    description?: string;
  }): Promise<BusinessAnalysisResult> {
    
    const { codebaseStats, companyName, description } = params;
    
    // Analyze business potential based on technical metrics
    const marketSize = this.estimateMarketSize(codebaseStats);
    const revenueProjection = this.projectRevenue(codebaseStats, marketSize);
    const growthRate = this.calculateGrowthRate(codebaseStats);
    
    return {
      marketSize,
      revenueProjection,
      growthRate,
      competitiveAdvantage: this.identifyCompetitiveAdvantage(codebaseStats),
      riskFactors: this.assessRiskFactors(codebaseStats),
      opportunityScore: this.calculateOpportunityScore(marketSize, revenueProjection, growthRate),
      description: description || '',
      generatedDescription: this.generateBusinessDescription(companyName, codebaseStats),
      targetMarket: this.identifyTargetMarket(codebaseStats),
      businessModel: this.suggestBusinessModel(codebaseStats),
      monetizationStrategy: this.suggestMonetizationStrategies(codebaseStats)
    };
  }

  static async generateBusinessConcept(params: {
    companyName: string;
    category: string;
    description?: string;
  }): Promise<BusinessAnalysisResult> {
    
    const { companyName, category, description } = params;
    
    // Generate business concept for new card orders
    const syntheticMetrics = this.generateSyntheticBusinessMetrics(category);
    
    return {
      ...syntheticMetrics,
      description: description || '',
      generatedDescription: this.generateConceptDescription(companyName, category),
      targetMarket: this.getTargetMarketForCategory(category),
      businessModel: this.getBusinessModelForCategory(category),
      monetizationStrategy: this.getMonetizationForCategory(category)
    };
  }

  private static estimateMarketSize(codebaseStats: any): number {
    let baseMarketSize = 10000000; // $10M base market
    
    // Adjust based on technology stack
    if (codebaseStats.languages.includes('Python')) baseMarketSize *= 1.5; // AI/ML premium
    if (codebaseStats.languages.includes('Solidity')) baseMarketSize *= 2; // Blockchain premium
    if (codebaseStats.languages.includes('Swift') || codebaseStats.languages.includes('Kotlin')) {
      baseMarketSize *= 1.3; // Mobile premium
    }
    
    // Scale with codebase size (larger = more complex = bigger market)
    const sizeFactor = Math.log10(codebaseStats.linesOfCode / 1000) || 1;
    baseMarketSize *= sizeFactor;
    
    // Add randomization for variety
    baseMarketSize *= (0.8 + Math.random() * 0.4); // ±20% variation
    
    return Math.floor(baseMarketSize);
  }

  private static projectRevenue(codebaseStats: any, marketSize: number): number {
    // Project potential revenue as percentage of addressable market
    let marketPenetration = 0.001; // 0.1% base penetration
    
    // Adjust based on tech sophistication
    if (codebaseStats.dependencies.includes('tensorflow') || codebaseStats.dependencies.includes('pytorch')) {
      marketPenetration *= 2; // AI solutions command premium
    }
    
    if (codebaseStats.testCoverage > 80) {
      marketPenetration *= 1.5; // Well-tested code = better execution
    }
    
    if (codebaseStats.documentationScore > 80) {
      marketPenetration *= 1.3; // Good docs = easier adoption
    }
    
    return Math.floor(marketSize * marketPenetration);
  }

  private static calculateGrowthRate(codebaseStats: any): number {
    let baseGrowthRate = 15; // 15% base annual growth
    
    // Tech stack growth multipliers
    if (codebaseStats.languages.includes('Rust')) baseGrowthRate += 10;
    if (codebaseStats.languages.includes('Go')) baseGrowthRate += 8;
    if (codebaseStats.dependencies.includes('react')) baseGrowthRate += 5;
    if (codebaseStats.dependencies.includes('next.js')) baseGrowthRate += 7;
    
    // Code quality impact
    if (codebaseStats.testCoverage > 90) baseGrowthRate += 5;
    if (codebaseStats.testCoverage < 50) baseGrowthRate -= 5;
    
    return Math.min(50, Math.max(5, baseGrowthRate + (Math.random() - 0.5) * 10));
  }

  private static identifyCompetitiveAdvantage(codebaseStats: any): string {
    const advantages = [];
    
    if (codebaseStats.testCoverage > 80) advantages.push('High code quality and reliability');
    if (codebaseStats.documentationScore > 85) advantages.push('Excellent documentation and developer experience');
    if (codebaseStats.languages.includes('Rust')) advantages.push('Memory safety and performance optimization');
    if (codebaseStats.dependencies.includes('tensorflow')) advantages.push('Advanced AI/ML capabilities');
    if (codebaseStats.dependencies.includes('blockchain')) advantages.push('Decentralized and trustless architecture');
    
    return advantages.length > 0 
      ? advantages[Math.floor(Math.random() * advantages.length)]
      : 'Solid technical foundation and execution capability';
  }

  private static assessRiskFactors(codebaseStats: any): string[] {
    const risks = [];
    
    if (codebaseStats.testCoverage < 50) risks.push('Low test coverage increases bug risk');
    if (codebaseStats.dependencies.length > 20) risks.push('High dependency count creates maintenance burden');
    if (codebaseStats.documentationScore < 60) risks.push('Poor documentation hampers adoption');
    if (codebaseStats.linesOfCode < 1000) risks.push('Early stage development with limited features');
    
    // Add some general business risks
    risks.push('Market competition and timing risks');
    if (Math.random() > 0.7) risks.push('Regulatory uncertainty in emerging tech spaces');
    
    return risks.slice(0, 3); // Limit to top 3 risks
  }

  private static calculateOpportunityScore(marketSize: number, revenue: number, growthRate: number): number {
    // Score from 0-100 based on market opportunity
    const marketScore = Math.min(40, Math.log10(marketSize / 1000000) * 10);
    const revenueScore = Math.min(30, Math.log10(revenue / 10000) * 10);
    const growthScore = Math.min(30, growthRate);
    
    return Math.floor(marketScore + revenueScore + growthScore);
  }

  private static generateBusinessDescription(companyName: string, codebaseStats: any): string {
    const techStack = codebaseStats.languages.join(', ');
    const primaryLang = codebaseStats.languages[0] || 'technology';
    
    let description = `${companyName} is a technology company leveraging ${techStack} to build innovative solutions. `;
    
    if (codebaseStats.languages.includes('Python') && codebaseStats.dependencies.includes('tensorflow')) {
      description += 'Specializing in AI and machine learning applications with advanced data processing capabilities.';
    } else if (codebaseStats.languages.includes('Solidity')) {
      description += 'Focused on blockchain and Web3 technologies with decentralized application development.';
    } else if (codebaseStats.dependencies.includes('react')) {
      description += 'Building modern web applications with focus on user experience and scalability.';
    } else {
      description += `Developing robust ${primaryLang}-based solutions for enterprise and consumer markets.`;
    }
    
    return description;
  }

  private static identifyTargetMarket(codebaseStats: any): string {
    if (codebaseStats.dependencies.includes('tensorflow')) return 'Enterprise AI/ML market';
    if (codebaseStats.languages.includes('Solidity')) return 'DeFi and Web3 users';
    if (codebaseStats.dependencies.includes('react-native')) return 'Mobile-first consumers';
    if (codebaseStats.dependencies.includes('express')) return 'API-driven businesses';
    return 'General technology adopters';
  }

  private static suggestBusinessModel(codebaseStats: any): string {
    if (codebaseStats.dependencies.includes('stripe')) return 'SaaS subscription model';
    if (codebaseStats.languages.includes('Solidity')) return 'Token-based economy';
    if (codebaseStats.dependencies.includes('react')) return 'Freemium with premium features';
    return 'B2B licensing model';
  }

  private static suggestMonetizationStrategies(codebaseStats: any): string[] {
    const strategies = [];
    
    if (codebaseStats.dependencies.includes('stripe')) strategies.push('Subscription revenue');
    if (codebaseStats.languages.includes('Solidity')) strategies.push('Transaction fees');
    if (codebaseStats.dependencies.includes('tensorflow')) strategies.push('API usage pricing');
    strategies.push('Enterprise licensing');
    strategies.push('Professional services');
    
    return strategies.slice(0, 3);
  }

  private static generateSyntheticBusinessMetrics(category: string): Omit<BusinessAnalysisResult, 'description' | 'generatedDescription' | 'targetMarket' | 'businessModel' | 'monetizationStrategy'> {
    const categoryMultipliers = {
      TECHNOLOGY: { market: 2, revenue: 1.5, growth: 1.3 },
      AUTOMOTIVE: { market: 3, revenue: 2, growth: 1.1 },
      REAL_ESTATE: { market: 5, revenue: 3, growth: 0.8 },
      LUXURY: { market: 1, revenue: 3, growth: 1.2 },
      GAMING: { market: 1.5, revenue: 1.8, growth: 1.5 },
      ENTERTAINMENT: { market: 2.5, revenue: 2.2, growth: 1.4 }
    };

    const multiplier = categoryMultipliers[category] || categoryMultipliers.TECHNOLOGY;
    
    const baseMarketSize = 5000000 * multiplier.market;
    const marketSize = Math.floor(baseMarketSize * (0.8 + Math.random() * 0.4));
    const revenueProjection = Math.floor(marketSize * 0.001 * multiplier.revenue);
    const growthRate = Math.floor(20 * multiplier.growth * (0.8 + Math.random() * 0.4));
    
    return {
      marketSize,
      revenueProjection,
      growthRate,
      competitiveAdvantage: 'First-mover advantage in emerging market segment',
      riskFactors: ['Market validation required', 'Execution risk', 'Competition from established players'],
      opportunityScore: this.calculateOpportunityScore(marketSize, revenueProjection, growthRate)
    };
  }

  private static generateConceptDescription(companyName: string, category: string): string {
    const descriptions = {
      TECHNOLOGY: `${companyName} is an innovative technology startup focused on developing cutting-edge solutions for the digital economy.`,
      AUTOMOTIVE: `${companyName} is revolutionizing the automotive industry through advanced technology and sustainable innovation.`,
      REAL_ESTATE: `${companyName} is transforming real estate through technology-driven solutions and market intelligence.`,
      LUXURY: `${companyName} represents the pinnacle of luxury and craftsmanship in premium market segments.`,
      GAMING: `${companyName} is creating next-generation gaming experiences with immersive technology.`,
      ENTERTAINMENT: `${companyName} is redefining entertainment through innovative content and technology platforms.`
    };
    
    return descriptions[category] || descriptions.TECHNOLOGY;
  }

  private static getTargetMarketForCategory(category: string): string {
    const markets = {
      TECHNOLOGY: 'Tech-savvy early adopters and enterprises',
      AUTOMOTIVE: 'Automotive enthusiasts and fleet operators',
      REAL_ESTATE: 'Property investors and real estate professionals',
      LUXURY: 'High-net-worth individuals and collectors',
      GAMING: 'Gamers and esports communities',
      ENTERTAINMENT: 'Content consumers and media companies'
    };
    
    return markets[category] || markets.TECHNOLOGY;
  }

  private static getBusinessModelForCategory(category: string): string {
    const models = {
      TECHNOLOGY: 'SaaS subscription with API monetization',
      AUTOMOTIVE: 'Direct sales with service contracts',
      REAL_ESTATE: 'Transaction-based commission model',
      LUXURY: 'Premium product sales with exclusivity',
      GAMING: 'Freemium with in-app purchases',
      ENTERTAINMENT: 'Content licensing and advertising'
    };
    
    return models[category] || models.TECHNOLOGY;
  }

  private static getMonetizationForCategory(category: string): string[] {
    const strategies = {
      TECHNOLOGY: ['Subscription fees', 'API usage', 'Enterprise licensing'],
      AUTOMOTIVE: ['Product sales', 'Service contracts', 'Parts and accessories'],
      REAL_ESTATE: ['Transaction fees', 'Listing fees', 'Premium services'],
      LUXURY: ['Product sales', 'Limited editions', 'Brand licensing'],
      GAMING: ['In-app purchases', 'Premium subscriptions', 'Esports tournaments'],
      ENTERTAINMENT: ['Content licensing', 'Advertising revenue', 'Subscription services']
    };
    
    return strategies[category] || strategies.TECHNOLOGY;
  }
}
