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
    {
      id: 1,
      name: "EcoTracker Pro",
      description: "AI-powered sustainability tracking app generating $12K/month revenue with 25K+ active users",
      category: "GreenTech",
      price: "$45,000",
      image: "/ai-study-app-interface.png",
      type: "for-sale",
      revenue: "$12K/mo",
      users: "25K+",
      status: "Live & Profitable",
      complexity: "Complex",
      rating: 4.8,
      orders: 0,
      features: ["AI Analytics", "Carbon Tracking", "User Dashboard", "Premium Subscriptions", "Mobile App"]
    },
    {
      id: 2,
      name: "Custom E-Commerce Platform",
      description: "Get your dream online store built with modern tech stack - Stripe, admin panel, inventory management",
      category: "E-Commerce",
      price: "From $1,299",
      image: "/restaurant-discovery-app.png",
      type: "custom-order",
      timeline: "7-14 days",
      status: "Available for Order",
      complexity: "Medium",
      rating: 4.7,
      orders: 156,
      features: ["Stripe Integration", "Admin Dashboard", "Inventory System", "Customer Analytics", "Mobile Responsive"]
    },
    {
      id: 3,
      name: "FinanceFlow",
      description: "Personal finance app with crypto integration generating $28K/month with growing user base",
      category: "FinTech",
      price: "$85,000",
      image: "/cryptocurrency-trading-app.png",
      type: "for-sale",
      revenue: "$28K/mo",
      users: "67K+",
      status: "Growing Fast",
      complexity: "Complex",
      rating: 4.6,
      orders: 0,
      features: ["Crypto Integration", "Portfolio Tracking", "Real-time Analytics", "Security Features", "Cross-platform"]
    },
    {
      id: 4,
      name: "SaaS Dashboard Template",
      description: "Modern SaaS application template with user management, subscription billing, and analytics",
      category: "SaaS",
      price: "From $899",
      image: "/placeholder.svg",
      type: "custom-order",
      timeline: "5-10 days",
      status: "Popular Template",
      complexity: "Medium",
      rating: 4.5,
      orders: 83,
      features: ["User Authentication", "Subscription Billing", "Analytics", "API Integration", "Admin Panel"]
    }
  ];

  // Sample order history for admin view
  const sampleOrderHistory: AppCard[] = [
    {
      id: 101,
      name: "Custom Portfolio Site",
      description: "Professional portfolio website for designer",
      category: "Portfolio",
      price: "$499",
      image: "/placeholder.svg",
      type: "completed",
      status: "Delivered",
      complexity: "Simple",
      orderId: "ORD-2024-001",
      developmentStage: "delivered",
      orderDate: "2024-01-15",
      estimatedCompletion: "2024-01-20",
      features: ["Responsive Design", "CMS Integration", "SEO Optimized"]
    },
    {
      id: 102,
      name: "E-commerce Store",
      description: "Online clothing store with payment integration",
      category: "E-Commerce",
      price: "$1,899",
      image: "/placeholder.svg",
      type: "completed",
      status: "In Development",
      complexity: "Complex",
      orderId: "ORD-2024-002",
      developmentStage: "development",
      orderDate: "2024-01-18",
      estimatedCompletion: "2024-02-05",
      features: ["Stripe Integration", "Inventory Management", "Admin Dashboard"]
    }
  ];

  const theme = {
    primary: "#0a1312",
    secondary: "#1a2625",
    accent: "#0e5f59",
    text: "#94a3a0",
    textPrimary: "#ffffff",
    border: "#0e5f59",
  };

  const currentCard = appCards[currentCardIndex];

  const handleSwipe = (direction: "left" | "right" | "up") => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === "up") {
        // Order this app
        if (currentCard.type === "custom-order") {
          window.location.href = `/order?app=${currentCard.id}`;
        } else {
          // Purchase existing app
          setPurchasedCards(prev => [...prev, currentCard.id]);
          alert(`Added ${currentCard.name} to your portfolio!`);
        }
      } else if (direction === "right") {
        // Save for later
        setSavedCards(prev => [...prev, currentCard.id]);
      }
      // Move to next card
      setCurrentCardIndex((prev) => (prev + 1) % appCards.length);
      setSwipeDirection(null);
    }, 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      const threshold = 100;

      if (Math.abs(deltaY) > threshold && deltaY < 0) {
        handleSwipe("up");
      } else if (Math.abs(deltaX) > threshold) {
        handleSwipe(deltaX > 0 ? "right" : "left");
      }

      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const renderCardsView = () => (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Instructions & Stats */}
        <div className="space-y-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm mb-6">
            🚀 <span className="ml-2">Swipe • Order • Build • Trade</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Trade Your Way to
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              App Success
            </span>
          </h1>
          
          <p className="text-xl text-white/80 leading-relaxed">
            Discover, order, and trade professionally built applications. Each app comes as a unique trading card 
            that you can collect, use, or trade on our marketplace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={() => handleSwipe("up")}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl text-white font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105"
            >
              📱 Order This App
            </button>
            <button 
              onClick={() => handleSwipe("right")}
              className="px-8 py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
            >
              ➡️ Next Card
            </button>
          </div>

          {/* Trading Instructions */}
          <div className="flex items-center gap-8 mt-12 text-white/60">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👆</span>
              <span>Swipe Up to Order</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👉</span>
              <span>Swipe Right to Save</span>
            </div>
          </div>
        </div>

        {/* Right Side - Trading Card */}
        <div className="flex justify-center items-center relative">
          {/* Card Stack Effect */}
          <div className="relative">
            {/* Background Cards */}
            <div 
              className="absolute inset-0 rounded-3xl shadow-2xl transform rotate-3 scale-95 opacity-30"
              style={{ backgroundColor: theme.secondary, borderColor: theme.border }}
            />
            <div 
              className="absolute inset-0 rounded-3xl shadow-2xl transform -rotate-2 scale-97 opacity-50"
              style={{ backgroundColor: theme.secondary, borderColor: theme.border }}
            />
            
            {/* Main Card */}
            <div
              ref={cardRef}
              className={`relative w-80 h-[500px] rounded-3xl shadow-2xl border cursor-grab active:cursor-grabbing transition-transform duration-300 ${
                swipeDirection === "left" ? "transform -translate-x-full -rotate-12 opacity-0" :
                swipeDirection === "right" ? "transform translate-x-full rotate-12 opacity-0" :
                swipeDirection === "up" ? "transform -translate-y-full scale-95 opacity-0" :
                isDragging ? "transform scale-105" : ""
              }`}
              style={{ 
                backgroundColor: theme.secondary, 
                borderColor: theme.border,
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{currentCard.name}</h3>
                    <p className="text-sm" style={{ color: theme.text }}>{currentCard.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-400">{currentCard.price}</div>
                    <div className="text-xs" style={{ color: theme.text }}>{currentCard.timeline || 'Available Now'}</div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentCard.complexity === "Simple" ? "bg-green-500/20 text-green-400" :
                    currentCard.complexity === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {currentCard.complexity}
                  </span>
                  <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs font-medium">
                    {currentCard.status}
                  </span>
                </div>
              </div>

              {/* Card Image */}
              <div className="h-48 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center border-b border-white/10">
                <div className="text-4xl opacity-50">📱</div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                  {currentCard.description}
                </p>

                {/* Features */}
                {currentCard.features && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentCard.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded text-xs"
                          style={{ color: theme.text }}
                        >
                          {feature}
                        </span>
                      ))}
                      {currentCard.features.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 rounded text-xs" style={{ color: theme.text }}>
                          +{currentCard.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{currentCard.orders || 0}</div>
                    <div className="text-xs" style={{ color: theme.text }}>Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{currentCard.rating || 4.5}</div>
                    <div className="text-xs" style={{ color: theme.text }}>Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-400">#{currentCard.id}</div>
                    <div className="text-xs" style={{ color: theme.text }}>Card ID</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Counter */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-2">
                {appCards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentCardIndex ? "bg-teal-400" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">App Marketplace</h2>
          <p className="text-white/80">Browse all available apps and custom order templates</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appCards.map((card) => (
            <div key={card.id} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                  <div className="text-4xl opacity-50">📱</div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    card.type === 'for-sale' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {card.type === 'for-sale' ? '💼 For Sale' : '🛠️ Custom Order'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{card.name}</h3>
                  <div className="text-lg font-bold text-teal-400">{card.price}</div>
                </div>
                <p className="text-white/70 text-sm mb-4">{card.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    card.complexity === "Simple" ? "bg-green-500/20 text-green-400" :
                    card.complexity === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {card.complexity}
                  </span>
                  <button
                    onClick={() => {
                      if (card.type === "custom-order") {
                        window.location.href = `/order?app=${card.id}`;
                      } else {
                        setPurchasedCards(prev => [...prev, card.id]);
                        alert(`Added ${card.name} to your portfolio!`);
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white text-sm font-medium hover:from-teal-600 hover:to-cyan-600 transition-all"
                  >
                    {card.type === 'for-sale' ? 'Buy Now' : 'Order'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h2>
          <p className="text-white/80">Manage orders and track app development</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">{appCards.length}</div>
              <div className="text-white/80 text-sm">Total Cards</div>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{purchasedCards.length}</div>
              <div className="text-white/80 text-sm">Purchased</div>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{savedCards.length}</div>
              <div className="text-white/80 text-sm">Saved</div>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{sampleOrderHistory.length}</div>
              <div className="text-white/80 text-sm">Active Orders</div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {sampleOrderHistory.map((order) => (
              <div key={order.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-medium">{order.name}</h4>
                      <span className="text-xs text-white/60">#{order.orderId}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.developmentStage === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.developmentStage === 'development' ? 'bg-blue-500/20 text-blue-400' :
                        order.developmentStage === 'testing' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {order.developmentStage}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">{order.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>Ordered: {order.orderDate}</span>
                      <span>Est. Completion: {order.estimatedCompletion}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-teal-400">{order.price}</div>
                    <div className="text-xs text-white/60">{order.complexity}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ backgroundColor: theme.primary }}>
      <div className="flex-1 flex flex-col">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">ECE</div>
            <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded text-xs font-medium">MARKETPLACE</span>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === "cards" ? "bg-teal-500 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === "grid" ? "bg-teal-500 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("admin")}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === "admin" ? "bg-teal-500 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a href="/order" className="text-white/80 hover:text-white transition-colors">Order App</a>
            <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">Portfolio</a>
            <a href="/" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white font-medium hover:from-teal-600 hover:to-cyan-600 transition-all">
              Home
            </a>
          </div>
        </nav>

        {/* Main Content */}
        {viewMode === "cards" && renderCardsView()}
        {viewMode === "grid" && renderGridView()}
        {viewMode === "admin" && renderAdminView()}
      </div>
    </div>
  );
};

export default MarketplacePage;
