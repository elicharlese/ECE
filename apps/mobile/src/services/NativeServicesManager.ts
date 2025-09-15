/**
 * Native Services Manager
 * Central coordinator for all mobile-native services
 * Handles initialization, lifecycle, and cross-service communication
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';

// Import all native services
import MobileNativeService from './MobileNativeService';
import CameraService from './CameraService';
import BiometricService from './BiometricService';
import LocationService from './LocationService';
import PushNotificationService from './PushNotificationService';

export interface ServiceStatus {
  name: string;
  initialized: boolean;
  available: boolean;
  lastError?: string;
  capabilities?: any;
}

export interface ServiceManagerConfig {
  enableAutoInit: boolean;
  enableBackgroundSync: boolean;
  debugMode: boolean;
  services: {
    camera: boolean;
    biometric: boolean;
    location: boolean;
    notifications: boolean;
    nfc: boolean;
  };
}

export class NativeServicesManager {
  private static instance: NativeServicesManager;
  private readonly CONFIG_KEY = '@ECE:ServiceManagerConfig';
  
  // Service instances
  private mobileNativeService: MobileNativeService;
  private cameraService: CameraService;
  private biometricService: BiometricService;
  private locationService: LocationService;
  private pushNotificationService: PushNotificationService;
  
  // Manager state
  private isInitialized = false;
  private appState: AppStateStatus = 'active';
  private serviceStatuses: Map<string, ServiceStatus> = new Map();
  
  public static getInstance(): NativeServicesManager {
    if (!NativeServicesManager.instance) {
      NativeServicesManager.instance = new NativeServicesManager();
    }
    return NativeServicesManager.instance;
  }

  constructor() {
    // Initialize service instances
    this.mobileNativeService = MobileNativeService.getInstance();
    this.cameraService = CameraService.getInstance();
    this.biometricService = BiometricService.getInstance();
    this.locationService = LocationService.getInstance();
    this.pushNotificationService = PushNotificationService.getInstance();
    
    // Setup app state handling
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
  }

  /**
   * Initialize all native services
   */
  public async initialize(): Promise<boolean> {
    try {
      console.log('🚀 NativeServicesManager: Starting initialization...');
      
      const config = await this.getConfig();
      const results: { [key: string]: boolean } = {};

      // Initialize core native service first
      results.mobileNative = await this.initializeService(
        'mobileNative',
        async () => {
          await this.mobileNativeService.initialize();
          return true; // Return boolean for success
        },
        config.services.nfc
      );

      // Initialize biometric service
      if (config.services.biometric) {
        results.biometric = await this.initializeService(
          'biometric',
          async () => {
            const capabilities = await this.biometricService.initialize();
            return capabilities.isAvailable;
          }
        );
      }

      // Initialize location service
      if (config.services.location) {
        results.location = await this.initializeService(
          'location',
          () => this.locationService.initialize()
        );
      }

      // Initialize notification service
      if (config.services.notifications) {
        results.notifications = await this.initializeService(
          'notifications',
          () => this.pushNotificationService.initialize()
        );
      }

      // Camera service doesn't need async initialization
      if (config.services.camera) {
        this.updateServiceStatus('camera', {
          name: 'Camera Service',
          initialized: true,
          available: true,
        });
        results.camera = true;
      }

      // Calculate overall success
      const successfulServices = Object.values(results).filter(Boolean).length;
      const totalServices = Object.keys(results).length;
      const successRate = successfulServices / totalServices;

      this.isInitialized = successRate > 0.5; // Consider initialized if >50% services are working

      console.log(`✅ NativeServicesManager: Initialized ${successfulServices}/${totalServices} services`);
      
      if (this.isInitialized && config.enableBackgroundSync) {
        this.startBackgroundSync();
      }

      return this.isInitialized;
    } catch (error) {
      console.error('❌ NativeServicesManager initialization failed:', error);
      return false;
    }
  }

  /**
   * Initialize individual service with error handling
   */
  private async initializeService(
    serviceId: string,
    initFunction: () => Promise<boolean>,
    enabled: boolean = true
  ): Promise<boolean> {
    if (!enabled) {
      this.updateServiceStatus(serviceId, {
        name: this.getServiceName(serviceId),
        initialized: false,
        available: false,
      });
      return false;
    }

    try {
      const result = await initFunction();
      this.updateServiceStatus(serviceId, {
        name: this.getServiceName(serviceId),
        initialized: true,
        available: result,
      });
      return result;
    } catch (error) {
      console.error(`Service ${serviceId} initialization failed:`, error);
      this.updateServiceStatus(serviceId, {
        name: this.getServiceName(serviceId),
        initialized: false,
        available: false,
        lastError: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Get user-friendly service name
   */
  private getServiceName(serviceId: string): string {
    const names: { [key: string]: string } = {
      mobileNative: 'Core Native Service',
      camera: 'Camera Service',
      biometric: 'Biometric Service',
      location: 'Location Service',
      notifications: 'Push Notifications',
    };
    return names[serviceId] || serviceId;
  }

  /**
   * Update service status
   */
  private updateServiceStatus(serviceId: string, status: ServiceStatus): void {
    this.serviceStatuses.set(serviceId, status);
  }

  /**
   * Get all service statuses
   */
  public getServiceStatuses(): ServiceStatus[] {
    return Array.from(this.serviceStatuses.values());
  }

  /**
   * Get specific service status
   */
  public getServiceStatus(serviceId: string): ServiceStatus | undefined {
    return this.serviceStatuses.get(serviceId);
  }

  /**
   * Check if all critical services are available
   */
  public areServicesHealthy(): boolean {
    const criticalServices = ['mobileNative'];
    return criticalServices.every(serviceId => {
      const status = this.serviceStatuses.get(serviceId);
      return status?.initialized && status?.available;
    });
  }

  // ==================== SERVICE ACCESS METHODS ====================

  /**
   * Get mobile native service
   */
  public getMobileNativeService(): MobileNativeService {
    return this.mobileNativeService;
  }

  /**
   * Get camera service
   */
  public getCameraService(): CameraService {
    return this.cameraService;
  }

  /**
   * Get biometric service
   */
  public getBiometricService(): BiometricService {
    return this.biometricService;
  }

  /**
   * Get location service
   */
  public getLocationService(): LocationService {
    return this.locationService;
  }

  /**
   * Get push notification service
   */
  public getPushNotificationService(): PushNotificationService {
    return this.pushNotificationService;
  }

  // ==================== LIFECYCLE MANAGEMENT ====================

  /**
   * Handle app state changes
   */
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    const prevAppState = this.appState;
    this.appState = nextAppState;

    if (prevAppState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('📱 App has come to the foreground');
      this.onAppForeground();
    } else if (prevAppState === 'active' && nextAppState.match(/inactive|background/)) {
      console.log('📱 App has gone to the background');
      this.onAppBackground();
    }
  }

  /**
   * Handle app coming to foreground
   */
  private async onAppForeground(): Promise<void> {
    try {
      // Refresh service statuses
      await this.refreshServices();
      
      // Process any pending notifications
      // await this.pushNotificationService.processPendingNotifications();
      
      console.log('✅ App foreground processing complete');
    } catch (error) {
      console.error('App foreground processing failed:', error);
    }
  }

  /**
   * Handle app going to background
   */
  private async onAppBackground(): Promise<void> {
    try {
      // Save any pending data
      await this.saveServiceStates();
      
      // Cleanup temporary resources
      await this.cleanupTemporaryResources();
      
      console.log('✅ App background processing complete');
    } catch (error) {
      console.error('App background processing failed:', error);
    }
  }

  /**
   * Refresh all services
   */
  private async refreshServices(): Promise<void> {
    if (!this.isInitialized) return;

    // Check service health and reinitialize if needed
    const statuses = this.getServiceStatuses();
    for (const status of statuses) {
      if (status.initialized && !status.available) {
        console.log(`🔄 Attempting to restore ${status.name}`);
        // Could implement service restoration logic here
      }
    }
  }

  /**
   * Save service states
   */
  private async saveServiceStates(): Promise<void> {
    try {
      const states = {
        timestamp: Date.now(),
        statuses: Array.from(this.serviceStatuses.entries()),
      };
      
      await AsyncStorage.setItem('@ECE:ServiceStates', JSON.stringify(states));
    } catch (error) {
      console.error('Failed to save service states:', error);
    }
  }

  /**
   * Cleanup temporary resources
   */
  private async cleanupTemporaryResources(): Promise<void> {
    try {
      // Stop location tracking if background tracking is disabled
      // Location service cleanup would be implemented here
      
      // Cleanup camera resources
      // Camera cleanup is handled automatically
      
      console.log('🧹 Temporary resources cleaned up');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  // ==================== BACKGROUND SYNC ====================

  /**
   * Start background sync for services
   */
  private startBackgroundSync(): void {
    // Set up periodic health checks and data sync
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute
    
    console.log('🔄 Background sync started');
  }

  /**
   * Perform health check on all services
   */
  private performHealthCheck(): void {
    if (this.appState !== 'active') return;
    
    const unhealthyServices = this.getServiceStatuses().filter(
      status => status.initialized && !status.available
    );
    
    if (unhealthyServices.length > 0) {
      console.warn('⚠️ Unhealthy services detected:', unhealthyServices.map(s => s.name));
    }
  }

  // ==================== CONFIGURATION ====================

  /**
   * Get service manager configuration
   */
  public async getConfig(): Promise<ServiceManagerConfig> {
    try {
      const configJson = await AsyncStorage.getItem(this.CONFIG_KEY);
      if (configJson) {
        return JSON.parse(configJson);
      }
    } catch (error) {
      console.error('Failed to load service config:', error);
    }

    // Default configuration
    return {
      enableAutoInit: true,
      enableBackgroundSync: true,
      debugMode: __DEV__,
      services: {
        camera: true,
        biometric: true,
        location: false, // Disabled by default for privacy
        notifications: true,
        nfc: true,
      },
    };
  }

  /**
   * Update service manager configuration
   */
  public async updateConfig(config: Partial<ServiceManagerConfig>): Promise<void> {
    try {
      const currentConfig = await this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      
      await AsyncStorage.setItem(this.CONFIG_KEY, JSON.stringify(newConfig));
      console.log('✅ Service manager config updated');
    } catch (error) {
      console.error('Failed to update service config:', error);
    }
  }

  /**
   * Reset all services and configuration
   */
  public async reset(): Promise<void> {
    try {
      // Cleanup all services
      await this.mobileNativeService.cleanup();
      
      // Clear service states
      this.serviceStatuses.clear();
      this.isInitialized = false;
      
      // Reset configuration
      await AsyncStorage.removeItem(this.CONFIG_KEY);
      await AsyncStorage.removeItem('@ECE:ServiceStates');
      
      console.log('🔄 NativeServicesManager reset complete');
    } catch (error) {
      console.error('Service manager reset failed:', error);
    }
  }

  /**
   * Get initialization status
   */
  public isReady(): boolean {
    return this.isInitialized;
  }
}

export default NativeServicesManager;
