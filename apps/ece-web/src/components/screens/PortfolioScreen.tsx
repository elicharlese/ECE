import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useECEStore, Portfolio } from '@ece-platform/shared-business-logic';
import { Button } from '@ece-platform/shared-ui';

export default function PortfolioScreen() {
  const { portfolios, activePortfolio, loadPortfolios, createPortfolio, setActivePortfolio } = useECEStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [selectedView, setSelectedView] = useState<'overview' | 'holdings' | 'performance'>('overview');

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  const handleCreatePortfolio = async () => {
    if (newPortfolioName.trim()) {
      await createPortfolio(newPortfolioName.trim());
      setNewPortfolioName('');
      setShowCreateModal(false);
    }
  };

  const mockHoldings = [
    { id: '1', name: 'Microsoft Corp', symbol: 'MSFT', quantity: 5, avgCost: 1200, currentValue: 1350, change: 12.5 },
    { id: '2', name: 'Apple Inc', symbol: 'AAPL', quantity: 3, avgCost: 980, currentValue: 1050, change: 7.1 },
    { id: '3', name: 'Tesla Inc', symbol: 'TSLA', quantity: 2, avgCost: 2100, currentValue: 1950, change: -7.1 },
    { id: '4', name: 'Amazon.com', symbol: 'AMZN', quantity: 4, avgCost: 1800, currentValue: 1920, change: 6.7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#134E4A] to-[#0F766E] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Portfolio</h1>
              <select 
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm"
                value={activePortfolio?.id || ''}
                onChange={(e) => {
                  const selected = portfolios.find((p: Portfolio) => p.id === e.target.value);
                  setActivePortfolio(selected || null);
                }}
              >
                <option value="">Select Portfolio</option>
                {portfolios.map((p: Portfolio) => (
                  <option key={p.id} value={p.id} className="bg-[#272822]">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>
                New Portfolio
              </Button>
              <Button size="sm">
                Add Cards
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-300">Total Value</p>
              <p className="text-3xl font-bold text-[#66D9EF]">$28,450</p>
              <p className="text-sm text-[#A6E22E] mt-1">+$2,340 (8.9%)</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-300">Total Cards</p>
              <p className="text-3xl font-bold text-[#F92672]">14</p>
              <p className="text-sm text-gray-400 mt-1">Across 4 sectors</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-300">Daily P&L</p>
              <p className="text-3xl font-bold text-[#A6E22E]">+$450</p>
              <p className="text-sm text-[#A6E22E] mt-1">+1.6%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-300">Best Performer</p>
              <p className="text-xl font-bold text-white">MSFT</p>
              <p className="text-sm text-[#A6E22E] mt-1">+12.5%</p>
            </div>
          </motion.div>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'holdings', label: 'Holdings' },
            { id: 'performance', label: 'Performance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedView === tab.id
                  ? 'bg-[#66D9EF] text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on selected view */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio Chart */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold mb-6">Portfolio Performance</h3>
                <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <p className="text-gray-300">Performance chart will be displayed here</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Allocation */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold mb-6">Allocation</h3>
                <div className="space-y-4">
                  {[
                    { sector: 'Technology', percentage: 45, color: '#66D9EF' },
                    { sector: 'Healthcare', percentage: 25, color: '#A6E22E' },
                    { sector: 'Finance', percentage: 20, color: '#F92672' },
                    { sector: 'Energy', percentage: 10, color: '#FD971F' },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.sector}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {selectedView === 'holdings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Card</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Avg Cost</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Current Value</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">P&L</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {mockHoldings.map((holding, index) => (
                    <tr key={holding.id} className="hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#F92672] to-[#66D9EF] rounded-lg"></div>
                          <div>
                            <p className="font-medium">{holding.name}</p>
                            <p className="text-sm text-gray-400">{holding.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{holding.quantity}</td>
                      <td className="px-6 py-4 text-sm">${holding.avgCost.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">${holding.currentValue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={holding.change >= 0 ? 'text-[#A6E22E]' : 'text-[#F92672]'}>
                          {holding.change >= 0 ? '+' : ''}{holding.change}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Sell
                          </Button>
                          <Button size="sm" variant="ghost">
                            Trade
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {selectedView === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-6">Performance Metrics</h3>
              <div className="space-y-6">
                {[
                  { label: 'Total Return', value: '+28.4%', subtext: 'Since inception' },
                  { label: 'Annualized Return', value: '+15.2%', subtext: 'Average yearly' },
                  { label: 'Sharpe Ratio', value: '1.34', subtext: 'Risk-adjusted return' },
                  { label: 'Max Drawdown', value: '-8.7%', subtext: 'Largest decline' },
                ].map((metric, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
                    <div>
                      <p className="font-medium">{metric.label}</p>
                      <p className="text-sm text-gray-400">{metric.subtext}</p>
                    </div>
                    <p className="text-xl font-bold text-[#66D9EF]">{metric.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {[
                  { type: 'Buy', card: 'MSFT', quantity: 2, price: 1350, date: '2 hours ago' },
                  { type: 'Sell', card: 'GOOGL', quantity: 1, price: 2100, date: '1 day ago' },
                  { type: 'Buy', card: 'AAPL', quantity: 3, price: 1050, date: '2 days ago' },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        transaction.type === 'Buy' ? 'bg-[#A6E22E] text-black' : 'bg-[#F92672] text-white'
                      }`}>
                        {transaction.type === 'Buy' ? 'B' : 'S'}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.type} {transaction.card}</p>
                        <p className="text-sm text-gray-400">{transaction.quantity} cards @ ${transaction.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Create Portfolio Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#272822] border border-white/20 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-semibold mb-4">Create New Portfolio</h3>
            <input
              type="text"
              placeholder="Portfolio name..."
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#66D9EF] mb-4"
            />
            <div className="flex space-x-3">
              <Button onClick={handleCreatePortfolio} className="flex-1">
                Create
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
