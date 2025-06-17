'use client';

import { useState, useRef, useEffect } from 'react';
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

interface AppCard {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  timeline: string;
  image: string;
  features: string[];
  complexity: "Simple" | "Medium" | "Complex";
  status: "Available" | "Building" | "Completed";
  orders: number;
  satisfaction: number;
}

const appCards: AppCard[] = [
  {
    id: 1,
    name: "E-Commerce Platform",
    description: "Full-featured online store with payment processing, inventory management, and customer analytics. Perfect for businesses ready to sell online.",
    category: "E-Commerce",
    pricing: "$1,299",
    timeline: "7-14 days",
    image: "/placeholder.svg?height=300&width=400&text=E-Commerce",
    features: ["Stripe Integration", "Admin Dashboard", "Inventory System", "Customer Analytics", "Mobile Responsive"],
    complexity: "Complex",
    status: "Available",
    orders: 47,
    satisfaction: 4.9
  },
  {
    id: 2,
    name: "SaaS Dashboard",
    description: "Modern SaaS application with user management, subscription billing, and comprehensive analytics. Ready for your next big idea.",
    category: "SaaS",
    pricing: "$899",
    timeline: "5-10 days",
    image: "/placeholder.svg?height=300&width=400&text=SaaS+Dashboard",
    features: ["User Authentication", "Subscription Billing", "Analytics", "API Integration", "Admin Panel"],
    complexity: "Medium",
    status: "Available",
    orders: 83,
    satisfaction: 4.8
  },
  {
    id: 3,
    name: "Portfolio Website",
    description: "Professional portfolio website with CMS, contact forms, and SEO optimization. Perfect for creators and professionals.",
    category: "Portfolio",
    pricing: "$299",
    timeline: "2-5 days",
    image: "/placeholder.svg?height=300&width=400&text=Portfolio",
    features: ["CMS Integration", "Contact Forms", "SEO Optimized", "Responsive Design", "Fast Loading"],
    complexity: "Simple",
    status: "Available",
    orders: 156,
    satisfaction: 4.7
  },
  {
    id: 4,
    name: "AI Chat Bot",
    description: "Intelligent chatbot with natural language processing, custom training, and seamless integration. Boost customer engagement.",
    category: "AI/ML",
    pricing: "$599",
    timeline: "5-8 days",
    image: "/placeholder.svg?height=300&width=400&text=AI+ChatBot",
    features: ["NLP Processing", "Custom Training", "Multi-Platform", "Analytics", "Live Chat"],
    complexity: "Medium",
    status: "Available",
    orders: 29,
    satisfaction: 4.6
  },
  {
    id: 5,
    name: "Crypto Trading App",
    description: "Advanced cryptocurrency trading platform with real-time data, portfolio tracking, and automated trading strategies.",
    category: "FinTech",
    pricing: "$1,899",
    timeline: "10-21 days",
    image: "/placeholder.svg?height=300&width=400&text=Crypto+Trading",
    features: ["Real-time Data", "Portfolio Tracking", "Auto Trading", "Security Features", "Mobile App"],
    complexity: "Complex",
    status: "Available",
    orders: 12,
    satisfaction: 4.8
  }
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Theme colors matching ECE app
  const theme = {
    primary: "#0a1312", // Dark teal background
    secondary: "#1a2625", // Card backgrounds
    accent: "#0e5f59", // Primary accent - teal
    text: "#94a3a0", // Light teal-gray text
    textPrimary: "#ffffff", // Primary text
    border: "#0e5f59", // Borders
  };

  const currentCard = appCards[currentCardIndex];

  const handleSwipe = (direction: "left" | "right" | "up") => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === "up") {
        // Order this app
        window.location.href = `/order?app=${currentCard.id}`;
      } else {
        // Move to next card
        setCurrentCardIndex((prev) => (prev + 1) % appCards.length);
      }
      setSwipeDirection(null);
    }, 300);
  };

  const handleAuth = async (provider: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          email: provider === 'google' ? 'demo@ece-cli.com' : undefined,
          walletAddress: provider !== 'demo' && provider !== 'google' ? '0x123...abc' : undefined
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('sessionId', data.session.id);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else {
        alert('Authentication failed: ' + data.error);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDemo = () => {
    handleAuth('demo');
  };

  // Mouse/touch handlers for card swiping
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

  return (
    <div 
      className={`h-screen w-screen flex overflow-hidden ${quicksand.className}`}
      style={{ backgroundColor: theme.primary }}
    >
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">ECE</div>
            <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded text-xs font-medium">DEV CARDS</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#marketplace" className="text-white/80 hover:text-white transition-colors">Marketplace</a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
            <a href="#portfolio" className="text-white/80 hover:text-white transition-colors">Portfolio</a>
            <button 
              onClick={() => window.location.href = '/admin-super'}
              className="text-white/60 hover:text-white/80 transition-colors text-sm"
            >
              Admin
            </button>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-white/80 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={handleStartDemo}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white font-medium hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-teal-500/25"
            >
              {isLoading ? 'Loading...' : 'Get Started'}
            </button>
          </div>
        </nav>

        {/* Hero Section with Trading Card Interface */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Hero Content */}
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
                  <span>Swipe Right to Skip</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💎</span>
                  <span>Trade on Marketplace</span>
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
                        <div className="text-2xl font-bold text-teal-400">{currentCard.pricing}</div>
                        <div className="text-xs" style={{ color: theme.text }}>{currentCard.timeline}</div>
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

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{currentCard.orders}</div>
                        <div className="text-xs" style={{ color: theme.text }}>Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{currentCard.satisfaction}</div>
                        <div className="text-xs" style={{ color: theme.text }}>Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-teal-400">#{currentCard.id}</div>
                        <div className="text-xs" style={{ color: theme.text }}>Card ID</div>
                      </div>
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

      {/* Authentication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign In</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleAuth('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <span>🔗</span>
                Continue with Google
              </button>
              
              <button
                onClick={() => handleAuth('phantom')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <span>👻</span>
                Connect Phantom Wallet
              </button>
              
              <button
                onClick={() => handleAuth('solflare')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <span>🔥</span>
                Connect Solflare Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
