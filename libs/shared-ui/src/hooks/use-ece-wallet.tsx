'use client';

import { useEffect, useState, useCallback } from 'react';

// Mock ThirdWeb functionality for development to avoid dependency conflicts
interface ThirdWebUser {
  address: string;
  data?: unknown;
}

export interface ECEWalletState {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  user: ThirdWebUser | undefined;
  eceBalance: number;
  connect: () => void;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

export function useECEWallet(): ECEWalletState {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [eceBalance, setEceBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState<ThirdWebUser | undefined>(undefined);

  const isConnected = !!address;

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Mock wallet connection for development
      const mockAddress = 'mock-wallet-' + Date.now();
      setAddress(mockAddress);
      setUser({ address: mockAddress, data: {} });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(undefined);
    setUser(undefined);
    setEceBalance(0);
  };

  const refreshBalance = useCallback(async () => {
    if (!address) return;
    
    try {
      // Fetch ECE balance from your API
      const response = await fetch(`/api/user/balance?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setEceBalance(data.eceBalance || 0);
      }
    } catch (error) {
      console.error('Failed to fetch ECE balance:', error);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected) {
      refreshBalance();
    } else {
      setEceBalance(0);
    }
  }, [isConnected, address, refreshBalance]);

  return {
    address,
    isConnected,
    isConnecting,
    user,
    eceBalance,
    connect: handleConnect,
    disconnect: handleDisconnect,
    refreshBalance,
  };
}
