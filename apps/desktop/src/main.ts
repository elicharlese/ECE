import { app, BrowserWindow, Menu, ipcMain, shell, dialog, Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

const isDev = process.env.NODE_ENV === 'development';

class ECEDesktop {
  private mainWindow: BrowserWindow | null = null;
  private db: sqlite3.Database | null = null;
  private autoTradingActive = false;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    await app.whenReady();
    this.createWindow();
    this.setupDatabase();
    this.setupIPCHandlers();
    this.setupAutoUpdater();
    this.setupGlobalShortcuts();
  }

  private setupDatabase(): void {
    const dbPath = path.join(app.getPath('userData'), 'ece_desktop.db');
    this.db = new sqlite3.Database(dbPath);
    
    // Create tables
    this.db.run(`CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id TEXT UNIQUE,
      name TEXT,
      rarity TEXT,
      price REAL,
      quantity INTEGER,
      synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    this.db.run(`CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trade_id TEXT UNIQUE,
      from_user TEXT,
      to_user TEXT,
      cards TEXT,
      status TEXT,
      synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }

  private setupIPCHandlers(): void {
    // Window controls
    ipcMain.handle('window-minimize', () => {
      this.mainWindow?.minimize();
      return { success: true };
    });
    
    ipcMain.handle('window-maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
      return { success: true };
    });
    
    ipcMain.handle('close-window', () => {
      this.mainWindow?.close();
      return { success: true };
    });

    // Web app launcher
    ipcMain.handle('open-web-app', () => {
      this.openWebApp();
      return { success: true };
    });
    
    // Trading features
    ipcMain.handle('start-auto-trading', (_event, config) => {
      this.autoTradingActive = true;
      console.log('Starting auto-trading with config:', config);
      return { success: true, status: 'active' };
    });
    
    ipcMain.handle('stop-auto-trading', () => {
      this.autoTradingActive = false;
      console.log('Stopping auto-trading');
      return { success: true, status: 'stopped' };
    });
  }

  private setupAutoUpdater(): void {
    autoUpdater.checkForUpdatesAndNotify();
    
    autoUpdater.on('update-available', () => {
      console.log('Update available');
    });
    
    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded');
      this.mainWindow?.webContents.send('update-downloaded', info);
    });
    
    ipcMain.handle('check-for-updates', () => {
      autoUpdater.checkForUpdatesAndNotify();
      return { success: true };
    });
    
    ipcMain.handle('install-update', () => {
      autoUpdater.quitAndInstall();
      return { success: true };
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      show: false,
      ...(process.platform === 'darwin' && { 
        vibrancy: 'sidebar',
        titleBarStyle: 'hiddenInset'
      }),
      ...(process.platform === 'win32' && {
        backgroundMaterial: 'acrylic'
      })
    });

    // Load the React app
    if (isDev) {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../dist/renderer/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      this.startPeriodicSync();
    });

    // Set up menu
    this.createMenu();

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle window state changes
    this.mainWindow.on('maximize', () => {
      this.mainWindow?.webContents.send('window-state-changed', 'maximized');
    });

    this.mainWindow.on('unmaximize', () => {
      this.mainWindow?.webContents.send('window-state-changed', 'normal');
    });

    this.mainWindow.on('minimize', () => {
      this.mainWindow?.webContents.send('window-state-changed', 'minimized');
    });
  }

  private openWebApp(): void {
    shell.openExternal('http://localhost:3000');
  }

  private startPeriodicSync(): void {
    setInterval(() => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('sync-requested');
      }
    }, 5 * 60 * 1000);
  }

  private createMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Collection',
            accelerator: 'CmdOrCtrl+N',
            click: () => console.log('New Collection')
          },
          {
            label: 'Import Cards',
            accelerator: 'CmdOrCtrl+I',
            click: () => console.log('Import Cards')
          },
          { type: 'separator' },
          {
            label: 'Exit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => app.quit()
          }
        ]
      },
      {
        label: 'Platform',
        submenu: [
          {
            label: 'Open M&A Trading Platform',
            accelerator: 'CmdOrCtrl+W',
            click: () => this.openWebApp()
          },
          {
            label: 'Sync Data',
            accelerator: 'CmdOrCtrl+S',
            click: () => console.log('Sync Data')
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupGlobalShortcuts(): void {
    const { globalShortcut } = require('electron');
    
    const shortcuts = [
      { accelerator: 'CommandOrControl+Shift+W', action: 'open-web-app' },
      { accelerator: 'CommandOrControl+Shift+S', action: 'quick-sync' },
      { accelerator: 'CommandOrControl+Shift+M', action: 'show-main' }
    ];

    shortcuts.forEach(({ accelerator, action }) => {
      const success = globalShortcut.register(accelerator, () => {
        console.log('Global shortcut triggered:', action);
        switch(action) {
          case 'open-web-app':
            this.openWebApp();
            break;
          case 'quick-sync':
            console.log('Quick sync triggered');
            break;
          case 'show-main':
            this.mainWindow?.show();
            break;
        }
      });

      if (!success) {
        console.log(`Failed to register global shortcut: ${accelerator}`);
      } else {
        console.log(`Registered global shortcut: ${accelerator}`);
      }
    });
  }
}

// Initialize the app
new ECEDesktop();

// Handle app events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new ECEDesktop();
  }
});
