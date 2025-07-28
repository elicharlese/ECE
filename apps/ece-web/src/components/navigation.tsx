'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogIn } from 'lucide-react'
import { Button } from './ui/button'
import { GlassCard } from './ui/glass-card'
import { ThemeToggle } from './theme-toggle'

const navigationItems = [
  { name: 'Features', href: '/features' },
  { name: 'Token', href: '/token' },
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
        <GlassCard 
          variant="dark" 
          className={`transition-all duration-300 ${
            scrolled ? 'shadow-2xl' : 'shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-8 h-8 bg-gradient-ocean rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">ECE Cards</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-ocean-success transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-tide group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/signin">
                <Button variant="ghost">
                  <LogIn className="w-4 h-4 mr-2 text-ocean-primary dark:text-ocean-light" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="gradient">
                  <User className="w-4 h-4 mr-2 text-white" />
                  Sign Up
                </Button>
              </Link>
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
                    <Link href="/signin" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <LogIn className="w-4 h-4 mr-2 text-ocean-primary dark:text-ocean-light" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" className="block">
                      <Button variant="gradient" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2 text-white" />
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
