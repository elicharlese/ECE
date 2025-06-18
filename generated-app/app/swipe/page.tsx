'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/src/lib/theme-context';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { BottomNavigation } from '@/src/components/bottom-navigation';
import type { TradingCard } from '@/src/lib/card-store';

interface SwipeCard extends TradingCard {
  images?: string[];
  tags?: string[];
  highlights?: string[];
}

const sampleCards: SwipeCard[] = [
  {
    id: '1',
    title: 'EcoTracker Pro',
    description: 'AI-powered sustainability tracking app with carbon footprint analytics and personalized eco-friendly recommendations.',
    category: 'lifestyle',
    rarity: 'epic',
    stats: {
      performance: 92,
      scalability: 88,
      security: 90,
      userExperience: 95,
      innovation: 89
    },
    originalPrice: 2200,
    currentPrice: 2750,
    marketCap: 12400,
    priceChange24h: 8.5,
    volume24h: 5600,
    isForSale: true,
    isCrowdfunding: false,
    bettingPool: 850,
    totalBets: 24,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    owner: {
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    metadata: {
      framework: 'React Native',
      complexity: 'medium',
      features: ['AI Analytics', 'Carbon Tracking', 'Social Features', 'Gamification'],
      deliveryMethod: 'github',
      timeline: '2w',
      completedAt: '2024-01-15T10:30:00Z',
      buildProgress: 100,
      techStack: ['React Native', 'Python', 'TensorFlow', 'Firebase']
    },
    images: ['/eco-tracker-1.jpg', '/eco-tracker-2.jpg'],
    tags: ['Trending', 'AI-Powered', 'Social Impact'],
    highlights: ['100k+ Downloads', '$15k Monthly Revenue', '4.8★ Rating']
  },
  {
    id: '2',
    title: 'CryptoVault',
    description: 'Secure cryptocurrency portfolio manager with advanced trading features, multi-wallet support, and real-time market analysis.',
    category: 'fintech',
    rarity: 'legendary',
    stats: {
      performance: 96,
      scalability: 94,
      security: 98,
      userExperience: 91,
      innovation: 95
    },
    originalPrice: 3500,
    currentPrice: 4200,
    marketCap: 21000,
    priceChange24h: 12.3,
    volume24h: 8900,
    isForSale: true,
    isCrowdfunding: false,
    bettingPool: 1250,
    totalBets: 42,
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    owner: {
      name: 'Alex Morgan',
      email: 'alex@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
    },
    metadata: {
      framework: 'Next.js',
      complexity: 'complex',
      features: ['Multi-Wallet', 'Advanced Trading', 'Real-time Analytics', 'Security Features'],
      deliveryMethod: 'deployed',
      timeline: '3w',
      completedAt: '2024-01-10T08:15:00Z',
      buildProgress: 100,
      techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'WebSocket']
    },
    images: ['/crypto-vault-1.jpg', '/crypto-vault-2.jpg'],
    tags: ['Hot', 'Security Focus', 'High Revenue'],
    highlights: ['$45k Monthly Revenue', '99.9% Uptime', 'Bank-Level Security']
  },
  {
    id: '3',
    title: 'MindfulSpace',
    description: 'Meditation and mindfulness app with guided sessions, progress tracking, and personalized wellness recommendations.',
    category: 'health',
    rarity: 'rare',
    stats: {
      performance: 88,
      scalability: 85,
      security: 87,
      userExperience: 93,
      innovation: 82
    },
    originalPrice: 1200,
    currentPrice: 1450,
    marketCap: 5800,
    priceChange24h: 5.2,
    volume24h: 2100,
    isForSale: false,
    isCrowdfunding: true,
    bettingPool: 420,
    totalBets: 18,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    owner: {
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
    },
    metadata: {
      framework: 'Flutter',
      complexity: 'simple',
      features: ['Guided Meditation', 'Progress Tracking', 'Personalization', 'Sleep Stories'],
      deliveryMethod: 'github',
      timeline: '10d',
      completedAt: '2024-01-20T12:00:00Z',
      buildProgress: 100,
      techStack: ['Flutter', 'Firebase', 'AI/ML', 'Cloud Functions']
    },
    images: ['/mindful-space-1.jpg', '/mindful-space-2.jpg'],
    tags: ['Wellness', 'Growing Fast', 'Community Loved'],
    highlights: ['250k+ Users', 'Featured by Apple', '4.9★ Rating']
  }
];

