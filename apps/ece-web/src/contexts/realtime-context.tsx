'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { meteorClient } from '@/services/meteor-client.service'
import { prismaCacheService } from '@/services/prisma-cache.service'
import { useRealtime, useBattle, useMarketplace, useChat } from '@/hooks/useRealtime'

interface RealtimeContextType {
  // Connection state
  connected: boolean
  latency: number
  reconnecting: boolean
  error: string | null
  
  // Battle functionality
  currentBattle: string | null
  joinBattle: (battleId: string, playerId: string, deck: any[]) => void
  leaveBattle: () => void
  
  // Marketplace functionality
  marketData: any
  refreshMarket: () => void
  
  // Chat functionality
  sendChatMessage: (message: string, type?: 'message' | 'emote') => void
  
  // Health check
  healthStatus: { prisma: boolean; redis: boolean; meteor: boolean }
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

interface RealtimeProviderProps {
  children: React.ReactNode
  userId?: string
}

export function RealtimeProvider({ children, userId }: RealtimeProviderProps) {
  const realtimeState = useRealtime()
  const [currentBattle, setCurrentBattle] = useState<string | null>(null)
  const [healthStatus, setHealthStatus] = useState({ prisma: false, redis: false, meteor: false })
  
  const battle = useBattle(currentBattle)
  const marketplace = useMarketplace()
  const chat = useChat(currentBattle)

  // Health monitoring
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const cacheHealth = await prismaCacheService.healthCheck()
        const meteorHealth = meteorClient.getConnectionStatus() === 'connected'
        
        setHealthStatus({
          prisma: cacheHealth.prisma,
          redis: cacheHealth.redis,
          meteor: meteorHealth
        })
      } catch (error) {
        console.error('Health check failed:', error)
        setHealthStatus({ prisma: false, redis: false, meteor: false })
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const joinBattle = async (battleId: string, playerId: string, deck: any[]) => {
    try {
      await battle.actions.joinBattle(playerId, deck)
      setCurrentBattle(battleId)
    } catch (error) {
      console.error('Failed to join battle:', error)
    }
  }

  const leaveBattle = () => {
    setCurrentBattle(null)
  }

  const refreshMarket = () => {
    // Invalidate marketplace cache and reload
    prismaCacheService.invalidateMarketplaceCache()
    window.location.reload()
  }

  const sendChatMessage = (message: string, type: 'message' | 'emote' = 'message') => {
    if (userId) {
      chat.sendMessage(userId, message, type)
    }
  }

  const contextValue: RealtimeContextType = {
    // Connection state
    connected: realtimeState.connected,
    latency: realtimeState.latency,
    reconnecting: realtimeState.reconnecting,
    error: realtimeState.error,
    
    // Battle functionality
    currentBattle,
    joinBattle,
    leaveBattle,
    
    // Marketplace functionality
    marketData: marketplace.marketState,
    refreshMarket,
    
    // Chat functionality
    sendChatMessage,
    
    // Health status
    healthStatus
  }

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtimeContext() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtimeContext must be used within a RealtimeProvider')
  }
  return context
}

// Connection status indicator component
export function ConnectionStatus() {
  const { connected, latency, reconnecting, error, healthStatus } = useRealtimeContext()

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Connection Error
      </div>
    )
  }

  if (reconnecting) {
    return (
      <div className="flex items-center gap-2 text-yellow-500 text-sm">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        Reconnecting...
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        Disconnected
      </div>
    )
  }

  const getLatencyColor = (ms: number) => {
    if (ms < 50) return 'text-green-500'
    if (ms < 100) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-green-500">Connected</span>
      <span className={`${getLatencyColor(latency)} font-mono`}>
        {latency}ms
      </span>
      
      {/* Health indicators */}
      <div className="flex items-center gap-1 ml-2">
        <div className={`w-1.5 h-1.5 rounded-full ${healthStatus.prisma ? 'bg-green-400' : 'bg-red-400'}`} title="Database" />
        <div className={`w-1.5 h-1.5 rounded-full ${healthStatus.redis ? 'bg-green-400' : 'bg-red-400'}`} title="Cache" />
        <div className={`w-1.5 h-1.5 rounded-full ${healthStatus.meteor ? 'bg-green-400' : 'bg-red-400'}`} title="Real-time" />
      </div>
    </div>
  )
}
