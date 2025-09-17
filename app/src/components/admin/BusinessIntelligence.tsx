'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Target
} from 'lucide-react';

interface BusinessMetrics {
  revenue: {
    total: number;
    growth: number;
    trend: number[];
    byPeriod: { period: string; amount: number }[];
  };
  users: {
    total: number;
    active: number;
    growth: number;
    retention: number;
    acquisition: { source: string; count: number }[];
  };
  transactions: {
    total: number;
    volume: number;
    averageValue: number;
    successRate: number;
    byCategory: { category: string; count: number; value: number }[];
  };
  engagement: {
    dailyActive: number;
    sessionDuration: number;
    pageViews: number;
    bounceRate: number;
    features: { feature: string; usage: number }[];
  };
}

export function BusinessIntelligence() {
  const [timeframe, setTimeframe] = React.useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Mock data - in real implementation, this would come from API
  const [metrics, setMetrics] = React.useState<BusinessMetrics>({
    revenue: {
      total: 1234567,
      growth: 23.5,
      trend: [120000, 135000, 142000, 155000, 168000, 180000, 195000],
      byPeriod: [
        { period: 'Q1', amount: 340000 },
        { period: 'Q2', amount: 420000 },
        { period: 'Q3', amount: 385000 },
        { period: 'Q4', amount: 450000 }
      ]
    },
    users: {
      total: 45692,
      active: 28934,
      growth: 18.2,
      retention: 76.8,
      acquisition: [
        { source: 'Organic', count: 12456 },
        { source: 'Social Media', count: 8923 },
        { source: 'Referral', count: 6745 },
        { source: 'Paid Ads', count: 4532 },
        { source: 'Direct', count: 3421 }
      ]
    },
    transactions: {
      total: 23456,
      volume: 156789,
      averageValue: 67.89,
      successRate: 96.7,
      byCategory: [
        { category: 'Trading Cards', count: 15600, value: 890000 },
        { category: 'Premium Features', count: 4200, value: 245000 },
        { category: 'Marketplace Fees', count: 2800, value: 125000 },
        { category: 'Subscriptions', count: 856, value: 89000 }
      ]
    },
    engagement: {
      dailyActive: 8934,
      sessionDuration: 24.5,
      pageViews: 156789,
      bounceRate: 23.4,
      features: [
        { feature: 'Trading', usage: 89.2 },
        { feature: 'Marketplace', usage: 76.8 },
        { feature: 'Profile', usage: 65.4 },
        { feature: 'Discover', usage: 58.9 },
        { feature: 'Wallet', usage: 45.6 }
      ]
    }
  });

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportData = () => {
    // Implementation for data export
    console.log('Exporting data for timeframe:', timeframe);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ece-light">Business Intelligence</h2>
          <p className="text-ece-muted mt-1">Comprehensive analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light focus:outline-none focus:border-ece-accent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-ece-info/20 text-ece-info rounded-lg hover:bg-ece-info/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-3 py-2 bg-ece-success/20 text-ece-success rounded-lg hover:bg-ece-success/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(metrics.revenue.total)}
          change={`+${formatPercentage(metrics.revenue.growth)}`}
          changeType="positive"
          icon={DollarSign}
        />
        <KPICard
          title="Active Users"
          value={formatNumber(metrics.users.active)}
          change={`+${formatPercentage(metrics.users.growth)}`}
          changeType="positive"
          icon={Users}
        />
        <KPICard
          title="Transactions"
          value={formatNumber(metrics.transactions.total)}
          change={`${formatPercentage(metrics.transactions.successRate)} success`}
          changeType="positive"
          icon={ShoppingCart}
        />
        <KPICard
          title="Avg Session"
          value={`${metrics.engagement.sessionDuration}m`}
          change={`${formatPercentage(metrics.engagement.bounceRate)} bounce rate`}
          changeType="neutral"
          icon={Target}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={metrics.revenue} />
        <UserAcquisitionChart data={metrics.users.acquisition} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionAnalysis data={metrics.transactions} />
        <EngagementMetrics data={metrics.engagement} />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueBreakdown data={metrics.revenue.byPeriod} />
        <UserRetention retention={metrics.users.retention} />
        <FeatureUsage features={metrics.engagement.features} />
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
}

