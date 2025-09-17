'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, BarChart3, Users, Settings, Rocket, Brain, Code, Palette } from 'lucide-react'
import { GlassCard } from '../../components/ui/glass-card'
import { Button } from '../../components/ui/button'
import { AdminAppGeneration } from '../../components/admin/admin-app-generation'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [generatedAppsCount, setGeneratedAppsCount] = useState(0)

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'app-generation', label: 'App Generation', icon: Rocket },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#66D9EF]/20 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-[#66D9EF]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F8EFD6]">Platform Analytics</h3>
                    <p className="text-[#75715E]">View comprehensive platform insights and metrics</p>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#A6E22E]/20 rounded-lg">
                    <Rocket className="w-8 h-8 text-[#A6E22E]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F8EFD6]">App Generation</h3>
                    <p className="text-[#75715E]">AI-powered application creation and management</p>
                    <div className="text-sm text-[#A6E22E] font-semibold mt-1">
                      {generatedAppsCount} apps generated
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#E6DB74]/20 rounded-lg">
                    <Users className="w-8 h-8 text-[#E6DB74]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F8EFD6]">User Management</h3>
                    <p className="text-[#75715E]">Manage users, permissions, and access control</p>
                  </div>
                </div>
              </GlassCard>
            </div>
            
            <GlassCard className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#A6E22E]/20 rounded-lg">
                  <Shield className="w-8 h-8 text-[#A6E22E]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#F8EFD6] mb-2">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#272822]/50 rounded-lg">
                      <span className="text-[#F8EFD6]">Core Patches (6-15)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#A6E22E] rounded-full"></div>
                        <span className="text-[#A6E22E] font-medium">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#272822]/50 rounded-lg">
                      <span className="text-[#F8EFD6]">AI Services</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#A6E22E] rounded-full"></div>
                        <span className="text-[#A6E22E] font-medium">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#272822]/50 rounded-lg">
                      <span className="text-[#F8EFD6]">3D Environment</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#A6E22E] rounded-full"></div>
                        <span className="text-[#A6E22E] font-medium">Ready</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-[#A6E22E]/10 border border-[#A6E22E]/30 rounded-lg">
                    <p className="text-[#A6E22E] font-medium">✅ All systems operational and ready for production</p>
                    <p className="text-[#75715E] text-sm mt-2">ECE patches 6-15 successfully implemented with enhanced AI, 3D, and app generation capabilities.</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )
      
      case 'app-generation':
        return (
          <AdminAppGeneration 
            onAppGenerated={(app) => {
              setGeneratedAppsCount(prev => prev + 1)
            }}
          />
        )
      
      case 'analytics':
        return (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">Platform Analytics</h3>
            <p className="text-[#75715E]">Analytics dashboard coming soon...</p>
          </GlassCard>
        )
      
      case 'users':
        return (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">User Management</h3>
            <p className="text-[#75715E]">User management interface coming soon...</p>
          </GlassCard>
        )
      
      case 'settings':
        return (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-[#F8EFD6] mb-4">System Settings</h3>
            <p className="text-[#75715E]">System configuration coming soon...</p>
          </GlassCard>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#272822] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl backdrop-blur-md border border-[#75715E]/30 bg-[#272822]/90 p-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Shield className="w-8 h-8 text-[#A6E22E]" />
            <h1 className="text-3xl font-bold text-[#F8EFD6]">ECE Admin Dashboard</h1>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-[#272822]/60 rounded-lg p-1 mb-8">
            {adminTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#A6E22E]/20 text-[#A6E22E] shadow-lg'
                      : 'text-[#75715E] hover:text-[#F8EFD6] hover:bg-[#272822]/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
          
          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
