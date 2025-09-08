'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { WalletConnector } from './WalletConnector';
import { useCryptoWallet } from '../../hooks/useCryptoWallet';
import { WalletConnection, FiscalLimit, SecuritySettings } from '@ece-platform/shared-types/crypto';
import {
  Wallet,
  Shield,
  AlertTriangle,
  TrendingUp,
  Settings,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  RefreshCw,
  Bell,
  Lock,
  Unlock
} from 'lucide-react';

interface CryptoWalletProfileProps {
  userId: string;
  className?: string;
}

export const CryptoWalletProfile: React.FC<CryptoWalletProfileProps> = ({
  userId,
  className = ''
}) => {
  const { connection, getBalance, getECEBalance } = useCryptoWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'limits' | 'security' | 'history'>('overview');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fiscalLimits, setFiscalLimits] = useState<FiscalLimit[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (connection) {
      loadUserData();
    }
  }, [connection]);

  const loadUserData = async () => {
    try {
      // Load fiscal limits, security settings, and transaction history
      // In a real app, these would come from your API
      setFiscalLimits([
        {
          id: '1',
          userId,
          limitType: 'daily',
          currency: 'ECE',
          amount: 10000,
          currentUsage: 2500,
          isActive: true
        },
        {
          id: '2',
          userId,
          limitType: 'monthly',
          currency: 'USD',
          amount: 50000,
          currentUsage: 12000,
          isActive: true
        }
      ]);

      setSecuritySettings({
        id: '1',
        userId,
        twoFactorEnabled: true,
        multiSigEnabled: false,
        withdrawalWhitelist: [],
        sessionTimeout: 3600,
        maxDailyTransactions: 50,
        requiresApprovalAbove: 1000,
        coldWalletThreshold: 100000
      });

      setTransactions([
        {
          id: '1',
          type: 'purchase',
          amount: '500',
          currency: 'ECE',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 86400000),
          description: 'Card purchase'
        },
        {
          id: '2',
          type: 'deposit',
          amount: '1000',
          currency: 'ECE',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 172800000),
          description: 'Wallet deposit'
        }
      ]);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleRefreshBalances = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([getBalance(), getECEBalance()]);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyAddress = () => {
    if (connection?.address) {
      navigator.clipboard.writeText(connection.address);
    }
  };

  const formatBalance = (balance: string, currency: string = 'ECE') => {
    if (!balanceVisible) return '••••••';
    const num = parseFloat(balance);
    return `${num.toLocaleString()} ${currency}`;
  };

  const getLimitUsagePercentage = (limit: FiscalLimit) => {
    return (limit.currentUsage / limit.amount) * 100;
  };

  const getLimitStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (!connection?.isConnected) {
    return (
      <div className={className}>
        <WalletConnector className="max-w-md mx-auto" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Wallet Overview */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Crypto Wallet
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {connection.address.slice(0, 6)}...{connection.address.slice(-4)}
                </span>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => window.open(`https://etherscan.io/address/${connection.address}`, '_blank')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshBalances}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">ECE Balance</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatBalance(connection.eceBalance)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300">ETH Balance</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatBalance(connection.balance, 'ETH')}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: Wallet },
            { id: 'limits', label: 'Limits', icon: AlertTriangle },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'history', label: 'History', icon: Bell }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Network</p>
                <p className="font-semibold">Ethereum</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Chain ID</p>
                <p className="font-semibold">{connection.chainId}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Provider</p>
                <p className="font-semibold capitalize">{connection.provider}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'limits' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fiscal Limits</h3>
            {fiscalLimits.map((limit) => {
              const percentage = getLimitUsagePercentage(limit);
              return (
                <div key={limit.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{limit.limitType} Limit</span>
                    <span className={`text-sm font-semibold ${getLimitStatusColor(percentage)}`}>
                      {percentage.toFixed(1)}% used
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{limit.currentUsage.toLocaleString()} {limit.currency}</span>
                      <span>{limit.amount.toLocaleString()} {limit.currency}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage >= 90 ? 'bg-red-500' :
                        percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'security' && securitySettings && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {securitySettings.twoFactorEnabled ? (
                    <Lock className="w-5 h-5 text-green-500" />
                  ) : (
                    <Unlock className="w-5 h-5 text-red-500" />
                  )}
                  <span>Two-Factor Auth</span>
                </div>
                <span className={`text-sm ${securitySettings.twoFactorEnabled ? 'text-green-500' : 'text-red-500'}`}>
                  {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {securitySettings.multiSigEnabled ? (
                    <Lock className="w-5 h-5 text-green-500" />
                  ) : (
                    <Unlock className="w-5 h-5 text-red-500" />
                  )}
                  <span>Multi-Signature</span>
                </div>
                <span className={`text-sm ${securitySettings.multiSigEnabled ? 'text-green-500' : 'text-red-500'}`}>
                  {securitySettings.multiSigEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Transaction Limits</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Daily Transactions:</span>
                  <span>{securitySettings.maxDailyTransactions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approval Required Above:</span>
                  <span>${securitySettings.requiresApprovalAbove.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold Wallet Threshold:</span>
                  <span>${securitySettings.coldWalletThreshold.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h3>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-green-100 text-green-600' :
                      tx.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{tx.type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tx.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.currency}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tx.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
