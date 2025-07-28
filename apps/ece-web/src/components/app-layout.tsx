'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Compass, 
  Store, 
  User, 
  Search,
  Bell,
  MessageCircle,
  Wallet,
  Plus,
  ShoppingCart,
  TrendingUp
} from 'lucide-react'
import { GlassCard } from './ui/glass-card'
import { Button } from './ui/button'
import { SubscriptionProvider, useSubscription } from '../contexts/subscription-context'
import { SubscriptionBadge, ProEnhancedCard } from './subscription-ui'
import { NotificationsPopout } from './notifications-popout'
import { WalletPopout } from './wallet-popout'
import { ToastProvider, addToast } from './toast-provider'

const navItems = [
  { name: 'Home', href: '/app', icon: Home, description: 'Quick Order, Social Feed, Chat, Wallet' },
  { name: 'Discover', href: '/app/discover', icon: Compass, description: 'Swipe cards, Boosts, Super Likes, Watchlist' },
  { name: 'Marketplace', href: '/app/marketplace', icon: Store, description: 'Bidding, Betting, Battling' },
  { name: 'Profile', href: '/app/profile', icon: User, description: 'Tiered cards, 3D viewer, Settings' }
]

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayoutInner({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showWallet, setShowWallet] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [walletBalance, setWalletBalance] = useState('1,250.50')
  const { subscription, isPro, isEnterprise } = useSubscription()
  const notificationRef = useRef<HTMLDivElement>(null)
  const walletRef = useRef<HTMLDivElement>(null)

  // Click outside to close popouts
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (walletRef.current && !walletRef.current.contains(event.target as Node)) {
        setShowWallet(false)
      }
    }

    if (showNotifications || showWallet) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications, showWallet])

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications?userId=user_pro_001')
        if (response.ok) {
          const data = await response.json()
          const notifications = data.notifications || data
          const unread = notifications.filter((n: any) => !n.read).length
          const previousUnread = unreadCount
          setUnreadCount(unread)
          
          // Show toast for new notifications
          if (unread > previousUnread && previousUnread > 0) {
            addToast({
              type: 'info',
              title: 'New Notifications',
              message: `You have ${unread - previousUnread} new notification${unread - previousUnread > 1 ? 's' : ''}`,
              duration: 4000
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }

    fetchUnreadCount()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [unreadCount])

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch('/api/wallet?userId=user_pro_001')
        if (response.ok) {
          const data = await response.json()
          const wallet = data.data || data
          setWalletBalance(wallet.balance.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }))
        }
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error)
      }
    }

    fetchWalletBalance()
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 p-2 md:p-4"
      >
        <ProEnhancedCard 
          isPro={isPro} 
          isEnterprise={isEnterprise}
          className="rounded-lg"
        >
          <GlassCard variant="dark" className="px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-6 h-6 md:w-8 md:h-8 bg-gradient-ocean rounded-lg"
              />
              <span className="text-lg md:text-xl font-bold text-foreground hidden sm:block">ECE Cards</span>
              <span className="text-lg md:text-xl font-bold text-foreground sm:hidden">ECE</span>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ocean-primary dark:text-ocean-light" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards, users, or collections..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-primary focus:border-transparent backdrop-blur-sm"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2 md:space-x-4 relative">
              {/* Mobile Search Button */}
              <div className="md:hidden">
                <Button variant="ghost" className="p-2">
                  <Search className="w-5 h-5" />
                </Button>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <Button 
                  variant="ghost" 
                  
                  className="p-2 relative"
                  onClick={() => {
                    setShowNotifications(!showNotifications)
                    setShowWallet(false) // Close wallet if open
                  }}
                >
                  <Bell className="w-4 h-4 md:w-5 md:h-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-[#F92672] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                  )}
                </Button>
                <NotificationsPopout 
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  onNotificationUpdate={() => {
                    // Refresh unread count when notifications are updated
                    fetch('/api/notifications?userId=user_pro_001')
                      .then(res => res.json())
                      .then(data => {
                        const notifications = data.notifications || data
                        const unread = notifications.filter((n: any) => !n.read).length
                        setUnreadCount(unread)
                      })
                      .catch(console.error)
                  }}
                />
              </div>

              {/* Messages */}
              <Button variant="ghost" className="p-2 hidden sm:flex">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              </Button>

              {/* Wallet */}
              <div className="relative" ref={walletRef}>
                <Button 
                  variant="ghost" 
                  
                  className="p-2"
                  onClick={() => {
                    setShowWallet(!showWallet)
                    setShowNotifications(false) // Close notifications if open
                  }}
                >
                  <Wallet className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="ml-2 text-sm font-medium hidden lg:inline">
                    {walletBalance} ECE
                  </span>
                </Button>
                <WalletPopout 
                  isOpen={showWallet}
                  onClose={() => setShowWallet(false)}
                  onBalanceUpdate={(newBalance) => {
                    setWalletBalance(newBalance.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    }))
                  }}
                />
              </div>

              {subscription && (
                <SubscriptionBadge 
                  plan={subscription.plan} 
                  className="hidden sm:inline-flex" 
                />
              )}
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-tide rounded-full" />
            </div>
          </div>
        </GlassCard>
        </ProEnhancedCard>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20 md:pt-24 pb-20 md:pb-24">
        {children}
      </div>

      {/* Bottom Navigation - Tinder Style */}
      <motion.nav
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-2 md:p-4"
      >
        <ProEnhancedCard 
          isPro={isPro} 
          isEnterprise={isEnterprise}
          className="rounded-lg"
        >
          <GlassCard variant="dark" className="px-2 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center space-y-1 relative min-w-0 flex-1 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 md:p-3 rounded-2xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-ocean text-white shadow-lg shadow-ocean-primary/30' 
                        : 'text-muted-foreground hover:text-ocean-primary hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.div>
                  <span className={`text-xs font-medium truncate ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {item.name}
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.description}
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-ocean-accent rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </GlassCard>
        </ProEnhancedCard>
      </motion.nav>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-40"
      >
        <Button variant="gradient" size="lg" className="rounded-full w-12 h-12 md:w-14 md:h-14 p-0 shadow-2xl">
          <Plus className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
      </motion.div>
    </div>
    </ToastProvider>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SubscriptionProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </SubscriptionProvider>
  )
}
