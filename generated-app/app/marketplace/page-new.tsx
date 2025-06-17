'use client';

import { useState, useEffect } from 'react';
import { Quicksand } from 'next/font/google';
import type { TradingCard } from '@/lib/card-store';

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

export default function MarketplacePage() {
  const [cards, setCards] = useState<TradingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'cards' | 'grid' | 'admin'>('cards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'for-sale' | 'crowdfunding'>('all');

  const theme = {
    primary: "#0a1312",
    secondary: "#1a2625",
    accent: "#0e5f59",
    text: "#94a3a0",
    textPrimary: "#ffffff",
    border: "#0e5f59",
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards');
        if (response.ok) {
          const data = await response.json();
          setCards(data.cards || []);
        }
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const filteredCards = cards.filter(card => {
    if (filter === 'for-sale') return card.isForSale;
    if (filter === 'crowdfunding') return card.isCrowdfunding;
    return true;
  });

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (direction === 'right' && currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (direction === 'left' && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 shadow-yellow-400/50';
      case 'epic': return 'border-purple-400 shadow-purple-400/50';
      case 'rare': return 'border-blue-400 shadow-blue-400/50';
      default: return 'border-gray-400 shadow-gray-400/50';
    }
  };

  if (loading) {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center ${quicksand.className}`}
        style={{ backgroundColor: theme.primary }}
      >
        <div className="text-white text-xl">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${quicksand.className}`}
      style={{ backgroundColor: theme.primary }}
    >
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center space-x-2"
        >
          <div className="text-2xl font-bold text-white">ECE</div>
          <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded text-xs font-medium">MARKETPLACE</span>
        </button>
        
        <div className="flex items-center space-x-6">
          {/* View Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setView('cards')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'cards' ? 'bg-teal-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'grid' ? 'bg-teal-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'admin' ? 'bg-teal-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'for-sale' | 'crowdfunding')}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">All Cards</option>
            <option value="for-sale">For Sale</option>
            <option value="crowdfunding">Crowdfunding</option>
          </select>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trading Card Marketplace
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Buy, sell, and trade app development cards. Each card represents a completed project with real value.
          </p>
        </div>

        {/* Cards View */}
        {view === 'cards' && (
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              {filteredCards.length === 0 ? (
                <div className="text-center text-white/60 py-12">
                  <p>No cards found matching your filter.</p>
                </div>
              ) : (
                <div className="relative">
                  {filteredCards.map((card, index) => (
                    <div
                      key={card.id}
                      className={`absolute inset-0 transition-all duration-300 ${
                        index === currentCardIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'
                      }`}
                    >
                      <div className={`backdrop-blur-sm bg-white/10 border-2 ${getRarityBorder(card.rarity)} rounded-3xl p-6 shadow-2xl`}>
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                            <p className="text-sm text-white/60">{card.category}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(card.rarity)}`}>
                            {card.rarity.toUpperCase()}
                          </div>
                        </div>

                        {/* Card Description */}
                        <p className="text-white/80 text-sm mb-6 line-clamp-3">
                          {card.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-white/60 mb-1">Performance</div>
                            <div className="text-lg font-bold text-white">{card.stats.performance}</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-white/60 mb-1">Security</div>
                            <div className="text-lg font-bold text-white">{card.stats.security}</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-white/60 mb-1">UX Score</div>
                            <div className="text-lg font-bold text-white">{card.stats.userExperience}</div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-white/60 mb-1">Innovation</div>
                            <div className="text-lg font-bold text-white">{card.stats.innovation}</div>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="border-t border-white/10 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="text-2xl font-bold text-teal-400">${card.currentPrice.toLocaleString()}</div>
                              <div className="text-xs text-white/60">24h: {card.priceChange24h > 0 ? '+' : ''}{card.priceChange24h}%</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-white/60">Volume</div>
                              <div className="text-lg font-bold text-white">${card.volume24h.toLocaleString()}</div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            {card.isForSale && (
                              <button className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl py-3 px-4 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all">
                                Buy Now
                              </button>
                            )}
                            {card.isCrowdfunding && (
                              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl py-3 px-4 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                                Fund Project
                              </button>
                            )}
                            <button className="bg-white/10 rounded-xl p-3 text-white hover:bg-white/20 transition-all">
                              ❤️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              {filteredCards.length > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => handleSwipe('left')}
                    disabled={currentCardIndex === 0}
                    className="bg-white/10 rounded-full p-3 text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <div className="text-white/60 text-sm">
                    {currentCardIndex + 1} of {filteredCards.length}
                  </div>
                  <button
                    onClick={() => handleSwipe('right')}
                    disabled={currentCardIndex === filteredCards.length - 1}
                    className="bg-white/10 rounded-full p-3 text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grid View */}
        {view === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className={`backdrop-blur-sm bg-white/10 border-2 ${getRarityBorder(card.rarity)} rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{card.title}</h3>
                    <p className="text-xs text-white/60">{card.category}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(card.rarity)}`}>
                    {card.rarity.toUpperCase()}
                  </div>
                </div>

                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  {card.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-xs text-white/60">Performance</div>
                    <div className="text-sm font-bold text-white">{card.stats.performance}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-xs text-white/60">Security</div>
                    <div className="text-sm font-bold text-white">{card.stats.security}</div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-teal-400">
                      ${card.currentPrice.toLocaleString()}
                    </div>
                    <div className="flex space-x-1">
                      {card.isForSale && (
                        <button className="bg-teal-500 hover:bg-teal-600 rounded-lg px-3 py-1 text-white text-xs font-medium transition-all">
                          Buy
                        </button>
                      )}
                      {card.isCrowdfunding && (
                        <button className="bg-purple-500 hover:bg-purple-600 rounded-lg px-3 py-1 text-white text-xs font-medium transition-all">
                          Fund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Admin View */}
        {view === 'admin' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="text-2xl font-bold text-white">{cards.length}</div>
                <div className="text-white/60">Total Cards</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="text-2xl font-bold text-teal-400">{cards.filter(c => c.isForSale).length}</div>
                <div className="text-white/60">For Sale</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="text-2xl font-bold text-purple-400">{cards.filter(c => c.isCrowdfunding).length}</div>
                <div className="text-white/60">Crowdfunding</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="text-2xl font-bold text-green-400">
                  ${cards.reduce((sum, card) => sum + card.volume24h, 0).toLocaleString()}
                </div>
                <div className="text-white/60">24h Volume</div>
              </div>
            </div>

            {/* Admin Table */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Card Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/60 py-3">Card</th>
                      <th className="text-left text-white/60 py-3">Category</th>
                      <th className="text-left text-white/60 py-3">Rarity</th>
                      <th className="text-left text-white/60 py-3">Price</th>
                      <th className="text-left text-white/60 py-3">Status</th>
                      <th className="text-left text-white/60 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card) => (
                      <tr key={card.id} className="border-b border-white/5">
                        <td className="py-3">
                          <div>
                            <div className="text-white font-medium">{card.title}</div>
                            <div className="text-white/60 text-sm">{card.owner.name}</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-white/80">{card.category}</span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(card.rarity)}`}>
                            {card.rarity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-teal-400 font-bold">${card.currentPrice.toLocaleString()}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-1">
                            {card.isForSale && (
                              <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded text-xs">For Sale</span>
                            )}
                            {card.isCrowdfunding && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">Crowdfunding</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="text-white/60 hover:text-white text-sm">Edit</button>
                            <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
