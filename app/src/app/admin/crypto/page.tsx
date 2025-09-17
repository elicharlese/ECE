'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@ece-platform/shared-ui';
import { AdminCryptoOverview, CryptoTransaction, FiscalLimit, KYCData } from '@ece-platform/shared-types';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  BarChart3,
  Settings,
  Download,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

const CryptoAdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<AdminCryptoOverview | null>(null);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [pendingKYC, setPendingKYC] = useState<KYCData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'kyc' | 'settings'>('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setIsRefreshing(true);
    try {
      // Mock data - replace with actual API calls
      const mockOverview: AdminCryptoOverview = {
        totalECECirculating: "10000000.00",
        totalUSDValue: 8500000,
        dailyVolume: 125000,
        activeWallets: 2847,
        pendingTransactions: 23,
        averageTransactionSize: 425.50,
        topHolders: [
          { address: "0x1234...5678", balance: "150000.00", percentage: 1.5 },
          { address: "0xabcd...efgh", balance: "125000.00", percentage: 1.25 },
          { address: "0x9876...4321", balance: "100000.00", percentage: 1.0 }
        ],
        priceHistory: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - (23 - i) * 3600000),
          price: 0.85 + Math.random() * 0.1 - 0.05,
          volume: Math.random() * 50000 + 25000
        }))
      };

      const mockTransactions: CryptoTransaction[] = [
        {
          id: '1',
          hash: '0x123...abc',
          from: '0x1234...5678',
          to: '0x9876...4321',
          amount: '500.00',
          currency: 'ECE',
          type: 'payment',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 300000),
          gasUsed: '21000',
          gasFee: '0.002'
        },
        {
          id: '2',
          hash: '0x456...def',
          from: '0xabcd...efgh',
          to: '0x5555...6666',
          amount: '1000.00',
          currency: 'ECE',
          type: 'purchase',
          status: 'pending',
          timestamp: new Date(Date.now() - 600000)
        }
      ];

      const mockKYC: KYCData[] = [
        {
          id: '1',
          userId: 'user1',
          level: 'intermediate',
          status: 'pending',
          documents: [
            { type: 'passport', url: '/docs/passport1.pdf', status: 'pending' }
          ]
        },
        {
          id: '2',
          userId: 'user2',
          level: 'advanced',
          status: 'pending',
          documents: [
            { type: 'drivers_license', url: '/docs/license1.pdf', status: 'approved' },
            { type: 'proof_of_address', url: '/docs/address1.pdf', status: 'pending' }
          ]
        }
      ];

      setOverview(mockOverview);
      setTransactions(mockTransactions);
      setPendingKYC(mockKYC);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'failed':
      case 'rejected':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crypto Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor ECE Token ecosystem and user transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={loadDashboardData}
            disabled={isRefreshing}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total ECE Supply</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(parseFloat(overview.totalECECirculating))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total USD Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(overview.totalUSDValue)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Wallets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(overview.activeWallets)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overview.pendingTransactions}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </GlassCard>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'transactions', label: 'Transactions', icon: Activity },
          { id: 'kyc', label: 'KYC Pending', icon: Shield },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as 'overview' | 'transactions' | 'kyc' | 'settings')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              activeTab === id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Chart */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ECE Price History
            </h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {overview.priceHistory.slice(-12).map((point: any, index: number) => (
                <div
                  key={index}
                  className="bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                  style={{
                    height: `${((point.price - 0.8) / 0.2) * 100}%`,
                    width: '8%'
                  }}
                  title={`$${point.price.toFixed(3)} at ${point.timestamp.toLocaleTimeString()}`}
                />
              ))}
            </div>
          </GlassCard>

          {/* Top Holders */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top ECE Holders
            </h3>
            <div className="space-y-3">
              {overview.topHolders.map((holder: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-mono text-sm">{holder.address}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {holder.percentage}% of supply
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatNumber(parseFloat(holder.balance))} ECE</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ${formatNumber(parseFloat(holder.balance) * 0.85)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'transactions' && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
              </div>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Hash</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">From/To</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm">{tx.hash?.slice(0, 10)}...</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs">
                        <p>From: {tx.from.slice(0, 8)}...</p>
                        <p>To: {tx.to.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">{tx.amount} {tx.currency}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-sm">{tx.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {tx.timestamp.toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {activeTab === 'kyc' && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending KYC Reviews
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {pendingKYC.length} pending
              </span>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          
          <div className="space-y-4">
            {pendingKYC.map((kyc) => (
              <div key={kyc.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">User ID: {kyc.userId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level: {kyc.level}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kyc.status)}`}>
                    {kyc.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Documents:</p>
                   {kyc.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{doc.type.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        <button className="text-blue-600 hover:underline">Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Auto-approve small transactions</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span>KYC requirement threshold</span>
                <input type="number" defaultValue="1000" className="w-24 p-2 border rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span>Daily withdrawal limit</span>
                <input type="number" defaultValue="10000" className="w-24 p-2 border rounded" />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Emergency Controls
            </h3>
            <div className="space-y-4">
              <button className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Pause All Transactions
              </button>
              <button className="w-full p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                Enable Maintenance Mode
              </button>
              <button className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Generate System Report
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default CryptoAdminDashboard;
