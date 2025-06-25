'use client'

import { Button, GlassCard } from '@ece-platform/shared-ui';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-monokai-dark via-monokai-purple/20 to-monokai-blue/20 bg-mesh">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-6xl font-bold text-gradient-sunset">
            ECE Trading Cards
          </h1>
          <p className="text-xl text-monokai-cream/80 max-w-2xl mx-auto">
            Welcome to the future of digital trading cards. Built with Next.js, powered by Nx monorepo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="ghost" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 bg-monokai-purple/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-monokai-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-monokai-cream mb-2">Lightning Fast</h3>
            <p className="text-monokai-cream/70">Built with Next.js 15 and optimized for performance</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 bg-monokai-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-monokai-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-monokai-cream mb-2">Multi-Platform</h3>
            <p className="text-monokai-cream/70">Web, Desktop, and Mobile apps from one codebase</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 bg-monokai-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-monokai-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-monokai-cream mb-2">Production Ready</h3>
            <p className="text-monokai-cream/70">Enterprise-grade security and scalability</p>
          </GlassCard>
        </div>

        {/* Status Section */}
        <div className="mt-16 text-center">
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-monokai-cream mb-4">🎉 Step 1.2 Complete!</h2>
            <p className="text-monokai-cream/80 mb-6">
              Successfully migrated ECE Trading Cards to Nx monorepo with shared libraries and Next.js 15.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-monokai-green font-semibold">✅ Web App</div>
                <div className="text-monokai-cream/60">Next.js 15</div>
              </div>
              <div className="text-center">
                <div className="text-monokai-green font-semibold">✅ Desktop</div>
                <div className="text-monokai-cream/60">Electron</div>
              </div>
              <div className="text-center">
                <div className="text-monokai-green font-semibold">✅ Shared UI</div>
                <div className="text-monokai-cream/60">Components</div>
              </div>
              <div className="text-center">
                <div className="text-monokai-green font-semibold">✅ TypeScript</div>
                <div className="text-monokai-cream/60">Types & Logic</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
