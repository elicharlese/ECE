/**
 * Sync Status Component
 * Displays real-time synchronization status across platforms
 */

import React from 'react';
import { useECESync } from '../hooks/useECESync';

interface SyncStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function SyncStatus({ showDetails = false, className = '' }: SyncStatusProps) {
  const { isInitialized, syncStatus, forceSync } = useECESync();

  if (!isInitialized) {
    return (
      <div className={`sync-status ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Initializing sync...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return 'bg-red-500';
    if (syncStatus.isSyncing) return 'bg-yellow-500 animate-pulse';
    if (syncStatus.errorCount > 0) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) return 'Offline';
    if (syncStatus.isSyncing) return 'Syncing...';
    if (syncStatus.errorCount > 0) return 'Sync errors';
    return 'Synced';
  };

  const formatLastSync = () => {
    if (!syncStatus.lastSync) return 'Never';
    
    const now = Date.now();
    const diff = now - syncStatus.lastSync;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (error) {
      console.error('Failed to force sync:', error);
    }
  };

  return (
    <div className={`sync-status ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getStatusText()}
          </span>
        </div>

        {showDetails && (
          <button
            onClick={handleForceSync}
            disabled={syncStatus.isSyncing}
            className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>

      {showDetails && (
        <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Last sync:</span>
            <span>{formatLastSync()}</span>
          </div>
          
          {syncStatus.pendingCount > 0 && (
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="text-yellow-600">{syncStatus.pendingCount} events</span>
            </div>
          )}
          
          {syncStatus.errorCount > 0 && (
            <div className="flex justify-between">
              <span>Errors:</span>
              <span className="text-red-600">{syncStatus.errorCount}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={syncStatus.isOnline ? 'text-green-600' : 'text-red-600'}>
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact sync indicator for minimal UI space
 */
export function SyncIndicator({ className = '' }: { className?: string }) {
  const { isInitialized, syncStatus } = useECESync();

  if (!isInitialized) {
    return (
      <div className={`w-3 h-3 bg-gray-400 rounded-full animate-pulse ${className}`} 
           title="Initializing sync..." />
    );
  }

  const getColor = () => {
    if (!syncStatus.isOnline) return 'bg-red-500';
    if (syncStatus.isSyncing) return 'bg-yellow-500 animate-pulse';
    if (syncStatus.errorCount > 0) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getTitle = () => {
    if (!syncStatus.isOnline) return 'Offline - changes will sync when online';
    if (syncStatus.isSyncing) return 'Syncing changes...';
    if (syncStatus.errorCount > 0) return `${syncStatus.errorCount} sync errors`;
    if (syncStatus.pendingCount > 0) return `${syncStatus.pendingCount} changes pending`;
    return 'All changes synced';
  };

  return (
    <div className={`w-3 h-3 rounded-full ${getColor()} ${className}`} 
         title={getTitle()} />
  );
}

/**
 * Detailed sync dashboard component
 */
export function SyncDashboard({ className = '' }: { className?: string }) {
  const { isInitialized, syncStatus, forceSync } = useECESync();

  if (!isInitialized) {
    return (
      <div className={`sync-dashboard ${className}`}>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sync-dashboard ${className}`}>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sync Status
          </h3>
          <SyncIndicator />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-500 dark:text-gray-400">Connection</div>
            <div className={`font-medium ${syncStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {syncStatus.pendingCount} events
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-500 dark:text-gray-400">Errors</div>
            <div className={`font-medium ${syncStatus.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {syncStatus.errorCount}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-500 dark:text-gray-400">Last Sync</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleTimeString() : 'Never'}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={forceSync}
            disabled={syncStatus.isSyncing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncStatus.isSyncing ? 'Syncing...' : 'Force Sync'}
          </button>
          
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500">
            Settings
          </button>
        </div>

        {syncStatus.websocketConnected !== undefined && (
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            WebSocket: {syncStatus.websocketConnected ? 'Connected' : 'Disconnected'}
          </div>
        )}
      </div>
    </div>
  );
}

export default SyncStatus;
