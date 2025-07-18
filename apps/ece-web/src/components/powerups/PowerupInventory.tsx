// PowerupInventory Component - User's powerup collection display
// /apps/ece-web/src/components/powerups/PowerupInventory.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPowerup, 
  PowerupInventoryProps,
  PowerupCategory,
  PowerupRarity,
  PowerupFilter,
  PowerupSortBy 
} from '@/types/powerups';
import PowerupCard from './PowerupCard';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Package, 
  Sparkles,
  Grid3X3,
  List
} from 'lucide-react';

export const PowerupInventory: React.FC<PowerupInventoryProps> = ({
  userId,
  powerups,
  onPowerupSelect,
  onPowerupApply,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<PowerupFilter>({});
  const [sortBy, setSortBy] = useState<PowerupSortBy>('rarity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort powerups
  const filteredPowerups = useMemo(() => {
    let filtered = powerups.filter(userPowerup => {
      const powerup = userPowerup.powerupType;
      if (!powerup) return false;

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!powerup.name.toLowerCase().includes(searchLower) &&
            !powerup.displayName.toLowerCase().includes(searchLower) &&
            !powerup.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filter.category && filter.category.length > 0) {
        if (!filter.category.includes(powerup.category)) {
          return false;
        }
      }

      // Rarity filter
      if (filter.rarity && filter.rarity.length > 0) {
        if (!filter.rarity.includes(powerup.rarity)) {
          return false;
        }
      }

      // Tradeable filter
      if (filter.tradeable !== undefined) {
        if (powerup.tradeable !== filter.tradeable) {
          return false;
        }
      }

      // Craftable filter
      if (filter.craftable !== undefined) {
        if (powerup.craftable !== filter.craftable) {
          return false;
        }
      }

      return true;
    });

    // Sort powerups
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.powerupType?.displayName || '';
          bValue = b.powerupType?.displayName || '';
          break;
        case 'rarity':
          const rarityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'ARTIFACT'];
          aValue = rarityOrder.indexOf(a.powerupType?.rarity || 'COMMON');
          bValue = rarityOrder.indexOf(b.powerupType?.rarity || 'COMMON');
          break;
        case 'price':
          aValue = a.powerupType?.baseCost || 0;
          bValue = b.powerupType?.baseCost || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.acquiredAt).getTime();
          bValue = new Date(b.acquiredAt).getTime();
          break;
        default:
          aValue = a.level;
          bValue = b.level;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [powerups, searchTerm, filter, sortBy, sortOrder]);

  const totalPowerups = powerups.length;
  const totalQuantity = powerups.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#A6E22E]/20 rounded-lg">
            <Package className="w-6 h-6 text-[#A6E22E]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#F8EFD6]">
              Powerup Inventory
            </h2>
            <p className="text-[#75715E]">
              {totalPowerups} unique powerups • {totalQuantity} total items
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-[#272822] border border-[#75715E] rounded-lg text-[#F8EFD6] hover:border-[#A6E22E] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid3X3 size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#75715E] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search powerups..."
              className="w-full pl-10 pr-4 py-3 bg-[#272822] border border-[#75715E] rounded-lg text-[#F8EFD6] placeholder-[#75715E] focus:border-[#A6E22E] focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Toggle */}
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-[#272822] border border-[#75715E] rounded-lg text-[#F8EFD6] hover:border-[#A6E22E] transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={20} />
            <span>Filters</span>
          </motion.button>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort as PowerupSortBy);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-3 bg-[#272822] border border-[#75715E] rounded-lg text-[#F8EFD6] focus:border-[#A6E22E] focus:outline-none transition-colors"
          >
            <option value="rarity-desc">Rarity (High to Low)</option>
            <option value="rarity-asc">Rarity (Low to High)</option>
            <option value="name-asc">Name (A to Z)</option>
            <option value="name-desc">Name (Z to A)</option>
            <option value="createdAt-desc">Recently Acquired</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="price-asc">Price (Low to High)</option>
          </select>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#272822]/50 backdrop-blur-md border border-[#75715E] rounded-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-[#F8EFD6] mb-2">
                    Category
                  </label>
                  <div className="space-y-2">
                    {Object.values(PowerupCategory).map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filter.category?.includes(category) || false}
                          onChange={(e) => {
                            const categories = filter.category || [];
                            if (e.target.checked) {
                              setFilter({
                                ...filter,
                                category: [...categories, category]
                              });
                            } else {
                              setFilter({
                                ...filter,
                                category: categories.filter(c => c !== category)
                              });
                            }
                          }}
                          className="text-[#A6E22E] bg-[#272822] border-[#75715E] rounded focus:ring-[#A6E22E]"
                        />
                        <span className="text-[#F8EFD6] text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rarity Filter */}
                <div>
                  <label className="block text-sm font-semibold text-[#F8EFD6] mb-2">
                    Rarity
                  </label>
                  <div className="space-y-2">
                    {Object.values(PowerupRarity).map(rarity => (
                      <label key={rarity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filter.rarity?.includes(rarity) || false}
                          onChange={(e) => {
                            const rarities = filter.rarity || [];
                            if (e.target.checked) {
                              setFilter({
                                ...filter,
                                rarity: [...rarities, rarity]
                              });
                            } else {
                              setFilter({
                                ...filter,
                                rarity: rarities.filter(r => r !== rarity)
                              });
                            }
                          }}
                          className="text-[#A6E22E] bg-[#272822] border-[#75715E] rounded focus:ring-[#A6E22E]"
                        />
                        <span className="text-[#F8EFD6] text-sm">{rarity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features Filter */}
                <div>
                  <label className="block text-sm font-semibold text-[#F8EFD6] mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.tradeable || false}
                        onChange={(e) => setFilter({
                          ...filter,
                          tradeable: e.target.checked || undefined
                        })}
                        className="text-[#A6E22E] bg-[#272822] border-[#75715E] rounded focus:ring-[#A6E22E]"
                      />
                      <span className="text-[#F8EFD6] text-sm">Tradeable</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.craftable || false}
                        onChange={(e) => setFilter({
                          ...filter,
                          craftable: e.target.checked || undefined
                        })}
                        className="text-[#A6E22E] bg-[#272822] border-[#75715E] rounded focus:ring-[#A6E22E]"
                      />
                      <span className="text-[#F8EFD6] text-sm">Craftable</span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <motion.button
                    onClick={() => setFilter({})}
                    className="w-full px-4 py-2 bg-[#F92672]/20 text-[#F92672] rounded-lg hover:bg-[#F92672]/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[#75715E]">
            Showing {filteredPowerups.length} of {totalPowerups} powerups
          </p>
        </div>

        {/* Powerup Grid/List */}
        {filteredPowerups.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            <AnimatePresence>
              {filteredPowerups.map((userPowerup, index) => (
                <motion.div
                  key={userPowerup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onPowerupSelect && onPowerupSelect(userPowerup)}
                  className="cursor-pointer"
                >
                  <PowerupCard
                    powerup={userPowerup.powerupType!}
                    quantity={userPowerup.quantity}
                    isOwned={true}
                    onApply={(powerupId) => onPowerupApply && onPowerupApply(powerupId, '')}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#75715E]/20 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-[#75715E]" />
            </div>
            <h3 className="text-xl font-semibold text-[#F8EFD6] mb-2">
              No powerups found
            </h3>
            <p className="text-[#75715E] mb-6">
              {searchTerm || Object.keys(filter).length > 0
                ? 'Try adjusting your search or filters'
                : 'Start collecting powerups to enhance your cards'
              }
            </p>
            {(!searchTerm && Object.keys(filter).length === 0) && (
              <motion.button
                className="px-6 py-3 bg-[#A6E22E]/20 text-[#A6E22E] rounded-lg hover:bg-[#A6E22E]/30 transition-colors font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Marketplace
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PowerupInventory;
