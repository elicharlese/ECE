"use client";

/**
 * React Hook for ECE Sync Integration
 * Provides easy sync functionality for React components
 */

import { useEffect, useState, useCallback, useRef, createContext, useContext, ReactNode } from 'react';
import { WebSyncAdapter } from '@ece-platform/shared-business-logic';
import type { SyncEvent } from '@ece-platform/shared-business-logic';

interface UseSyncOptions {
  autoInit?: boolean;
  enableRealtime?: boolean;
  onSyncEvent?: (event: SyncEvent) => void;
  onSyncStatusChange?: (status: any) => void;
}

interface SyncHookResult {
  isInitialized: boolean;
  syncStatus: any;
  syncTrade: (tradeData: any) => Promise<void>;
  syncCardUpdate: (cardData: any) => Promise<void>;
  syncPortfolioChange: (portfolioData: any) => Promise<void>;
  forceSync: () => Promise<void>;
  initializeSync: () => Promise<void>;
  cleanup: () => void;
}

export function useECESync(options: UseSyncOptions = {}): SyncHookResult {
  const {
    autoInit = true,
    enableRealtime = true,
    onSyncEvent,
    onSyncStatusChange
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>({
    isOnline: true,
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false,
    errors: []
  });

  const syncAdapterRef = useRef<WebSyncAdapter | null>(null);
  const eventListenersRef = useRef<(() => void)[]>([]);

  /**
   * Initialize sync adapter
   */
  const initializeSync = useCallback(async () => {
    if (syncAdapterRef.current) return;

    try {
      console.log('🔄 Initializing ECE Sync...');
      
      const adapter = new WebSyncAdapter();
      await adapter.initialize();
      
      syncAdapterRef.current = adapter;
      setIsInitialized(true);

      // Set up status polling
      const statusInterval = setInterval(() => {
        if (syncAdapterRef.current) {
          const status = syncAdapterRef.current.getSyncStatus();
          setSyncStatus(status);
          onSyncStatusChange?.(status);
        }
      }, 5000); // Update every 5 seconds

      eventListenersRef.current.push(() => clearInterval(statusInterval));

      console.log('✅ ECE Sync initialized');

    } catch (error) {
      console.error('❌ Failed to initialize sync:', error);
    }
  }, [onSyncStatusChange]);

  /**
   * Set up event listeners for sync events
   */
  useEffect(() => {
    if (!isInitialized) return;

    const handleTradeUpdate = (event: CustomEvent) => {
      onSyncEvent?.({
        type: 'data_changed',
        timestamp: new Date(),
        data: { type: 'trade', ...event.detail }
      });
    };

    const handleCardUpdate = (event: CustomEvent) => {
      onSyncEvent?.({
        type: 'data_changed',
        timestamp: new Date(),
        data: { type: 'card_update', ...event.detail }
      });
    };

    const handlePortfolioUpdate = (event: CustomEvent) => {
      onSyncEvent?.({
        type: 'data_changed',
        timestamp: new Date(),
        data: { type: 'portfolio_change', ...event.detail }
      });
    };

    const handleMarketUpdate = (event: CustomEvent) => {
      onSyncEvent?.({
        type: 'data_changed',
        timestamp: new Date(),
        data: { type: 'market_update', ...event.detail }
      });
    };

    // Add event listeners
    window.addEventListener('ece-trade-update', handleTradeUpdate as EventListener);
    window.addEventListener('ece-card-update', handleCardUpdate as EventListener);
    window.addEventListener('ece-portfolio-update', handlePortfolioUpdate as EventListener);
    window.addEventListener('ece-market-update', handleMarketUpdate as EventListener);

    // Store cleanup functions
    eventListenersRef.current.push(() => {
      window.removeEventListener('ece-trade-update', handleTradeUpdate as EventListener);
      window.removeEventListener('ece-card-update', handleCardUpdate as EventListener);
      window.removeEventListener('ece-portfolio-update', handlePortfolioUpdate as EventListener);
      window.removeEventListener('ece-market-update', handleMarketUpdate as EventListener);
    });

  }, [isInitialized, onSyncEvent]);

  /**
   * Auto-initialize if enabled
   */
  useEffect(() => {
    if (autoInit && !isInitialized) {
      initializeSync();
    }
  }, [autoInit, isInitialized, initializeSync]);

  /**
   * Sync a trade
   */
  const syncTrade = useCallback(async (tradeData: any) => {
    if (syncAdapterRef.current) {
      await syncAdapterRef.current.syncTrade(tradeData);
    } else {
      console.warn('⚠️ Sync not initialized, cannot sync trade');
    }
  }, []);

  /**
   * Sync a card update
   */
  const syncCardUpdate = useCallback(async (cardData: any) => {
    if (syncAdapterRef.current) {
      await syncAdapterRef.current.syncCardUpdate(cardData);
    } else {
      console.warn('⚠️ Sync not initialized, cannot sync card update');
    }
  }, []);

  /**
   * Sync a portfolio change
   */
  const syncPortfolioChange = useCallback(async (portfolioData: any) => {
    if (syncAdapterRef.current) {
      await syncAdapterRef.current.syncPortfolioChange(portfolioData);
    } else {
      console.warn('⚠️ Sync not initialized, cannot sync portfolio change');
    }
  }, []);

  /**
   * Force sync
   */
  const forceSync = useCallback(async () => {
    if (syncAdapterRef.current) {
      await syncAdapterRef.current.sync();
    } else {
      console.warn('⚠️ Sync not initialized, cannot force sync');
    }
  }, []);

  /**
   * Cleanup function
   */
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up ECE Sync...');
    
    // Run all cleanup functions
    eventListenersRef.current.forEach(cleanupFn => cleanupFn());
    eventListenersRef.current = [];

    // Cleanup sync adapter
    if (syncAdapterRef.current) {
      syncAdapterRef.current.cleanup();
      syncAdapterRef.current = null;
    }

    setIsInitialized(false);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isInitialized,
    syncStatus,
    syncTrade,
    syncCardUpdate,
    syncPortfolioChange,
    forceSync,
    initializeSync,
    cleanup
  };
}

/* 
// Context functionality - temporarily disabled
interface SyncContextValue {
  syncHook: SyncHookResult;
}

const SyncContext = createContext<SyncContextValue | null>(null);

interface SyncProviderProps {
  children: ReactNode;
  options?: UseSyncOptions;
}

export function SyncProvider({ children, options }: SyncProviderProps) {
  const syncHook = useECESync(options);

  return (
    <SyncContext.Provider value={{ syncHook }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
}
*/

export default useECESync;
