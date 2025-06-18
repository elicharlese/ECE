'use client';

import { useState } from 'react';
import { useTheme } from '@/src/lib/theme-context';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { BottomNavigation } from '@/src/components/bottom-navigation';
import type { TradingCard } from '@/src/lib/card-store';

export default function TestPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    appName: 'TestApp Pro',
    customerName: 'John Doe',
    customerEmail: 'john@example.com'
  });

  const handleCreateTestOrder = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to create test order'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cards');
      const data = await response.json();
      setResult({
        success: true,
        message: `Found ${data.cards.length} cards`,
        cards: data.cards
      });
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to fetch cards'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-background">
      <nav className="flex justify-between items-center p-6 bg-theme-surface border-b border-theme-border">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center space-x-2"
        >
          <div className="text-2xl font-bold text-theme-text-primary">ECE</div>
          <span className="px-2 py-1 bg-theme-accent/20 text-theme-accent rounded text-xs font-medium">TEST</span>
        </button>
        <ThemeToggle />
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-text-primary mb-4">
            Trading Card System Test
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Test the order-to-trading-card workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Create Test Order</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">App Name</label>
                <input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => setFormData({...formData, appName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Customer Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCreateTestOrder}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating...' : '🎯 Create Test Order & Generate Card'}
              </button>
              
              <button
                onClick={handleFetchCards}
                disabled={loading}
                className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Loading...' : '📋 View All Cards'}
              </button>
              
              <button
                onClick={() => window.location.href = '/marketplace'}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                🏪 Go to Marketplace
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${
                  result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  <div className="font-semibold mb-2">
                    {result.success ? '✅ Success' : '❌ Error'}
                  </div>
                  <div className="text-sm">
                    {result.message || result.error}
                  </div>
                </div>

                {result.order && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">Order Created:</h3>
                    <div className="text-sm text-white/80 space-y-1">
                      <div>ID: {result.order.id}</div>
                      <div>App: {result.order.appName}</div>
                      <div>Customer: {result.order.customerName}</div>
                      <div>Status: {result.order.status}</div>
                      <div>Amount: ${result.order.totalAmount}</div>
                    </div>
                  </div>
                )}

                {result.card && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">Trading Card Generated:</h3>
                    <div className="text-sm text-white/80 space-y-1">
                      <div>ID: {result.card.id}</div>
                      <div>Title: {result.card.title}</div>
                      <div>Rarity: {result.card.rarity}</div>
                      <div>Price: ${result.card.currentPrice}</div>
                      <div>Performance: {result.card.stats.performance}</div>
                      <div>Security: {result.card.stats.security}</div>
                    </div>
                  </div>
                )}

                {result.cards && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">All Cards:</h3>
                    <div className="text-sm text-white/80 space-y-2">
                      {result.cards.map((card: TradingCard, index: number) => (
                        <div key={card.id} className="border-b border-white/10 pb-2">
                          <div>#{index + 1}: {card.title}</div>
                          <div>Rarity: {card.rarity} | Price: ${card.currentPrice}</div>
                          <div>Owner: {card.owner.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.cardError && (
                  <div className="bg-yellow-500/20 text-yellow-400 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Card Generation Error:</h3>
                    <div className="text-sm">{result.cardError}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-white/60 mb-4">🎮</div>
                <p className="text-white/60">
                  Click a button above to test the system
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
