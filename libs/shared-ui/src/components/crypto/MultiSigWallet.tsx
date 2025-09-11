'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../lib/button';
import { GlassCard } from '../../lib/glass-card';
import { SecuritySettings } from '@ece-platform/shared-types';
import {
  Shield,
  Users,
  Key,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Plus,
  X,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react';

interface MultiSigTransaction {
  id: string;
  to: string;
  amount: string;
  currency: string;
  description: string;
  requiredSignatures: number;
  currentSignatures: number;
  signers: string[];
  status: 'pending' | 'approved' | 'executed' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
  createdBy: string;
}

interface MultiSigWalletProps {
  userId: string;
  walletAddress: string;
  className?: string;
}

export const MultiSigWallet: React.FC<MultiSigWalletProps> = ({
  userId,
  walletAddress,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'signers' | 'settings'>('overview');
  const [pendingTransactions, setPendingTransactions] = useState<MultiSigTransaction[]>([]);
  const [signers, setSigners] = useState<string[]>([]);
  const [requiredSignatures, setRequiredSignatures] = useState(2);
  const [newSignerAddress, setNewSignerAddress] = useState('');
  const [isOwner, setIsOwner] = useState(true);
  const [walletBalance, setWalletBalance] = useState('0');

  useEffect(() => {
    loadMultiSigData();
  }, [userId, walletAddress]);

  const loadMultiSigData = async () => {
    try {
      // Mock data - in production, fetch from smart contract
      setSigners([
        '0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f', // User's address
        '0x8ba1f109551bD432803012645Hac136c78746e9b', // Trusted contact 1
        '0x1234567890123456789012345678901234567890'  // Trusted contact 2
      ]);

      setPendingTransactions([
        {
          id: '1',
          to: '0x9999999999999999999999999999999999999999',
          amount: '5000.00',
          currency: 'ECE',
          description: 'Large withdrawal to exchange',
          requiredSignatures: 2,
          currentSignatures: 1,
          signers: ['0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f'],
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000),
          expiresAt: new Date(Date.now() + 86400000 * 6), // 7 days total
          createdBy: '0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f'
        },
        {
          id: '2',
          to: '0x8888888888888888888888888888888888888888',
          amount: '1500.00',
          currency: 'ECE',
          description: 'Payment to contractor',
          requiredSignatures: 2,
          currentSignatures: 2,
          signers: [
            '0x742d35Cc6634C0532925a3b8D404fddBD4f20A6f',
            '0x8ba1f109551bD432803012645Hac136c78746e9b'
          ],
          status: 'approved',
          createdAt: new Date(Date.now() - 7200000),
          expiresAt: new Date(Date.now() + 86400000 * 5),
          createdBy: '0x8ba1f109551bD432803012645Hac136c78746e9b'
        }
      ]);

      setWalletBalance('25000.50');
    } catch (error) {
      console.error('Failed to load multi-sig data:', error);
    }
  };

  const signTransaction = async (transactionId: string) => {
    try {
      // In production, this would call the smart contract
      setPendingTransactions(prev => 
        prev.map(tx => {
          if (tx.id === transactionId && !tx.signers.includes(walletAddress)) {
            const newSigners = [...tx.signers, walletAddress];
            const newSignatureCount = newSigners.length;
            
            return {
              ...tx,
              signers: newSigners,
              currentSignatures: newSignatureCount,
              status: newSignatureCount >= tx.requiredSignatures ? 'approved' : 'pending'
            };
          }
          return tx;
        })
      );
    } catch (error) {
      console.error('Failed to sign transaction:', error);
    }
  };

  const executeTransaction = async (transactionId: string) => {
    try {
      // In production, this would call the smart contract
      setPendingTransactions(prev => 
        prev.map(tx => 
          tx.id === transactionId ? { ...tx, status: 'executed' } : tx
        )
      );
    } catch (error) {
      console.error('Failed to execute transaction:', error);
    }
  };

  const addSigner = async () => {
    if (!newSignerAddress || signers.includes(newSignerAddress)) return;

    try {
      // In production, this would call the smart contract
      setSigners(prev => [...prev, newSignerAddress]);
      setNewSignerAddress('');
    } catch (error) {
      console.error('Failed to add signer:', error);
    }
  };

  const removeSigner = async (signerAddress: string) => {
    try {
      // In production, this would call the smart contract
      setSigners(prev => prev.filter(signer => signer !== signerAddress));
    } catch (error) {
      console.error('Failed to remove signer:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'executed':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'cancelled':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'pending':
      default:
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  const canSign = (transaction: MultiSigTransaction) => {
    return !transaction.signers.includes(walletAddress) && 
           transaction.status === 'pending' &&
           transaction.expiresAt > new Date();
  };

  const canExecute = (transaction: MultiSigTransaction) => {
    return transaction.status === 'approved' && 
           transaction.currentSignatures >= transaction.requiredSignatures;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Multi-Sig Overview */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Multi-Signature Wallet
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enhanced security with multiple approvals required
            </p>
          </div>
        </div>

        {/* Wallet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Balance</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {parseFloat(walletBalance).toLocaleString()} ECE
                </p>
              </div>
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300">Signers</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {signers.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Required</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {requiredSignatures}
                </p>
              </div>
              <Key className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300">Pending</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {pendingTransactions.filter(tx => tx.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'transactions', label: 'Transactions', icon: Clock },
            { id: 'signers', label: 'Signers', icon: Users },
            { id: 'settings', label: 'Settings', icon: Key }
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
      </GlassCard>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security Configuration
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Multi-sig threshold:</span>
                <span className="font-semibold">{requiredSignatures} of {signers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Transaction timeout:</span>
                <span className="font-semibold">7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Your role:</span>
                <span className="font-semibold">{isOwner ? 'Owner' : 'Signer'}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {pendingTransactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {tx.amount} {tx.currency} • {tx.currentSignatures}/{tx.requiredSignatures} signatures
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'transactions' && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Multi-Sig Transactions
          </h3>
          <div className="space-y-4">
            {pendingTransactions.map((tx) => (
              <div key={tx.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{tx.description}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      To: {formatAddress(tx.to)} • {tx.amount} {tx.currency}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {tx.createdAt.toLocaleDateString()} • Expires {tx.expiresAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>

                {/* Signature Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Signatures: {tx.currentSignatures}/{tx.requiredSignatures}</span>
                    <span>{Math.round((tx.currentSignatures / tx.requiredSignatures) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((tx.currentSignatures / tx.requiredSignatures) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Signers */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Signers:</p>
                  <div className="flex flex-wrap gap-2">
                    {signers.map((signer) => (
                      <div
                        key={signer}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                          tx.signers.includes(signer)
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        <span>{formatAddress(signer)}</span>
                        {tx.signers.includes(signer) && <CheckCircle className="w-3 h-3" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {canSign(tx) && (
                    <Button size="sm" onClick={() => signTransaction(tx.id)}>
                      <Key className="w-4 h-4 mr-1" />
                      Sign
                    </Button>
                  )}
                  {canExecute(tx) && (
                    <Button size="sm" variant="outline" onClick={() => executeTransaction(tx.id)}>
                      Execute
                    </Button>
                  )}
                  <button className="text-sm text-blue-600 hover:underline">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === 'signers' && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Authorized Signers
            </h3>
            {isOwner && (
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Signer
              </Button>
            )}
          </div>

          {/* Add New Signer */}
          {isOwner && (
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium mb-3">Add New Signer</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="0x... Ethereum address"
                  value={newSignerAddress}
                  onChange={(e) => setNewSignerAddress(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
                <Button onClick={addSigner} disabled={!newSignerAddress}>
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Signers List */}
          <div className="space-y-3">
            {signers.map((signer, index) => (
              <div key={signer} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-mono text-sm">{signer}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {signer === walletAddress ? 'You' : `Signer ${index + 1}`}
                      {index === 0 && ' (Owner)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(signer)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => window.open(`https://etherscan.io/address/${signer}`, '_blank')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </button>
                  {isOwner && signer !== walletAddress && (
                    <button
                      onClick={() => removeSigner(signer)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === 'settings' && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Multi-Sig Settings
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Signatures
              </label>
              <select
                value={requiredSignatures}
                onChange={(e) => setRequiredSignatures(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                disabled={!isOwner}
              >
                {Array.from({ length: signers.length }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} of {signers.length} signatures required
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium mb-1">Security Notice</p>
                  <p>Changes to multi-sig settings require approval from all current signers. Ensure you have access to the required number of signatures before making changes.</p>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex space-x-3">
                <Button>Save Changes</Button>
                <Button variant="outline">Reset to Default</Button>
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
