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

  // Theme colors - Light theme with primary accent
  const theme = {
    primary: "#FAFAFA", // Light background
    secondary: "#f1f5f9", // Light gray card backgrounds
    accent: "#0e5f59", // Primary accent - teal
    text: "#64748b", // Slate gray text
    textPrimary: "#1e293b", // Dark slate primary text
    border: "#e2e8f0", // Light borders
    dark: {
      primary: "#0f172a", // Dark slate background
      secondary: "#1e293b", // Dark card backgrounds
      text: "#94a3b8", // Light slate text
      textPrimary: "#f1f5f9", // Light primary text
      border: "#334155", // Dark borders
    }
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
                  � Order This App
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
                  <span className="text-2xl">�</span>
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
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl">
                  🛒
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                  E-commerce
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">TechStart Marketplace</h3>
              <p className="text-white/70 mb-4">Multi-vendor e-commerce platform with AI recommendations, built in 5 days.</p>
              <div className="text-sm text-white/60 space-y-1">
                <p>• Next.js + Stripe integration</p>
                <p>• 10,000+ products capability</p>
                <p>• Real-time analytics dashboard</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-purple-300 font-semibold">$250K revenue in first 3 months</p>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl">
                  🤖
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                  AI SaaS
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">DataFlow Analytics</h3>
              <p className="text-white/70 mb-4">AI-powered business intelligence platform with custom dashboards, delivered in 1 week.</p>
              <div className="text-sm text-white/60 space-y-1">
                <p>• Python + React integration</p>
                <p>• Machine learning models</p>
                <p>• Real-time data processing</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-purple-300 font-semibold">500+ enterprise clients served</p>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl">
                  📱
                </div>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">
                  Mobile App
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">GrowthLabs Mobile</h3>
              <p className="text-white/70 mb-4">Cross-platform mobile app with offline capabilities, built in 2 weeks.</p>
              <div className="text-sm text-white/60 space-y-1">
                <p>• React Native + Node.js</p>
                <p>• Offline-first architecture</p>
                <p>• Push notifications & analytics</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-purple-300 font-semibold">50K+ downloads in launch month</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => window.location.href = '/order'}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
            >
              Start Your Success Story
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transparent Pricing
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Fixed prices, no hidden fees. Choose the plan that fits your project complexity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`backdrop-blur-sm border rounded-2xl p-8 hover:scale-105 transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-purple-500/20 to-blue-500/20 border-purple-400/50 shadow-2xl shadow-purple-500/25' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                  <p className="text-white/60">Delivery: {plan.timeline}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-white/80">
                      <span className="text-green-400 mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => window.location.href = '/order'}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How ECE-CLI Works
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our streamlined process takes you from idea to deployed application in record time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                  📝
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-purple-900 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Requirements</h3>
              <p className="text-white/70">Tell us about your application needs, features, and business goals through our comprehensive order form.</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                  💳
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-purple-900 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure Payment</h3>
              <p className="text-white/70">Pay securely through Stripe with transparent, fixed pricing. No hidden fees or surprises.</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-green-500 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                  🤖
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-purple-900 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Development</h3>
              <p className="text-white/70">Our AI-powered development teams begin building your application with real-time progress tracking.</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                  🚀
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-purple-900 rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Delivery</h3>
              <p className="text-white/70">Receive your completed application via GitHub, ZIP download, or live deployment with full documentation.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 inline-block">
              <h3 className="text-2xl font-bold text-white mb-4">Average Project Timeline</h3>
              <div className="flex items-center justify-center space-x-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400">24h</div>
                  <p className="text-white/60 text-sm">Simple Apps</p>
                </div>
                <div className="text-white/40">•</div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">3-7d</div>
                  <p className="text-white/60 text-sm">Standard Apps</p>
                </div>
                <div className="text-white/40">•</div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">1-2w</div>
                  <p className="text-white/60 text-sm">Complex Apps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-white/80">
              Join hundreds of satisfied customers who trusted us with their vision.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white/80">
              Everything you need to know about our development process.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">How fast can you really deliver?</h3>
              <p className="text-white/70">Our AI-powered development teams can deliver simple applications in as little as 24 hours, with complex enterprise solutions typically taking 1-2 weeks. We provide realistic timelines during the order process based on your specific requirements.</p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">What if I'm not satisfied with the result?</h3>
              <p className="text-white/70">We offer unlimited revisions until you're completely satisfied. If for any reason we can't meet your requirements, we provide a full refund within 30 days. Your satisfaction is our guarantee.</p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Do I get the source code?</h3>
              <p className="text-white/70">Absolutely! You receive complete ownership of your application, including full source code, documentation, and deployment instructions. We can deliver via GitHub repository, ZIP download, or live deployment.</p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">What technologies do you use?</h3>
              <p className="text-white/70">We use modern, industry-standard technologies including Next.js, React, Node.js, Python, PostgreSQL, MongoDB, AWS, Vercel, and more. Our tech stack is chosen based on your specific needs and scalability requirements.</p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Do you provide ongoing support?</h3>
              <p className="text-white/70">Yes! All plans include initial support (1-6 months depending on plan). We also offer ongoing maintenance packages for bug fixes, updates, and feature additions as your business grows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/20 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Turn Your Idea Into Reality
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join over 1,000 successful entrepreneurs who've launched their applications with ECE-CLI. 
              Professional development, transparent pricing, guaranteed results.
            </p>
            
            {/* Key benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                  ⚡
                </div>
                <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                <p className="text-white/70 text-sm">24h to 2 weeks delivery</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                  🛡️
                </div>
                <h3 className="text-white font-semibold mb-2">Risk-Free</h3>
                <p className="text-white/70 text-sm">30-day money-back guarantee</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                  💎
                </div>
                <h3 className="text-white font-semibold mb-2">Enterprise Quality</h3>
                <p className="text-white/70 text-sm">Production-ready code</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/order'}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                🚀 Start Building Now
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                💬 Schedule a Consultation
              </button>
            </div>
            
            <p className="text-white/60 text-sm mt-6">
              🔒 Secure payment processing • 📞 24/7 support • 🎯 100% satisfaction guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">ECE-CLI</div>
              <p className="text-white/60 mb-4 max-w-sm">
                Professional AI-powered app development on demand. Transform your ideas into production-ready applications with enterprise-grade quality and lightning-fast delivery.
              </p>
              <div className="flex space-x-4 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors cursor-pointer">
                  🐦
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors cursor-pointer">
                  💼
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors cursor-pointer">
                  📧
                </div>
              </div>
              <div className="text-white/60 text-sm">
                � SOC 2 Compliant • 🌍 Global Team • ⚡ 24/7 Support
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="hover:text-white/80 transition-colors cursor-pointer">Web Applications</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Mobile Apps</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">AI Integration</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">E-commerce Platforms</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">API Development</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">MVP Development</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="hover:text-white/80 transition-colors cursor-pointer">About ECE-CLI</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Our Process</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Case Studies</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Press Kit</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="hover:text-white/80 transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">API Reference</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">System Status</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white/80 transition-colors cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-white/60 text-sm mb-4 md:mb-0">
                <p>&copy; 2024 ECE-CLI. All rights reserved. Built with ❤️ using AI-powered development.</p>
              </div>
              <div className="flex items-center space-x-6 text-white/60 text-sm">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>All systems operational</span>
                </span>
                <span>|</span>
                <span>99.9% uptime</span>
                <span>|</span>
                <span>1,000+ apps delivered</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
            <div className="space-y-4">
              <button 
                onClick={() => handleAuth('google')}
                disabled={isLoading}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>🔐</span>
                <span>{isLoading ? 'Loading...' : 'Continue with Google'}</span>
              </button>
              <button 
                onClick={() => handleAuth('phantom')}
                disabled={isLoading}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>👻</span>
                <span>{isLoading ? 'Loading...' : 'Connect Phantom Wallet'}</span>
              </button>
              <button 
                onClick={() => handleAuth('demo')}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>🎮</span>
                <span>{isLoading ? 'Loading...' : 'Try Demo Mode'}</span>
              </button>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="mt-6 text-white/60 hover:text-white w-full text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
