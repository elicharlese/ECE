'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/lib/wallet-context';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (publicKey: string) => void;
}

export default function WalletModal({ isOpen, onClose, onConnected }: WalletModalProps) {
  const { wallets, select, connect, connecting, connected, publicKey } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<string>('');

  useEffect(() => {
    if (connected && publicKey) {
      onConnected(publicKey.toBase58());
      onClose();
    }
  }, [connected, publicKey, onConnected, onClose]);

  if (!isOpen) return null;

  const handleWalletSelect = async (walletName: string) => {
    setSelectedWallet(walletName);
    select(walletName);
    
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50">
      <div className="theme-modal-content rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👛</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Connect Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your preferred wallet to connect
          </p>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleWalletSelect(wallet.name)}
              disabled={connecting}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedWallet === wallet.name
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${
                connecting && selectedWallet === wallet.name
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {wallet.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {wallet.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {wallet.readyState === 'Installed' ? 'Ready to connect' : 'Not installed'}
                  </p>
                </div>
                {connecting && selectedWallet === wallet.name && (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This is a demo implementation. Wallet connections are simulated.
          </p>
        </div>
      </div>
    </div>
  );
}
