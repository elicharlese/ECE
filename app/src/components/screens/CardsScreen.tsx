import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Layers, Zap, DollarSign, Users } from 'lucide-react';
import { Button } from '@ece-platform/shared-ui';
import { GlassCard } from '@ece-platform/shared-ui';
import { CardGenerationModal } from '@ece-platform/shared-ui';
import { DiscoverDeck } from '@ece-platform/shared-ui';
import { useECEWallet } from '@ece-platform/shared-ui';

export function CardsScreen() {
  const { address, eceBalance } = useECEWallet();
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [discoverFilter, setDiscoverFilter] = useState<'all' | 'bidding' | 'buying' | 'battling'>('all');

  const handleCardAction = async (action: string, card: any, data?: any) => {
    console.log(`Card action: ${action}`, card, data);
    
    try {
      switch (action) {
        case 'like':
          // Handle card like action
          console.log('Liked card:', card.name);
          break;
          
        case 'pass':
          // Handle card pass action
          console.log('Passed on card:', card.name);
          break;
          
        case 'bid':
          // Handle bidding action
          if (data?.amount && address) {
            const response = await fetch('/api/cards/bid', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cardId: card.id,
                walletAddress: address,
                amount: data.amount
              })
            });
            
            if (response.ok) {
              console.log('Bid placed successfully');
            }
          }
          break;
          
        case 'buy':
          // Handle buying action
          if (address) {
            const response = await fetch('/api/cards/buy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cardId: card.id,
                walletAddress: address
              })
            });
            
            if (response.ok) {
              console.log('Card purchased successfully');
            }
          }
          break;
          
        case 'battle':
          // Handle battle challenge action
          if (address) {
            const response = await fetch('/api/cards/battle', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                challengerCardId: null, // User needs to select their card
                targetCardId: card.id,
                walletAddress: address
              })
            });
            
            if (response.ok) {
              console.log('Battle challenge sent');
            }
          }
          break;
          
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Card action error:', error);
    }
  };

  const handleCardGenerated = (newCard: any) => {
    console.log('New card generated:', newCard);
    // Optionally refresh the discover deck or show success message
  };

  const filterOptions = [
    { id: 'all', label: 'All Cards', icon: Layers },
    { id: 'bidding', label: 'Bidding', icon: DollarSign },
    { id: 'buying', label: 'For Sale', icon: Users },
    { id: 'battling', label: 'Battle Ready', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
          >
            ECE Trading Cards
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Discover, trade, and battle with unique company cards generated from code, concepts, and AI enhancements. 
            Each card represents real business potential backed by technical analysis.
          </motion.p>
        </div>

        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowGenerationModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Card
            </Button>
            
            <div className="hidden md:flex items-center text-sm text-gray-400">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>Balance: {eceBalance} ECE</span>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-1">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant={discoverFilter === option.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDiscoverFilter(option.id as any)}
                    className={`${
                      discoverFilter === option.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                    }`}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    <span className="text-xs">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discovery Deck */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Discover Cards</h2>
                <div className="text-sm text-gray-400">
                  Swipe right to like, left to pass, up for details
                </div>
              </div>
              
              <DiscoverDeck 
                onCardAction={handleCardAction}
                filter={discoverFilter}
              />
            </GlassCard>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Stats Card */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cards Owned</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Value</span>
                  <span className="text-green-400 font-semibold">0 ECE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cards Generated</span>
                  <span className="text-blue-400 font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Battles Won</span>
                  <span className="text-purple-400 font-semibold">0</span>
                </div>
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowGenerationModal(true)}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate New Card
                </Button>
                
                <Button 
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-700/30"
                  disabled
                >
                  <Layers className="w-4 h-4 mr-2" />
                  My Collection
                </Button>
                
                <Button 
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-700/30"
                  disabled
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Battle Arena
                </Button>
              </div>
            </GlassCard>

            {/* Generation Costs */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Generation Costs</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Upload Code:</span>
                  <span className="text-green-400">50 ECE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Card:</span>
                  <span className="text-blue-400">100 ECE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Enhance Code:</span>
                  <span className="text-purple-400">150 ECE</span>
                </div>
              </div>
            </GlassCard>

            {/* How It Works */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <strong className="text-blue-400">1. Generate:</strong> Upload code, order new cards, or enhance existing codebases with AI
                </div>
                <div>
                  <strong className="text-green-400">2. Configure:</strong> Set preferences for bidding, buying, and battling
                </div>
                <div>
                  <strong className="text-purple-400">3. Interact:</strong> Swipe through cards to discover, bid, buy, or challenge others
                </div>
                <div>
                  <strong className="text-yellow-400">4. Battle:</strong> Use card stats in strategic battles for ECE rewards
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Card Generation Modal */}
      <CardGenerationModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        onCardGenerated={handleCardGenerated}
      />
    </div>
  );
}
