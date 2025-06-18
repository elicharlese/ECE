'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/src/lib/theme-context';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { BottomNavigation } from '@/src/components/bottom-navigation';

interface UserStats {
  totalInvestments: number;
  portfolioValue: number;
  totalApps: number;
  monthlyReturn: number;
  appsLiked: number;
  totalSpent: number;
  avgAppPerformance: number;
}

interface OwnedApp {
  id: string;
  title: string;
  category: string;
  purchasePrice: number;
  currentValue: number;
  performance: number;
  monthlyRevenue: number;
  status: 'active' | 'development' | 'maintenance';
  purchaseDate: string;
}

const mockUserStats: UserStats = {
  totalInvestments: 5,
  portfolioValue: 125400,
  totalApps: 3,
  monthlyReturn: 8.5,
  appsLiked: 12,
  totalSpent: 89200,
  avgAppPerformance: 92
};

const mockOwnedApps: OwnedApp[] = [
  {
    id: '1',
    title: 'EcoTracker Pro',
    category: 'lifestyle',
    purchasePrice: 2200,
    currentValue: 2750,
    performance: 92,
    monthlyRevenue: 1250,
    status: 'active',
    purchaseDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'CryptoVault',
    category: 'fintech',
    purchasePrice: 3500,
    currentValue: 4200,
    performance: 96,
    monthlyRevenue: 3750,
    status: 'active',
    purchaseDate: '2024-01-10'
  },
  {
    id: '3',
    title: 'TaskMaster Pro',
    category: 'productivity',
    purchasePrice: 1200,
    currentValue: 1580,
    performance: 88,
    monthlyRevenue: 890,
    status: 'development',
    purchaseDate: '2024-02-01'
  }
];

export default function DashboardPage() {
  const { theme } = useTheme();
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [ownedApps, setOwnedApps] = useState<OwnedApp[]>(mockOwnedApps);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'analytics'>('overview');

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'development': return 'text-yellow-500 bg-yellow-500/10';
      case 'maintenance': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const calculateGainLoss = (purchasePrice: number, currentValue: number) => {
    const difference = currentValue - purchasePrice;
    const percentage = (difference / purchasePrice) * 100;
    return { difference, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-theme-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-theme-text-secondary">Loading your portfolio...</p>
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
              <h1 className="text-3xl font-bold text-theme-text-primary">Portfolio Dashboard</h1>
              <p className="text-theme-text-secondary">Track your app investments and performance</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-theme-background rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'apps', label: 'My Apps' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-theme-accent text-white'
                    : 'text-theme-text-secondary hover:text-theme-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-theme-surface rounded-2xl p-6 border border-theme-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-theme-text-secondary text-sm">Portfolio Value</span>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-2xl font-bold text-theme-text-primary">{formatPrice(userStats.portfolioValue)}</p>
                <p className="text-green-500 text-sm">+{userStats.monthlyReturn}% this month</p>
              </div>

              <div className="bg-theme-surface rounded-2xl p-6 border border-theme-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-theme-text-secondary text-sm">Total Investments</span>
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-2xl font-bold text-theme-text-primary">{userStats.totalInvestments}</p>
                <p className="text-theme-text-secondary text-sm">{formatPrice(userStats.totalSpent)} invested</p>
              </div>

              <div className="bg-theme-surface rounded-2xl p-6 border border-theme-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-theme-text-secondary text-sm">Active Apps</span>
                  <span className="text-2xl">📱</span>
                </div>
                <p className="text-2xl font-bold text-theme-text-primary">{userStats.totalApps}</p>
                <p className="text-theme-text-secondary text-sm">Avg {userStats.avgAppPerformance}% performance</p>
              </div>

              <div className="bg-theme-surface rounded-2xl p-6 border border-theme-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-theme-text-secondary text-sm">Apps Liked</span>
                  <span className="text-2xl">❤️</span>
                </div>
                <p className="text-2xl font-bold text-theme-text-primary">{userStats.appsLiked}</p>
                <p className="text-theme-text-secondary text-sm">Discovery activity</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-theme-surface rounded-2xl p-6 border border-theme-border">
              <h3 className="text-lg font-semibold text-theme-text-primary mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => window.location.href = '/swipe'}
                  className="p-4 bg-theme-accent/10 border border-theme-accent/20 rounded-xl hover:bg-theme-accent/20 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-theme-text-primary">Discover Apps</h4>
                  <p className="text-sm text-theme-text-secondary">Find new investment opportunities</p>
                </button>

                <button
                  onClick={() => window.location.href = '/order'}
                  className="p-4 bg-theme-accent/10 border border-theme-accent/20 rounded-xl hover:bg-theme-accent/20 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🚀</div>
                  <h4 className="font-semibold text-theme-text-primary">Order Custom App</h4>
                  <p className="text-sm text-theme-text-secondary">Build your own trading card</p>
                </button>

                <button
                  onClick={() => window.location.href = '/marketplace'}
                  className="p-4 bg-theme-accent/10 border border-theme-accent/20 rounded-xl hover:bg-theme-accent/20 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">🏪</div>
                  <h4 className="font-semibold text-theme-text-primary">Browse Marketplace</h4>
                  <p className="text-sm text-theme-text-secondary">Explore all available apps</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="space-y-6">
            {ownedApps.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-theme-text-primary mb-2">No apps in portfolio</h3>
                <p className="text-theme-text-secondary mb-6">Start discovering and investing in apps</p>
                <button
                  onClick={() => window.location.href = '/swipe'}
                  className="px-6 py-3 bg-theme-accent text-white rounded-xl font-semibold hover:bg-theme-accent/90 transition-colors"
                >
                  Discover Apps
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ownedApps.map((app) => {
                  const { difference, percentage } = calculateGainLoss(app.purchasePrice, app.currentValue);
                  
                  return (
                    <div key={app.id} className="bg-theme-surface rounded-2xl p-6 border border-theme-border">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-theme-text-primary">{app.title}</h3>
                          <p className="text-sm text-theme-text-secondary capitalize">{app.category}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-theme-text-secondary">Purchase Price</p>
                          <p className="text-lg font-semibold text-theme-text-primary">{formatPrice(app.purchasePrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-theme-text-secondary">Current Value</p>
                          <p className="text-lg font-semibold text-theme-text-primary">{formatPrice(app.currentValue)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-theme-text-secondary">Gain/Loss</p>
                          <p className={`text-sm font-semibold ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {difference >= 0 ? '+' : ''}{formatPrice(difference)} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-theme-text-secondary">Monthly Revenue</p>
                          <p className="text-sm font-semibold text-green-500">{formatPrice(app.monthlyRevenue)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-theme-text-secondary">Performance Score</p>
                          <p className="text-lg font-bold text-theme-accent">{app.performance}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-theme-text-secondary">Purchased</p>
                          <p className="text-sm text-theme-text-secondary">
                            {new Date(app.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-theme-surface rounded-2xl p-6 border border-theme-border">
              <h3 className="text-lg font-semibold text-theme-text-primary mb-4">Portfolio Analytics</h3>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📈</div>
                <h4 className="text-xl font-semibold text-theme-text-primary mb-2">Analytics Coming Soon</h4>
                <p className="text-theme-text-secondary">
                  Advanced portfolio analytics and insights will be available soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