function KPICard({ title, value, change, changeType, icon: Icon }: KPICardProps) {
  const changeColor = changeType === 'positive' ? 'text-ece-success' : 
                     changeType === 'negative' ? 'text-ece-error' : 'text-ece-muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-ece-accent" />
        <TrendingUp className="w-4 h-4 text-ece-success" />
      </div>
      <div>
        <p className="text-sm text-ece-muted mb-1">{title}</p>
        <p className="text-2xl font-bold text-ece-light mb-1">{value}</p>
        <p className={`text-sm ${changeColor}`}>{change}</p>
      </div>
    </motion.div>
  );
}

function RevenueChart({ data }: { data: BusinessMetrics['revenue'] }) {
  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <LineChart className="w-6 h-6 text-ece-accent" />
        <h3 className="text-lg font-semibold text-ece-light">Revenue Trend</h3>
      </div>
      
      <div className="h-64 relative">
        {/* Simple line chart visualization */}
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
          {data.trend.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-8 bg-gradient-to-t from-ece-accent to-ece-info rounded-t-lg"
                style={{ 
                  height: `${(value / Math.max(...data.trend)) * 200}px`,
                  minHeight: '20px'
                }}
              />
              <span className="text-xs text-ece-muted mt-2">
                W{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-ece-muted">
        <span>Growth: +{data.growth}%</span>
        <span>Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(data.total)}</span>
      </div>
    </div>
  );
}

function UserAcquisitionChart({ data }: { data: BusinessMetrics['users']['acquisition'] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <PieChart className="w-6 h-6 text-ece-accent" />
        <h3 className="text-lg font-semibold text-ece-light">User Acquisition</h3>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.count / total) * 100;
          return (
            <div key={item.source} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ece-light">{item.source}</span>
                <span className="text-ece-muted">{item.count.toLocaleString()} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-ece-dark/50 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-ece-accent' :
                    index === 1 ? 'bg-ece-success' :
                    index === 2 ? 'bg-ece-info' :
                    index === 3 ? 'bg-ece-warning' : 'bg-ece-error'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransactionAnalysis({ data }: { data: BusinessMetrics['transactions'] }) {
  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-ece-accent" />
        <h3 className="text-lg font-semibold text-ece-light">Transaction Analysis</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-ece-light">{data.total.toLocaleString()}</p>
          <p className="text-sm text-ece-muted">Total Transactions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-ece-light">${data.averageValue}</p>
          <p className="text-sm text-ece-muted">Average Value</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.byCategory.map((item, index) => (
          <div key={item.category} className="flex justify-between items-center">
            <span className="text-sm text-ece-light">{item.category}</span>
            <div className="text-right">
              <p className="text-sm font-medium text-ece-light">{item.count.toLocaleString()}</p>
              <p className="text-xs text-ece-muted">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngagementMetrics({ data }: { data: BusinessMetrics['engagement'] }) {
  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-6 h-6 text-ece-accent" />
        <h3 className="text-lg font-semibold text-ece-light">Engagement Metrics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-ece-light">{data.dailyActive.toLocaleString()}</p>
          <p className="text-sm text-ece-muted">Daily Active Users</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-ece-light">{data.pageViews.toLocaleString()}</p>
          <p className="text-sm text-ece-muted">Page Views</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-ece-muted">Session Duration</span>
          <span className="text-sm text-ece-light">{data.sessionDuration} minutes</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-ece-muted">Bounce Rate</span>
          <span className="text-sm text-ece-light">{data.bounceRate}%</span>
        </div>
      </div>
    </div>
  );
}

function RevenueBreakdown({ data }: { data: BusinessMetrics['revenue']['byPeriod'] }) {
  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-ece-light mb-4">Revenue by Quarter</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.period} className="flex justify-between items-center">
            <span className="text-sm text-ece-muted">{item.period}</span>
            <span className="text-sm font-medium text-ece-light">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserRetention({ retention }: { retention: number }) {
  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-ece-light mb-4">User Retention</h4>
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-ece-dark"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - retention / 100)}`}
              className="text-ece-success"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-ece-light">{retention}%</span>
          </div>
        </div>
        <p className="text-sm text-ece-muted">30-day retention rate</p>
      </div>
    </div>
  );
}

function FeatureUsage({ features }: { features: BusinessMetrics['engagement']['features'] }) {
  return (
    <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-ece-light mb-4">Feature Usage</h4>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={feature.feature} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-ece-light">{feature.feature}</span>
              <span className="text-ece-muted">{feature.usage}%</span>
            </div>
            <div className="w-full bg-ece-dark/50 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-ece-accent"
                initial={{ width: 0 }}
                animate={{ width: `${feature.usage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusinessIntelligence;
