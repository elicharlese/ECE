/**
 * App Generation Types
 * TypeScript interfaces for the complete app generation pipeline
 */

export interface AppTemplate {
  id: string
  name: string
  description: string
  category: 'web' | 'mobile' | 'desktop' | 'backend' | 'ai'
  complexity: 'simple' | 'medium' | 'complex'
  estimatedTime: number // minutes
  features: string[]
  frameworks: string[]
  icon: string
  preview?: string
}

export interface GenerationProgress {
  step: number
  totalSteps: number
  message: string
  percentage: number
  estimatedTimeRemaining?: number
}

export interface BattleStats {
  power: number       // Code complexity and functionality
  speed: number       // Performance and optimization
  innovation: number  // Unique features and creativity
  scalability: number // Architecture and maintainability
}

export interface GeneratedApp {
  id: string
  name: string
  description: string
  template: AppTemplate
  framework: string
  complexity: 'simple' | 'medium' | 'complex'
  features: string[]
  files: Record<string, string> // filepath -> content
  architecture: any
  qualityScore: number // 0-100
  battleStats: BattleStats
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  specialAbilities?: string[]
  weaknesses?: string[]
  evolutionPath?: string[]
  tradingValue: number // ECE tokens
  createdAt: string
  updatedAt?: string
  status: 'generating' | 'completed' | 'failed' | 'deployed'
  deploymentUrl?: string
  repositoryUrl?: string
  userId?: string
  isPublic: boolean
  likes: number
  views: number
  shares: number
  tags: string[]
  // Add media assets from AI generation
  mediaAssets?: {
    images: {
      hero: string[]
      screenshots: string[]
      icons: string[]
      backgrounds: string[]
      thumbnails: string[]
    }
    videos: {
      hero: string
      demo: string
      tutorial: string
      loading: string[]
      transitions: string[]
    }
    assets3D: {
      scenes: string[]
      models: string[]
      environments: string[]
      animations: string[]
    }
    metadata: {
      totalSize: number
      optimizationRatio: number
      processingTime: number
      qualityScore: number
    }
  }
}

export interface GenerationResult {
  id: string
  projectName: string
  githubRepo: string
  vercelUrl: string
  downloadUrl: string
  mediaAssets?: any
  appCardData: AppCardData
  timestamp: Date
}

export interface AppCardData {
  id: string
  name: string
  description: string
  template: string
  techStack: string[]
  features: string[]
  battleStats: BattleStats
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  thumbnail: string
  creator: string
}

export interface AppGenerationRequest {
  template: AppTemplate
  projectName: string
  description: string
  features: string[]
  complexity: 'simple' | 'medium' | 'complex'
  framework: string
  isPublic: boolean
  tags: string[]
}

export interface AppCard {
  id: string
  appId: string
  name: string
  description: string
  image: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  battleStats: BattleStats
  specialAbilities: string[]
  weaknesses: string[]
  evolutionPath: string[]
  tradingValue: number
  category: string
  framework: string
  createdAt: string
  ownerId: string
  isForTrade: boolean
  tradeOffers: TradeOffer[]
}

export interface TradeOffer {
  id: string
  fromUserId: string
  toUserId: string
  offeredCards: string[] // card IDs
  requestedCards: string[] // card IDs
  eceTokens: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
  expiresAt: string
}

export interface UserGeneratedApps {
  userId: string
  apps: GeneratedApp[]
  cards: AppCard[]
  statistics: {
    totalApps: number
    totalCards: number
    totalValue: number // ECE tokens
    level: number
    experience: number
    nextLevelXp: number
    achievements: Achievement[]
    expertise: {
      web: number
      mobile: number
      desktop: number
      backend: number
      ai: number
    }
  }
  collections: {
    favorites: string[] // app IDs
    featured: string[] // app IDs
    private: string[] // app IDs
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum'
  category: 'generation' | 'quality' | 'social' | 'trading' | 'special'
  requirements: {
    type: 'count' | 'quality' | 'streak' | 'special'
    target: number
    current: number
  }
  reward: {
    xp: number
    tokens: number
    title?: string
    badge?: string
  }
  unlockedAt?: string
}

export interface GenerationStats {
  totalGenerations: number
  successRate: number
  averageQuality: number
  averageTime: number
  popularTemplates: Array<{
    template: string
    count: number
    percentage: number
  }>
  rarityDistribution: {
    common: number
    rare: number
    epic: number
    legendary: number
  }
  categoryBreakdown: {
    web: number
    mobile: number
    desktop: number
    backend: number
    ai: number
  }
  userEngagement: {
    activeUsers: number
    dailyGenerations: number
    averageAppsPerUser: number
  }
}

export interface NebiusConfig {
  apiKey: string
  baseUrl: string
  models: {
    codeGeneration: string
    architecture: string
    optimization: string
    validation: string
  }
  pricing: {
    development: {
      instance: string
      costPerHour: number
      monthlyEstimate: number
    }
    production: {
      instance: string
      costPerHour: number
      monthlyEstimate: number
    }
    enterprise: {
      instance: string
      costPerHour: number
      monthlyEstimate: number
    }
  }
}

export interface QualityReport {
  score: number // 0-100
  issues: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical'
    type: 'security' | 'performance' | 'maintainability' | 'style'
    message: string
    file?: string
    line?: number
  }>
  recommendations: string[]
  metrics: {
    codeComplexity: number
    testCoverage: number
    performance: number
    security: number
    maintainability: number
  }
  passed: boolean
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'github-pages' | 'aws' | 'azure'
  customDomain?: string
  environmentVariables: Record<string, string>
  buildCommand: string
  outputDirectory: string
  nodeVersion?: string
}

