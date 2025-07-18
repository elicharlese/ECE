/**
 * Web Sync Adapter for ECE Trading Cards
 * Integrates ECE Sync Service with web browsers
 */

import { ECESyncService, SyncEvent, SyncState } from './ECESyncService';

export class WebSyncAdapter {
  private syncService: ECESyncService;
  private isInitialized: boolean = false;
  private eventListeners: ((event: SyncEvent) => void)[] = [];
  private statusListeners: ((status: SyncState) => void)[] = [];

  constructor() {
    // Initialize with web-specific config
    const config = {
      apiUrl: process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3000/api',
      websocketUrl: process.env['NEXT_PUBLIC_WS_URL'] || 'ws://localhost:3001',
      syncInterval: 30000, // 30 seconds
      maxRetries: 3,
      conflictResolution: 'smart_merge' as const,
      batchSize: 10,
      enableRealtime: true
    };

    this.syncService = new ECESyncService(config);
  }

  async initialize(): Promise<void> {
    try {
      await this.syncService.initialize();
      this.isInitialized = true;
      
      // Set up browser-specific event handlers
      this.setupBrowserEvents();
      
      console.log('✅ Web Sync Adapter initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Web Sync Adapter:', error);
      throw error;
    }
  }

  private setupBrowserEvents(): void {
    // Handle browser tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Tab became visible, force sync
        this.syncService.sync();
      }
    });

    // Handle online/offline events
    window.addEventListener('online', () => {
      console.log('🌐 Browser came online, syncing...');
      this.syncService.sync();
    });

    window.addEventListener('offline', () => {
      console.log('🌐 Browser went offline');
    });

    // Handle before unload to sync any pending data
    window.addEventListener('beforeunload', () => {
      // Try to sync any pending data before page unload
      const status = this.syncService.getState();
      if (status.pendingChanges > 0) {
        // Use sendBeacon for reliable data sending during unload
        navigator.sendBeacon('/api/sync/events', JSON.stringify({
          events: status.pendingChanges
        }));
      }
    });
  }

  async syncTrade(tradeData: any): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Web Sync Adapter not initialized');
    }
    
    await this.syncService.sync();
    console.log('💰 Trade synced via web adapter');
  }

  async syncCardUpdate(cardData: any): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Web Sync Adapter not initialized');
    }
    
    await this.syncService.sync();
    console.log('🃏 Card update synced via web adapter');
  }

  async syncPortfolioChange(portfolioData: any): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Web Sync Adapter not initialized');
    }
    
    await this.syncService.sync();
    console.log('📊 Portfolio change synced via web adapter');
  }

  async syncMarketUpdate(marketData: any): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Web Sync Adapter not initialized');
    }
    
    await this.syncService.sync();
    console.log('📈 Market update synced via web adapter');
  }

  async sync(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Web Sync Adapter not initialized');
    }
    
    await this.syncService.sync();
  }

  getSyncStatus(): SyncState {
    if (!this.isInitialized) {
      return {
        isOnline: navigator.onLine,
        lastSync: null,
        pendingChanges: 0,
        syncInProgress: false,
        errors: []
      };
    }
    
    const status = this.syncService.getState();
    // Update online status from browser
    status.isOnline = navigator.onLine;
    return status;
  }

  onSyncEvent(callback: (event: SyncEvent) => void): () => void {
    this.eventListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  onStatusChange(callback: (status: SyncState) => void): () => void {
    this.statusListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.statusListeners.indexOf(callback);
      if (index > -1) {
        this.statusListeners.splice(index, 1);
      }
    };
  }

  // Web-specific features
  async exportSyncData(): Promise<Blob> {
    const status = this.getSyncStatus();
    const data = {
      pendingEvents: [], // Placeholder - would be populated from local storage
      conflictQueue: [], // Placeholder - would be populated from conflicts
      lastSync: status.lastSync,
      exportedAt: Date.now(),
      platform: 'web'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    return blob;
  }

  async importSyncData(file: File): Promise<void> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.platform && data.pendingEvents) {
        // Import pending events
        for (const event of data.pendingEvents) {
          await this.syncService.sync();
        }
        
        console.log(`✅ Imported ${data.pendingEvents.length} sync events`);
      }
    } catch (error) {
      console.error('❌ Failed to import sync data:', error);
      throw new Error('Invalid sync data file');
    }
  }

  // Browser storage integration
  async persistPendingData(): Promise<void> {
    const status = this.getSyncStatus();
    const data = {
      pendingEvents: [], // Placeholder - would be populated from local storage
      lastSync: status.lastSync
    };
    
    try {
      localStorage.setItem('ece_sync_pending', JSON.stringify(data));
      console.log('💾 Pending sync data persisted to localStorage');
    } catch (error) {
      console.error('❌ Failed to persist sync data:', error);
    }
  }

  async restorePendingData(): Promise<void> {
    try {
      const stored = localStorage.getItem('ece_sync_pending');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Restore pending events
        for (const event of data.pendingEvents || []) {
          await this.syncService.sync();
        }
        
        // Clear stored data after restoration
        localStorage.removeItem('ece_sync_pending');
        
        console.log(`✅ Restored ${data.pendingEvents?.length || 0} pending sync events`);
      }
    } catch (error) {
      console.error('❌ Failed to restore sync data:', error);
    }
  }

  cleanup(): void {
    // Persist any pending data before cleanup
    this.persistPendingData();
    
    this.eventListeners = [];
    this.statusListeners = [];
    this.syncService.destroy();
    this.isInitialized = false;
  }
}

export default WebSyncAdapter;
