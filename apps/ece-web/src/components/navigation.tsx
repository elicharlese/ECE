'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Plus, LogIn, User } from 'lucide-react'
import { Button } from './ui/button'
import { GlassCard } from './ui/glass-card'
import { ThemeToggle } from './theme-toggle'
import { WalletConnectButton, ECEPurchaseModal, useECEWallet } from '@ece-platform/shared-ui'

const navigationItems = [
  { name: 'Features', href: '/features' },
  { name: 'Token', href: '/token' },
  { name: 'Cards', href: '/cards' },
  { name: 'Trading Cards', href: '/trading-cards' },
  { name: 'Overview', href: '/marketplace-overview' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Staking', href: '/staking' },
  { name: 'Governance', href: '/governance' },
  { name: 'Orders', href: '/orders' },
  { name: 'Admin', href: '/admin/orders' },
  { name: 'MP Admin', href: '/admin/marketplace' },
  { name: 'Test MP', href: '/test/marketplace' },
  { name: 'Pricing', href: '/pricing' }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const { isConnected, eceBalance } = useECEWallet()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <GlassCard variant="sidebar" className="backdrop-blur-xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-sunset rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-sunset bg-clip-text text-transparent">
                ECE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-monokai-accent transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-sunset group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Wallet & ECE Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              {isConnected && (
                <Button
                  variant="ghost"
                  onClick={() => setShowPurchaseModal(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Buy ECE
                </Button>
              )}
              
              <WalletConnectButton showBalance={true} />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-ocean-primary dark:text-ocean-light hover:text-ocean-accent transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </GlassCard>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2"
            >
              <GlassCard variant="dark">
                <div className="px-6 py-4 space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-foreground hover:text-ocean-success transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <ThemeToggle />
                    
                    {isConnected && (
                      <Button
                        variant="ghost"
                        onClick={() => setShowPurchaseModal(true)}
                        className="w-full justify-start gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Buy ECE
                      </Button>
                    )}
                    
                    <div className="w-full">
                      <WalletConnectButton showBalance={true} className="w-full" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* ECE Purchase Modal */}
      <ECEPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onSuccess={(amount, newBalance) => {
          console.log(`Successfully purchased ${amount} ECE. New balance: ${newBalance}`);
          setShowPurchaseModal(false);
        }}
      />
    </motion.nav>
  )
}
