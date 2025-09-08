import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  // Window controls
  windowMinimize: () => Promise<{ success: boolean }>;
  windowMaximize: () => Promise<{ success: boolean }>;
  closeWindow: () => Promise<{ success: boolean }>;
  
  // App functionality
  openWebApp: () => Promise<{ success: boolean }>;
  
  // Trading
  startAutoTrading: (config: any) => Promise<{ success: boolean; status: string }>;
  stopAutoTrading: () => Promise<{ success: boolean; status: string }>;
  
  // Updates
  checkForUpdates: () => Promise<{ success: boolean }>;
  installUpdate: () => Promise<{ success: boolean }>;
  
  // Event listeners
  onUpdateDownloaded: (callback: (info: any) => void) => void;
  onSyncRequested: (callback: () => void) => void;
  onWindowStateChanged: (callback: (state: string) => void) => void;
  
  // Remove listeners
  removeAllListeners: (channel: string) => void;
}

const electronAPI: ElectronAPI = {
  // Window controls
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // App functionality
  openWebApp: () => ipcRenderer.invoke('open-web-app'),
  
  // Trading
  startAutoTrading: (config) => ipcRenderer.invoke('start-auto-trading', config),
  stopAutoTrading: () => ipcRenderer.invoke('stop-auto-trading'),
  
  // Updates
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  
  // Event listeners
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (_event, info) => callback(info)),
  onSyncRequested: (callback) => ipcRenderer.on('sync-requested', callback),
  onWindowStateChanged: (callback) => ipcRenderer.on('window-state-changed', (_event, state) => callback(state)),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