export default function TinderStyleSwipe() {
  const { theme } = useTheme();
  const [cards] = useState<SwipeCard[]>(sampleCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [showLiked, setShowLiked] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [likedCards, setLikedCards] = useState<SwipeCard[]>([]);
  const [passedCards, setPassedCards] = useState<SwipeCard[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const currentCard = cards[currentIndex];
  const hasMoreCards = currentIndex < cards.length - 1;

  // Touch/Mouse handlers for smooth swiping
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    setDragOffset({ x: 0, y: 0 });
    setDragRotation(0);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    const rotation = deltaX * 0.1;

    setDragOffset({ x: deltaX, y: deltaY });
    setDragRotation(rotation);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    const { x } = dragOffset;

    if (Math.abs(x) > threshold) {
      handleSwipe(x > 0 ? 'right' : 'left');
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
      setDragRotation(0);
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentCard || !hasMoreCards) return;

    if (direction === 'right') {
      setLikedCards(prev => [...prev, currentCard]);
    } else {
      setPassedCards(prev => [...prev, currentCard]);
    }

    setCurrentIndex(prev => prev + 1);
    setDragOffset({ x: 0, y: 0 });
    setDragRotation(0);
    setCurrentImageIndex(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Handle image navigation
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentCard?.images && currentImageIndex < currentCard.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'epic': return 'from-purple-400 via-pink-500 to-purple-600';
      case 'rare': return 'from-blue-400 via-cyan-500 to-blue-600';
      default: return 'from-gray-400 via-gray-500 to-gray-600';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-theme-text-primary mb-2">No more cards!</h2>
          <p className="text-theme-text-secondary mb-6">You've seen all available apps</p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setLikedCards([]);
              setPassedCards([]);
            }}
            className="px-6 py-3 bg-theme-accent text-white rounded-full font-semibold hover:bg-theme-accent/90 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-theme-surface/95 backdrop-blur-sm border-b border-theme-border">
        <button
          onClick={() => setShowProfile(true)}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-theme-accent to-blue-500 flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-theme-text-primary">ECE</div>
          <span className="px-2 py-1 bg-theme-accent/20 text-theme-accent rounded text-xs font-medium">DISCOVER</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLiked(true)}
            className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center relative"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {likedCards.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {likedCards.length}
              </span>
            )}
          </button>
          <ThemeToggle size="sm" />
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Cards */}
        {hasMoreCards && (
          <div className="absolute inset-4 max-w-sm mx-auto">
            <div className="absolute inset-0 bg-theme-surface rounded-3xl shadow-lg transform scale-95 opacity-50" />
            <div className="absolute inset-0 bg-theme-surface rounded-3xl shadow-lg transform scale-90 opacity-25" />
          </div>
        )}

        {/* Current Card */}
        <div
          ref={cardRef}
          className={`relative w-full max-w-sm h-[600px] cursor-grab active:cursor-grabbing swipe-card ${
            isDragging ? 'swipe-card-dragging' : ''
          }`}
          style={{
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragRotation}deg)`,
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: 10
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Swipe Indicators */}
          {isDragging && (
            <>
              <div
                className={`absolute top-8 left-8 z-30 transition-all duration-150 ${
                  dragOffset.x < -50 ? 'opacity-100 scale-110' : 'opacity-0 scale-75'
                }`}
              >
                <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm border-4 border-white shadow-xl transform -rotate-12">
                  PASS
                </div>
              </div>
              <div
                className={`absolute top-8 right-8 z-30 transition-all duration-150 ${
                  dragOffset.x > 50 ? 'opacity-100 scale-110' : 'opacity-0 scale-75'
                }`}
              >
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm border-4 border-white shadow-xl transform rotate-12">
                  LIKE
                </div>
              </div>
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-150 ${
                  dragOffset.y < -50 ? 'opacity-100 scale-110' : 'opacity-0 scale-75'
                }`}
              >
                <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg border-4 border-white shadow-xl">
                  ORDER
                </div>
              </div>
            </>
          )}

          {/* Card Content */}
          <div className="h-full bg-theme-surface rounded-3xl shadow-2xl overflow-hidden">
            {/* Images Section */}
            <div className="relative h-2/3 bg-gradient-to-br from-gray-200 to-gray-300">
              {/* Image Navigation Dots */}
              {currentCard.images && currentCard.images.length > 1 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {currentCard.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Image Navigation Areas */}
              <div
                className="absolute left-0 top-0 w-1/2 h-full z-10"
                onClick={prevImage}
              />
              <div
                className="absolute right-0 top-0 w-1/2 h-full z-10"
                onClick={nextImage}
              />

              {/* App Screenshot/Preview */}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-6xl opacity-50">📱</div>
              </div>

              {/* Rarity Badge */}
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityGradient(currentCard.rarity)}`}>
                {currentCard.rarity.toUpperCase()}
              </div>

              {/* Tags */}
              {currentCard.tags && (
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {currentCard.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="h-1/3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-theme-text-primary">{currentCard.title}</h3>
                    <p className="text-sm text-theme-text-secondary capitalize">{currentCard.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-theme-accent">{formatPrice(currentCard.currentPrice)}</p>
                    <p className={`text-xs ${currentCard.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {currentCard.priceChange24h >= 0 ? '+' : ''}{currentCard.priceChange24h.toFixed(1)}%
                    </p>
                  </div>
                </div>

              <div className="space-y-2">
                <p className="text-sm text-theme-text-secondary line-clamp-2 mb-3">
                  {currentCard.description}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-green-500">💰</span>
                      <span className="font-semibold text-green-600">{formatPrice(currentCard.currentPrice)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={currentCard.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {currentCard.priceChange24h >= 0 ? '↗️' : '↘️'}
                      </span>
                      <span className={`text-xs font-medium ${currentCard.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {currentCard.priceChange24h >= 0 ? '+' : ''}{currentCard.priceChange24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-theme-text-secondary">Market Cap</span>
                    <p className="text-sm font-semibold text-theme-text-primary">{formatPrice(currentCard.marketCap)}</p>
                  </div>
                </div>

                {/* Highlights */}
                {currentCard.highlights && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {currentCard.highlights.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-theme-accent/10 text-theme-accent text-xs rounded font-medium border border-theme-accent/20"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center space-x-4 pb-20 pt-4">
        <button
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center shadow-lg action-button"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => setShowMatches(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center shadow-lg action-button"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => handleSwipe('up')}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg action-button super-like-pulse border-4 border-white"
          title="Super Like - Order this app!"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => handleSwipe('right')}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center shadow-lg action-button"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-theme-surface w-full sm:w-96 sm:rounded-2xl p-6 sm:m-4 rounded-t-2xl sm:rounded-t-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-theme-text-primary">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="w-8 h-8 rounded-full bg-theme-border flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-theme-accent to-blue-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-theme-text-primary">App Explorer</h3>
                  <p className="text-theme-text-secondary text-sm">Discovering amazing apps</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-theme-accent">{likedCards.length}</p>
                  <p className="text-xs text-theme-text-secondary">Liked</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-theme-accent">{passedCards.length}</p>
                  <p className="text-xs text-theme-text-secondary">Passed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-theme-accent">{currentIndex}</p>
                  <p className="text-xs text-theme-text-secondary">Seen</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProfile(false);
                  // Navigate to order page with current app context
                  const queryParams = currentCard ? 
                    `?appId=${currentCard.id}&appTitle=${encodeURIComponent(currentCard.title)}&appPrice=${currentCard.currentPrice}` : '';
                  window.location.href = `/order${queryParams}`;
                }}
                className="w-full py-3 bg-theme-accent text-white rounded-xl font-semibold hover:bg-theme-accent/90 transition-colors"
              >
                🚀 Order Custom App
              </button>

              <div className="pt-4 border-t border-theme-border">
                <h4 className="font-semibold text-theme-text-primary mb-3">Your Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-theme-text-secondary">Apps Liked:</span>
                    <span className="font-medium text-green-600">{likedCards.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-text-secondary">Apps Passed:</span>
                    <span className="font-medium text-red-500">{passedCards.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-text-secondary">Total Viewed:</span>
                    <span className="font-medium text-theme-text-primary">{currentIndex}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liked Cards Modal */}
      {showLiked && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-theme-surface w-full sm:w-96 sm:rounded-2xl p-6 sm:m-4 rounded-t-2xl sm:rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-theme-text-primary">Liked Apps ({likedCards.length})</h2>
              <button
                onClick={() => setShowLiked(false)}
                className="w-8 h-8 rounded-full bg-theme-border flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {likedCards.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💔</div>
                  <p className="text-theme-text-secondary">No liked apps yet</p>
                </div>
              ) : (
                likedCards.map((card) => (
                  <div key={card.id} className="flex items-center space-x-4 p-3 bg-theme-background rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-theme-text-primary">{card.title}</h4>
                      <p className="text-sm text-theme-text-secondary">{formatPrice(card.currentPrice)}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowMatches(false);
                        const queryParams = `?appId=${card.id}&appTitle=${encodeURIComponent(card.title)}&appPrice=${card.currentPrice}`;
                        window.location.href = `/order${queryParams}`;
                      }}
                      className="px-3 py-1 bg-theme-accent text-white text-sm rounded-lg hover:bg-theme-accent/90 transition-colors"
                    >
                      Order
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Progress Indicator */}
      <div className="px-4 pb-20">
        <div className="w-full bg-theme-border h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-theme-accent progress-bar"
            style={{ width: `${(currentIndex / cards.length) * 100}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-theme-text-secondary">
            {currentIndex} of {cards.length} apps
          </span>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
