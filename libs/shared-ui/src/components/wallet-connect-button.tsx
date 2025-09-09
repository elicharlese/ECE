'use client';

import { useECEWallet } from '../hooks/use-ece-wallet';
import { Button } from '../lib/button';
import { GlassCard } from '../lib/glass-card';
import { Wallet, LogOut, Coins } from 'lucide-react';
import { cn } from '../lib/utils';

interface WalletConnectButtonProps {
  className?: string;
  showBalance?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export function WalletConnectButton({ 
  className, 
  showBalance = true, 
  variant = 'default' 
}: WalletConnectButtonProps) {
  const { address, isConnected, isConnecting, eceBalance, connect, disconnect } = useECEWallet();

  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        variant={variant}
        className={cn("gap-2", className)}
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showBalance && (
        <GlassCard className="px-3 py-2 flex items-center gap-2">
          <Coins className="h-4 w-4 text-[#F92672]" />
          <span className="text-sm font-medium">{eceBalance.toFixed(2)} ECE</span>
        </GlassCard>
      )}
      
      <div className="flex items-center gap-1">
        <GlassCard className="px-3 py-2">
          <span className="text-sm font-mono">{formatAddress(address!)}</span>
        </GlassCard>
        
        <Button
          onClick={disconnect}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
