'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/src/lib/theme-context';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { BottomNavigation } from '@/src/components/bottom-navigation';
import type { TradingCard } from '@/src/lib/card-store';

interface AppCard extends TradingCard {
  images?: string[];
  tags?: string[];
  highlights?: string[];
}

const sampleApps: AppCard[] = [
  {
    id: '1',
    title: 'EcoTracker Pro',
    description: 'AI-powered sustainability tracking app with carbon footprint analytics and personalized eco-friendly recommendations.',
    category: 'lifestyle',
    rarity: 'epic',
    stats: {
      performance: 92,
      scalability: 88,
      security: 90,
      userExperience: 95,
      innovation: 89
    },
    originalPrice: 2200,
    currentPrice: 2750,
    marketCap: 12400,
    priceChange24h: 8.5,
    volume24h: 5600,
    isForSale: true,
    isCrowdfunding: false,
    bettingPool: 850,
    totalBets: 24,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    owner: {
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    metadata: {
      framework: 'React Native',
      complexity: 'medium',
      features: ['AI Analytics', 'Carbon Tracking', 'Social Features', 'Gamification'],
      deliveryMethod: 'github',
      timeline: '2w',
      completedAt: '2024-01-15T10:30:00Z',
      buildProgress: 100,
      techStack: ['React Native', 'Python', 'TensorFlow', 'Firebase']
    },
    images: ['/eco-tracker-1.jpg', '/eco-tracker-2.jpg'],
    tags: ['Trending', 'AI-Powered', 'Social Impact'],
    highlights: ['100k+ Downloads', '$15k Monthly Revenue', '4.8★ Rating']
  },
  {
    id: '2',
    title: 'CryptoVault',
    description: 'Secure cryptocurrency portfolio manager with advanced trading features, multi-wallet support, and real-time market analysis.',
    category: 'fintech',
    rarity: 'legendary',
    stats: {
      performance: 96,
      scalability: 94,
      security: 98,
      userExperience: 91,
      innovation: 95
    },
    originalPrice: 3500,
    currentPrice: 4200,
    marketCap: 21000,
    priceChange24h: 12.3,
    volume24h: 8900,
    isForSale: true,
    isCrowdfunding: false,
    bettingPool: 1250,
    totalBets: 42,
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    owner: {
      name: 'Alex Morgan',
      email: 'alex@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
    },
    metadata: {
      framework: 'Next.js',
      complexity: 'complex',
      features: ['Multi-Wallet', 'Advanced Trading', 'Real-time Analytics', 'Security Features'],
      deliveryMethod: 'deployed',
      timeline: '3w',
      completedAt: '2024-01-10T08:15:00Z',
      buildProgress: 100,
      techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'WebSocket']
    },
    images: ['/crypto-vault-1.jpg', '/crypto-vault-2.jpg'],
    tags: ['Hot', 'Security Focus', 'High Revenue'],
    highlights: ['$45k Monthly Revenue', '99.9% Uptime', 'Bank-Level Security']
  },
  {
    id: '3',
    title: 'MindfulSpace',
    description: 'Meditation and mindfulness app with guided sessions, progress tracking, and personalized wellness recommendations.',
    category: 'health',
    rarity: 'rare',
    stats: {
      performance: 88,
      scalability: 85,
      security: 87,
      userExperience: 93,
      innovation: 82
    },
    originalPrice: 1200,
    currentPrice: 1450,
    marketCap: 5800,
    priceChange24h: 5.2,
    volume24h: 2100,
    isForSale: false,
    isCrowdfunding: true,
    bettingPool: 420,
    totalBets: 18,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    owner: {
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
    },
    metadata: {
      framework: 'Flutter',
      complexity: 'simple',
      features: ['Guided Meditation', 'Progress Tracking', 'Personalization', 'Sleep Stories'],
      deliveryMethod: 'github',
      timeline: '10d',
      completedAt: '2024-01-20T12:00:00Z',
      buildProgress: 100,
      techStack: ['Flutter', 'Firebase', 'AI/ML', 'Cloud Functions']
    },
    images: ['/mindful-space-1.jpg', '/mindful-space-2.jpg'],
    tags: ['Wellness', 'Growing Fast', 'Community Loved'],
    highlights: ['250k+ Users', 'Featured by Apple', '4.9★ Rating']
  }
];

export default function MarketplacePage() {
  const { theme } = useTheme();
  const [apps, setApps] = useState<AppCard[]>(sampleApps);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'epic': return 'from-purple-400 via-pink-500 to-purple-600';
      case 'rare': return 'from-blue-400 via-cyan-500 to-blue-600';
      default: return 'from-gray-400 via-gray-500 to-gray-600';
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedApps = filteredApps.sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.currentPrice - b.currentPrice;
      case 'price-desc':
        return b.currentPrice - a.currentPrice;
      case 'performance':
        return b.stats.performance - a.stats.performance;
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-theme-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-theme-text-secondary">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background pb-20">
      {/* Header */}
      <div className="bg-theme-surface/95 backdrop-blur-sm border-b border-theme-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-theme-text-primary">App Marketplace</h1>
              <p className="text-theme-text-secondary">Browse and trade professionally built applications</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text-primary placeholder-theme-text-secondary focus:ring-2 focus:ring-theme-accent focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text-primary focus:ring-2 focus:ring-theme-accent"
            >
              <option value="all">All Categories</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="fintech">FinTech</option>
              <option value="health">Health</option>
              <option value="productivity">Productivity</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-theme-background border border-theme-border rounded-lg text-theme-text-primary focus:ring-2 focus:ring-theme-accent"
            >
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="performance">Performance</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* App Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {sortedApps.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-2">No apps found</h3>
            <p className="text-theme-text-secondary">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedApps.map((app) => (
              <div
                key={app.id}
                className="bg-theme-surface rounded-2xl overflow-hidden border border-theme-border hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => {
                  // Navigate to app details or order page
                  const queryParams = `?appId=${app.id}&appTitle=${encodeURIComponent(app.title)}&appPrice=${app.currentPrice}`;
                  window.location.href = `/order${queryParams}`;
                }}
              >
                {/* App Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-60">📱</div>
                  </div>
                  
                  {/* Rarity Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityGradient(app.rarity)}`}>
                    {app.rarity.toUpperCase()}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full text-xs">
                    {app.isForSale ? 'For Sale' : app.isCrowdfunding ? 'Crowdfunding' : 'Not Listed'}
                  </div>
                </div>

                {/* App Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-theme-text-primary">{app.title}</h3>
                      <p className="text-sm text-theme-text-secondary capitalize">{app.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-theme-accent">{formatPrice(app.currentPrice)}</p>
                      <p className={`text-xs ${app.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {app.priceChange24h >= 0 ? '+' : ''}{app.priceChange24h.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-theme-text-secondary line-clamp-2 mb-3">
                    {app.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-theme-text-secondary mb-3">
                    <span>Performance: {app.stats.performance}%</span>
                    <span>Market Cap: {formatPrice(app.marketCap)}</span>
                  </div>

                  {/* Highlights */}
                  {app.highlights && (
                    <div className="flex flex-wrap gap-1">
                      {app.highlights.slice(0, 2).map((highlight, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-theme-accent/10 text-theme-accent text-xs rounded border border-theme-accent/20"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
