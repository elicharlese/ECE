'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../lib/button';
import { GlassCard } from '../../lib/glass-card';
import { CryptoTransaction } from '@ece-platform/shared-types';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';

interface TransactionHistoryProps {
  userId: string;
  className?: string;
  showFilters?: boolean;
  maxItems?: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  userId,
  className = '',
  showFilters = true,
  maxItems
}) => {
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<CryptoTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30d');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadTransactions();
  }, [userId, dateRange]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [transactions, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Mock transaction data - in production, fetch from API
      const mockTransactions: CryptoTransaction[] = [
        {
          id: '1',
          hash: '0x1234567890abcdef1234567890abcdef12345678',
          from: '0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f',
          to: '0x8ba1f109551bD432803012645Hac136c78746e9b',
          amount: '500.00',
          currency: 'ECE',
          type: 'payment',
          status: 'confirmed',
          blockNumber: 18500000,
          gasUsed: '21000',
          gasFee: '0.002',
          timestamp: new Date(Date.now() - 86400000),
          metadata: { description: 'Card purchase payment' }
        },
        {
          id: '2',
          hash: '0x9876543210fedcba9876543210fedcba98765432',
          from: '0x8ba1f109551bD432803012645Hac136c78746e9b',
          to: '0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f',
          amount: '1000.00',
          currency: 'ECE',
          type: 'deposit',
          status: 'confirmed',
          blockNumber: 18499500,
          gasUsed: '25000',
          gasFee: '0.0025',
          timestamp: new Date(Date.now() - 172800000),
          metadata: { description: 'Fiat on-ramp conversion' }
        },
        {
          id: '3',
          from: '0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f',
          to: '0x1111111111111111111111111111111111111111',
          amount: '250.00',
          currency: 'ECE',
          type: 'withdrawal',
          status: 'pending',
          timestamp: new Date(Date.now() - 3600000),
          metadata: { description: 'Fiat off-ramp request' }
        },
        {
          id: '4',
          hash: '0xabcdef1234567890abcdef1234567890abcdef12',
          from: '0x2222222222222222222222222222222222222222',
          to: '0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f',
          amount: '75.50',
          currency: 'ECE',
          type: 'purchase',
          status: 'confirmed',
          blockNumber: 18501200,
          gasUsed: '21000',
          gasFee: '0.0018',
          timestamp: new Date(Date.now() - 259200000),
          metadata: { description: 'Powerup purchase' }
        },
        {
          id: '5',
          from: '0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f',
          to: '0x3333333333333333333333333333333333333333',
          amount: '2000.00',
          currency: 'ECE',
          type: 'conversion',
          status: 'failed',
          timestamp: new Date(Date.now() - 345600000),
          metadata: { description: 'Token swap failed - insufficient liquidity' }
        }
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.metadata?.["description"]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const comparison = a.timestamp.getTime() - b.timestamp.getTime();
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = parseFloat(a.amount) - parseFloat(b.amount);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    // Apply max items limit
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredTransactions(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'purchase':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
      case 'payment':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'conversion':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Amount', 'Currency', 'Status', 'Hash', 'From', 'To', 'Description'].join(','),
      ...filteredTransactions.map(tx => [
        tx.timestamp.toISOString(),
        tx.type,
        tx.amount,
        tx.currency,
        tx.status,
        tx.hash || '',
        tx.from,
        tx.to,
        tx.metadata?.["description"] || ""
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ece_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const transactionStats = useMemo(() => {
    const total = filteredTransactions.reduce((sum, tx) => {
      if (tx.status === 'confirmed') {
        return sum + parseFloat(tx.amount);
      }
      return sum;
    }, 0);

    const incoming = filteredTransactions
      .filter(tx => ['deposit', 'purchase'].includes(tx.type) && tx.status === 'confirmed')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const outgoing = filteredTransactions
      .filter(tx => ['withdrawal', 'payment'].includes(tx.type) && tx.status === 'confirmed')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    return { total, incoming, outgoing };
  }, [filteredTransactions]);

  if (loading) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {transactionStats.total.toLocaleString()} ECE
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Incoming</p>
              <p className="text-xl font-bold text-green-600">
                +{transactionStats.incoming.toLocaleString()} ECE
              </p>
            </div>
            <ArrowDownLeft className="w-8 h-8 text-green-500" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Outgoing</p>
              <p className="text-xl font-bold text-red-600">
                -{transactionStats.outgoing.toLocaleString()} ECE
              </p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-red-500" />
          </div>
        </GlassCard>
      </div>

      {/* Main Transaction List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction History
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportTransactions}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Types</option>
                <option value="payment">Payment</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="purchase">Purchase</option>
                <option value="conversion">Conversion</option>
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        )}

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(transaction.type)}
                    {getStatusIcon(transaction.status)}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {transaction.type}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{transaction.metadata?.description || 'No description'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span>From: {formatAddress(transaction.from)}</span>
                        <ArrowUpRight className="w-3 h-3" />
                        <span>To: {formatAddress(transaction.to)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${
                    ['deposit', 'purchase'].includes(transaction.type) 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {['deposit', 'purchase'].includes(transaction.type) ? '+' : '-'}
                    {parseFloat(transaction.amount).toLocaleString()} {transaction.currency}
                  </p>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>{transaction.timestamp.toLocaleDateString()}</p>
                    <p>{transaction.timestamp.toLocaleTimeString()}</p>
                    
                    {transaction.hash && (
                      <button
                        onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')}
                        className="flex items-center space-x-1 text-blue-600 hover:underline mt-1"
                      >
                        <span className="text-xs">View on Etherscan</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {!maxItems && filteredTransactions.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={loadTransactions}>
              Load More Transactions
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
