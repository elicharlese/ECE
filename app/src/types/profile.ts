export interface AppCard {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  techStack: string[];
  status: 'active' | 'demo' | 'production' | 'archived';
  imageUrl?: string;
  featured: boolean;
  stats: {
    stars: number;
    forks: number;
    language: string;
    lastUpdated: Date;
  };
  links: {
    demo?: string;
    live?: string;
    documentation?: string;
  };
  category: 'web-app' | 'mobile-app' | 'api' | 'library' | 'game' | 'tool' | 'other';
  tags: string[];
}

export interface EnhancedUserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  
  // App Portfolio
  apps: AppCard[];
  featuredApps: string[]; // App IDs
  
  // Statistics
  stats: {
    totalApps: number;
    totalStars: number;
    totalForks: number;
    profileViews: number;
    generatedApps: number;
    marketplaceSales: number;
  };
  
  // Social Features
  social: {
    followers: number;
    following: number;
    connections: number;
    tradingGroups: string[];
    badges: UserBadge[];
    achievements: UserAchievement[];
  };
  
  // ECE Platform Specific
  ece: {
    tokens: number;
    cards: UserCard[];
    badges: UserBadge[];
    tier: 'free' | 'pro' | 'enterprise';
    subscriptionStatus: 'active' | 'inactive' | 'trial';
    generationQuota: {
      used: number;
      total: number;
      resetDate: Date;
    };
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  category: 'development' | 'social' | 'trading' | 'achievement';
}

export interface UserCard {
  id: string;
  name: string;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  power: number;
  abilities: string[];
  acquiredAt: Date;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: Date;
  category: 'coding' | 'social' | 'trading' | 'platform';
}
