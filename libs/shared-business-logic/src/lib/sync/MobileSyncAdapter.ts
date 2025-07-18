/**
 * Mobile Sync Adapter for React Native
 * Handles mobile-specific synchronization logic
 */

import { ECESyncService, SyncEvent, SyncState } from './ECESyncService';

export class MobileSyncAdapter {
  private syncService: ECESyncService;
  private backgroundTaskId?: number;

  constructor() {
    // Initialize with mobile-specific config
    const config = {
      apiUrl: process.env['EXPO_PUBLIC_API_URL'] || 'http://localhost:3000/api',
      websocketUrl: process.env['EXPO_PUBLIC_WS_URL'] || 'ws://localhost:3001',
      syncInterval: 60000, // 1 minute for mobile
      maxRetries: 5,
      conflictResolution: 'smart_merge' as const,
      enableRealtime: true,
    };

    this.syncService = new ECESyncService(config);
    this.setupMobileSpecificHandlers();
  }

  /**
   * Initialize mobile sync
   */
  async initialize(): Promise<void> {
    await this.syncService.initialize();
    this.setupBackgroundSync();
    this.setupNetworkStatusListener();
  }

  /**
   * Setup mobile-specific sync handlers
   */
  private setupMobileSpecificHandlers(): void {
    this.syncService.on('sync_start', (event: SyncEvent) => {
      this.onSyncStart(event);
    });

    this.syncService.on('sync_complete', (event: SyncEvent) => {
      this.onSyncComplete(event);
    });

    this.syncService.on('sync_error', (event: SyncEvent) => {
      this.onSyncError(event);
    });
  }

  /**
   * Setup background sync for mobile
   */
  private setupBackgroundSync(): void {
    // Register background task for iOS/Android
    // This would use Expo TaskManager or similar
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      // Setup background sync for PWA
      navigator.serviceWorker.ready.then((registration) => {
        // Register background sync
        if ('sync' in registration) {
          (registration as any).sync.register('ece-sync');
        }
      });
    }
  }

  /**
   * Setup network status listener
   */
  private setupNetworkStatusListener(): void {
    // Use NetInfo for React Native or navigator.onLine for web
    if (typeof navigator !== 'undefined') {
      const updateOnlineStatus = () => {
        const isOnline = navigator.onLine;
        if (isOnline) {
          // Trigger sync when coming back online
          this.syncService.sync();
        }
      };

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    }
  }

  /**
   * Handle sync start event
   */
  private onSyncStart(event: SyncEvent): void {
    // Show sync indicator in mobile UI
    // Could dispatch to Redux/Zustand store
    console.log('Mobile sync started:', event.timestamp);
  }

  /**
   * Handle sync completion
   */
  private onSyncComplete(event: SyncEvent): void {
    // Hide sync indicator
    // Update mobile UI with fresh data
    console.log('Mobile sync completed:', event.timestamp);
    
    // Send local notification if significant changes
    this.sendSyncNotification('Sync completed successfully');
  }

  /**
   * Handle sync errors
   */
  private onSyncError(event: SyncEvent): void {
    console.error('Mobile sync error:', event.error);
    
    // Show error toast/alert in mobile UI
    this.sendSyncNotification('Sync failed. Will retry automatically.', true);
  }

  /**
   * Send sync notification to user
   */
  private sendSyncNotification(message: string, isError = false): void {
    // Use Expo Notifications or similar for React Native
    // For now, just log
    console.log(`Sync notification: ${message}`, { isError });
  }

  /**
   * Get current sync state
   */
  getSyncState(): SyncState {
    return this.syncService.getState();
  }

  /**
   * Manually trigger sync
   */
  async sync(): Promise<void> {
    return this.syncService.sync();
  }

  /**
   * Subscribe to sync events
   */
  onSyncEvent(event: string, callback: Function): void {
    this.syncService.on(event, callback);
  }

  /**
   * Unsubscribe from sync events
   */
  offSyncEvent(event: string, callback: Function): void {
    this.syncService.off(event, callback);
  }

  /**
   * Cleanup mobile adapter
   */
  destroy(): void {
    if (this.backgroundTaskId) {
      // Cancel background task
      // Implementation depends on the background task library used
    }
    this.syncService.destroy();
  }
}
