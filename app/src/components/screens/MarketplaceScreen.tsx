import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Mock Button component for now
const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, ...props }: any) => (
  <button
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-white/30 text-white hover:bg-white/10' 
        : 'bg-blue-500 text-white hover:bg-blue-600'
    } ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  const handleSearch = () => {
    const filters = {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      rarity: selectedRarity !== 'all' ? selectedRarity : undefined,
    };
    console.log('Searching for:', searchQuery, 'with filters:', filters);
  };

  const categories = ['all', 'tech', 'finance', 'healthcare', 'energy', 'retail'];
  const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272822] via-[#134E4A] to-[#0F766E] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">Marketplace</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                My Listings
              </Button>
              <Button size="sm">
                Sell Cards
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#66D9EF]"
              />
            </div>
            <Button onClick={handleSearch} className="px-8">
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#66D9EF]"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-[#272822]">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rarity</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#66D9EF]"
              >
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity} className="bg-[#272822]">
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-300">Total Cards</p>
              <p className="text-2xl font-bold text-[#66D9EF]">2,847</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-300">24h Volume</p>
              <p className="text-2xl font-bold text-[#A6E22E]">$1.2M</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-300">Active Traders</p>
              <p className="text-2xl font-bold text-[#F92672]">15,432</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-300">Avg Price</p>
              <p className="text-2xl font-bold text-[#66D9EF]">$847</p>
            </div>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:border-[#66D9EF]/50 transition-colors group"
            >
              {/* Card Image */}
              <div className="aspect-[3/4] bg-gradient-to-br from-[#F92672] to-[#66D9EF] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🏢</div>
                    <div className="text-lg font-bold">COMPANY</div>
                    <div className="text-sm opacity-80">SYMBOL</div>
                  </div>
                </div>
                
                {/* Rarity Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-[#A6E22E] text-black text-xs font-bold rounded-full">
                    RARE
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-black/60 text-white text-sm font-medium rounded-lg">
                    $1,250
                  </span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Microsoft Corp</h3>
                <p className="text-gray-400 text-sm mb-3">Technology • $2.8T Market Cap</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="text-center p-2 bg-black/20 rounded">
                    <div className="text-[#A6E22E] font-bold">95</div>
                    <div className="text-gray-400">Power</div>
                  </div>
                  <div className="text-center p-2 bg-black/20 rounded">
                    <div className="text-[#66D9EF] font-bold">88</div>
                    <div className="text-gray-400">Growth</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Buy Now
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Make Offer
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Cards
          </Button>
        </div>
      </div>
    </div>
  );
}