export interface AppTemplate {
  id: string
  name: string
  description: string
  category: 'web' | 'mobile' | 'desktop' | 'backend' | 'ai'
  complexity: 'simple' | 'medium' | 'complex'
  estimatedTime: number
  features: string[]
  frameworks: string[]
  icon: string
  preview?: string
  baseFiles: Record<string, string>
  requiredSkills: string[]
  learningObjectives: string[]
  battleStatsTemplate: BattleStats
}

// Default app templates
export const APP_TEMPLATES: AppTemplate[] = [
  {
    id: 'web-app',
    name: 'Modern Web App',
    description: 'Full-stack web application with React, TypeScript, and Tailwind CSS',
    category: 'web',
    complexity: 'medium',
    estimatedTime: 8,
    features: ['Responsive Design', 'API Integration', 'User Authentication', 'Database'],
    frameworks: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    icon: '🌐',
    preview: '/templates/web-app-preview.png',
    baseFiles: {},
    requiredSkills: ['React', 'TypeScript', 'CSS'],
    learningObjectives: ['Component Architecture', 'State Management', 'API Design'],
    battleStatsTemplate: { power: 65, speed: 70, innovation: 60, scalability: 75 }
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Cross-platform mobile application with React Native',
    category: 'mobile',
    complexity: 'complex',
    estimatedTime: 12,
    features: ['Cross-Platform', 'Native APIs', 'Push Notifications', 'Offline Support'],
    frameworks: ['React Native', 'Expo', 'TypeScript'],
    icon: '📱',
    preview: '/templates/mobile-app-preview.png',
    baseFiles: {},
    requiredSkills: ['React Native', 'Mobile Development', 'TypeScript'],
    learningObjectives: ['Mobile UX', 'Device APIs', 'App Store Deployment'],
    battleStatsTemplate: { power: 70, speed: 60, innovation: 80, scalability: 65 }
  },
  {
    id: 'desktop-app',
    name: 'Desktop Application',
    description: 'Cross-platform desktop application with Electron',
    category: 'desktop',
    complexity: 'complex',
    estimatedTime: 10,
    features: ['Cross-Platform', 'Native OS Integration', 'File System Access', 'System Tray'],
    frameworks: ['Electron', 'React', 'TypeScript'],
    icon: '💻',
    preview: '/templates/desktop-app-preview.png',
    baseFiles: {},
    requiredSkills: ['Electron', 'Desktop Development', 'Node.js'],
    learningObjectives: ['Desktop UX', 'OS Integration', 'Distribution'],
    battleStatsTemplate: { power: 75, speed: 55, innovation: 70, scalability: 60 }
  },
  {
    id: 'api-backend',
    name: 'API Backend',
    description: 'RESTful API backend with Node.js, Express, and database integration',
    category: 'backend',
    complexity: 'medium',
    estimatedTime: 6,
    features: ['RESTful API', 'Database Integration', 'Authentication', 'Documentation'],
    frameworks: ['Node.js', 'Express', 'TypeScript', 'Prisma'],
    icon: '⚡',
    preview: '/templates/api-backend-preview.png',
    baseFiles: {},
    requiredSkills: ['Node.js', 'API Design', 'Database Design'],
    learningObjectives: ['API Architecture', 'Database Modeling', 'Security'],
    battleStatsTemplate: { power: 60, speed: 80, innovation: 50, scalability: 85 }
  },
  {
    id: 'ai-app',
    name: 'AI-Powered App',
    description: 'Application with integrated AI/ML capabilities and smart features',
    category: 'ai',
    complexity: 'complex',
    estimatedTime: 15,
    features: ['AI Integration', 'Machine Learning', 'Natural Language Processing', 'Computer Vision'],
    frameworks: ['Python', 'TensorFlow', 'OpenAI API', 'FastAPI'],
    icon: '🤖',
    preview: '/templates/ai-app-preview.png',
    baseFiles: {},
    requiredSkills: ['Python', 'AI/ML', 'API Integration'],
    learningObjectives: ['AI Integration', 'Model Training', 'Data Processing'],
    battleStatsTemplate: { power: 90, speed: 50, innovation: 95, scalability: 70 }
  }
]

// Utility functions
export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#75715E',
    rare: '#66D9EF',
    epic: '#A6E22E',
    legendary: '#F92672'
  }
  return colors[rarity as keyof typeof colors] || colors.common
}

export const getRarityGradient = (rarity: string): string => {
  const gradients = {
    common: 'linear-gradient(135deg, #75715E, #E6DB74)',
    rare: 'linear-gradient(135deg, #66D9EF, #819AFF)',
    epic: 'linear-gradient(135deg, #A6E22E, #3EBA7C)',
    legendary: 'linear-gradient(135deg, #F92672, #FD5C63)'
  }
  return gradients[rarity as keyof typeof gradients] || gradients.common
}

export const calculateTotalBattleRating = (stats: BattleStats): number => {
  return Math.round((stats.power + stats.speed + stats.innovation + stats.scalability) / 4)
}

export const getComplexityMultiplier = (complexity: string): number => {
  const multipliers = { simple: 1.0, medium: 1.3, complex: 1.7 }
  return multipliers[complexity as keyof typeof multipliers] || 1.0
}

export const getFrameworkBonus = (framework: string): number => {
  const bonuses: Record<string, number> = {
    'React': 10,
    'Next.js': 15,
    'React Native': 20,
    'Electron': 15,
    'TypeScript': 10,
    'Python': 5,
    'TensorFlow': 25,
    'OpenAI API': 30
  }
  return bonuses[framework] || 0
}
