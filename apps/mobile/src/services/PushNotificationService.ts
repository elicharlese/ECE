/**
 * Push Notification Service for ECE Mobile
 * Handles local and remote push notifications for trading alerts, market updates, and social features
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import MobileNativeService from './MobileNativeService';

export interface NotificationConfig {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
  category?: string;
  priority?: 'low' | 'normal' | 'high';
  vibrate?: boolean;
  lights?: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  tradingAlerts: boolean;
  marketUpdates: boolean;
  socialNotifications: boolean;
  priceAlerts: boolean;
  auctionNotifications: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string;   // HH:MM format
  };
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface ScheduledNotification {
  id: string;
  config: NotificationConfig;
  scheduledTime: number;
  type: 'local' | 'reminder';
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private nativeService: MobileNativeService;
  private readonly SETTINGS_KEY = '@ECE:NotificationSettings';
  private readonly SCHEDULED_KEY = '@ECE:ScheduledNotifications';
  private isInitialized = false;

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  constructor() {
    this.nativeService = MobileNativeService.getInstance();
  }

  /**
   * Initialize push notification service
   */
  public async initialize(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (hasPermission) {
        await this.loadScheduledNotifications();
        this.isInitialized = true;
        console.log('✅ PushNotificationService initialized successfully');
        return true;
      } else {
        console.log('⚠️ Push notification permissions denied');
        return false;
      }
    } catch (error) {
      console.error('❌ PushNotificationService initialization failed:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // iOS: Request permission through Settings app or show alert
        Alert.alert(
          'Enable Notifications',
          'Allow ECE to send you trading alerts and market updates?',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Enable', onPress: () => this.updateSettings({ enabled: true }) }
          ]
        );
        return true; // Mock permission granted
      } else {
        // Android: Notifications are enabled by default in modern versions
        return true;
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  // ==================== TRADING NOTIFICATIONS ====================

  /**
   * Send trade completion notification
   */
  public async notifyTradeCompleted(tradeData: any): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.tradingAlerts) return;

    await this.sendLocalNotification({
      id: `trade_${tradeData.tradeId}`,
      title: '🎉 Trade Completed!',
      body: `Your trade for ${tradeData.cardName} has been completed`,
      data: { type: 'trade', tradeId: tradeData.tradeId },
      category: 'trading',
      priority: 'high'
    });

    this.nativeService.triggerTradeSuccessHaptic();
  }

  /**
   * Send trade request notification
   */
  public async notifyTradeRequest(tradeData: any): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.tradingAlerts) return;

    await this.sendLocalNotification({
      id: `trade_request_${tradeData.tradeId}`,
      title: '📨 New Trade Request',
      body: `${tradeData.fromUser} wants to trade for your ${tradeData.cardName}`,
      data: { type: 'trade_request', tradeId: tradeData.tradeId },
      category: 'social',
      priority: 'normal'
    });

    this.nativeService.triggerHaptic('impactMedium');
  }

  /**
   * Send price alert notification
   */
  public async notifyPriceAlert(cardData: any): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.priceAlerts) return;

    const priceChange = cardData.currentPrice > cardData.targetPrice ? '📈' : '📉';
    
    await this.sendLocalNotification({
      id: `price_alert_${cardData.cardId}`,
      title: `${priceChange} Price Alert`,
      body: `${cardData.cardName} is now $${cardData.currentPrice}`,
      data: { type: 'price_alert', cardId: cardData.cardId },
      category: 'market',
      priority: 'normal'
    });
  }

  /**
   * Send auction ending notification
   */
  public async notifyAuctionEnding(auctionData: any): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.auctionNotifications) return;

    await this.sendLocalNotification({
      id: `auction_${auctionData.auctionId}`,
      title: '⏰ Auction Ending Soon',
      body: `${auctionData.cardName} auction ends in ${auctionData.timeRemaining}`,
      data: { type: 'auction', auctionId: auctionData.auctionId },
      category: 'market',
      priority: 'high'
    });
  }

  // ==================== MARKET NOTIFICATIONS ====================

  /**
   * Send market update notification
   */
  public async notifyMarketUpdate(marketData: any): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.marketUpdates) return;

    await this.sendLocalNotification({
      id: `market_${Date.now()}`,
      title: '📊 Market Update',
      body: `${marketData.trendingCard} is trending with ${marketData.priceChange}% change`,
      data: { type: 'market_update', ...marketData },
      category: 'market',
      priority: 'low'
    });
  }

  /**
   * Send daily market summary
   */
  public async scheduleDailyMarketSummary(): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.marketUpdates) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM

    await this.scheduleNotification({
      id: `daily_summary_${tomorrow.getTime()}`,
      title: '📈 Daily Market Summary',
      body: 'Check out today\'s trending cards and market insights',
      data: { type: 'daily_summary' },
      category: 'market',
      priority: 'low'
    }, tomorrow.getTime());
  }

  // ==================== SOCIAL NOTIFICATIONS ====================

  /**
   * Send friend request notification
   */
  public async notifyFriendRequest(userData: any): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.socialNotifications) return;

    await this.sendLocalNotification({
      id: `friend_request_${userData.userId}`,
      title: '👤 New Friend Request',
      body: `${userData.username} wants to connect with you`,
      data: { type: 'friend_request', userId: userData.userId },
      category: 'social',
      priority: 'normal'
    });
  }

  /**
   * Send collection showcase notification
   */
  public async notifyCollectionShowcase(userData: any): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.socialNotifications) return;

    await this.sendLocalNotification({
      id: `showcase_${userData.userId}`,
      title: '✨ New Collection Showcase',
      body: `${userData.username} shared their ${userData.collectionName} collection`,
      data: { type: 'collection_showcase', userId: userData.userId },
      category: 'social',
      priority: 'low'
    });
  }

  // ==================== CORE NOTIFICATION METHODS ====================

  /**
   * Send local notification
   */
  private async sendLocalNotification(config: NotificationConfig): Promise<void> {
    try {
      if (!this.isInitialized) return;

      const settings = await this.getSettings();
      
      // Check quiet hours
      if (this.isQuietHours(settings)) {
        await this.scheduleNotification(config, this.getNextAllowedTime(settings));
        return;
      }

      // Mock notification display - in production, this would use actual notification APIs
      console.log('📱 Local Notification:', config.title, '-', config.body);
      
      // Trigger appropriate haptic feedback
      if (config.vibrate !== false && settings.vibrationEnabled) {
        switch (config.priority) {
          case 'high':
            this.nativeService.triggerHaptic('impactHeavy');
            break;
          case 'normal':
            this.nativeService.triggerHaptic('impactMedium');
            break;
          default:
            this.nativeService.triggerHaptic('impactLight');
            break;
        }
      }

    } catch (error) {
      console.error('Local notification failed:', error);
    }
  }

  /**
   * Schedule notification for later
   */
  public async scheduleNotification(config: NotificationConfig, scheduledTime: number): Promise<void> {
    try {
      const scheduled: ScheduledNotification = {
        id: config.id,
        config,
        scheduledTime,
        type: 'local'
      };

      const scheduledNotifications = await this.getScheduledNotifications();
      scheduledNotifications.push(scheduled);
      
      await AsyncStorage.setItem(this.SCHEDULED_KEY, JSON.stringify(scheduledNotifications));
      console.log('⏰ Notification scheduled for:', new Date(scheduledTime).toLocaleString());
    } catch (error) {
      console.error('Schedule notification failed:', error);
    }
  }

  /**
   * Cancel scheduled notification
   */
  public async cancelNotification(notificationId: string): Promise<void> {
    try {
      const scheduledNotifications = await this.getScheduledNotifications();
      const filteredNotifications = scheduledNotifications.filter(n => n.id !== notificationId);
      
      await AsyncStorage.setItem(this.SCHEDULED_KEY, JSON.stringify(filteredNotifications));
      console.log('🚫 Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Cancel notification failed:', error);
    }
  }

  // ==================== SETTINGS MANAGEMENT ====================

  /**
   * Get notification settings
   */
  public async getSettings(): Promise<NotificationSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }

    // Default settings
    return {
      enabled: true,
      tradingAlerts: true,
      marketUpdates: true,
      socialNotifications: true,
      priceAlerts: true,
      auctionNotifications: true,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      },
      soundEnabled: true,
      vibrationEnabled: true
    };
  }

  /**
   * Update notification settings
   */
  public async updateSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
      console.log('✅ Notification settings updated');
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Check if current time is in quiet hours
   */
  private isQuietHours(settings: NotificationSettings): boolean {
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { startTime, endTime } = settings.quietHours;
    
    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Get next allowed notification time
   */
  private getNextAllowedTime(settings: NotificationSettings): number {
    const now = new Date();
    const endTime = settings.quietHours.endTime.split(':');
    const nextAllowed = new Date();
    
    nextAllowed.setHours(parseInt(endTime[0]), parseInt(endTime[1]), 0, 0);
    
    if (nextAllowed <= now) {
      nextAllowed.setDate(nextAllowed.getDate() + 1);
    }
    
    return nextAllowed.getTime();
  }

  /**
   * Get scheduled notifications
   */
  private async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const scheduledJson = await AsyncStorage.getItem(this.SCHEDULED_KEY);
      return scheduledJson ? JSON.parse(scheduledJson) : [];
    } catch (error) {
      console.error('Failed to load scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Load and process scheduled notifications
   */
  private async loadScheduledNotifications(): Promise<void> {
    try {
      const scheduledNotifications = await this.getScheduledNotifications();
      const now = Date.now();
      
      // Process any notifications that should have fired
      const toFire = scheduledNotifications.filter(n => n.scheduledTime <= now);
      const remaining = scheduledNotifications.filter(n => n.scheduledTime > now);
      
      for (const notification of toFire) {
        await this.sendLocalNotification(notification.config);
      }
      
      // Save remaining notifications
      await AsyncStorage.setItem(this.SCHEDULED_KEY, JSON.stringify(remaining));
    } catch (error) {
      console.error('Failed to load scheduled notifications:', error);
    }
  }

  /**
   * Clear all notifications
   */
  public async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SCHEDULED_KEY, JSON.stringify([]));
      console.log('🧹 All notifications cleared');
    } catch (error) {
      console.error('Clear notifications failed:', error);
    }
  }
}

export default PushNotificationService;
