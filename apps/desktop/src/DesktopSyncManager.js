/**
 * Desktop Sync Integration for ECE Trading Cards
 * Integrates ECE Sync Service with Electron desktop app
 */

const { DesktopSyncAdapter } = require('../../libs/shared-business-logic/src/lib/sync/DesktopSyncAdapter');

class DesktopSyncManager {
  constructor(mainWindow, database) {
    this.mainWindow = mainWindow;
    this.db = database;
    this.syncAdapter = null;
    this.isInitialized = false;
    this.syncTimer = null;
  }

  async initialize() {
    try {
      console.log('🔄 Initializing Desktop Sync Manager...');
      
      // Initialize sync adapter
      this.syncAdapter = new DesktopSyncAdapter();
      await this.syncAdapter.initialize();
      
      // Set up sync event handlers
      this.setupEventHandlers();
      
      // Start periodic sync
      this.startPeriodicSync();
      
      this.isInitialized = true;
      console.log('✅ Desktop Sync Manager initialized');
      
      // Notify renderer about sync status
      this.sendSyncStatus();
      
    } catch (error) {
      console.error('❌ Failed to initialize Desktop Sync Manager:', error);
      throw error;
    }
  }

  setupEventHandlers() {
    // Handle sync events from other platforms
    this.syncAdapter.onSyncEvent((event) => {
      console.log('📡 Received sync event:', event.type);
      
      // Update local database based on sync event
      this.handleSyncEvent(event);
      
      // Notify renderer about the update
      this.mainWindow.webContents.send('sync-event', event);
      
      // Show desktop notification for important events
      this.showSyncNotification(event);
    });

    // Handle sync status changes
    this.syncAdapter.onStatusChange((status) => {
      console.log('🔄 Sync status changed:', status);
      this.sendSyncStatus();
    });
  }

  async handleSyncEvent(event) {
    switch (event.type) {
      case 'trade':
        await this.syncTrade(event.data);
        break;
      case 'card_update':
        await this.syncCardUpdate(event.data);
        break;
      case 'portfolio_change':
        await this.syncPortfolioChange(event.data);
        break;
      case 'market_update':
        await this.syncMarketUpdate(event.data);
        break;
    }
  }

  async syncTrade(tradeData) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO trades 
        (trade_id, type, card_id, quantity, price, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        tradeData.id,
        tradeData.type,
        tradeData.cardId,
        tradeData.quantity,
        tradeData.price,
        tradeData.status,
        new Date().toISOString()
      );
      
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async syncCardUpdate(cardData) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO cards 
        (card_id, name, rarity, price, owned_quantity, last_sync)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        cardData.id,
        cardData.name,
        cardData.rarity,
        cardData.price,
        cardData.ownedQuantity || 0,
        new Date().toISOString()
      );
      
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async syncPortfolioChange(portfolioData) {
    // Record portfolio change in analytics
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO analytics (metric_name, metric_value, recorded_at)
        VALUES (?, ?, ?)
      `);
      
      stmt.run(
        'portfolio_sync',
        JSON.stringify(portfolioData),
        new Date().toISOString()
      );
      
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async syncMarketUpdate(marketData) {
    // Record market update in analytics
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO analytics (metric_name, metric_value, recorded_at)
        VALUES (?, ?, ?)
      `);
      
      stmt.run(
        'market_sync',
        JSON.stringify(marketData),
        new Date().toISOString()
      );
      
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  showSyncNotification(event) {
    const { Notification } = require('electron');
    
    const notificationMessages = {
      trade: '💰 New trade synchronized',
      card_update: '🃏 Card data updated',
      portfolio_change: '📊 Portfolio synchronized',
      market_update: '📈 Market data refreshed'
    };

    const message = notificationMessages[event.type] || '🔄 Data synchronized';
    
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: 'ECE Trading Cards',
        body: message,
        icon: path.join(__dirname, '../assets/icon.png'),
        silent: false
      });

      notification.on('click', () => {
        this.mainWindow.focus();
      });

      notification.show();
    }
  }

  sendSyncStatus() {
    if (this.syncAdapter && this.mainWindow) {
      const status = this.syncAdapter.getSyncStatus();
      this.mainWindow.webContents.send('sync-status', status);
    }
  }

  startPeriodicSync() {
    // Sync every 30 seconds
    this.syncTimer = setInterval(async () => {
      if (this.syncAdapter) {
        try {
          await this.syncAdapter.sync();
        } catch (error) {
          console.error('Periodic sync failed:', error);
        }
      }
    }, 30000);
  }

  async manualSync() {
    if (this.syncAdapter) {
      try {
        console.log('🔄 Starting manual sync...');
        await this.syncAdapter.sync();
        console.log('✅ Manual sync completed');
        
        // Show success notification
        this.showSyncNotification({ type: 'manual_sync' });
        
        return { success: true };
      } catch (error) {
        console.error('❌ Manual sync failed:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'Sync not initialized' };
  }

  setupIPCHandlers(ipcMain) {
    // Get sync status
    ipcMain.handle('get-sync-status', () => {
      if (this.syncAdapter) {
        return this.syncAdapter.getSyncStatus();
      }
      return null;
    });

    // Force manual sync
    ipcMain.handle('force-sync', async () => {
      return await this.manualSync();
    });

    // Sync specific data types
    ipcMain.handle('sync-trade', async (event, tradeData) => {
      if (this.syncAdapter) {
        await this.syncAdapter.syncTrade(tradeData);
        return { success: true };
      }
      return { success: false };
    });

    ipcMain.handle('sync-card-update', async (event, cardData) => {
      if (this.syncAdapter) {
        await this.syncAdapter.syncCardUpdate(cardData);
        return { success: true };
      }
      return { success: false };
    });

    ipcMain.handle('sync-portfolio-change', async (event, portfolioData) => {
      if (this.syncAdapter) {
        await this.syncAdapter.syncPortfolioChange(portfolioData);
        return { success: true };
      }
      return { success: false };
    });
  }

  cleanup() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    
    if (this.syncAdapter) {
      this.syncAdapter.cleanup();
      this.syncAdapter = null;
    }
    
    this.isInitialized = false;
  }
}

module.exports = DesktopSyncManager;
