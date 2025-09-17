'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  MessageSquare, 
  Users, 
  Wallet,
  TrendingUp,
  Heart
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { GlassCard } from '../components/ui/glass-card'
import { LandingPage } from '@ece-platform/shared-ui'

const homeTabs = [
  { 
    id: 'orders', 
    name: 'Quick Order', 
    icon: ShoppingCart,
    description: 'Fast buy/sell orders'
  },
  { 
    id: 'social', 
    name: 'Social Feed', 
    icon: Users,
    description: 'Community activity'
  },
  { 
    id: 'chat', 
    name: 'Chat', 
    icon: MessageSquare,
    description: 'Trade negotiations'
  },
  { 
    id: 'wallet', 
    name: 'Wallet', 
    icon: Wallet,
    description: 'ECE balance & transactions'
  }
]

export default function WebLandingPage() {
  const handleEnterPlatform = () => {
    window.location.href = '/app';
  };

  const handleViewPricing = () => {
    window.location.href = '/pricing';
  };

  return (
    <div className="min-h-[100svh]">
      <LandingPage 
        platform="web"
        onEnterPlatform={handleEnterPlatform}
        onViewPricing={handleViewPricing}
      />
    </div>
  );
}

const mockSocialPosts = [
  {
    id: 1,
    user: 'CardMaster99',
    avatar: '/api/placeholder/40/40',
    action: 'purchased',
    card: 'Tesla Model S Plaid',
    value: '1,250 ECE',
    time: '2m ago',
    likes: 12
  },
  {
    id: 2,
    user: 'TechCollector',
    avatar: '/api/placeholder/40/40',
    action: 'won battle',
    card: 'iPhone 15 Pro vs Samsung S24',
    value: '+500 ECE',
    time: '5m ago',
    likes: 28
  },
  {
    id: 3,
    user: 'CryptoTrader',
    avatar: '/api/placeholder/40/40',
    action: 'achieved milestone',
    card: '100 Legendary Cards',
    value: 'Diamond Badge',
    time: '8m ago',
    likes: 45
  }
]

const mockQuickOrders = [
  {
    id: 1,
    type: 'buy',
    card: 'Tesla Model S Plaid',
    price: '1,250 ECE',
    quantity: 1,
    status: 'pending'
  },
  {
    id: 2,
    type: 'sell',
    card: 'iPhone 15 Pro Max',
    price: '1,100 ECE',
    quantity: 2,
    status: 'active'
  }
]

export function AppHomePageOld() {
  const [activeTab, setActiveTab] = useState('orders')
  const [quickOrderType, setQuickOrderType] = useState('buy')
  const [orderAmount, setOrderAmount] = useState('')
  const [selectedCard, setSelectedCard] = useState('')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-6 hide-scrollbar">
            {/* Quick Order Form */}
            <GlassCard>
              <div className="p-6 hide-scrollbar">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Order</h3>
                
                {/* Buy/Sell Toggle */}
                <div className="flex bg-white/10 rounded-lg p-1 mb-4">
                  <button
                    onClick={() => setQuickOrderType('buy')}
                    className={`flex-1 py-2 px-4 rounded-md transition-all ${
                      quickOrderType === 'buy' 
                        ? 'bg-ocean-success text-white' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setQuickOrderType('sell')}
                    className={`flex-1 py-2 px-4 rounded-md transition-all ${
                      quickOrderType === 'sell' 
                        ? 'bg-monokai-accent text-white' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Order Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Card Name
                    </label>
                    <input
                      type="text"
                      value={selectedCard}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      placeholder="Search for a card..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Amount (ECE)
                    </label>
                    <input
                      type="number"
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-primary"
                    />
                  </div>

                  <Button 
                    variant={quickOrderType === 'buy' ? 'default' : 'gradient'} 
                    className="w-full"
                  >
                    Place {quickOrderType === 'buy' ? 'Buy' : 'Sell'} Order
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Active Orders */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Active Orders</h3>
                <div className="space-y-3">
                  {mockQuickOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.type === 'buy' ? 'bg-ocean-success/20 text-ocean-success' : 'bg-monokai-accent/20 text-monokai-accent'
                          }`}>
                            {order.type.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-foreground">{order.card}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {order.quantity}x @ {order.price}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          order.status === 'active' ? 'text-ocean-success' : 'text-monokai-warning'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-4">
            {mockSocialPosts.map((post) => (
              <GlassCard key={post.id}>
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-ocean rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-foreground">{post.user}</span>
                        <span className="text-muted-foreground">{post.action}</span>
                        <span className="text-ocean-primary font-medium">{post.card}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{post.time}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-ocean-success font-medium">{post.value}</span>
                          <button className="flex items-center space-x-1 text-muted-foreground hover:text-monokai-accent">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )

      case 'chat':
        return (
          <div className="space-y-4">
            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Chats</h3>
                <div className="space-y-3">
                  {[
                    { name: 'TradeMaster', lastMessage: 'Interested in your Tesla card', time: '2m', unread: 2 },
                    { name: 'CardCollector99', lastMessage: 'Battle accepted!', time: '5m', unread: 0 },
                    { name: 'TechEnthusiast', lastMessage: 'Thanks for the trade!', time: '1h', unread: 0 }
                  ].map((chat, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                      <div className="w-10 h-10 bg-gradient-tide rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{chat.name}</span>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground truncate">{chat.lastMessage}</span>
                          {chat.unread > 0 && (
                            <span className="bg-monokai-accent text-white text-xs rounded-full px-2 py-1 ml-2">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )

      case 'wallet':
        return (
          <div className="space-y-6">
            {/* Balance Card */}
            <GlassCard>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-foreground mb-2">1,250.50 ECE</div>
                  <div className="text-muted-foreground">Available Balance</div>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-ocean-success" />
                    <span className="text-ocean-success text-sm">+2.4% (24h)</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="default" className="flex-1">
                    Deposit
                  </Button>
                  <Button variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground">
                    Withdraw
                  </Button>
                  <Button variant="gradient" className="flex-1">
                    Trade
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Recent Transactions */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {[
                    { type: 'purchase', card: 'iPhone 15 Pro', amount: '-1,100 ECE', time: '2h ago' },
                    { type: 'sale', card: 'Tesla Model S', amount: '+1,250 ECE', time: '1d ago' },
                    { type: 'bet_win', card: 'Battle Royale', amount: '+500 ECE', time: '2d ago' }
                  ].map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'purchase' ? 'bg-monokai-accent/20' :
                          tx.type === 'sale' ? 'bg-ocean-success/20' : 'bg-monokai-success/20'
                        }`}>
                          {tx.type === 'purchase' ? <ShoppingCart className="w-4 h-4" /> :
                           tx.type === 'sale' ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{tx.card}</div>
                          <div className="text-xs text-muted-foreground">{tx.time}</div>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        tx.amount.startsWith('+') ? 'text-ocean-success' : 'text-monokai-accent'
                      }`}>
                        {tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Manage your trading activity from one place</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            {homeTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-ocean text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
