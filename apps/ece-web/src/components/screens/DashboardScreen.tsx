import React from 'react';
import { motion } from 'framer-motion';
import { useECEStore } from '@ece-platform/shared-business-logic';
import { Button } from '@ece-platform/shared-ui';

export default function DashboardScreen() {
  const { user, activePortfolio } = useECEStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#134E4A] to-[#0F766E] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-lg"></div>
              <h1 className="text-xl font-bold">ECE Cards</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome, {user?.name || 'Trader'}
              </div>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Portfolio Value</p>
                <p className="text-2xl font-bold text-[#66D9EF]">
                  ${activePortfolio?.totalValue?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#66D9EF]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#66D9EF] text-xl">💰</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Active Trades</p>
                <p className="text-2xl font-bold text-[#A6E22E]">12</p>
              </div>
              <div className="w-12 h-12 bg-[#A6E22E]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#A6E22E] text-xl">📈</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Cards Owned</p>
                <p className="text-2xl font-bold text-[#F92672]">
                  {activePortfolio?.holdings?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#F92672]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#F92672] text-xl">🃏</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Daily P&L</p>
                <p className="text-2xl font-bold text-[#A6E22E]">+$2,450</p>
              </div>
              <div className="w-12 h-12 bg-[#A6E22E]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#A6E22E] text-xl">📊</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Portfolio Performance</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              {/* Chart Placeholder */}
              <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <p className="text-gray-300">Portfolio chart will be displayed here</p>
                </div>
              </div>

              {/* Top Holdings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Top Holdings</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Microsoft Corp', symbol: 'MSFT', value: '$12,450', change: '+2.4%', positive: true },
                    { name: 'Apple Inc', symbol: 'AAPL', value: '$8,920', change: '+1.8%', positive: true },
                    { name: 'Tesla Inc', symbol: 'TSLA', value: '$6,750', change: '-0.5%', positive: false },
                  ].map((holding, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-lg"></div>
                        <div>
                          <p className="font-medium">{holding.name}</p>
                          <p className="text-sm text-gray-400">{holding.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{holding.value}</p>
                        <p className={`text-sm ${holding.positive ? 'text-[#A6E22E]' : 'text-[#F92672]'}`}>
                          {holding.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="ghost">
                  <span className="mr-3">🛒</span>
                  Buy Cards
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <span className="mr-3">💸</span>
                  Sell Cards
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <span className="mr-3">🔄</span>
                  Trade Offers
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <span className="mr-3">📊</span>
                  Analytics
                </Button>
              </div>
            </motion.div>

            {/* Market Trends */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold mb-4">Market Trends</h3>
              <div className="space-y-3">
                {[
                  { name: 'Tech Sector', change: '+5.2%', positive: true },
                  { name: 'Healthcare', change: '+2.1%', positive: true },
                  { name: 'Energy', change: '-1.3%', positive: false },
                  { name: 'Finance', change: '+0.8%', positive: true },
                ].map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{trend.name}</span>
                    <span className={`text-sm font-medium ${trend.positive ? 'text-[#A6E22E]' : 'text-[#F92672]'}`}>
                      {trend.change}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'Bought', card: 'MSFT', time: '2 hours ago' },
                  { action: 'Sold', card: 'GOOGL', time: '5 hours ago' },
                  { action: 'Trade Offer', card: 'TSLA', time: '1 day ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-[#66D9EF]">{activity.action}</span>
                      <span className="ml-1">{activity.card}</span>
                    </div>
                    <span className="text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
