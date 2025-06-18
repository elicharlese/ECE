'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/src/lib/theme-context';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { 
  Zap, 
  Store, 
  TrendingUp, 
  Sparkles,
  ShoppingCart,
  BarChart3,
  Home,
  X,
  Building2,
  Users
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin check - in production, this would be proper authentication
    if (credentials.email === 'admin@ece-cli.com' && credentials.password === 'admin') {
      router.push('/admin-super');
    } else {
      alert('Invalid credentials. Use admin@ece-cli.com / admin for admin access.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-background via-theme-background to-theme-secondary">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-theme-accent rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-theme-text-primary">ECE Trading</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors"
          >
            Admin
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-theme-text-primary mb-6">
            Trade Digital Apps
            <span className="block text-theme-accent">Like Trading Cards</span>
          </h2>
          <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto mb-8">
            Discover, collect, and trade digital applications in a revolutionary marketplace. 
            Swipe through apps, build your portfolio, and join the future of digital asset trading.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/swipe')}
              className="bg-theme-accent hover:bg-theme-accent/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              Start Discovering Apps
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="border-2 border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-theme-surface rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-theme-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-theme-accent" />
            </div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-3">Swipe to Discover</h3>
            <p className="text-theme-text-secondary">Experience apps like never before with our Tinder-style interface. Swipe right to save, up to order.</p>
          </div>
          
          <div className="bg-theme-surface rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-theme-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-theme-accent" />
            </div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-3">Trading Cards</h3>
            <p className="text-theme-text-secondary">Every app becomes a unique trading card with stats, rarity levels, and market value.</p>
          </div>
          
          <div className="bg-theme-surface rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-theme-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-theme-accent" />
            </div>
            <h3 className="text-xl font-semibold text-theme-text-primary mb-3">Build Portfolio</h3>
            <p className="text-theme-text-secondary">Collect apps, track their performance, and build a valuable digital portfolio.</p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-theme-surface rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-theme-text-primary mb-6 text-center">Explore Platform</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/swipe')}
              className="p-4 bg-theme-background hover:bg-theme-accent hover:text-white rounded-xl transition-colors group"
            >
              <div className="mb-2">
                <Zap className="w-6 h-6 mx-auto" />
              </div>
              <div className="font-semibold">Discover</div>
              <div className="text-sm text-theme-text-secondary group-hover:text-white/80">Swipe through apps</div>
            </button>
            
            <button
              onClick={() => router.push('/marketplace')}
              className="p-4 bg-theme-background hover:bg-theme-accent hover:text-white rounded-xl transition-colors group"
            >
              <div className="mb-2">
                <Store className="w-6 h-6 mx-auto" />
              </div>
              <div className="font-semibold">Marketplace</div>
              <div className="text-sm text-theme-text-secondary group-hover:text-white/80">Browse all apps</div>
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="p-4 bg-theme-background hover:bg-theme-accent hover:text-white rounded-xl transition-colors group"
            >
              <div className="mb-2">
                <BarChart3 className="w-6 h-6 mx-auto" />
              </div>
              <div className="font-semibold">Portfolio</div>
              <div className="text-sm text-theme-text-secondary group-hover:text-white/80">Your collection</div>
            </button>
            
            <button
              onClick={() => router.push('/order')}
              className="p-4 bg-theme-background hover:bg-theme-accent hover:text-white rounded-xl transition-colors group"
            >
              <div className="mb-2">
                <ShoppingCart className="w-6 h-6 mx-auto" />
              </div>
              <div className="font-semibold">Order</div>
              <div className="text-sm text-theme-text-secondary group-hover:text-white/80">Get custom app</div>
            </button>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center p-4 z-50">
          <div className="theme-modal-content rounded-2xl p-8 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-theme-text-primary">Admin Login</h3>
              <button
                onClick={() => setShowLogin(false)}
                className="text-theme-text-secondary hover:text-theme-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-primary mb-2">Email</label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
                  placeholder="admin@ece-cli.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-theme-text-primary mb-2">Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-theme-background border border-theme-border rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent"
                  placeholder="admin"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-theme-accent hover:bg-theme-accent/90 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Login to Admin Panel
              </button>
            </form>
            
            <p className="text-xs text-theme-text-secondary mt-4 text-center">
              Demo credentials: admin@ece-cli.com / admin
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
