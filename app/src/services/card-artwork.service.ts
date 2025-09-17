export interface CardArtworkParams {
  companyName: string;
  category: string;
  rarity: string;
  technicalTheme: string;
}

export class CardArtworkService {
  
  static async generateCardArt(params: CardArtworkParams): Promise<string> {
    // In production, this would integrate with:
    // - DALL-E, Midjourney, or Stable Diffusion for AI art generation
    // - Template-based card generation system
    // - Dynamic SVG generation with company branding
    
    // For now, return a placeholder URL that could be generated
    const artworkUrl = this.generatePlaceholderArtwork(params);
    return artworkUrl;
  }

  private static generatePlaceholderArtwork(params: CardArtworkParams): string {
    // Generate a unique artwork URL based on card parameters
    const { companyName, category, rarity, technicalTheme } = params;
    
    // Color schemes based on rarity
    const rarityColors = {
      COMMON: 'gray',
      RARE: 'blue', 
      EPIC: 'purple',
      LEGENDARY: 'gold',
      MYTHIC: 'rainbow'
    };

    // Technical theme icons
    const themeIcons = {
      web: '🌐',
      mobile: '📱',
      ai: '🤖',
      blockchain: '⛓️',
      api: '🔌',
      enhanced: '⚡',
      startup: '🚀',
      general: '💻'
    };

    // Category backgrounds
    const categoryBgs = {
      TECHNOLOGY: 'tech-circuit',
      AUTOMOTIVE: 'automotive-grid',
      REAL_ESTATE: 'building-silhouette',
      LUXURY: 'luxury-pattern',
      GAMING: 'gaming-neon',
      ENTERTAINMENT: 'entertainment-stage'
    };

    // Create a deterministic but unique artwork identifier
    const artworkId = this.hashString(companyName + category + rarity + technicalTheme);
    
    // Return placeholder URL that would point to generated artwork
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/api/artwork/generate/${artworkId}?rarity=${rarity}&category=${category}&theme=${technicalTheme}`;
  }

  static async generateBattleCardLayout(cardData: any): Promise<string> {
    // Generate battle-specific card layout with stats prominently displayed
    const battleLayoutUrl = this.generateBattleLayout(cardData);
    return battleLayoutUrl;
  }

  static async generateMarketplaceCardLayout(cardData: any): Promise<string> {
    // Generate marketplace-optimized card layout focusing on valuation and metrics
    const marketLayoutUrl = this.generateMarketplaceLayout(cardData);
    return marketLayoutUrl;
  }

  private static generateBattleLayout(cardData: any): string {
    const battleId = this.hashString(cardData.id + 'battle' + JSON.stringify(cardData.stats));
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/api/artwork/battle/${battleId}`;
  }

  private static generateMarketplaceLayout(cardData: any): string {
    const marketId = this.hashString(cardData.id + 'market' + cardData.currentPrice);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/api/artwork/market/${marketId}`;
  }

  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }

  // Dynamic SVG card generation (for placeholder implementation)
  static generateSVGCard(params: CardArtworkParams & { stats?: any }): string {
    const { companyName, category, rarity, technicalTheme, stats } = params;
    
    const rarityColors = {
      COMMON: '#6B7280',
      RARE: '#3B82F6', 
      EPIC: '#8B5CF6',
      LEGENDARY: '#F59E0B',
      MYTHIC: '#EC4899'
    };

    const bgColor = rarityColors[rarity] || rarityColors.COMMON;
    
    return `
      <svg width="300" height="420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${bgColor};stop-opacity:0.7" />
          </linearGradient>
        </defs>
        
        <!-- Card Background -->
        <rect width="300" height="420" rx="15" fill="url(#cardGradient)" stroke="#000" stroke-width="2"/>
        
        <!-- Company Name -->
        <text x="150" y="30" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
          ${companyName}
        </text>
        
        <!-- Rarity Badge -->
        <rect x="10" y="10" width="60" height="20" rx="10" fill="rgba(0,0,0,0.5)"/>
        <text x="40" y="23" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10">
          ${rarity}
        </text>
        
        <!-- Category -->
        <text x="150" y="50" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">
          ${category}
        </text>
        
        <!-- Main Art Area -->
        <rect x="20" y="70" width="260" height="200" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)"/>
        <text x="150" y="180" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48">
          ${this.getThemeIcon(technicalTheme)}
        </text>
        
        <!-- Stats Area (if provided) -->
        ${stats ? this.generateStatsSection(stats) : ''}
        
        <!-- Tech Theme -->
        <text x="150" y="400" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10" opacity="0.8">
          ${technicalTheme.toUpperCase()}
        </text>
      </svg>
    `;
  }

  private static generateStatsSection(stats: any): string {
    if (!stats) return '';
    
    const statY = 290;
    const statSpacing = 25;
    
    return `
      <!-- Stats Background -->
      <rect x="20" y="280" width="260" height="100" rx="5" fill="rgba(0,0,0,0.3)"/>
      
      <!-- Attack -->
      <text x="30" y="${statY + 15}" fill="white" font-family="Arial, sans-serif" font-size="12">
        ATK: ${stats.attack || 0}
      </text>
      
      <!-- Defense -->
      <text x="150" y="${statY + 15}" fill="white" font-family="Arial, sans-serif" font-size="12">
        DEF: ${stats.defense || 0}
      </text>
      
      <!-- Speed -->
      <text x="30" y="${statY + 35}" fill="white" font-family="Arial, sans-serif" font-size="12">
        SPD: ${stats.speed || 0}
      </text>
      
      <!-- Special -->
      <text x="150" y="${statY + 35}" fill="white" font-family="Arial, sans-serif" font-size="12">
        SPC: ${stats.special || 0}
      </text>
      
      <!-- Overall -->
      <text x="90" y="${statY + 55}" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
        Overall: ${stats.overall || 0}
      </text>
    `;
  }

  private static getThemeIcon(theme: string): string {
    const icons = {
      web: '🌐',
      mobile: '📱',
      ai: '🤖',
      blockchain: '⛓️',
      api: '🔌',
      enhanced: '⚡',
      startup: '🚀',
      general: '💻'
    };
    return icons[theme] || icons.general;
  }
}
