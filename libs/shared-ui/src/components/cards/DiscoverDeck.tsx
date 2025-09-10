'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, Zap, DollarSign, TrendingUp, Info, RefreshCw } from 'lucide-react';
import { Button } from '../../lib/button';
import { GlassCard } from '../../lib/glass-card';
import { CardDetailModal } from './CardDetailModal';
import { useECEWallet } from '../../hooks/use-ece-wallet';

interface DiscoverDeckProps {
  onCardAction?: (action: 'like' | 'pass' | 'bid' | 'buy' | 'battle', card: any, data?: any) => void;
  filter?: 'all' | 'bidding' | 'buying' | 'battling';
}

export function DiscoverDeck({ onCardAction, filter = 'all' }: DiscoverDeckProps) {
  const { address } = useECEWallet();
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch cards for discovery
  const fetchCards = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cards/discover?walletAddress=${address}&filter=${filter}&limit=20`);
      const result = await response.json();
      
      if (result.success) {
        setCards(result.cards);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [address, filter]);

  const handleSwipe = (direction: 'left' | 'right' | 'up', card: any) => {
    if (direction === 'left') {
      onCardAction?.('pass', card);
    } else if (direction === 'right') {
      onCardAction?.('like', card);
    } else if (direction === 'up') {
      setSelectedCard(card);
      setShowDetails(true);
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const handleCardAction = (action: string, card: any, data?: any) => {
    onCardAction?.(action as any, card, data);
    if (action !== 'like') {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading cards...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-6xl mb-4">🎴</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Cards Available</h3>
        <p className="text-gray-400 mb-4">
          No cards match your current filter. Try changing the filter or check back later.
        </p>
        <Button onClick={fetchCards} className="bg-blue-500 hover:bg-blue-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </GlassCard>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-white mb-2">All Done!</h3>
        <p className="text-gray-400 mb-4">
          You've seen all available cards. More cards will appear as they're created.
        </p>
        <Button onClick={fetchCards} className="bg-blue-500 hover:bg-blue-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Deck
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px]">
      {/* Card Stack */}
      <div className="relative w-full h-full">
        {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
          <SwipeableCard
            key={card.id}
            card={card}
            index={index}
            isActive={index === 0}
            onSwipe={(direction) => handleSwipe(direction, card)}
            onAction={(action, data) => handleCardAction(action, card, data)}
            onShowDetails={() => {
              setSelectedCard(card);
              setShowDetails(true);
            }}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSwipe('left', cards[currentIndex])}
          className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSwipe('up', cards[currentIndex])}
          className="w-12 h-12 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
        >
          <Info className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSwipe('right', cards[currentIndex])}
          className="w-12 h-12 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/30 px-3 py-1 rounded-full text-white text-sm">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        currentUserAddress={address}
        onBid={(amount) => handleCardAction('bid', selectedCard, { amount })}
        onBuy={() => handleCardAction('buy', selectedCard)}
        onBattle={() => handleCardAction('battle', selectedCard)}
        onLike={() => handleCardAction('like', selectedCard)}
      />
    </div>
  );
}

interface SwipeableCardProps {
  card: any;
  index: number;
  isActive: boolean;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onAction: (action: string, data?: any) => void;
  onShowDetails: () => void;
}

function SwipeableCard({ card, index, isActive, onSwipe, onAction, onShowDetails }: SwipeableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0) {
        onSwipe('right');
      } else {
        onSwipe('left');
      }
    } else if (info.offset.y < -threshold) {
      onSwipe('up');
    }
  };

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0.7 },
    active: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing ${isActive ? 'z-30' : 'z-20'}`}
      style={{
        x: isActive ? x : 0,
        y: isActive ? y : 0,
        rotate: isActive ? rotate : 0,
        opacity: isActive ? opacity : 1,
        scale: isActive ? 1 : 0.95 - index * 0.05
      }}
      variants={cardVariants}
      initial="initial"
      animate={isActive ? "active" : "initial"}
      drag={isActive}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={isActive ? { scale: 1.02 } : undefined}
    >
      <GlassCard className="h-full p-6 overflow-hidden">
        {/* Rarity Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            card.rarity === 'MYTHIC' ? 'bg-gradient-to-r from-pink-500 to-purple-500' :
            card.rarity === 'LEGENDARY' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
            card.rarity === 'EPIC' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
            card.rarity === 'RARE' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
            'bg-gradient-to-r from-gray-500 to-gray-600'
          } text-white`}>
            {card.rarity}
          </div>
          <div className="text-sm text-gray-400">{card.category}</div>
        </div>

        {/* Card Art Area */}
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {card.cardArtwork ? (
            <img 
              src={card.cardArtwork} 
              alt={card.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl">
                {card.generationType === 'CODE_UPLOAD' ? '💻' :
                 card.generationType === 'CARD_ORDER' ? '🚀' :
                 card.generationType === 'CODEBASE_ENHANCE' ? '⚡' : '🎴'}
              </div>
            </div>
          )}
          
          {/* Price Overlay */}
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm font-bold">
            {card.currentPrice} ECE
          </div>
        </div>

        {/* Card Info */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{card.description}</p>
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
            <span>by</span>
            <span className="font-medium text-white">{card.owner?.username}</span>
          </div>
        </div>

        {/* Stats Grid */}
        {card.stats && (
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-red-900/30 p-2 rounded text-center border border-red-500/30">
              <div className="font-bold text-red-400">{card.stats.attack}</div>
              <div className="text-gray-400">ATK</div>
            </div>
            <div className="bg-blue-900/30 p-2 rounded text-center border border-blue-500/30">
              <div className="font-bold text-blue-400">{card.stats.defense}</div>
              <div className="text-gray-400">DEF</div>
            </div>
            <div className="bg-green-900/30 p-2 rounded text-center border border-green-500/30">
              <div className="font-bold text-green-400">{card.stats.speed}</div>
              <div className="text-gray-400">SPD</div>
            </div>
            <div className="bg-purple-900/30 p-2 rounded text-center border border-purple-500/30">
              <div className="font-bold text-purple-400">{card.stats.overall}</div>
              <div className="text-gray-400">OVR</div>
            </div>
          </div>
        )}

        {/* Market Data */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="text-center">
            <div className="text-gray-400">Market Cap</div>
            <div className="font-bold text-white">{card.marketCap || 'N/A'} ECE</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">24h Volume</div>
            <div className="font-bold text-white">{card.tradingVolume || 0} ECE</div>
          </div>
        </div>

        {/* Interaction Options */}
        <div className="flex justify-center space-x-2">
          {card.availableForBidding && (
            <div className="w-6 h-6 bg-yellow-500/30 rounded-full flex items-center justify-center border border-yellow-500/50">
              <span className="text-yellow-400 text-xs">🏷️</span>
            </div>
          )}
          {card.availableForBuying && (
            <div className="w-6 h-6 bg-green-500/30 rounded-full flex items-center justify-center border border-green-500/50">
              <DollarSign className="w-3 h-3 text-green-400" />
            </div>
          )}
          {card.availableForBattling && (
            <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center border border-purple-500/50">
              <Zap className="w-3 h-3 text-purple-400" />
            </div>
          )}
        </div>

        {/* Quick Actions (only show on active card) */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2"
          >
            {card.availableForBidding && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('bid', { amount: card.minimumBidAmount || card.currentPrice * 1.1 });
                }}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 text-xs px-2 py-1"
              >
                Bid
              </Button>
            )}
            {card.availableForBuying && card.fixedBuyPrice && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('buy');
                }}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 text-xs px-2 py-1"
              >
                Buy
              </Button>
            )}
            {card.availableForBattling && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('battle');
                }}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 text-xs px-2 py-1"
              >
                Battle
              </Button>
            )}
          </motion.div>
        )}

        {/* Swipe Hints */}
        {isActive && (
          <>
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 opacity-0"
              animate={{ opacity: Math.abs(x.get()) > 50 && x.get() < 0 ? 1 : 0 }}
            >
              <X className="w-8 h-8" />
            </motion.div>
            <motion.div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 opacity-0"
              animate={{ opacity: Math.abs(x.get()) > 50 && x.get() > 0 ? 1 : 0 }}
            >
              <Heart className="w-8 h-8" />
            </motion.div>
            <motion.div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 text-blue-400 opacity-0"
              animate={{ opacity: y.get() < -50 ? 1 : 0 }}
            >
              <Info className="w-8 h-8" />
            </motion.div>
          </>
        )}
      </GlassCard>
    </motion.div>
  );
}
