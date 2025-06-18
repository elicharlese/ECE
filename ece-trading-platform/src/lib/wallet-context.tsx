'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Stub interfaces for wallet types
interface PublicKey {
  toBase58(): string;
}

interface WalletAdapter {
  name: string;
  url: string;
  icon: string;
  readyState: 'Installed' | 'NotDetected' | 'Loadable' | 'Unsupported';
  publicKey: PublicKey | null;
  connecting: boolean;
  connected: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
}

interface WalletContextType {
  wallets: WalletAdapter[];
  wallet: WalletAdapter | null;
  publicKey: PublicKey | null;
  connecting: boolean;
  connected: boolean;
  select: (walletName: string) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}

// Create context
const WalletContext = createContext<WalletContextType | null>(null);

// Stub wallet implementations
const createStubWallet = (name: string, url: string, icon: string): WalletAdapter => {
  let isConnected = false;
  let isConnecting = false;
  let pubKey: PublicKey | null = null;

  return {
    name,
    url,
    icon,
    readyState: 'Installed', // Stub as installed for demo
    publicKey: pubKey,
    connecting: isConnecting,
    connected: isConnected,
    
    async connect() {
      isConnecting = true;
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a fake public key for demo
      pubKey = {
        toBase58: () => 'Demo' + name + 'PublicKey' + Math.random().toString(36).substr(2, 9)
      };
      
      isConnected = true;
      isConnecting = false;
    },
    
    async disconnect() {
      isConnected = false;
      pubKey = null;
    },
    
    async signMessage(message: Uint8Array): Promise<Uint8Array> {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }
      // Return a fake signature for demo
      return new Uint8Array(64).fill(1);
    }
  };
};

// Stub wallets
const stubWallets: WalletAdapter[] = [
  createStubWallet('Phantom', 'https://phantom.app/', '/phantom-icon.png'),
  createStubWallet('Solflare', 'https://solflare.com/', '/solflare-icon.png'),
  createStubWallet('Backpack', 'https://backpack.app/', '/backpack-icon.png'),
];

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletAdapter | null>(null);
  const [wallets] = useState<WalletAdapter[]>(stubWallets);

  const select = useCallback((walletName: string) => {
    const wallet = wallets.find(w => w.name === walletName);
    setSelectedWallet(wallet || null);
  }, [wallets]);

  const connect = useCallback(async () => {
    if (selectedWallet) {
      await selectedWallet.connect();
    }
  }, [selectedWallet]);

  const disconnect = useCallback(async () => {
    if (selectedWallet) {
      await selectedWallet.disconnect();
    }
  }, [selectedWallet]);

  const signMessage = useCallback(async (message: Uint8Array): Promise<Uint8Array> => {
    if (!selectedWallet) {
      throw new Error('No wallet selected');
    }
    return selectedWallet.signMessage(message);
  }, [selectedWallet]);

  const value: WalletContextType = {
    wallets,
    wallet: selectedWallet,
    publicKey: selectedWallet?.publicKey || null,
    connecting: selectedWallet?.connecting || false,
    connected: selectedWallet?.connected || false,
    select,
    connect,
    disconnect,
    signMessage,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
