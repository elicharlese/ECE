const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App management
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  appReady: () => ipcRenderer.invoke('app-ready'),
  openWebApp: () => ipcRenderer.invoke('open-web-app'),
  
  // Data operations
  onExportData: (callback) => ipcRenderer.on('export-data', callback),
  exportToFile: (data, filename) => ipcRenderer.invoke('export-to-file', data, filename),
  importFromFile: () => ipcRenderer.invoke('import-from-file'),
  
  // Database operations (offline mode)
  saveDataLocally: (data) => ipcRenderer.invoke('save-local-data', data),
  loadLocalData: () => ipcRenderer.invoke('load-local-data'),
  syncWithCloud: () => ipcRenderer.invoke('sync-with-cloud'),
  
  // Enhanced offline operations
  addCardOffline: (card) => ipcRenderer.invoke('add-card-offline', card),
  getOfflineCards: () => ipcRenderer.invoke('get-offline-cards'),
  syncPendingTrades: () => ipcRenderer.invoke('sync-pending-trades'),
  getSyncStatus: () => ipcRenderer.invoke('get-sync-status'),
  
  // Platform detection
  platform: process.platform,
  
  // System integration
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
  setAppBadge: (count) => ipcRenderer.invoke('set-app-badge', count),
  openExternalLink: (url) => ipcRenderer.invoke('open-external', url),
  
  // Native desktop features
  registerGlobalShortcut: (accelerator, action) => ipcRenderer.invoke('register-global-shortcut', accelerator, action),
  unregisterAllShortcuts: () => ipcRenderer.invoke('unregister-all-shortcuts'),
  
  // Window management
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Analytics window
  openAnalytics: () => ipcRenderer.invoke('open-analytics'),
  closeAnalytics: () => ipcRenderer.invoke('close-analytics'),
  onGenerateReport: (callback) => ipcRenderer.on('generate-report', callback),
  onExportAnalytics: (callback) => ipcRenderer.on('export-analytics', callback),
  
  // Trading-specific features
  startAutoTrading: (config) => ipcRenderer.invoke('start-auto-trading', config),
  stopAutoTrading: () => ipcRenderer.invoke('stop-auto-trading'),
  onTradeNotification: (callback) => ipcRenderer.on('trade-notification', callback),
  
  // Portfolio analytics
  generateAnalyticsReport: () => ipcRenderer.invoke('generate-analytics-report'),
  scheduleDataBackup: (schedule) => ipcRenderer.invoke('schedule-backup', schedule),
  
  // Security features
  enableBiometricAuth: () => ipcRenderer.invoke('enable-biometric-auth'),
  lockApp: () => ipcRenderer.invoke('lock-app'),
  
  // Splash and auth flow
  splashComplete: () => ipcRenderer.invoke('splash-complete'),
  authComplete: (userData) => ipcRenderer.invoke('auth-complete', userData)
});

// Auto-updater functionality
contextBridge.exposeInMainWorld('updater', {
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  installUpdate: () => ipcRenderer.invoke('install-update')
});

// Desktop-specific feature detection
contextBridge.exposeInMainWorld('desktopFeatures', {
  hasMultiMonitorSupport: true,
  hasNativeNotifications: true,
  hasFileSystemAccess: true,
  hasAutoUpdater: true,
  hasOfflineMode: true,
  hasGlobalShortcuts: true,
  hasSystemIntegration: true,
  supportedExportFormats: ['json', 'csv', 'pdf', 'xlsx'],
  platform: process.platform,
  architecture: process.arch
});
