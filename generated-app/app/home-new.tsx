'use client';

import { useState, useRef, useEffect } from 'react';
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

// Simple UI Components
const Card = ({ children, className = "", style = {}, ...props }: any) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`} style={style} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className = "", ...props }: any) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
)

const Button = ({ children, className = "", size = "default", variant = "default", onClick, disabled, ...props }: any) => {
  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }
  
  const variantClasses: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
  }
  
  return (
    <button
      className={`rounded-lg font-medium transition-colors ${sizeClasses[size] || sizeClasses.default} ${variantClasses[variant] || variantClasses.default} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Badge = ({ children, className = "", variant = "default", ...props }: any) => {
  const variantClasses: Record<string, string> = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variantClasses[variant] || variantClasses.default} ${className}`} {...props}>
      {children}
    </span>
  )
}

// Simple Icons
const Zap = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const Code = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const Star = ({ className = "" }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const Clock = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Heart = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const DollarSign = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const ChevronRight = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const ShoppingCart = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293a1 1 0 00.293 1.414L6.414 18M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
  </svg>
)

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
  status: "Available" | "Building" | "Completed" | "Live";
  orders: number;
  satisfaction: number;
  type: "for-sale" | "custom-order" | "marketplace";
  marketCap?: number;
  monthlyRevenue?: number;
  rating?: number;
}

const appCards: AppCard[] = [
  {
    id: 1,
    name: "EcoTracker Pro",
    description: "AI-powered sustainability tracking app with carbon footprint analytics. Built with Next.js and ML models. Ready to launch and generating revenue.",
    category: "Sustainability Tech",
    pricing: "$45,000",
    timeline: "Available Now",
    image: "/ai-study-app-interface.png",
    features: ["AI Analytics", "Real-time Tracking", "Social Features", "Payment Integration", "Dashboard"],
    complexity: "Complex",
    status: "Live",
    orders: 1,
    satisfaction: 4.8,
    type: "for-sale",
    marketCap: 180000,
    monthlyRevenue: 12000,
    rating: 4.8
  },
  {
    id: 2,
    name: "Custom E-Commerce Platform",
    description: "Get your dream e-commerce platform built from scratch. Full-stack development with modern payment systems, inventory management, and admin dashboard.",
    category: "E-Commerce",
    pricing: "From $1,299",
    timeline: "7-14 days",
    image: "/restaurant-discovery-app.png",
    features: ["Custom Design", "Stripe Integration", "Admin Dashboard", "Inventory System", "Mobile Responsive"],
    complexity: "Complex",
    status: "Available",
    orders: 47,
    satisfaction: 4.9,
    type: "custom-order"
  },
  {
    id: 3,
    name: "FinanceFlow",
    description: "Modern personal finance management platform with crypto integration. React Native app with proven revenue model and growing user base.",
    category: "FinTech",
    pricing: "$85,000",
    timeline: "Available Now",
    image: "/cryptocurrency-trading-app.png",
    features: ["Crypto Integration", "Multi-bank Sync", "Investment Tracking", "AI Insights", "Mobile App"],
    complexity: "Complex",
    status: "Live",
    orders: 1,
    satisfaction: 4.6,
    type: "for-sale",
    marketCap: 450000,
    monthlyRevenue: 28000,
    rating: 4.6
  },
  {
    id: 4,
    name: "Custom SaaS Platform",
    description: "Build your SaaS application with user management, subscription billing, analytics, and more. Modern tech stack with scalable architecture.",
    category: "SaaS",
    pricing: "From $899",
    timeline: "5-10 days",
    image: "/meditation-app-interface.png",
    features: ["User Authentication", "Subscription Billing", "Analytics", "API Integration", "Admin Panel"],
    complexity: "Medium",
    status: "Available",
    orders: 32,
    satisfaction: 4.7,
    type: "custom-order"
  },
  {
    id: 5,
    name: "PetCare Connect",
    description: "Veterinary appointment and pet health tracking app. Profitable SaaS with recurring revenue, established user base, and growth potential.",
    category: "Pet Care",
    pricing: "$32,000",
    timeline: "Available Now",
    image: "/pet-care-app-interface.png",
    features: ["Appointment Booking", "Health Records", "Reminders", "Vet Network", "Mobile App"],
    complexity: "Medium",
    status: "Live",
    orders: 1,
    satisfaction: 4.5,
    type: "for-sale",
    marketCap: 95000,
    monthlyRevenue: 8500,
    rating: 4.5
  },
  {
    id: 6,
    name: "Custom Mobile App",
    description: "Native iOS and Android app development. From concept to App Store. Perfect for startups and businesses wanting mobile presence.",
    category: "Mobile Development",
    pricing: "From $1,999",
    timeline: "2-3 weeks",
    image: "/placeholder.svg?height=300&width=400&text=Mobile+App",
    features: ["Native Development", "App Store Deployment", "Push Notifications", "User Analytics", "Backend API"],
    complexity: "Complex",
    status: "Available",
    orders: 23,
    satisfaction: 4.8,
    type: "custom-order"
  }
];

export default function ECETradingPlatform() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentView, setCurrentView] = useState<"landing" | "swipe" | "marketplace">("landing");
  const [cart, setCart] = useState<AppCard[]>([]);
  const [wishlist, setWishlist] = useState<AppCard[]>([]);

  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const currentCard = appCards[currentIndex % appCards.length];

  const handleSwipe = (direction: string) => {
    if (direction === "right") {
      // Add to wishlist (like)
      if (!wishlist.find(item => item.id === currentCard.id)) {
        setWishlist(prev => [...prev, currentCard]);
      }
    } else if (direction === "up") {
      // Add to cart (invest/buy)
      if (!cart.find(item => item.id === currentCard.id)) {
        setCart(prev => [...prev, currentCard]);
      }
    }

    // Move to next card
    setCurrentIndex((prev) => (prev + 1) % appCards.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    currentPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    currentPos.current = { x: touch.clientX, y: touch.clientY };

    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;
    const threshold = 80;

    if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < 0) {
        handleSwipe("up");
      }
    } else if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleSwipe("right");
      } else {
        handleSwipe("left");
      }
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Complex": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-blue-500";
      case "Building": return "bg-orange-500";
      case "Live": return "bg-green-500";
      case "Completed": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const renderLandingPage = () => (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 ${quicksand.variable} font-sans`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-white">ECE Trading</div>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">BETA</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => setCurrentView("marketplace")} className="text-white/80 hover:text-white transition-colors">Marketplace</button>
          <button onClick={() => window.location.href = '/order'} className="text-white/80 hover:text-white transition-colors">Order App</button>
          <button onClick={() => window.location.href = '/dashboard'} className="text-white/80 hover:text-white transition-colors">Portfolio</button>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setCurrentView("swipe")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
          >
            Start Trading
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Trade App
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Trading Cards
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover, invest, and trade custom-built applications like trading cards. 
            Swipe through professionally developed apps, buy successful businesses, 
            and order your custom application trading card.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => setCurrentView("swipe")}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg px-8 py-4 hover:from-purple-600 hover:to-blue-600 shadow-2xl shadow-purple-500/25"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Discovery
            </Button>
            <Button
              onClick={() => window.location.href = '/order'}
              size="lg"
              variant="outline"
              className="border-2 border-white/20 text-white text-lg px-8 py-4 hover:bg-white/10 backdrop-blur-sm"
            >
              <Code className="mr-2 h-5 w-5" />
              Order Custom App
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                🚀
              </div>
              <h3 className="text-white font-semibold mb-2">Discover Apps</h3>
              <p className="text-white/70 text-sm">Swipe through premium applications</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                💰
              </div>
              <h3 className="text-white font-semibold mb-2">Buy & Sell</h3>
              <p className="text-white/70 text-sm">Trade profitable app businesses</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                🎯
              </div>
              <h3 className="text-white font-semibold mb-2">Custom Orders</h3>
              <p className="text-white/70 text-sm">Get your app built by experts</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                📈
              </div>
              <h3 className="text-white font-semibold mb-2">Track Portfolio</h3>
              <p className="text-white/70 text-sm">Monitor your investments</p>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-white/60">Apps Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">$2.5M</div>
              <div className="text-white/60">Total Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-white/60">Active Traders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-white/60">Fast Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/20 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who are building their digital portfolios with premium applications. 
              Start discovering, investing, and creating today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setCurrentView("swipe")}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg px-8 py-4 hover:from-purple-600 hover:to-blue-600"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Trading Now
              </Button>
              <Button
                onClick={() => window.location.href = '/order'}
                size="lg"
                variant="outline"
                className="border-2 border-white/20 text-white text-lg px-8 py-4 hover:bg-white/10"
              >
                <Code className="mr-2 h-5 w-5" />
                Order Custom App
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderSwipeInterface = () => (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 z-20 relative">
        <button 
          onClick={() => setCurrentView("landing")}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <div className="text-white font-semibold">Discover Apps</div>
        <div className="flex items-center gap-2">
          <div className="text-white text-sm">
            {currentIndex + 1} / {appCards.length}
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="relative w-full max-w-sm h-[600px]">
          {/* Current Card */}
          <Card
            className="absolute inset-0 w-full h-full cursor-pointer shadow-2xl border-0 bg-white"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg)`,
              transition: isDragging ? "none" : "all 0.3s ease-out",
              zIndex: 10
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Swipe Direction Indicators */}
            {isDragging && (
              <>
                <div
                  className={`absolute top-1/2 left-4 transform -translate-y-1/2 transition-all duration-150 z-20 ${
                    dragOffset.x < -40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                  }`}
                >
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-bold text-sm border-2 border-white shadow-xl">
                    PASS
                  </div>
                </div>
                <div
                  className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-150 z-20 ${
                    dragOffset.y < -40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                  }`}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-bold text-sm border-2 border-white shadow-xl">
                    BUY
                  </div>
                </div>
                <div
                  className={`absolute top-1/2 right-4 transform -translate-y-1/2 transition-all duration-150 z-20 ${
                    dragOffset.x > 40 ? "opacity-100 scale-110" : "opacity-20 scale-85"
                  }`}
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full font-bold text-sm border-2 border-white shadow-xl">
                    LIKE
                  </div>
                </div>
              </>
            )}

            <div className="relative h-full flex flex-col">
              {/* App Image */}
              <div className="h-2/3 relative overflow-hidden rounded-t-lg">
                <img
                  src={currentCard.image || "/placeholder.svg"}
                  alt={currentCard.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Badge className={`${getStatusColor(currentCard.status)} text-white border-0`}>
                    {currentCard.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Badge className={`${getComplexityColor(currentCard.complexity)} text-white border-0 text-xs`}>
                      {currentCard.complexity}
                    </Badge>
                    {currentCard.rating && (
                      <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {currentCard.rating}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom overlay info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{currentCard.name}</h3>
                  <p className="text-sm text-white/80 mb-2">{currentCard.category}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {currentCard.timeline}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {currentCard.pricing}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="h-1/3 p-4 bg-white flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {currentCard.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {currentCard.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">{currentCard.orders} orders</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-600">{currentCard.satisfaction}</span>
                  </div>
                  {currentCard.monthlyRevenue && (
                    <div className="text-green-600 font-semibold">
                      {formatCurrency(currentCard.monthlyRevenue)}/mo
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Next Card Preview */}
          {appCards[(currentIndex + 1) % appCards.length] && (
            <Card className="absolute inset-0 w-full h-full shadow-xl border-0 -z-10 scale-95 opacity-50 bg-white">
              <div className="h-2/3 relative overflow-hidden rounded-t-lg">
                <img
                  src={appCards[(currentIndex + 1) % appCards.length].image || "/placeholder.svg"}
                  alt={appCards[(currentIndex + 1) % appCards.length].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="h-1/3 p-4 bg-white">
                <h3 className="font-bold">
                  {appCards[(currentIndex + 1) % appCards.length].name}
                </h3>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 p-6 bg-white/5 backdrop-blur-sm">
        <button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg hover:scale-110 transition-all text-white"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe("up")}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg hover:scale-110 transition-all text-white"
        >
          <ShoppingCart className="h-7 w-7" />
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg hover:scale-110 transition-all text-white"
        >
          <Heart className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Info */}
      <div className="text-center text-white/60 text-sm p-4">
        <p>❌ Pass • ⬆️ Buy/Invest • ❤️ Save to Wishlist</p>
        <p className="mt-1">Cart: {cart.length} • Wishlist: {wishlist.length}</p>
      </div>
    </div>
  );

  // Switch between views
  switch (currentView) {
    case "swipe":
      return renderSwipeInterface();
    case "marketplace":
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Marketplace</h2>
              <p className="text-white/80 text-center mb-8">
                Browse and trade app ownership, discover investment opportunities, 
                and build your digital portfolio in the app economy.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                onClick={() => setCurrentView("swipe")}
              >
                Browse Apps
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    default:
      return renderLandingPage();
  }
}
