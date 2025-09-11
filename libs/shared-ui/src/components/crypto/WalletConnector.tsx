'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../lib/button';
import { GlassCard } from '../../lib/glass-card';
import { useCryptoWallet } from '../../hooks/useCryptoWallet';
import { WalletConnection } from '@ece-platform/shared-types';
import { Wallet, AlertCircle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

interface WalletConnectorProps {
  onConnect?: (connection: WalletConnection) => void;
  onDisconnect?: () => void;
  className?: string;
  showBalance?: boolean;
  showECEBalance?: boolean;
}

const SUPPORTED_WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using MetaMask wallet'
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Connect using WalletConnect protocol'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔷',
    description: 'Connect using Coinbase Wallet'
  }
];

export const WalletConnector: React.FC<WalletConnectorProps> = ({
  onConnect,
  onDisconnect,
  className = '',
  showBalance = true,
  showECEBalance = true
}) => {
  const {
    connection,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
    getBalance,
    getECEBalance
  } = useCryptoWallet();

  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (connection && onConnect) {
      onConnect(connection);
    }
  }, [connection, onConnect]);

  const handleConnect = useCallback(async (walletId: string) => {
    setSelectedWallet(walletId);
    try {
      await connect(walletId);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      if (onDisconnect) {
        onDisconnect();
      }
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
    }
  }, [disconnect, onDisconnect]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string, decimals: number = 4) => {
    const num = parseFloat(balance);
    return num.toFixed(decimals);
  };

  if (connection?.isConnected) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Wallet Connected
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatAddress(connection.address)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-3 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Network
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  Chain ID: {connection.chainId}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Provider
                </label>
                <p className="text-sm text-gray-900 dark:text-white capitalize">
                  {connection.provider}
                </p>
              </div>
            </div>

            {showBalance && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ETH Balance
                  </label>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {formatBalance(connection.balance)} ETH
                  </p>
                </div>
                {showECEBalance && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ECE Balance
                    </label>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">
                      {formatBalance(connection.eceBalance)} ECE
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                onClick={() => window.open(`https://etherscan.io/address/${connection.address}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Etherscan</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  getBalance();
                  getECEBalance();
                }}
              >
                Refresh Balances
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    );
  }

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="text-center mb-6">
        <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Connect your crypto wallet to start trading ECE tokens
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {SUPPORTED_WALLETS.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => handleConnect(wallet.id)}
            disabled={isConnecting}
            className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600">
                    {wallet.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {wallet.description}
                  </p>
                </div>
              </div>
              {isConnecting && selectedWallet === wallet.id && (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </GlassCard>
  );
};
