'use client';

import { useState, useCallback, useEffect } from 'react';
import { WalletConnection, CryptoPaymentError, CRYPTO_ERROR_CODES } from '@ece-platform/shared-types';

// Mock contract address - replace with actual ECE token contract
const ECE_TOKEN_CONTRACT = {
  address: '0x1234567890123456789012345678901234567890',
  symbol: 'ECE',
  decimals: 18,
  name: 'ECE Token',
  chainId: 1 // Ethereum mainnet
};

export const useCryptoWallet = () => {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectToProvider('metamask', accounts[0]);
        }
      }
    } catch (err) {
      console.warn('No existing wallet connection found');
    }
  }, []);

  const connectToProvider = useCallback(async (provider: string, address?: string) => {
    try {
      let walletAddress = address;
      let chainId = 1;
      
      if (provider === 'metamask' && window.ethereum) {
        if (!walletAddress) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          walletAddress = accounts[0];
        }
        
        const network = await window.ethereum.request({ method: 'eth_chainId' });
        chainId = parseInt(network, 16);
        
        // Get ETH balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [walletAddress, 'latest']
        });
        
        // Convert from Wei to ETH
        const ethBalance = (parseInt(balance, 16) / Math.pow(10, 18)).toString();
        
        // Get ECE token balance (mock for now)
        const eceBalance = walletAddress ? await getECETokenBalance(walletAddress) : "0";
        
        const newConnection: WalletConnection = {
          address: walletAddress!,
          chainId,
          isConnected: true,
          provider,
          balance: ethBalance,
          eceBalance
        };
        
        setConnection(newConnection);
        setError(null);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        return newConnection;
      }
      
      throw new CryptoPaymentError('Wallet provider not available', CRYPTO_ERROR_CODES.NETWORK_ERROR);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const connect = useCallback(async (provider: string) => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      await connectToProvider(provider);
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, connectToProvider]);

  const disconnect = useCallback(async () => {
    try {
      if (window.ethereum) {
        // Remove event listeners
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
      
      setConnection(null);
      setError(null);
    } catch (err: any) {
      console.error('Disconnect failed:', err);
      setError('Failed to disconnect wallet');
    }
  }, []);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else if (connection && accounts[0] !== connection.address) {
      // Account changed, reconnect
      connectToProvider(connection.provider, accounts[0]);
    }
  }, [connection, disconnect, connectToProvider]);

  const handleChainChanged = useCallback((chainId: string) => {
    const newChainId = parseInt(chainId, 16);
    if (connection) {
      setConnection({ ...connection, chainId: newChainId });
    }
  }, [connection]);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not available');
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (err: any) {
      if (err.code === 4902) {
        // Chain not added to wallet
        throw new CryptoPaymentError('Network not added to wallet', CRYPTO_ERROR_CODES.NETWORK_ERROR);
      }
      throw err;
    }
  }, []);

  const getBalance = useCallback(async (): Promise<string | undefined> => {
    if (!connection || !window.ethereum) return undefined;
    
    try {
      const balance = connection.balance;
      return balance.toString();
    } catch (error) {
      console.error('Error getting balance:', error);
      return undefined;
    }
  }, [connection]);

  const getECEBalance = useCallback(async (): Promise<string | undefined> => {
    if (!connection) return undefined;
    
    try {
      const eceBalance = await getECETokenBalance(connection.address);
      setConnection({ ...connection, eceBalance });
      return eceBalance;
    } catch (err) {
      console.error('Failed to get ECE balance:', err);
      return undefined;
    }
  }, [connection]);

  const sendTransaction = useCallback(async (to: string, amount: string, currency: 'ETH' | 'ECE') => {
    if (!connection || !window.ethereum) {
      throw new CryptoPaymentError('Wallet not connected', CRYPTO_ERROR_CODES.UNAUTHORIZED);
    }
    
    try {
      let txHash: string;
      
      if (currency === 'ETH') {
        // Send ETH
        const value = (parseFloat(amount) * Math.pow(10, 18)).toString(16);
        txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{ from: connection.address, to, value: `0x${value}` }]
        });
      } else {
        // Send ECE tokens (requires contract interaction)
        txHash = await sendECETokens(to, amount);
      }
      
      return txHash;
    } catch (err: any) {
      throw new CryptoPaymentError(
        err.message || 'Transaction failed',
        CRYPTO_ERROR_CODES.TRANSACTION_FAILED
      );
    }
  }, [connection]);

  // Mock function to get ECE token balance
  const getECETokenBalance = async (address: string): Promise<string> => {
    // In a real implementation, this would call the ECE token contract
    // For now, return a mock balance
    return "1000.0";
  };

  // Mock function to send ECE tokens
  const sendECETokens = async (to: string, amount: string): Promise<string> => {
    // In a real implementation, this would interact with the ECE token contract
    // For now, return a mock transaction hash
    return "0x" + Math.random().toString(16).substring(2, 66);
  };

  return {
    connection,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
    getBalance,
    getECEBalance,
    sendTransaction
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
