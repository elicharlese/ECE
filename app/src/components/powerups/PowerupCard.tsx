// PowerupCard Component - Individual powerup display card
// /app/src/components/powerups/PowerupCard.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  PowerupType, 
  PowerupRarity, 
  PowerupCategory,
  PowerupCardProps 
} from '@/types/powerups';
import { Sparkles, Zap, Shield, Star, Crown, Gem } from 'lucide-react';

const RARITY_COLORS = {
  COMMON: '#75715E',
  UNCOMMON: '#A6E22E',
  RARE: '#66D9EF',
  EPIC: '#F92672',
  LEGENDARY: '#E6DB74',
  MYTHIC: '#819AFF',
  ARTIFACT: '#FD5C63'
};

const RARITY_ICONS = {
  COMMON: Sparkles,
  UNCOMMON: Zap,
  RARE: Shield,
  EPIC: Star,
  LEGENDARY: Crown,
  MYTHIC: Gem,
  ARTIFACT: Crown
};

const CATEGORY_COLORS = {
  COMBAT: '#F92672',
  DEFENSE: '#A6E22E',
  UTILITY: '#66D9EF',
  SPECIAL: '#E6DB74',
  LEGENDARY: '#FD5C63',
  TEMPORAL: '#819AFF',
  ELEMENTAL: '#3EBA7C',
  MYSTICAL: '#F8EFD6',
  TECHNOLOGICAL: '#75715E',
  ECONOMIC: '#E6DB74'
};

export const PowerupCard: React.FC<PowerupCardProps> = ({
  powerup,
  quantity = 0,
  isOwned = false,
  onApply,
  onPurchase,
  className = ''
}) => {
  const rarityColor = RARITY_COLORS[powerup.rarity];
  const categoryColor = CATEGORY_COLORS[powerup.category];
  const RarityIcon = RARITY_ICONS[powerup.rarity];

  const handleAction = () => {
    if (isOwned && onApply) {
      onApply(powerup.id);
    } else if (!isOwned && onPurchase) {
      onPurchase(powerup.id);
    }
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border border-gray-800 bg-[#272822]/90 backdrop-blur-md ${className}`}
      style={{
        borderColor: rarityColor,
        boxShadow: `0 0 20px ${rarityColor}20`
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 0 30px ${rarityColor}40`
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rarity Glow Effect */}
      {powerup.glowEffect && (
        <div 
          className="absolute inset-0 rounded-xl opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${rarityColor}40 0%, transparent 70%)`
          }}
        />
      )}

      {/* Header */}
      <div className="relative p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <RarityIcon 
              size={20} 
              style={{ color: rarityColor }}
              className="animate-pulse"
            />
            <span 
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: rarityColor }}
            >
              {powerup.rarity}
            </span>
          </div>
          
          {quantity > 0 && (
            <div className="flex items-center space-x-1 bg-[#A6E22E]/20 text-[#A6E22E] px-2 py-1 rounded-full text-xs font-medium">
              <span>×{quantity}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-[#F8EFD6] mb-1">
          {powerup.displayName}
        </h3>
        
        <div className="flex items-center space-x-2">
          <span 
            className="text-sm px-2 py-1 rounded-full font-medium"
            style={{ 
              backgroundColor: `${categoryColor}20`,
              color: categoryColor
            }}
          >
            {powerup.category}
          </span>
          
          {powerup.duration && (
            <span className="text-xs text-[#75715E]">
              {powerup.duration < 60 ? `${powerup.duration}s` : `${Math.floor(powerup.duration / 60)}m`}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Powerup Icon/Image */}
        <div className="flex justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${rarityColor}20, ${categoryColor}20)`,
              border: `2px solid ${rarityColor}`
            }}
          >
            {powerup.iconUrl ? (
              <img 
                src={powerup.iconUrl} 
                alt={powerup.name}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <RarityIcon size={32} style={{ color: rarityColor }} />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[#F8EFD6] text-sm mb-4 text-center leading-relaxed">
          {powerup.description}
        </p>

        {/* Effects Preview */}
        <div className="space-y-2 mb-4">
          {powerup.effects.slice(0, 3).map((effect, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-[#75715E] capitalize">
                {effect.targetStat.replace('_', ' ')}
              </span>
              <span 
                className="font-semibold"
                style={{ color: categoryColor }}
              >
                {effect.modifierType === 'PERCENT_INCREASE' ? '+' : ''}
                {effect.modifier}
                {effect.modifierType.includes('PERCENT') ? '%' : ''}
              </span>
            </div>
          ))}
          
          {powerup.effects.length > 3 && (
            <div className="text-center text-xs text-[#75715E]">
              +{powerup.effects.length - 3} more effects...
            </div>
          )}
        </div>

        {/* Price/Action */}
        <div className="flex items-center justify-between">
          {powerup.baseCost && (
            <div className="flex items-center space-x-1">
              <span className="text-[#E6DB74] font-bold">
                {powerup.baseCost.toLocaleString()}
              </span>
              <span className="text-[#75715E] text-xs">ECE</span>
            </div>
          )}

          <motion.button
            onClick={handleAction}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isOwned 
                ? 'bg-[#A6E22E]/20 text-[#A6E22E] hover:bg-[#A6E22E]/30' 
                : 'bg-[#F92672]/20 text-[#F92672] hover:bg-[#F92672]/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!onApply && !onPurchase}
          >
            {isOwned ? 'Apply' : 'Purchase'}
          </motion.button>
        </div>
      </div>

      {/* Particle Effects */}
      {powerup.particleEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Add particle animation system here */}
        </div>
      )}
    </motion.div>
  );
};

export default PowerupCard;
