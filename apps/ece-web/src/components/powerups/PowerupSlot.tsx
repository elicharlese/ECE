// PowerupSlot Component - Powerup application slots on card details
// /apps/ece-web/src/components/powerups/PowerupSlot.tsx

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CardPowerup, 
  PowerupSlotProps,
  PowerupType,
  UserPowerup 
} from '@/types/powerups';
import { 
  Plus, 
  X, 
  Clock, 
  Zap, 
  Shield, 
  Star,
  Sparkles
} from 'lucide-react';

export const PowerupSlot: React.FC<PowerupSlotProps> = ({
  cardId,
  slotIndex,
  appliedPowerup,
  onPowerupApply,
  onPowerupRemove,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const isEmpty = !appliedPowerup;
  const isExpired = appliedPowerup?.expiresAt && new Date(appliedPowerup.expiresAt) < new Date();
  const isOnCooldown = appliedPowerup?.cooldownEnds && new Date(appliedPowerup.cooldownEnds) > new Date();

  const getRemainingTime = () => {
    if (!appliedPowerup?.expiresAt) return null;
    const now = new Date().getTime();
    const expires = new Date(appliedPowerup.expiresAt).getTime();
    const remaining = expires - now;
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getCooldownTime = () => {
    if (!appliedPowerup?.cooldownEnds) return null;
    const now = new Date().getTime();
    const cooldown = new Date(appliedPowerup.cooldownEnds).getTime();
    const remaining = cooldown - now;
    
    if (remaining <= 0) return null;
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSlotClick = () => {
    if (isEmpty && onPowerupApply) {
      // Show powerup selection modal/dropdown
      onPowerupApply('');
    } else if (appliedPowerup) {
      setShowDetails(!showDetails);
    }
  };

  const handleRemovePowerup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (appliedPowerup && onPowerupRemove) {
      onPowerupRemove(appliedPowerup.id);
    }
  };

  const getSlotColor = () => {
    if (isEmpty) return '#75715E';
    if (isExpired) return '#F92672';
    if (isOnCooldown) return '#E6DB74';
    
    const rarity = appliedPowerup?.powerupType?.rarity;
    switch (rarity) {
      case 'COMMON': return '#75715E';
      case 'UNCOMMON': return '#A6E22E';
      case 'RARE': return '#66D9EF';
      case 'EPIC': return '#F92672';
      case 'LEGENDARY': return '#E6DB74';
      case 'MYTHIC': return '#819AFF';
      case 'ARTIFACT': return '#FD5C63';
      default: return '#75715E';
    }
  };

  const slotColor = getSlotColor();

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300"
        style={{
          borderColor: slotColor,
          backgroundColor: `${slotColor}10`
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: `0 0 20px ${slotColor}40`
        }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleSlotClick}
      >
        {/* Empty Slot */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Plus 
                size={24} 
                style={{ color: slotColor }}
                className="drop-shadow-lg"
              />
            </motion.div>
          </div>
        )}

        {/* Applied Powerup */}
        {appliedPowerup && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            {/* Background Glow */}
            <div 
              className="absolute inset-0 rounded-xl opacity-30"
              style={{
                background: `radial-gradient(circle at center, ${slotColor}60 0%, transparent 70%)`
              }}
            />

            {/* Powerup Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              {appliedPowerup.powerupType?.iconUrl ? (
                <img 
                  src={appliedPowerup.powerupType.iconUrl} 
                  alt={appliedPowerup.powerupType.name}
                  className="w-12 h-12 object-contain drop-shadow-lg"
                />
              ) : (
                <Sparkles 
                  size={24} 
                  style={{ color: slotColor }}
                  className="drop-shadow-lg"
                />
              )}
            </div>

            {/* Status Indicators */}
            <div className="absolute top-1 right-1 space-y-1">
              {/* Stack Count */}
              {appliedPowerup.stackCount > 1 && (
                <div 
                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ 
                    backgroundColor: slotColor,
                    color: '#272822'
                  }}
                >
                  {appliedPowerup.stackCount}
                </div>
              )}

              {/* Cooldown Indicator */}
              {isOnCooldown && (
                <div className="w-5 h-5 rounded-full bg-[#E6DB74] flex items-center justify-center">
                  <Clock size={10} className="text-[#272822]" />
                </div>
              )}

              {/* Expired Indicator */}
              {isExpired && (
                <div className="w-5 h-5 rounded-full bg-[#F92672] flex items-center justify-center">
                  <X size={10} className="text-[#F8EFD6]" />
                </div>
              )}
            </div>

            {/* Remove Button */}
            {isHovered && !isEmpty && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleRemovePowerup}
                className="absolute -top-2 -right-2 w-6 h-6 bg-[#F92672] rounded-full flex items-center justify-center text-[#F8EFD6] hover:bg-[#F92672]/80 transition-colors"
              >
                <X size={12} />
              </motion.button>
            )}

            {/* Duration Progress */}
            {appliedPowerup.expiresAt && !isExpired && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#272822]/50 rounded-b-xl overflow-hidden">
                <motion.div
                  className="h-full rounded-b-xl"
                  style={{ backgroundColor: slotColor }}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ 
                    duration: (new Date(appliedPowerup.expiresAt).getTime() - Date.now()) / 1000,
                    ease: 'linear'
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Slot Number */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div 
            className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
            style={{ 
              backgroundColor: `${slotColor}40`,
              color: slotColor
            }}
          >
            {slotIndex + 1}
          </div>
        </div>
      </motion.div>

      {/* Powerup Details Tooltip */}
      <AnimatePresence>
        {(showDetails || isHovered) && appliedPowerup && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-[#272822]/95 backdrop-blur-md border border-[#75715E] rounded-lg p-4 text-sm"
            style={{ borderColor: slotColor }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h4 
                className="font-semibold"
                style={{ color: slotColor }}
              >
                {appliedPowerup.powerupType?.displayName}
              </h4>
              <span className="text-xs text-[#75715E]">
                Level {appliedPowerup.level}
              </span>
            </div>

            {/* Description */}
            <p className="text-[#F8EFD6] mb-3 text-xs leading-relaxed">
              {appliedPowerup.powerupType?.description}
            </p>

            {/* Effects */}
            <div className="space-y-1 mb-3">
              {appliedPowerup.effects?.slice(0, 3).map((effect, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-[#75715E] capitalize">
                    {effect.targetStat.replace('_', ' ')}
                  </span>
                  <span style={{ color: slotColor }}>
                    {effect.modifierType === 'PERCENT_INCREASE' ? '+' : ''}
                    {effect.modifier}
                    {effect.modifierType.includes('PERCENT') ? '%' : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between text-xs">
              {appliedPowerup.expiresAt && (
                <div className="flex items-center space-x-1">
                  <Clock size={12} className="text-[#75715E]" />
                  <span className="text-[#75715E]">
                    {getRemainingTime()}
                  </span>
                </div>
              )}

              {isOnCooldown && (
                <div className="flex items-center space-x-1">
                  <Zap size={12} className="text-[#E6DB74]" />
                  <span className="text-[#E6DB74]">
                    {getCooldownTime()}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-1">
                <span className="text-[#75715E]">Uses:</span>
                <span className="text-[#F8EFD6]">
                  {appliedPowerup.usageCount}
                  {appliedPowerup.maxUsages && `/${appliedPowerup.maxUsages}`}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
              style={{ borderTopColor: slotColor }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PowerupSlot;
