'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Scene } from '@/components/3d/core/Scene';
import { TradingCard3D } from '@/components/3d/models/TradingCard3D';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  SortDesc,
  Eye,
  Heart,
  Zap,
  Star
} from 'lucide-react';
import * as THREE from 'three';

interface NFTCard {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: string;
  stats?: {
    attack?: number;
    defense?: number;
    speed?: number;
  };
  price?: number;
  owned?: boolean;
}

interface NFTCardGalleryProps {
  cards: NFTCard[];
  className?: string;
}

export function NFTCardGallery({ cards, className = '' }: NFTCardGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel' | 'sphere'>('grid');
  const [selectedCard, setSelectedCard] = useState<NFTCard | null>(null);
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'price'>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const groupRef = useRef<THREE.Group>(null);

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = cards;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rarity filter
    if (filterRarity !== 'all') {
      filtered = filtered.filter(card => card.rarity === filterRarity);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'price':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [cards, searchTerm, filterRarity, sortBy]);

  // Carousel rotation
  useFrame((state) => {
    if (viewMode === 'carousel' && groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Layout calculations
  const getCardPosition = (index: number, total: number): [number, number, number] => {
    switch (viewMode) {
      case 'grid':
        const cols = Math.ceil(Math.sqrt(total));
        const row = Math.floor(index / cols);
        const col = index % cols;
        return [
          (col - (cols - 1) / 2) * 3,
          -(row - Math.floor((total - 1) / cols) / 2) * 4,
          0
        ];
      
      case 'carousel':
        const angle = (index / total) * Math.PI * 2;
        const radius = Math.max(5, total * 0.5);
        return [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ];
      
      case 'sphere':
        const phi = Math.acos(1 - 2 * (index + 0.5) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
        const sphereRadius = Math.max(8, total * 0.3);
        return [
          sphereRadius * Math.sin(phi) * Math.cos(theta),
          sphereRadius * Math.cos(phi),
          sphereRadius * Math.sin(phi) * Math.sin(theta)
        ];
      
      default:
        return [0, 0, 0];
    }
  };

  const rarityColors = {
    common: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <GlassCard className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search size={20} className="text-[#75715E]" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-b border-[#75715E] text-[#F8EFD6] placeholder-[#75715E] focus:border-[#F92672] outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Rarity Filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[#75715E]" />
                <select
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value)}
                  className="bg-[#272822] text-[#F8EFD6] border border-[#75715E] rounded px-2 py-1"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortDesc size={16} className="text-[#75715E]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#272822] text-[#F8EFD6] border border-[#75715E] rounded px-2 py-1"
                >
                  <option value="name">Name</option>
                  <option value="rarity">Rarity</option>
                  <option value="price">Price</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex gap-1 border border-[#75715E] rounded overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === 'carousel' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('carousel')}
                  className="rounded-none"
                >
                  <Eye size={16} />
                </Button>
                <Button
                  variant={viewMode === 'sphere' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('sphere')}
                  className="rounded-none"
                >
                  <Zap size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-[#75715E]/30">
            <Badge variant="outline" className="border-[#75715E] text-[#F8EFD6]">
              Total: {filteredCards.length}
            </Badge>
            {Object.entries(
              filteredCards.reduce((acc, card) => {
                acc[card.rarity] = (acc[card.rarity] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([rarity, count]) => (
              <Badge
                key={rarity}
                className={`${rarityColors[rarity as keyof typeof rarityColors]} text-white`}
              >
                {rarity}: {count}
              </Badge>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* 3D Gallery */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-[600px]"
      >
        <GlassCard className="p-4 h-full">
          <Scene
            enableControls={true}
            enablePerformanceMonitor={false}
            environment="studio"
            shadows={true}
            className="w-full h-full"
          >
            <group ref={groupRef}>
              {filteredCards.map((card, index) => (
                <TradingCard3D
                  key={card.id}
                  cardData={card}
                  scale={0.5}
                  position={getCardPosition(index, filteredCards.length)}
                  enableAnimation={true}
                  animationSpeed={0.5}
                  interactive={true}
                  onClick={() => setSelectedCard(card)}
                  showStats={viewMode === 'grid'}
                />
              ))}
            </group>
          </Scene>
        </GlassCard>
      </motion.div>

      {/* Selected Card Details */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2">
                  {selectedCard.name}
                </h3>
                <Badge className={`${rarityColors[selectedCard.rarity]} text-white mb-4`}>
                  <Star size={12} className="mr-1" />
                  {selectedCard.rarity.toUpperCase()}
                </Badge>
                <p className="text-[#75715E] mb-4">{selectedCard.type}</p>
                
                {selectedCard.stats && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-[#F8EFD6]">Stats</h4>
                    {selectedCard.stats.attack && (
                      <div className="flex justify-between">
                        <span className="text-[#75715E]">Attack:</span>
                        <span className="text-[#F92672] font-mono">{selectedCard.stats.attack}</span>
                      </div>
                    )}
                    {selectedCard.stats.defense && (
                      <div className="flex justify-between">
                        <span className="text-[#75715E]">Defense:</span>
                        <span className="text-[#66D9EF] font-mono">{selectedCard.stats.defense}</span>
                      </div>
                    )}
                    {selectedCard.stats.speed && (
                      <div className="flex justify-between">
                        <span className="text-[#75715E]">Speed:</span>
                        <span className="text-[#A6E22E] font-mono">{selectedCard.stats.speed}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                {selectedCard.price && (
                  <div className="text-center">
                    <p className="text-[#75715E] text-sm">Current Price</p>
                    <p className="text-2xl font-bold text-[#A6E22E]">
                      {selectedCard.price} ECE
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#F92672] hover:bg-[#F92672]/80">
                    <Heart size={16} className="mr-2" />
                    Favorite
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#66D9EF] text-[#66D9EF] hover:bg-[#66D9EF]/10"
                  >
                    View Details
                  </Button>
                </div>
                
                <Button 
                  variant="ghost"
                  onClick={() => setSelectedCard(null)}
                  className="text-[#75715E] hover:text-[#F8EFD6]"
                >
                  Close
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
