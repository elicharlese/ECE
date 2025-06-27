/**
 * Mobile Sync Status Component
 * Shows real-time sync status in the mobile app
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

interface SyncStatusProps {
  status: {
    isOnline: boolean;
    isSyncing: boolean;
    pendingCount: number;
    errorCount: number;
    lastSync: number;
  };
  onRetrySync: () => void;
  compact?: boolean;
}

const MobileSyncStatus: React.FC<SyncStatusProps> = ({
  status,
  onRetrySync,
  compact = false,
}) => {
  const getStatusColor = () => {
    if (!status.isOnline) return '#FD5C63'; // Red for offline
    if (status.isSyncing) return '#66D9EF'; // Blue for syncing
    if (status.errorCount > 0) return '#F92672'; // Pink for errors
    if (status.pendingCount > 0) return '#E6DB74'; // Yellow for pending
    return '#3EBA7C'; // Green for synced
  };

  const getStatusText = () => {
    if (!status.isOnline) return 'Offline';
    if (status.isSyncing) return 'Syncing...';
    if (status.errorCount > 0) return `${status.errorCount} errors`;
    if (status.pendingCount > 0) return `${status.pendingCount} pending`;
    return 'Synced';
  };

  const formatLastSync = () => {
    if (!status.lastSync) return 'Never';
    const now = Date.now();
    const diff = now - status.lastSync;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { borderLeftColor: getStatusColor() }]}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.compactText}>{getStatusText()}</Text>
        {(status.errorCount > 0 || status.pendingCount > 0) && (
          <TouchableOpacity onPress={onRetrySync} style={styles.retryButton}>
            <Text style={styles.retryText}>↻</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.title}>Sync Status</Text>
        </View>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Connection:</Text>
          <Text style={[styles.value, { color: status.isOnline ? '#3EBA7C' : '#FD5C63' }]}>
            {status.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Last Sync:</Text>
          <Text style={styles.value}>{formatLastSync()}</Text>
        </View>

        {status.pendingCount > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Pending:</Text>
            <Text style={[styles.value, { color: '#E6DB74' }]}>
              {status.pendingCount} changes
            </Text>
          </View>
        )}

        {status.errorCount > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Errors:</Text>
            <Text style={[styles.value, { color: '#F92672' }]}>
              {status.errorCount} failed
            </Text>
          </View>
        )}
      </View>

      {(status.errorCount > 0 || status.pendingCount > 0) && (
        <TouchableOpacity onPress={onRetrySync} style={styles.actionButton}>
          <Text style={styles.actionText}>Retry Sync</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(248, 239, 214, 0.05)',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: 'rgba(249, 38, 114, 0.1)',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 239, 214, 0.05)',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8EFD6',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#75715E',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#75715E',
  },
  value: {
    fontSize: 14,
    color: '#F8EFD6',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#F92672',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#F8EFD6',
    fontSize: 14,
    fontWeight: '600',
  },
  compactText: {
    fontSize: 12,
    color: '#F8EFD6',
    marginLeft: 6,
    flex: 1,
  },
  retryButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 38, 114, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#F92672',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MobileSyncStatus;
