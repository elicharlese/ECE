import React, { useState } from 'react';
import { Button, GlassCard } from '@ece-platform/shared-ui';
import { useECEWallet } from '@ece-platform/shared-ui';
import { useECEStore } from '@ece-platform/shared-business-logic';
import type { User, Portfolio } from '@ece-platform/shared-types';

export function MainLayout() {
  const [activeView, setActiveView] = useState<'dashboard' | 'cards' | 'trading' | 'portfolio'>('dashboard');
  const { address, eceBalance } = useECEWallet();
  const { user, activePortfolio } = useECEStore();

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-pink-500">ECE Trading Cards</h1>
          <p className="text-sm text-blue-400 mt-1">Desktop Edition</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'cards', label: 'Cards', icon: '🃏' },
            { id: 'trading', label: 'Trading', icon: '💱' },
            { id: 'portfolio', label: 'Portfolio', icon: '💼' },
          ].map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveView(item.id as any)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Wallet Info */}
        <div className="p-4 border-t border-gray-700">
          <GlassCard className="p-4">
            <div className="text-sm">
              <p className="text-green-400 font-semibold">{eceBalance} ECE</p>
              <p className="text-blue-400 text-xs mt-1">
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'Not Connected'}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold capitalize">{activeView}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Welcome, {user?.name || 'Trader'}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'cards' && <CardsView />}
          {activeView === 'trading' && <TradingView />}
          {activeView === 'portfolio' && <PortfolioView />}
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const { activePortfolio } = useECEStore();
  const { eceBalance } = useECEWallet();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <h3 className="text-sm text-gray-400 mb-2">Total Cards</h3>
          <p className="text-2xl font-bold text-green-400">
            {activePortfolio?.cards?.length || 0}
          </p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <h3 className="text-sm text-gray-400 mb-2">ECE Balance</h3>
          <p className="text-2xl font-bold text-green-400">{eceBalance}</p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <h3 className="text-sm text-gray-400 mb-2">Portfolio Value</h3>
          <p className="text-2xl font-bold text-green-400">
            {activePortfolio?.totalValue?.toFixed(2) || '0.00'}
          </p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <h3 className="text-sm text-gray-400 mb-2">Active Trades</h3>
          <p className="text-2xl font-bold text-green-400">0</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-sm">Welcome to ECE Trading Cards Desktop!</span>
            <span className="text-xs text-gray-400">Just now</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function CardsView() {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold mb-4">Your Cards</h3>
      <p className="text-gray-400">Card collection will be displayed here.</p>
    </GlassCard>
  );
}

function TradingView() {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold mb-4">Trading Center</h3>
      <p className="text-gray-400">Trading interface will be displayed here.</p>
    </GlassCard>
  );
}

function PortfolioView() {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
      <p className="text-gray-400">Portfolio details will be displayed here.</p>
    </GlassCard>
  );
}
