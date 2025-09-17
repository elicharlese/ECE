import React from 'react';
import { Button } from '../lib/button';
import { GlassCard } from '../lib/glass-card';

interface LandingPageProps {
  onEnterPlatform: () => void;
  onViewPricing: () => void;
  platform?: 'web' | 'desktop' | 'mobile';
}

export function LandingPage({ onEnterPlatform, onViewPricing, platform = 'web' }: LandingPageProps) {
  const containerClass = platform === 'mobile' 
    ? 'flex-1 px-6 py-16 bg-black' 
    : 'min-h-screen bg-gradient-to-b from-background to-secondary/20';

  const titleClass = platform === 'mobile'
    ? 'text-4xl font-extrabold tracking-tight mb-4 text-white text-center'
    : 'text-5xl font-extrabold tracking-tight mb-4';

  const subtitleClass = platform === 'mobile'
    ? 'text-base text-gray-300 mb-8 text-center'
    : 'text-lg text-muted-foreground mb-8';

  return (
    <div className={containerClass}>
      <div className={platform === 'mobile' ? 'flex-1 justify-center' : 'container mx-auto px-6 py-16'}>
        <div className={platform === 'mobile' ? 'flex-1 justify-center items-center' : 'text-center max-w-3xl mx-auto'}>
          <h1 className={titleClass}>ECE Trading Cards</h1>
          <p className={subtitleClass}>
            Trade, battle, and build portfolios of technology product cards. Powered by ECE tokens and wallet authentication.
          </p>
          <div className={platform === 'mobile' ? 'flex flex-col gap-4 mb-8' : 'flex justify-center gap-4'}>
            <Button 
              onClick={onEnterPlatform}
              className={platform === 'mobile' 
                ? 'w-full py-4 bg-white text-black font-medium rounded-lg' 
                : 'inline-flex items-center rounded-lg px-5 py-3 bg-foreground text-background font-medium hover:opacity-90'
              }
            >
              Enter Platform
            </Button>
            <Button 
              onClick={onViewPricing}
              variant={platform === 'mobile' ? 'outline' : 'ghost'}
              className={platform === 'mobile' 
                ? 'w-full py-4 border border-gray-600 text-white rounded-lg' 
                : 'inline-flex items-center rounded-lg px-5 py-3 border border-foreground/20 hover:bg-foreground/5'
              }
            >
              Pricing
            </Button>
          </div>
        </div>

        {platform !== 'mobile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="rounded-xl border p-6 bg-card text-card-foreground">
              <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
              <p className="text-sm text-muted-foreground mb-4">Bid, bet, and battle with real-time analytics.</p>
              <span className="text-accent hover:underline cursor-pointer">Explore marketplace →</span>
            </div>
            <div className="rounded-xl border p-6 bg-card text-card-foreground">
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-sm text-muted-foreground mb-4">Swipe to match and find high-potential cards.</p>
              <span className="text-accent hover:underline cursor-pointer">Start discovering →</span>
            </div>
            <div className="rounded-xl border p-6 bg-card text-card-foreground">
              <h3 className="text-xl font-semibold mb-2">Portfolio</h3>
              <p className="text-sm text-muted-foreground mb-4">Track value, trades, and performance.</p>
              <span className="text-accent hover:underline cursor-pointer">View portfolio →</span>
            </div>
          </div>
        )}

        {platform === 'mobile' && (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-xl border border-gray-700 p-4 bg-gray-900">
                <h3 className="text-lg font-semibold mb-2 text-white">Marketplace</h3>
                <p className="text-sm text-gray-300">Bid, bet, and battle with real-time analytics.</p>
              </div>
              <div className="rounded-xl border border-gray-700 p-4 bg-gray-900">
                <h3 className="text-lg font-semibold mb-2 text-white">Discover</h3>
                <p className="text-sm text-gray-300">Swipe to match and find high-potential cards.</p>
              </div>
              <div className="rounded-xl border border-gray-700 p-4 bg-gray-900">
                <h3 className="text-lg font-semibold mb-2 text-white">Portfolio</h3>
                <p className="text-sm text-gray-300">Track value, trades, and performance.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
