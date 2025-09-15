/**
 * Mobile Sync Integration
 * Integrates ECE Sync Service with React Native mobile app
 */

import { MobileSyncAdapter } from '@ece-platform/shared-business-logic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface MobileSyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  errorCount: number;
  lastSync: number;
}

class MobileSyncManager {
  private static instance: MobileSyncManager;
  private syncAdapter: MobileSyncAdapter | null = null;
  private isInitialized: boolean = false;
  private syncTimer: NodeJS.Timeout | null = null;
  private statusListeners: ((status: MobileSyncStatus) => void)[] = [];
  private eventListeners: ((event: any) => void)[] = [];

  private constructor() {}

  static getInstance(): MobileSyncManager {
    if (!MobileSyncManager.instance) {
      MobileSyncManager.instance = new MobileSyncManager();
    }
    return MobileSyncManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      console.log('🔄 Initializing Mobile Sync Manager...');
      
      // Initialize sync adapter
      this.syncAdapter = new MobileSyncAdapter();
      await this.syncAdapter.initialize();
      
      // Set up event handlers
      this.setupEventHandlers();
      
      // Start periodic sync
      this.startPeriodicSync();
      
      this.isInitialized = true;
      console.log('✅ Mobile Sync Manager initialized');
      
      // Notify status listeners
      this.notifyStatusChange();
      
    } catch (error) {
      console.error('❌ Failed to initialize Mobile Sync Manager:', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.syncAdapter) return;

    // Handle sync events from other platforms
    this.syncAdapter.onSyncEvent((event) => {
      console.log('📡 Mobile received sync event:', event.type);
      
      // Store sync event locally
      this.storeSyncEvent(event);
      
      // Notify event listeners
      this.eventListeners.forEach(listener => listener(event));
    });

    // Handle sync status changes
    this.syncAdapter.onStatusChange((status) => {
      console.log('🔄 Mobile sync status changed:', status);
      this.notifyStatusChange();
    });
  }

  private async storeSyncEvent(event: any): Promise<void> {
    try {
      const key = `sync_event_${event.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(event));
    } catch (error) {
      console.error('Failed to store sync event:', error);
    }
  }

  async syncTrade(tradeData: any): Promise<void> {
    if (!this.syncAdapter) {
      throw new Error('Sync not initialized');
    }
    
    console.log('🔄 Syncing trade data...');
    await this.syncAdapter.syncTrade(tradeData);
    
    // Store locally as backup
    await this.storeLocalData('trade', tradeData);
  }

  async syncCardUpdate(cardData: any): Promise<void> {
    if (!this.syncAdapter) {
      throw new Error('Sync not initialized');
    }
    
    console.log('🔄 Syncing card update...');
    await this.syncAdapter.syncCardUpdate(cardData);
    
    // Store locally as backup
    await this.storeLocalData('card', cardData);
  }

  async syncPortfolioChange(portfolioData: any): Promise<void> {
    if (!this.syncAdapter) {
      throw new Error('Sync not initialized');
    }
    
    console.log('🔄 Syncing portfolio change...');
    await this.syncAdapter.syncPortfolioChange(portfolioData);
    
    // Store locally as backup
    await this.storeLocalData('portfolio', portfolioData);
  }

  private async storeLocalData(type: string, data: any): Promise<void> {
    try {
      const key = `local_${type}_${Date.now()}`;
      await AsyncStorage.setItem(key, JSON.stringify({
        type,
        data,
        timestamp: Date.now(),
        platform: Platform.OS,
        synced: false
      }));
    } catch (error) {
      console.error('Failed to store local data:', error);
    }
  }

  async forceSync(): Promise<{ success: boolean; error?: string }> {
    if (!this.syncAdapter) {
      return { success: false, error: 'Sync not initialized' };
    }

    try {
      console.log('🔄 Starting manual sync...');
      await this.syncAdapter.sync();
      console.log('✅ Manual sync completed');
      
      // Update last sync time
      await AsyncStorage.setItem('last_sync', Date.now().toString());
      
      this.notifyStatusChange();
      return { success: true };
    } catch (error) {
      console.error('❌ Manual sync failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  getSyncStatus(): MobileSyncStatus {
    if (!this.syncAdapter) {
      return {
        isOnline: false,
        isSyncing: false,
        pendingCount: 0,
        errorCount: 0,
        lastSync: 0
      };
    }

    const status = this.syncAdapter.getSyncStatus();
    return {
      isOnline: status.isOnline,
      isSyncing: status.isSyncing,
      pendingCount: status.pendingEvents.length,
      errorCount: status.syncErrors.length,
      lastSync: status.lastSync
    };
  }

  private startPeriodicSync(): void {
    // Sync every 30 seconds
    this.syncTimer = setInterval(async () => {
      if (this.syncAdapter) {
        try {
          await this.syncAdapter.sync();
        } catch (error) {
          console.error('Periodic sync failed:', error);
        }
      }
    }, 30000);
  }

  private notifyStatusChange(): void {
    const status = this.getSyncStatus();
    this.statusListeners.forEach(listener => listener(status));
  }

  onStatusChange(listener: (status: MobileSyncStatus) => void): () => void {
    this.statusListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.statusListeners.indexOf(listener);
      if (index > -1) {
        this.statusListeners.splice(index, 1);
      }
    };
  }

  onSyncEvent(listener: (event: any) => void): () => void {
    this.eventListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  async getLocalPendingData(): Promise<any[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const localKeys = keys.filter(key => key.startsWith('local_'));
      
      const pendingData = [];
      for (const key of localKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const data = JSON.parse(item);
          if (!data.synced) {
            pendingData.push(data);
          }
        }
      }
      
      return pendingData;
    } catch (error) {
      console.error('Failed to get local pending data:', error);
      return [];
    }
  }

  async clearSyncedData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const syncKeys = keys.filter(key => 
        key.startsWith('local_') || key.startsWith('sync_event_')
      );
      
      await AsyncStorage.multiRemove(syncKeys);
      console.log('✅ Cleared synced data');
    } catch (error) {
      console.error('Failed to clear synced data:', error);
    }
  }

  cleanup(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    
    if (this.syncAdapter) {
      this.syncAdapter.cleanup();
      this.syncAdapter = null;
    }
    
    this.statusListeners = [];
    this.eventListeners = [];
    this.isInitialized = false;
  }
}

export default MobileSyncManager;
export type { MobileSyncStatus };
