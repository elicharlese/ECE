'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import SplineScene from './SplineScene';
import { gsap } from 'gsap';

interface Card3DData {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  splineUrl: string;
  stats: {
    power: number;
    defense: number;
    speed: number;
  };
  description: string;
  imageUrl?: string; // Fallback 2D image
}

interface Card3DInteractiveProps {
  cards: Card3DData[];
  onCardSelect?: (card: Card3DData) => void;
  onCardSwipe?: (direction: 'left' | 'right', card: Card3DData) => void;
  className?: string;
  enableSwipe?: boolean;
  showStats?: boolean;
}

/**
 * Interactive 3D Card Component for ECE Trading Cards
 * 
 * Features:
 * - Tinder-like swiping mechanics for card discovery
 * - Individual Spline 3D models for each card
 * - Rarity-based visual effects and animations
 * - Beach Monokai themed UI with glassmorphism
 * - Performance-optimized card loading and caching
 * - Accessibility controls and keyboard navigation
 * - GSAP-powered entrance and interaction animations
 */
export default function Card3DInteractive({
  cards,
  onCardSelect,
  onCardSwipe,
  className = '',
  enableSwipe = true,
  showStats = true
}: Card3DInteractiveProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loadedCards, setLoadedCards] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for gesture controls
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const currentCard = cards[currentCardIndex];

  // Rarity color schemes
  const rarityColors = {
    common: {
      primary: '#75715E',
      secondary: '#F8EFD6',
      accent: '#E6DB74',
      glow: 'rgba(230, 219, 116, 0.3)'
    },
    rare: {
      primary: '#66D9EF',
      secondary: '#F8EFD6',
      accent: '#819AFF',
      glow: 'rgba(102, 217, 239, 0.4)'
    },
    epic: {
      primary: '#A6E22E',
      secondary: '#272822',
      accent: '#3EBA7C',
      glow: 'rgba(166, 226, 46, 0.5)'
    },
    legendary: {
      primary: '#F92672',
      secondary: '#F8EFD6',
      accent: '#FD5C63',
      glow: 'rgba(249, 38, 114, 0.6)'
    }
  };

  const currentRarityColors = rarityColors[currentCard?.rarity || 'common'];

  // GSAP animations for card entrance
  useEffect(() => {
    if (!cardRef.current) return;

    const tl = gsap.timeline();
    
    tl.fromTo(cardRef.current,
      { 
        scale: 0.8,
        rotationY: -90,
        opacity: 0
      },
      {
        scale: 1,
        rotationY: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );

    return () => {
      tl.kill();
    };
  }, [currentCardIndex]);

  // Handle card swipe gestures
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 150;
    const { offset, velocity } = info;

    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      const direction = offset.x > 0 ? 'right' : 'left';
      
      // Animate card out
      gsap.to(cardRef.current, {
        x: direction === 'right' ? 300 : -300,
        rotation: direction === 'right' ? 25 : -25,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          // Move to next card
          nextCard();
          // Reset position
          gsap.set(cardRef.current, { x: 0, rotation: 0, opacity: 1 });
        }
      });

      onCardSwipe?.(direction, currentCard);
    } else {
      // Spring back to center
      gsap.to(cardRef.current, {
        x: 0,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    }

    // Reset motion values
    x.set(0);
    y.set(0);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const previousCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleCardLoad = (cardId: string) => {
    setLoadedCards(prev => new Set(prev).add(cardId));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          previousCard();
          break;
        case 'ArrowRight':
          nextCard();
          break;
        case ' ':
        case 'Enter':
          setShowDetails(!showDetails);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showDetails]);

  // Card fallback component
  const Card2DFallback = ({ card }: { card: Card3DData }) => (
    <div className="w-full h-full bg-gradient-to-br from-[#272822] to-[#3E3D32] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${currentRarityColors.primary} 0%, transparent 70%)`
        }}
      />
      
      {/* Card image placeholder */}
      <motion.div
        className="w-32 h-32 rounded-full bg-gradient-to-br from-current to-transparent mb-6 flex items-center justify-center"
        style={{ color: currentRarityColors.primary }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg className="w-16 h-16 text-[#F8EFD6]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>

      <h3 className="text-2xl font-bold text-[#F8EFD6] mb-2">{card.name}</h3>
      <p className="text-sm text-[#75715E] mb-4 capitalize">{card.rarity} Card</p>
      
      {showStats && (
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {Object.entries(card.stats).map(([stat, value]) => (
            <div key={stat} className="text-center">
              <div className="text-lg font-bold" style={{ color: currentRarityColors.primary }}>
                {value}
              </div>
              <div className="text-xs text-[#75715E] capitalize">{stat}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!currentCard) return null;

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {/* Card Stack Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Background cards */}
        {cards.slice(currentCardIndex + 1, currentCardIndex + 3).map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute w-80 h-96 bg-[#272822]/50 rounded-2xl border border-[#75715E]/30"
            style={{
              zIndex: -index - 1,
              scale: 1 - (index + 1) * 0.05,
              y: (index + 1) * 10,
            }}
            animate={{
              rotateY: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Main Interactive Card */}
        <motion.div
          ref={cardRef}
          className="relative w-80 h-96 cursor-grab active:cursor-grabbing"
          style={{ x, y, rotate, opacity }}
          drag={enableSwipe}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsInteracting(true)}
          onDragEnd={handleDragEnd}
          onTap={() => {
            setShowDetails(!showDetails);
            onCardSelect?.(currentCard);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Card glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at center, ${currentRarityColors.glow} 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Card container */}
          <div className="relative w-full h-full bg-[#272822]/90 backdrop-blur-md rounded-2xl border-2 border-current overflow-hidden"
               style={{ borderColor: currentRarityColors.primary }}>
            
            {/* 3D Scene */}
            <div className="w-full h-2/3">
              <SplineScene
                scene={currentCard.splineUrl}
                className="w-full h-full rounded-t-2xl"
                onLoad={() => handleCardLoad(currentCard.id)}
                fallback={<Card2DFallback card={currentCard} />}
                quality="medium"
                interactive={true}
              />
            </div>

            {/* Card Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#272822] to-transparent">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-[#F8EFD6]">{currentCard.name}</h3>
                  <p className="text-sm capitalize" style={{ color: currentRarityColors.primary }}>
                    {currentCard.rarity}
                  </p>
                </div>
                
                {/* Rarity indicator */}
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentRarityColors.primary }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              {/* Stats */}
              {showStats && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(currentCard.stats).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="font-bold text-[#F8EFD6]">{value}</div>
                      <div className="text-[#75715E] capitalize">{stat}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
        <motion.button
          className="w-12 h-12 bg-[#272822]/90 backdrop-blur-md rounded-full border border-[#75715E]/50 flex items-center justify-center text-[#FD5C63]"
          whileHover={{ scale: 1.1, borderColor: '#FD5C63' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleDragEnd(null, { offset: { x: -200, y: 0 }, velocity: { x: -600, y: 0 } } as PanInfo)}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </motion.button>

        <motion.button
          className="w-12 h-12 bg-[#272822]/90 backdrop-blur-md rounded-full border border-[#75715E]/50 flex items-center justify-center text-[#66D9EF]"
          whileHover={{ scale: 1.1, borderColor: '#66D9EF' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDetails(!showDetails)}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </motion.button>

        <motion.button
          className="w-12 h-12 bg-[#272822]/90 backdrop-blur-md rounded-full border border-[#75715E]/50 flex items-center justify-center text-[#A6E22E]"
          whileHover={{ scale: 1.1, borderColor: '#A6E22E' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleDragEnd(null, { offset: { x: 200, y: 0 }, velocity: { x: 600, y: 0 } } as PanInfo)}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>

      {/* Card counter */}
      <div className="absolute top-6 right-6 bg-[#272822]/90 backdrop-blur-md rounded-full px-4 py-2 border border-[#75715E]/50">
        <span className="text-[#F8EFD6] text-sm font-medium">
          {currentCardIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Swipe indicators */}
      <AnimatePresence>
        {isInteracting && (
          <>
            <motion.div
              className="absolute left-10 top-1/2 transform -translate-y-1/2 text-[#FD5C63] text-4xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              ✗
            </motion.div>
            <motion.div
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#A6E22E] text-4xl font-bold"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              ✓
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
