'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ShoppingCart, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Discover', href: '/discover' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Community', href: '/community' },
];

export function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? 'bg-ece-dark/95 backdrop-blur-md border-b border-ece-muted/20 shadow-lg' 
        : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-sunset rounded-lg flex items-center justify-center text-ece-light font-bold text-xl transition-transform group-hover:scale-105">
              E
            </div>
            <span className="text-ece-light font-bold text-xl hidden sm:block">
              ECE Trading Cards
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-ece-accent",
                  pathname === item.href 
                    ? 'text-ece-accent' 
                    : 'text-ece-muted hover:text-ece-light'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-ece-muted hover:text-ece-light transition-colors p-2 rounded-lg hover:bg-ece-muted/10">
              <Search className="w-5 h-5" />
            </button>
            
            <button className="text-ece-muted hover:text-ece-light transition-colors p-2 rounded-lg hover:bg-ece-muted/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-ece-accent rounded-full"></span>
            </button>
            
            <button className="text-ece-muted hover:text-ece-light transition-colors p-2 rounded-lg hover:bg-ece-muted/10">
              <ShoppingCart className="w-5 h-5" />
            </button>
            
            <button className="text-ece-muted hover:text-ece-light transition-colors p-2 rounded-lg hover:bg-ece-muted/10">
              <User className="w-5 h-5" />
            </button>
            
            <Link
              href="/auth/signup"
              className="bg-ece-accent text-ece-light px-6 py-2 rounded-lg font-medium hover:bg-ece-error transition-colors"
            >
              Get Started
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-ece-light p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-ece-dark/95 backdrop-blur-md border-t border-ece-muted/20">
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block text-lg font-medium transition-colors py-2",
                    pathname === item.href 
                      ? 'text-ece-accent' 
                      : 'text-ece-light hover:text-ece-accent'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-ece-muted/30 space-y-3">
                <Link
                  href="/auth/signup"
                  className="block w-full bg-ece-accent text-ece-light py-3 rounded-lg font-medium text-center hover:bg-ece-error transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/signin"
                  className="block w-full border border-ece-info text-ece-info py-3 rounded-lg font-medium text-center hover:bg-ece-info hover:text-ece-dark transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
