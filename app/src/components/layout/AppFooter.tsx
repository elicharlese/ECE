'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  MessageCircle,
  Heart,
  ExternalLink,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Trading', href: '/trading' },
      { label: 'Collections', href: '/collections' },
      { label: 'Tournaments', href: '/tournaments' },
    ]
  },
  {
    title: 'Community',
    links: [
      { label: 'Discord Server', href: 'https://discord.gg/ece-cards', external: true },
      { label: 'Forums', href: '/community/forums' },
      { label: 'Events', href: '/community/events' },
      { label: 'Leaderboards', href: '/community/leaderboards' },
      { label: 'Creator Program', href: '/community/creators' },
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/support' },
      { label: 'Getting Started', href: '/support/getting-started' },
      { label: 'Trading Guide', href: '/support/trading' },
      { label: 'Security', href: '/support/security' },
      { label: 'Contact Us', href: '/support/contact' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Blog', href: '/blog' },
      { label: 'Partnerships', href: '/partnerships' },
    ]
  }
];

const socialLinks = [
  { 
    icon: Twitter, 
    label: 'Twitter', 
    href: 'https://twitter.com/ece_cards',
    color: 'hover:text-blue-400'
  },
  { 
    icon: Instagram, 
    label: 'Instagram', 
    href: 'https://instagram.com/ece_cards',
    color: 'hover:text-pink-400'
  },
  { 
    icon: Youtube, 
    label: 'YouTube', 
    href: 'https://youtube.com/@ece_cards',
    color: 'hover:text-red-400'
  },
  { 
    icon: MessageCircle, 
    label: 'Discord', 
    href: 'https://discord.gg/ece-cards',
    color: 'hover:text-indigo-400'
  },
];

export function AppFooter() {
  return (
    <footer className="bg-ece-dark border-t border-ece-muted/20">
      {/* Newsletter Section */}
      <div className="border-b border-ece-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-ece-light mb-4">
              Stay in the Loop
            </h3>
            <p className="text-ece-muted mb-8 max-w-2xl mx-auto">
              Get the latest updates on new card releases, tournaments, and exclusive trading opportunities delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-ece-muted/10 border border-ece-muted/30 rounded-lg text-ece-light placeholder-ece-muted focus:outline-none focus:border-ece-accent focus:ring-1 focus:ring-ece-accent"
              />
              <button className="bg-ece-accent text-ece-light px-6 py-3 rounded-lg font-medium hover:bg-ece-error transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            
            <p className="text-xs text-ece-muted mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from ECE Trading Cards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-sunset rounded-lg flex items-center justify-center text-ece-light font-bold text-xl">
                E
              </div>
              <span className="text-ece-light font-bold text-xl">
                ECE Trading Cards
              </span>
            </Link>
            
            <p className="text-ece-muted mb-6 max-w-sm">
              The future of digital trading cards. Collect, trade, and battle with immersive 3D cards powered by cutting-edge technology.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-ece-muted transition-colors p-2 rounded-lg hover:bg-ece-muted/10 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-ece-light font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ece-muted hover:text-ece-light transition-colors text-sm flex items-center"
                      {...(link.external && { 
                        target: '_blank', 
                        rel: 'noopener noreferrer' 
                      })}
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 ml-1" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-ece-muted/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-ece-muted">
              <p>© 2025 ECE Trading Cards. All rights reserved.</p>
              
              <div className="flex items-center gap-4">
                <Link href="/legal/privacy" className="hover:text-ece-light transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/legal/terms" className="hover:text-ece-light transition-colors">
                  Terms of Service
                </Link>
                <Link href="/legal/cookies" className="hover:text-ece-light transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-ece-muted">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-ece-accent fill-current" />
              <span>for collectors worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
