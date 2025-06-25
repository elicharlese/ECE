'use client'

import { Button, GlassCard } from '@ece-platform/shared-ui';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            ECE Trading Cards
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
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
            <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Lightning Fast</h3>
            <p className="text-slate-400">Built with Next.js 15 and optimized for performance</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Multi-Platform</h3>
            <p className="text-slate-400">Web, Desktop, and Mobile apps from one codebase</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Production Ready</h3>
            <p className="text-slate-400">Enterprise-grade security and scalability</p>
          </GlassCard>
        </div>

        {/* Status Section */}
        <div className="mt-16 text-center">
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">🎉 Step 1.2 Complete!</h2>
            <p className="text-slate-400 mb-6">
              Successfully migrated ECE Trading Cards to Nx monorepo with shared libraries and Next.js 15.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-400 font-semibold">✅ Web App</div>
                <div className="text-slate-500">Next.js 15</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">✅ Desktop</div>
                <div className="text-slate-500">Electron</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">✅ Shared UI</div>
                <div className="text-slate-500">Components</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">✅ TypeScript</div>
                <div className="text-slate-500">Types & Logic</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
