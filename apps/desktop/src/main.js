const { app, BrowserWindow, Menu, ipcMain, shell, dialog, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const isDev = process.env.NODE_ENV === 'development';

class ECEDesktop {
  constructor() {
    this.mainWindow = null;
    this.analyticsWindow = null;
    this.db = null;
    this.autoTradingActive = false;
    this.init();
  }

  init() {
    app.whenReady().then(() => {
      this.createWindow();
      this.setupDatabase();
      this.setupIPCHandlers();
    });
    
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    // Auto-updater events
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify();
      this.setupAutoUpdater();
    }
  }

  setupDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'ece-data.db');
    this.db = new sqlite3.Database(dbPath);
    
    // Create tables for offline data storage
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_id TEXT UNIQUE,
        name TEXT,
        rarity TEXT,
        price REAL,
        owned_quantity INTEGER,
        last_sync DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      this.db.run(`CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trade_id TEXT UNIQUE,
        type TEXT,
        card_id TEXT,
        quantity INTEGER,
        price REAL,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      this.db.run(`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        metric_name TEXT,
        metric_value TEXT,
        recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    });
  }

  setupIPCHandlers() {
    // App management
    ipcMain.handle('get-app-version', () => app.getVersion());
    ipcMain.handle('app-ready', () => console.log('Desktop app ready'));
    ipcMain.handle('open-web-app', () => shell.openExternal('https://ece-platform.vercel.app'));
    
    // File operations
    ipcMain.handle('export-to-file', async (event, data, filename) => {
      const { filePath } = await dialog.showSaveDialog(this.mainWindow, {
        defaultPath: filename,
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'CSV Files', extensions: ['csv'] },
          { name: 'Excel Files', extensions: ['xlsx'] }
        ]
      });
      
      if (filePath) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return { success: true, path: filePath };
      }
      return { success: false };
    });
    
    ipcMain.handle('import-from-file', async () => {
      const { filePaths } = await dialog.showOpenDialog(this.mainWindow, {
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile']
      });
      
      if (filePaths.length > 0) {
        const data = fs.readFileSync(filePaths[0], 'utf8');
        return { success: true, data: JSON.parse(data) };
      }
      return { success: false };
    });
    
    // Database operations
    ipcMain.handle('save-local-data', (event, data) => {
      return new Promise((resolve, reject) => {
        const stmt = this.db.prepare("INSERT OR REPLACE INTO cards (card_id, name, rarity, price, owned_quantity) VALUES (?, ?, ?, ?, ?)");
        data.forEach(card => {
          stmt.run(card.id, card.name, card.rarity, card.price, card.quantity);
        });
        stmt.finalize((err) => {
          if (err) reject(err);
          else resolve({ success: true });
        });
      });
    });
    
    ipcMain.handle('load-local-data', () => {
      return new Promise((resolve, reject) => {
        this.db.all("SELECT * FROM cards", (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    });
    
    ipcMain.handle('sync-with-cloud', async () => {
      return await this.performAutoSync();
    });

    // Enhanced offline operations
    ipcMain.handle('add-card-offline', async (event, card) => {
      return await this.addCard(card);
    });

    ipcMain.handle('get-offline-cards', async () => {
      return await this.getOfflineCards();
    });

    ipcMain.handle('sync-pending-trades', async () => {
      return await this.syncPendingTrades();
    });

    ipcMain.handle('get-sync-status', () => {
      return {
        last_sync: new Date().toISOString(),
        offline_mode: true,
        pending_uploads: 0 // Would be calculated from DB
      };
    });
    
    // System integration
    ipcMain.handle('show-notification', (event, title, body) => {
      const notification = new Notification({ title, body });
      notification.show();
      
      // Handle notification click
      notification.on('click', () => {
        if (this.mainWindow) {
          this.mainWindow.show();
          this.mainWindow.focus();
        }
      });
      
      return { success: true };
    });
    
    ipcMain.handle('set-app-badge', (event, count) => {
      if (process.platform === 'darwin') {
        app.dock.setBadge(count.toString());
      }
      return { success: true };
    });

    // Native desktop features
    ipcMain.handle('register-global-shortcut', (event, accelerator, action) => {
      const { globalShortcut } = require('electron');
      
      const success = globalShortcut.register(accelerator, () => {
        console.log('Global shortcut triggered:', action);
        if (this.mainWindow) {
          switch(action) {
            case 'show-analytics':
              this.createAnalyticsWindow();
              break;
            case 'quick-sync':
              this.performAutoSync();
              break;
            case 'show-main':
              this.mainWindow.show();
              this.mainWindow.focus();
              break;
          }
        }
      });
      
      return { success, registered: accelerator };
    });

    ipcMain.handle('unregister-all-shortcuts', () => {
      const { globalShortcut } = require('electron');
      globalShortcut.unregisterAll();
      return { success: true };
    });
    
    ipcMain.handle('open-external', (event, url) => {
      shell.openExternal(url);
      return { success: true };
    });
    
    // Window management
    ipcMain.handle('minimize-window', () => {
      this.mainWindow.minimize();
      return { success: true };
    });
    
    ipcMain.handle('maximize-window', () => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow.maximize();
      }
      return { success: true };
    });
    
    ipcMain.handle('close-window', () => {
      this.mainWindow.close();
      return { success: true };
    });

    // Analytics window
    ipcMain.handle('open-analytics', () => {
      this.createAnalyticsWindow();
      return { success: true };
    });

    ipcMain.handle('close-analytics', () => {
      if (this.analyticsWindow) {
        this.analyticsWindow.close();
        this.analyticsWindow = null;
      }
      return { success: true };
    });
    
    // Trading features
    ipcMain.handle('start-auto-trading', (event, config) => {
      this.autoTradingActive = true;
      console.log('Starting auto-trading with config:', config);
      // Implement auto-trading logic
      return { success: true, status: 'active' };
    });
    
    ipcMain.handle('stop-auto-trading', () => {
      this.autoTradingActive = false;
      console.log('Stopping auto-trading');
      return { success: true, status: 'stopped' };
    });
    
    // Analytics
    ipcMain.handle('generate-analytics-report', () => {
      return new Promise((resolve, reject) => {
        this.db.all("SELECT * FROM analytics WHERE recorded_at > datetime('now', '-30 days')", (err, rows) => {
          if (err) reject(err);
          else {
            const report = {
              period: '30 days',
              metrics: rows,
              generated_at: new Date().toISOString()
            };
            resolve(report);
          }
        });
      });
    });
    
    ipcMain.handle('schedule-backup', (event, schedule) => {
      console.log('Scheduling backup:', schedule);
      // Implement backup scheduling
      return { success: true, next_backup: new Date() };
    });
    
    // Security
    ipcMain.handle('enable-biometric-auth', () => {
      // Implement biometric authentication
      console.log('Biometric auth not yet implemented');
      return { success: false, reason: 'Not implemented' };
    });
    
    ipcMain.handle('lock-app', () => {
      // Implement app locking
      console.log('App locking not yet implemented');
      return { success: false, reason: 'Not implemented' };
    });
  }

  setupAutoUpdater() {
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...');
    });
    
    autoUpdater.on('update-available', (info) => {
      console.log('Update available.');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-available', info);
      }
    });
    
    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available.');
    });
    
    autoUpdater.on('error', (err) => {
      console.log('Error in auto-updater. ' + err);
    });
    
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
      log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
      console.log(log_message);
    });
    
    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-downloaded', info);
      }
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

  createWindow() {
    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'hiddenInset',
      show: false,
      vibrancy: 'dark', // macOS vibrancy effect
      backgroundMaterial: 'acrylic' // Windows acrylic effect
    });

    // Load the desktop app
    if (isDev) {
      // In development, load the web app from localhost
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      // In production, load our desktop-specific HTML
      this.mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      
      // Set up periodic sync
      this.startPeriodicSync();
      
      // Register global shortcuts
      this.setupGlobalShortcuts();
    });

    // Set up menu
    this.createMenu();

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle window state changes
    this.mainWindow.on('maximize', () => {
      this.mainWindow.webContents.send('window-state-changed', 'maximized');
    });

    this.mainWindow.on('unmaximize', () => {
      this.mainWindow.webContents.send('window-state-changed', 'normal');
    });

    this.mainWindow.on('minimize', () => {
      this.mainWindow.webContents.send('window-state-changed', 'minimized');
    });
  }

  createAnalyticsWindow() {
    if (this.analyticsWindow) {
      this.analyticsWindow.focus();
      return;
    }

    this.analyticsWindow = new BrowserWindow({
      width: 1600,
      height: 1000,
      minWidth: 1400,
      minHeight: 900,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'hiddenInset',
      show: false,
      vibrancy: 'dark',
      backgroundMaterial: 'acrylic',
      parent: this.mainWindow,
      modal: false
    });

    // Load analytics dashboard
    this.analyticsWindow.loadFile(path.join(__dirname, 'analytics.html'));

    this.analyticsWindow.once('ready-to-show', () => {
      this.analyticsWindow.show();
    });

    this.analyticsWindow.on('closed', () => {
      this.analyticsWindow = null;
    });
  }

  startPeriodicSync() {
    // Sync with cloud every 5 minutes
    setInterval(() => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('sync-requested');
      }
    }, 5 * 60 * 1000);
  }

  createMenu() {
    const template = [
      {
        label: 'ECE Trading Cards',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Export Data',
            accelerator: 'CmdOrCtrl+E',
            click: () => this.exportData()
          },
          { type: 'separator' },
          { role: 'close' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'actualSize' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Analytics',
        submenu: [
          {
            label: 'Open Analytics Dashboard',
            accelerator: 'CmdOrCtrl+A',
            click: () => this.createAnalyticsWindow()
          },
          {
            label: 'Generate Report',
            accelerator: 'CmdOrCtrl+R',
            click: () => this.generateReport()
          },
          { type: 'separator' },
          {
            label: 'Export Analytics',
            click: () => this.exportAnalytics()
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

  exportData() {
    // Send message to renderer process to handle data export
    if (this.mainWindow) {
      this.mainWindow.webContents.send('export-data');
    }
  }

  generateReport() {
    // Generate analytics report
    if (this.analyticsWindow) {
      this.analyticsWindow.webContents.send('generate-report');
    } else {
      this.createAnalyticsWindow();
      setTimeout(() => {
        if (this.analyticsWindow) {
          this.analyticsWindow.webContents.send('generate-report');
        }
      }, 1000);
    }
  }

  exportAnalytics() {
    // Export analytics data
    if (this.analyticsWindow) {
      this.analyticsWindow.webContents.send('export-analytics');
    } else if (this.mainWindow) {
      this.mainWindow.webContents.send('export-analytics');
    }
  }

  setupGlobalShortcuts() {
    const { globalShortcut } = require('electron');
    
    // Register common shortcuts
    const shortcuts = [
      { accelerator: 'CommandOrControl+Shift+A', action: 'show-analytics' },
      { accelerator: 'CommandOrControl+Shift+S', action: 'quick-sync' },
      { accelerator: 'CommandOrControl+Shift+M', action: 'show-main' }
    ];
    
    shortcuts.forEach(({ accelerator, action }) => {
      const success = globalShortcut.register(accelerator, () => {
        console.log('Global shortcut triggered:', action);
        switch(action) {
          case 'show-analytics':
            this.createAnalyticsWindow();
            break;
          case 'quick-sync':
            this.performAutoSync().then(result => {
              if (this.mainWindow) {
                this.mainWindow.webContents.send('sync-completed', result);
              }
            });
            break;
          case 'show-main':
            if (this.mainWindow) {
              this.mainWindow.show();
              this.mainWindow.focus();
            }
            break;
        }
      });
      
      if (success) {
        console.log('Registered global shortcut:', accelerator);
      } else {
        console.log('Failed to register global shortcut:', accelerator);
      }
    });
  }

  // Enhanced offline storage methods
  async addCard(card) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO cards (card_id, name, rarity, price, owned_quantity, last_sync) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      stmt.run(card.id, card.name, card.rarity, card.price, card.quantity, (err) => {
        if (err) reject(err);
        else {
          console.log('Card saved offline:', card.name);
          resolve({ success: true, card_id: card.id });
        }
      });
      stmt.finalize();
    });
  }

  async getOfflineCards() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM cards ORDER BY last_sync DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async syncPendingTrades() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM trades WHERE status = 'pending'", (err, rows) => {
        if (err) reject(err);
        else {
          console.log(`Found ${rows.length} pending trades to sync`);
          // Here you would sync with the cloud API
          resolve({ synced: rows.length, failed: 0 });
        }
      });
    });
  }

  // Auto-sync with conflict resolution
  async performAutoSync() {
    try {
      // Get local data that needs syncing
      const localCards = await this.getOfflineCards();
      const pendingTrades = await this.syncPendingTrades();
      
      // Mock cloud sync - in real app, this would call your API
      console.log('Auto-sync: Cards to upload:', localCards.length);
      console.log('Auto-sync: Trades to sync:', pendingTrades.synced);
      
      // Record sync analytics
      this.recordAnalytics('sync_completed', {
        cards_synced: localCards.length,
        trades_synced: pendingTrades.synced,
        timestamp: Date.now()
      });
      
      return { success: true, cards: localCards.length, trades: pendingTrades.synced };
    } catch (error) {
      console.error('Auto-sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  recordAnalytics(metric_name, metric_value) {
    const stmt = this.db.prepare("INSERT INTO analytics (metric_name, metric_value) VALUES (?, ?)");
    stmt.run(metric_name, JSON.stringify(metric_value));
    stmt.finalize();
  }

  // ...existing code...
}

// Initialize the application
new ECEDesktop();
