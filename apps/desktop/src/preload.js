const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  appReady: () => ipcRenderer.invoke('app-ready'),
  
  // Data export functionality
  onExportData: (callback) => ipcRenderer.on('export-data', callback),
  
  // Platform detection
  platform: process.platform,
  
  // Notification API
  showNotification: (title, body) => {
    new Notification(title, { body });
  }
});

// Remove this if your app does not use auto-updater
contextBridge.exposeInMainWorld('updater', {
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback)
});
