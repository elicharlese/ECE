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

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
