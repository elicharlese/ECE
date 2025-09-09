'use client';

import { useECEWallet } from '../hooks/use-ece-wallet';
import { ReactNode } from 'react';
import { GlassCard } from '../lib/glass-card';
import { WalletConnectButton } from './wallet-connect-button';
import { Wallet, Shield, Coins } from 'lucide-react';

interface ECEWalletGuardProps {
  children: ReactNode;
  showOnboarding?: boolean;
}

export function ECEWalletGuard({ children, showOnboarding = true }: ECEWalletGuardProps) {
  const { isConnected } = useECEWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-2xl w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F92672] to-[#FD5C63] rounded-full flex items-center justify-center">
                <Wallet className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-[#A6E3A1] to-[#74C0FC] rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F92672] to-[#FD5C63] bg-clip-text text-transparent">
              Welcome to ECE Trading Cards
            </h1>
            <p className="text-gray-300 text-lg">
              Connect your wallet to access the revolutionary M&A trading card ecosystem
            </p>
          </div>

          {showOnboarding && (
            <div className="space-y-4 text-left">
              <h2 className="text-xl font-semibold text-center mb-4">Platform Overview</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#F92672]">
                    <Coins className="h-5 w-5" />
                    <span className="font-medium">ECE Currency</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    All purchases, trading, and valuations use ECE tokens. Your portfolio value reflects ECE holdings.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#74C0FC]">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Wallet Authentication</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Secure wallet-based authentication ensures your assets and identity are protected.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#A6E3A1]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Trading Cards</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Collect and trade M&A-themed cards representing real companies and deals.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#F9E2AF]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    <span className="font-medium">Marketplace</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Buy, sell, and auction cards in our ECE-powered marketplace with advanced trading features.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <WalletConnectButton className="w-full max-w-sm mx-auto" showBalance={false} />
          </div>

          <p className="text-xs text-gray-500">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </GlassCard>
      </div>
    );
  }

  return <>{children}</>;
}
