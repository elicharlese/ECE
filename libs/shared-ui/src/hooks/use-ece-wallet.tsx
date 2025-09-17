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
  // Check if we have a valid ThirdWeb client ID
  const hasValidClientId = process.env['NEXT_PUBLIC_THIRDWEB_CLIENT_ID'] &&
    process.env['NEXT_PUBLIC_THIRDWEB_CLIENT_ID'] !== 'your_thirdweb_client_id_here' &&
    process.env['NEXT_PUBLIC_THIRDWEB_CLIENT_ID'].length > 10;

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [eceBalance, setEceBalance] = useState(100); // Default 100 ECE for demo
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!address;

  // Auto-connect in development mode for testing
  useEffect(() => {
    if (!hasValidClientId && process.env['NODE_ENV'] === 'development' && !address) {
      // Auto-connect mock wallet for development testing
      const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      setAddress(mockAddress);
      console.log('Auto-connected mock wallet for development:', mockAddress);
    }
  }, [hasValidClientId, address]);

  const handleConnect = async () => {
    if (!hasValidClientId) {
      // Mock wallet connection for development
      setIsConnecting(true);

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock wallet address
      const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      setAddress(mockAddress);

      setIsConnecting(false);
      console.log('Mock wallet connected:', mockAddress);
    } else {
      // Real ThirdWeb connection would go here
      console.log('Real ThirdWeb connection would be implemented here');
    }
  };

  const handleDisconnect = () => {
    setAddress(undefined);
    setEceBalance(0);
  };

  const refreshBalance = useCallback(async () => {
    if (!address) return;

    try {
      // For mock, just keep the default balance
      if (!hasValidClientId) {
        setEceBalance(100);
        return;
      }

      // Fetch ECE balance from your API
      const response = await fetch(`/api/user/balance?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setEceBalance(data.eceBalance || 0);
      }
    } catch (error) {
      console.error('Failed to fetch ECE balance:', error);
    }
  }, [address, hasValidClientId]);

  useEffect(() => {
    if (isConnected) {
      refreshBalance();
    } else {
      setEceBalance(0);
    }
  }, [isConnected, address, refreshBalance]);

  const user: ThirdWebUser | undefined = address ? { address, data: {} } : undefined;

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
