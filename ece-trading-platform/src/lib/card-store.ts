// In-memory trading card store
// In production, this would be replaced with a database

export interface TradingCard {
  id: string;
  orderId?: string; // Reference to the order that created this card
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: {
    performance: number;
    scalability: number;
    security: number;
    userExperience: number;
    innovation: number;
  };
  originalPrice: number;
  currentPrice: number;
  marketCap: number;
  priceChange24h: number;
  volume24h: number;
  isForSale: boolean;
  isCrowdfunding: boolean;
  bettingPool: number;
  totalBets: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    name: string;
    email: string;
    avatar: string;
  };
  metadata: {
    framework: string;
    complexity: string;
    features: string[];
    deliveryMethod: string;
    timeline: string;
    completedAt: string;
    buildProgress: number;
    techStack: string[];
    githubUrl?: string;
    deploymentUrl?: string;
  };
}

// In-memory cards storage
export const cards: TradingCard[] = [
  // Sample cards for demo
  {
    id: 'card_sample_1',
    title: 'CryptoTrader Pro',
    description: 'Advanced cryptocurrency trading platform with real-time analytics and automated trading strategies.',
    category: 'fintech',
    rarity: 'legendary',
    stats: {
      performance: 95,
      scalability: 88,
      security: 92,
      userExperience: 87,
      innovation: 94
    },
    originalPrice: 2500,
    currentPrice: 3200,
    marketCap: 15600,
    priceChange24h: 12.5,
    volume24h: 8900,
    isForSale: true,
    isCrowdfunding: false,
    bettingPool: 1200,
    totalBets: 45,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:25:00Z',
    owner: {
      name: 'Alex Chen',
      email: 'alex@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
    },
    metadata: {
      framework: 'Next.js',
      complexity: 'complex',
      features: ['Real-time Trading', 'Portfolio Analytics', 'Risk Management', 'API Integration', 'Mobile App'],
      deliveryMethod: 'github',
      timeline: '2w',
      completedAt: '2024-01-15T10:30:00Z',
      buildProgress: 100,
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'WebSocket'],
      githubUrl: 'https://github.com/alexchen/crypto-trader-pro',
      deploymentUrl: 'https://crypto-trader-pro.vercel.app'
    }
  },
  {
    id: 'card_sample_2',
    title: 'EcoDelivery App',
    description: 'Sustainable food delivery platform connecting local restaurants with eco-conscious consumers.',
    category: 'marketplace',
    rarity: 'epic',
    stats: {
      performance: 82,
      scalability: 79,
      security: 85,
      userExperience: 91,
      innovation: 76
    },
    originalPrice: 1800,
    currentPrice: 2100,
    marketCap: 8400,
    priceChange24h: -3.2,
    volume24h: 4200,
    isForSale: false,
    isCrowdfunding: true,
    bettingPool: 850,
    totalBets: 32,
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    owner: {
      name: 'Maria Rodriguez',
      email: 'maria@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
    },
    metadata: {
      framework: 'React Native',
      complexity: 'medium',
      features: ['Location Tracking', 'Payment Gateway', 'Rating System', 'Push Notifications'],
      deliveryMethod: 'zip',
      timeline: '1w',
      completedAt: '2024-01-18T16:45:00Z',
      buildProgress: 100,
      techStack: ['React Native', 'Node.js', 'MongoDB', 'Stripe'],
      deploymentUrl: 'https://eco-delivery.app'
    }
  },
  {
    id: 'card_sample_3',
    title: 'MindfulSpace',
    description: 'AI-powered meditation and wellness app with personalized mindfulness programs.',
    category: 'wellness',
    rarity: 'rare',
    stats: {
      performance: 78,
      scalability: 74,
      security: 80,
      userExperience: 89,
      innovation: 82
    },
    originalPrice: 1200,
    currentPrice: 1350,
    marketCap: 5400,
    priceChange24h: 8.7,
    volume24h: 2100,
    isForSale: true,
    isCrowdfunding: false,
    bettingPool: 420,
    totalBets: 18,
    createdAt: '2024-01-20T08:20:00Z',
    updatedAt: '2024-01-20T12:30:00Z',
    owner: {
      name: 'David Park',
      email: 'david@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
    },
    metadata: {
      framework: 'Flutter',
      complexity: 'medium',
      features: ['AI Recommendations', 'Progress Tracking', 'Social Features'],
      deliveryMethod: 'github',
      timeline: '1w',
      completedAt: '2024-01-20T08:20:00Z',
      buildProgress: 100,
      techStack: ['Flutter', 'Python', 'TensorFlow', 'Firebase'],
      githubUrl: 'https://github.com/davidpark/mindful-space'
    }
  },
  {
    id: 'card_sample_4',
    title: 'TaskFlow Pro',
    description: 'Enterprise project management solution with advanced workflow automation.',
    category: 'productivity',
    rarity: 'common',
    stats: {
      performance: 72,
      scalability: 85,
      security: 88,
      userExperience: 76,
      innovation: 65
    },
    originalPrice: 950,
    currentPrice: 1050,
    marketCap: 3150,
    priceChange24h: 4.2,
    volume24h: 1800,
    isForSale: true,
    isCrowdfunding: false,
    bettingPool: 280,
    totalBets: 12,
    createdAt: '2024-01-19T14:10:00Z',
    updatedAt: '2024-01-20T11:45:00Z',
    owner: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    metadata: {
      framework: 'Vue.js',
      complexity: 'simple',
      features: ['Task Management', 'Team Collaboration', 'Reporting'],
      deliveryMethod: 'deployed',
      timeline: '3d',
      completedAt: '2024-01-19T14:10:00Z',
      buildProgress: 100,
      techStack: ['Vue.js', 'Express.js', 'MySQL'],
      deploymentUrl: 'https://taskflow-pro.com'
    }
  }
];

// Helper functions
export function addCard(card: TradingCard): void {
  cards.push(card);
}

export function findCardById(id: string): TradingCard | undefined {
  return cards.find(card => card.id === id);
}

export function findCardByOrderId(orderId: string): TradingCard | undefined {
  return cards.find(card => card.orderId === orderId);
}

export function updateCard(id: string, updates: Partial<TradingCard>): TradingCard | null {
  const cardIndex = cards.findIndex(card => card.id === id);
  if (cardIndex === -1) return null;
  
  cards[cardIndex] = { ...cards[cardIndex], ...updates, updatedAt: new Date().toISOString() };
  return cards[cardIndex];
}

export function getAllCards(): TradingCard[] {
  return [...cards];
}

export function getCardsForSale(): TradingCard[] {
  return cards.filter(card => card.isForSale);
}

export function getCrowdfundingCards(): TradingCard[] {
  return cards.filter(card => card.isCrowdfunding);
}

export function getCardsByOwner(email: string): TradingCard[] {
  return cards.filter(card => card.owner.email === email);
}

export function getCardsByCategory(category: string): TradingCard[] {
  return cards.filter(card => card.category === category);
}

export function getCardsByRarity(rarity: 'common' | 'rare' | 'epic' | 'legendary'): TradingCard[] {
  return cards.filter(card => card.rarity === rarity);
}
