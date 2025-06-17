'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../src/lib/theme-context';
import { ThemeToggle } from '../src/components/theme-toggle';

export default function Home() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<"landing" | "trading">("landing");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Trading card style apps data
  const appCards = [
    {
      id: 1,
      name: "EcoTracker Pro",
      description: "AI-powered sustainability tracking app generating $12K/month",
      category: "GreenTech",
      price: "$45,000",
      image: "/ai-study-app-interface.png",
      type: "for-sale",
      revenue: "$12K/mo",
      users: "25K+",
      status: "Live & Profitable",
      orders: 83,
      satisfaction: 4.8,
      timeline: "7-14 days",
      features: "Stripe, Admin, Mobile",
      complexity: "Medium"
    },
    {
      id: 2,
      name: "Custom E-Commerce",
      description: "Get your dream online store built with modern tech stack",
      category: "E-Commerce",
      price: "From $1,299",
      image: "/restaurant-discovery-app.png", 
      type: "custom-order",
      timeline: "7-14 days",
      features: "Stripe, Admin, Mobile",
      complexity: "Medium",
      status: "Available",
      orders: 83,
      satisfaction: 4.8
    },
    {
      id: 3,
      name: "FinanceFlow",
      description: "Personal finance app with crypto integration - $28K/month revenue",
      category: "FinTech",
      price: "$85,000",
      image: "/cryptocurrency-trading-app.png",
      type: "for-sale",
      revenue: "$28K/mo",
      users: "67K+",
      status: "Growing Fast",
      orders: 12,
      satisfaction: 4.8,
      timeline: "10-21 days",
      features: "Real-time Data, Portfolio Tracking, Auto Trading, Security Features, Mobile App",
      complexity: "Complex"
    }
  ];

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

  const renderLandingPage = () => (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm bg-card/50 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-foreground">ECE Trading</div>
          <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-medium">BETA</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => setCurrentView("trading")} className="text-muted-foreground hover:text-foreground transition-colors">Marketplace</button>
          <a href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">Trading Cards</a>
          <a href="/order" className="text-muted-foreground hover:text-foreground transition-colors">Order App</a>
          <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Portfolio</a>
          <a href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">Admin</a>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => setCurrentView("trading")}
            className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-all duration-300"
          >
            Start Trading
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-display text-display-large text-foreground mb-6">
            Trade App
            <span className="block bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              Trading Cards
            </span>
          </h1>
          
          <p className="text-subheading text-subheading-large text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover, invest, and trade custom-built applications like trading cards. 
            Swipe through professionally developed apps, buy successful businesses, 
            and order your custom application.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setCurrentView("trading")}
              className="text-body text-body-large font-medium bg-accent text-accent-foreground px-8 py-4 rounded-lg hover:bg-accent/90 shadow-2xl shadow-accent/25 transition-all duration-300"
            >
              ⚡ Start Discovery
            </button>
            <a
              href="/order"
              className="text-body text-body-large font-medium border-2 border-border text-foreground px-8 py-4 rounded-lg hover:bg-secondary/50 backdrop-blur-sm transition-all duration-300"
            >
              💻 Order Custom App
            </a>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="backdrop-blur-sm bg-card/50 border border-border rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                🚀
              </div>
              <h3 className="text-heading text-heading-small text-card-foreground mb-2">Swipe & Discover</h3>
              <p className="text-body text-body-small text-muted-foreground">Browse apps like trading cards</p>
            </div>
            <div className="backdrop-blur-sm bg-card/50 border border-border rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                💰
              </div>
              <h3 className="text-heading text-heading-small text-card-foreground mb-2">Buy & Sell</h3>
              <p className="text-body text-body-small text-muted-foreground">Trade profitable app businesses</p>
            </div>
            <div className="backdrop-blur-sm bg-card/50 border border-border rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                🎯
              </div>
              <h3 className="text-heading text-heading-small text-card-foreground mb-2">Custom Orders</h3>
              <p className="text-body text-body-small text-muted-foreground">Get your app built by experts</p>
            </div>
            <div className="backdrop-blur-sm bg-card/50 border border-border rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                📈
              </div>
              <h3 className="text-heading text-heading-small text-card-foreground mb-2">Build Portfolio</h3>
              <p className="text-body text-body-small text-muted-foreground">Track your digital investments</p>
            </div>
          </div>
        </div>
      </main>

      {/* Featured Apps Preview */}
      <section className="relative z-10 py-20 px-6 border-t border-border bg-secondary/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-heading text-heading-large text-foreground text-center mb-12">Featured App Cards</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {appCards.map((app, index) => (
              <div key={app.id} className="backdrop-blur-sm bg-card/50 border border-border rounded-2xl overflow-hidden hover:bg-card/70 transition-all duration-300 group">
                <div className="relative">
                  <img 
                    src={app.image} 
                    alt={app.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.type === 'for-sale' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {app.type === 'for-sale' ? '💼 For Sale' : '🛠️ Custom Order'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
                    <p className="text-white/80 text-sm">{app.category}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground text-sm mb-4">{app.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-card-foreground">{app.price}</div>
                    {app.revenue && (
                      <div className="text-green-400 text-sm font-medium">{app.revenue}</div>
                    )}
                    {app.timeline && (
                      <div className="text-accent text-sm font-medium">{app.timeline}</div>
                    )}
                  </div>
                  {app.status && (
                    <div className="mt-2 text-xs text-muted-foreground">{app.status}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentView("trading")}
              className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-medium hover:bg-accent/90 transition-all duration-300"
            >
              Browse All Apps
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">150+</div>
              <div className="text-muted-foreground">Apps Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">$2.5M</div>
              <div className="text-muted-foreground">Total Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">5,000+</div>
              <div className="text-muted-foreground">Active Traders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">24h</div>
              <div className="text-muted-foreground">Fast Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <a href="/marketplace" className="block group">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                  🎴
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Trading Card Marketplace</h3>
                <p className="text-white/70 text-center">Browse, buy, and trade app cards. Swipe through applications like Tinder for apps!</p>
              </div>
            </a>
            
            <a href="/order" className="block group">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                  🛠️
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Custom App Development</h3>
                <p className="text-white/70 text-center">Order your custom application and receive it as a unique trading card when completed.</p>
              </div>
            </a>
            
            <a href="/dashboard" className="block group">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                  📈
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Portfolio Dashboard</h3>
                <p className="text-white/70 text-center">Track your app investments, monitor development progress, and manage your card collection.</p>
              </div>
            </a>
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
              Join thousands of entrepreneurs building their digital portfolios. 
              Start discovering, investing, and creating today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentView("trading")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg px-8 py-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                ⚡ Start Trading Now
              </button>
              <a
                href="/order"
                className="border-2 border-white/20 text-white text-lg px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                💻 Order Custom App
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderTradingInterface = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => setCurrentView("landing")}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">App Trading Cards</h1>
          <div className="text-white/60">1 / {appCards.length}</div>
        </div>

        {/* Trading Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            <img 
              src={appCards[0].image} 
              alt={appCards[0].name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-medium">
                💼 For Sale
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white mb-2">{appCards[0].name}</h2>
              <p className="text-white/80">{appCards[0].category}</p>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">{appCards[0].description}</p>
            <div className="flex justify-between items-center mb-6">
              <div className="text-3xl font-bold text-green-600">{appCards[0].price}</div>
              <div className="text-right">
                <div className="text-green-500 font-semibold">{appCards[0].revenue}</div>
                <div className="text-gray-500 text-sm">{appCards[0].users} users</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all">
                ❌ Pass
              </button>
              <button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all">
                ❤️ Save
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all">
                💰 Buy
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-white/60 mt-8">
          <p>Swipe or use buttons: ❌ Pass • ❤️ Save • 💰 Buy/Invest</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <a 
            href="/order"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all"
          >
            <div className="text-2xl mb-2">🛠️</div>
            <h3 className="text-white font-semibold mb-1">Order Custom App</h3>
            <p className="text-white/60 text-sm">Get your trading card built</p>
          </a>
          <a 
            href="/dashboard"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all"
          >
            <div className="text-2xl mb-2">📈</div>
            <h3 className="text-white font-semibold mb-1">View Portfolio</h3>
            <p className="text-white/60 text-sm">Track your investments</p>
          </a>
        </div>
      </div>
    </div>
  );

  // Switch between views
  return currentView === "trading" ? renderTradingInterface() : renderLandingPage();
}
