import { useState, useEffect, useCallback, useRef } from 'react'
import { meteorClient } from '@/services/meteor-client.service'
import { prismaCacheService } from '@/services/prisma-cache.service'

interface RealtimeState {
  connected: boolean
  latency: number
  reconnecting: boolean
  error: string | null
}

interface BattleState {
  id: string
  phase: 'waiting' | 'deck-selection' | 'battle' | 'ended'
  players: any[]
  currentTurn: string | null
  timeLeft: number
  gameState: any
}

interface MarketState {
  auctions: any[]
  bets: any[]
  latestBids: Map<string, any>
  priceUpdates: Map<string, number>
}

export function useRealtime() {
  const [state, setState] = useState<RealtimeState>({
    connected: false,
    latency: 0,
    reconnecting: false,
    error: null
  })

  useEffect(() => {
    const checkConnection = () => {
      const status = meteorClient.getConnectionStatus()
      const latency = meteorClient.getLatency()
      
      setState(prev => ({
        ...prev,
        connected: status === 'connected',
        latency,
        reconnecting: status === 'connecting',
        error: status === 'failed' ? 'Connection failed' : null
      }))
    }

    // Check connection immediately
    checkConnection()

    // Check every 5 seconds
    const interval = setInterval(checkConnection, 5000)
    return () => clearInterval(interval)
  }, [])

  return state
}

export function useBattle(battleId: string | null) {
  const [battleState, setBattleState] = useState<BattleState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!battleId) {
      setBattleState(null)
      return
    }

    const loadBattle = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Load from cache first
        const cached = await prismaCacheService.getBattleState(battleId)
        if (cached) {
          setBattleState(cached)
        }

        // Subscribe to real-time updates
        subscriptionRef.current = meteorClient.subscribe('battle', battleId)
        
        // Setup reactive data binding
        const stopReactive = meteorClient.reactive(() => {
          const battleCollection = meteorClient.getCollection('battles')
          const battle = battleCollection.findOne(battleId)
          if (battle) {
            setBattleState(battle)
            // Cache the updated state
            prismaCacheService.cacheBattleState(battleId, battle)
          }
        })

        return () => {
          stopReactive()
          if (subscriptionRef.current) {
            meteorClient.unsubscribe('battle')
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load battle')
      } finally {
        setLoading(false)
      }
    }

    loadBattle()
  }, [battleId])

  const joinBattle = useCallback(async (playerId: string, deck: any[]) => {
    if (!battleId) return
    
    try {
      await meteorClient.joinBattle(battleId, playerId, deck)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join battle')
    }
  }, [battleId])

  const playCard = useCallback(async (playerId: string, cardId: string, targetId?: string) => {
    if (!battleId) return
    
    try {
      await meteorClient.playCard(battleId, playerId, cardId, targetId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play card')
    }
  }, [battleId])

  const endTurn = useCallback(async (playerId: string) => {
    if (!battleId) return
    
    try {
      await meteorClient.endTurn(battleId, playerId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end turn')
    }
  }, [battleId])

  return {
    battleState,
    loading,
    error,
    actions: {
      joinBattle,
      playCard,
      endTurn
    }
  }
}

export function useMarketplace() {
  const [marketState, setMarketState] = useState<MarketState>({
    auctions: [],
    bets: [],
    latestBids: new Map(),
    priceUpdates: new Map()
  })
  const [loading, setLoading] = useState(false)
  const subscriptionsRef = useRef<any[]>([])

  useEffect(() => {
    const loadMarketplace = async () => {
      setLoading(true)
      
      try {
        // Load initial data from cache
        const listings = await prismaCacheService.getMarketplaceListings()
        setMarketState(prev => ({ ...prev, auctions: listings }))

        // Subscribe to real-time marketplace updates
        const auctionSub = meteorClient.subscribe('marketplace.auctions')
        const betSub = meteorClient.subscribe('marketplace.bets')
        subscriptionsRef.current = [auctionSub, betSub]

        // Setup reactive updates
        const stopAuctionReactive = meteorClient.reactive(() => {
          const auctionCollection = meteorClient.getCollection('auctions')
          const auctions = auctionCollection.find({}).fetch()
          setMarketState(prev => ({ ...prev, auctions }))
        })

        const stopBetReactive = meteorClient.reactive(() => {
          const betCollection = meteorClient.getCollection('bets')
          const bets = betCollection.find({}).fetch()
          setMarketState(prev => ({ ...prev, bets }))
        })

        return () => {
          stopAuctionReactive()
          stopBetReactive()
          subscriptionsRef.current.forEach(sub => sub.stop())
        }
      } catch (err) {
        console.error('Failed to load marketplace:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMarketplace()
  }, [])

  const placeBid = useCallback(async (auctionId: string, userId: string, amount: number) => {
    try {
      const result = await meteorClient.placeBid(auctionId, userId, amount)
      
      // Update local state optimistically
      setMarketState(prev => ({
        ...prev,
        latestBids: new Map(prev.latestBids.set(auctionId, { userId, amount, timestamp: Date.now() }))
      }))
      
      return result
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to place bid')
    }
  }, [])

  const placeBet = useCallback(async (marketId: string, userId: string, prediction: any) => {
    try {
      return await meteorClient.placeBet(marketId, userId, prediction)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to place bet')
    }
  }, [])

  return {
    marketState,
    loading,
    actions: {
      placeBid,
      placeBet
    }
  }
}

export function useChat(battleId: string | null) {
  const [messages, setMessages] = useState<any[]>([])
  const [connected, setConnected] = useState(false)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!battleId) return

    // Subscribe to chat messages
    subscriptionRef.current = meteorClient.subscribe('chat', battleId)
    setConnected(true)

    // Setup reactive message updates
    const stopReactive = meteorClient.reactive(() => {
      const chatCollection = meteorClient.getCollection('chat')
      const chatMessages = chatCollection.find({ battleId }).fetch()
      setMessages(chatMessages.sort((a: any, b: any) => a.timestamp - b.timestamp))
    })

    return () => {
      stopReactive()
      if (subscriptionRef.current) {
        subscriptionRef.current.stop()
      }
      setConnected(false)
    }
  }, [battleId])

  const sendMessage = useCallback(async (userId: string, message: string, type: 'message' | 'emote' = 'message') => {
    if (!battleId) return
    
    try {
      await meteorClient.sendChatMessage(battleId, userId, message, type)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }, [battleId])

  return {
    messages,
    connected,
    sendMessage
  }
}

export function useOptimisticUpdates<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, any>>(new Map())
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set())

  const applyOptimisticUpdate = useCallback((key: string, update: Partial<T>) => {
    setOptimisticUpdates(prev => new Map(prev.set(key, update)))
    setPendingActions(prev => new Set(prev.add(key)))
    
    setState(prevState => ({
      ...prevState,
      ...update
    }))
  }, [])

  const confirmUpdate = useCallback((key: string) => {
    setOptimisticUpdates(prev => {
      const newMap = new Map(prev)
      newMap.delete(key)
      return newMap
    })
    
    setPendingActions(prev => {
      const newSet = new Set(prev)
      newSet.delete(key)
      return newSet
    })
  }, [])

  const revertUpdate = useCallback((key: string, originalState: T) => {
    const update = optimisticUpdates.get(key)
    if (update) {
      setState(originalState)
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev)
        newMap.delete(key)
        return newMap
      })
      
      setPendingActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }
  }, [optimisticUpdates])

  return {
    state,
    setState,
    isPending: (key: string) => pendingActions.has(key),
    applyOptimisticUpdate,
    confirmUpdate,
    revertUpdate
  }
}
