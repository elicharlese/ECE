/**
 * ECE Trading Cards Sync Service
 * Handles data synchronization across platforms
 */

export interface SyncState {
  isOnline: boolean
  lastSync: Date | null
  pendingChanges: number
  syncInProgress: boolean
  errors: SyncError[]
}

export interface SyncEvent {
  type: 'sync_start' | 'sync_complete' | 'sync_error' | 'data_changed'
  timestamp: Date
  data?: any
  error?: SyncError
}

export interface SyncError {
  code: string
  message: string
  timestamp: Date
  details?: any
}

export interface SyncConfig {
  apiUrl: string
  websocketUrl: string
  syncInterval: number
  maxRetries: number
  conflictResolution: 'client_wins' | 'server_wins' | 'smart_merge'
  enableRealtime: boolean
}

export class ECESyncService {
  private config: SyncConfig
  private state: SyncState
  private listeners: Map<string, Function[]> = new Map()
  private syncTimer?: NodeJS.Timeout

  constructor(config: SyncConfig) {
    this.config = config
    this.state = {
      isOnline: false,
      lastSync: null,
      pendingChanges: 0,
      syncInProgress: false,
      errors: []
    }
  }

  /**
   * Initialize the sync service
   */
  async initialize(): Promise<void> {
    try {
      // Check online status
      this.state.isOnline = await this.checkOnlineStatus()
      
      // Start periodic sync if online
      if (this.state.isOnline) {
        this.startPeriodicSync()
      }
      
      // Set up event listeners
      this.setupEventListeners()
      
      this.emit('sync_start', { timestamp: new Date() })
    } catch (error) {
      this.handleError('INIT_ERROR', 'Failed to initialize sync service', error)
    }
  }

  /**
   * Perform manual sync
   */
  async sync(): Promise<void> {
    if (this.state.syncInProgress) {
      return
    }

    this.state.syncInProgress = true
    this.emit('sync_start', { timestamp: new Date() })

    try {
      // Sync user data
      await this.syncUserData()
      
      // Sync trading cards
      await this.syncTradingCards()
      
      // Sync marketplace data
      await this.syncMarketplaceData()
      
      // Sync wallet transactions
      await this.syncWalletData()

      this.state.lastSync = new Date()
      this.state.pendingChanges = 0
      this.emit('sync_complete', { timestamp: new Date() })
    } catch (error) {
      this.handleError('SYNC_ERROR', 'Sync operation failed', error)
    } finally {
      this.state.syncInProgress = false
    }
  }

  /**
   * Get current sync state
   */
  getState(): SyncState {
    return { ...this.state }
  }

  /**
   * Subscribe to sync events
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  /**
   * Unsubscribe from sync events
   */
  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Emit sync event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in sync event callback:', error)
        }
      })
    }
  }

  /**
   * Check if device is online
   */
  private async checkOnlineStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/health`, {
        method: 'HEAD',
        mode: 'no-cors'
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Start periodic sync
   */
  private startPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
    }

    this.syncTimer = setInterval(() => {
      if (this.state.isOnline && !this.state.syncInProgress) {
        this.sync()
      }
    }, this.config.syncInterval)
  }

  /**
   * Set up event listeners for online/offline status
   */
  private setupEventListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.state.isOnline = true
        this.startPeriodicSync()
      })

      window.addEventListener('offline', () => {
        this.state.isOnline = false
        if (this.syncTimer) {
          clearInterval(this.syncTimer)
        }
      })
    }
  }

  /**
   * Sync user profile data
   */
  private async syncUserData(): Promise<void> {
    // Implementation for user data sync
    // This would interact with the backend API
  }

  /**
   * Sync trading cards collection
   */
  private async syncTradingCards(): Promise<void> {
    // Implementation for trading cards sync
    // This would sync card ownership, trades, etc.
  }

  /**
   * Sync marketplace listings and transactions
   */
  private async syncMarketplaceData(): Promise<void> {
    // Implementation for marketplace sync
    // This would sync listings, purchases, sales
  }

  /**
   * Sync wallet and token data
   */
  private async syncWalletData(): Promise<void> {
    // Implementation for wallet sync
    // This would sync token balances, transactions
  }

  /**
   * Handle sync errors
   */
  private handleError(code: string, message: string, details?: any): void {
    const error: SyncError = {
      code,
      message,
      timestamp: new Date(),
      details
    }

    this.state.errors.push(error)
    
    // Keep only last 10 errors
    if (this.state.errors.length > 10) {
      this.state.errors = this.state.errors.slice(-10)
    }

    this.emit('sync_error', { error, timestamp: new Date() })
    console.error(`Sync Error [${code}]:`, message, details)
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
    }
    this.listeners.clear()
  }
}
