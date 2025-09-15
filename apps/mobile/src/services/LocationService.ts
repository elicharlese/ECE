/**
 * Location Service for ECE Mobile
 * Handles geolocation, proximity trading, and location-based features
 */

import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MobileNativeService from './MobileNativeService';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface NearbyTrader {
  userId: string;
  username: string;
  distance: number; // in meters
  location: LocationData;
  activeCards: string[];
  rating: number;
  isOnline: boolean;
  lastSeen: number;
}

export interface TradingEvent {
  eventId: string;
  name: string;
  location: LocationData;
  startTime: number;
  endTime: number;
  participantCount: number;
  featuredSets: string[];
  distance: number;
}

export class LocationService {
  private static instance: LocationService;
  private nativeService: MobileNativeService;
  private currentLocation: LocationData | null = null;
  private locationWatcher: number | null = null;
  private proximityTraders: NearbyTrader[] = [];

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  constructor() {
    this.nativeService = MobileNativeService.getInstance();
  }

  /**
   * Initialize location services
   */
  public async initialize(): Promise<boolean> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        console.log('⚠️ Location permission denied');
        return false;
      }

      console.log('✅ LocationService initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ LocationService initialization failed:', error);
      return false;
    }
  }

  /**
   * Request location permissions
   */
  private async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        return (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Location permission request failed:', error);
        return false;
      }
    }
    return true; // iOS handles through Info.plist
  }

  /**
   * Get current location
   */
  public async getCurrentLocation(): Promise<LocationData | null> {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            altitude: position.coords.altitude || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
          };

          this.currentLocation = location;
          resolve(location);
        },
        (error) => {
          console.error('Location error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  /**
   * Start watching location changes
   */
  public async startLocationWatch(callback: (location: LocationData) => void): Promise<void> {
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) return;

    this.locationWatcher = Geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          altitude: position.coords.altitude || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
        };

        this.currentLocation = location;
        callback(location);
      },
      (error) => {
        console.error('Location watch error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 30000, // Check every 30 seconds
      }
    );
  }

  /**
   * Stop watching location changes
   */
  public stopLocationWatch(): void {
    if (this.locationWatcher !== null) {
      Geolocation.clearWatch(this.locationWatcher);
      this.locationWatcher = null;
    }
  }

  /**
   * Find nearby traders
   */
  public async findNearbyTraders(radiusMeters: number = 1000): Promise<NearbyTrader[]> {
    const currentLocation = await this.getCurrentLocation();
    if (!currentLocation) return [];

    try {
      this.nativeService.triggerHaptic('impactLight');

      // Mock nearby traders - in production, this would call a real API
      const mockTraders: NearbyTrader[] = [
        {
          userId: 'trader_001',
          username: 'CardMaster92',
          distance: 250,
          location: {
            latitude: currentLocation.latitude + 0.002,
            longitude: currentLocation.longitude + 0.001,
            accuracy: 10,
            timestamp: Date.now(),
          },
          activeCards: ['charizard_ex', 'pikachu_vmax'],
          rating: 4.8,
          isOnline: true,
          lastSeen: Date.now() - 60000, // 1 minute ago
        },
        {
          userId: 'trader_002',
          username: 'PokemonPro',
          distance: 520,
          location: {
            latitude: currentLocation.latitude - 0.003,
            longitude: currentLocation.longitude + 0.002,
            accuracy: 15,
            timestamp: Date.now(),
          },
          activeCards: ['blastoise_gx', 'venusaur_v'],
          rating: 4.6,
          isOnline: true,
          lastSeen: Date.now() - 300000, // 5 minutes ago
        },
        {
          userId: 'trader_003',
          username: 'CollectorElite',
          distance: 750,
          location: {
            latitude: currentLocation.latitude + 0.001,
            longitude: currentLocation.longitude - 0.004,
            accuracy: 12,
            timestamp: Date.now(),
          },
          activeCards: ['rayquaza_gx', 'arceus_vstar'],
          rating: 4.9,
          isOnline: false,
          lastSeen: Date.now() - 1800000, // 30 minutes ago
        },
      ];

      // Filter by radius
      const nearbyTraders = mockTraders.filter(trader => trader.distance <= radiusMeters);
      this.proximityTraders = nearbyTraders;

      return nearbyTraders;
    } catch (error) {
      console.error('Failed to find nearby traders:', error);
      return [];
    }
  }

  /**
   * Find trading events nearby
   */
  public async findNearbyEvents(radiusMeters: number = 5000): Promise<TradingEvent[]> {
    const currentLocation = await this.getCurrentLocation();
    if (!currentLocation) return [];

    try {
      // Mock trading events - in production, this would call a real API
      const mockEvents: TradingEvent[] = [
        {
          eventId: 'event_001',
          name: 'Pokemon TCG Tournament',
          location: {
            latitude: currentLocation.latitude + 0.01,
            longitude: currentLocation.longitude + 0.01,
            accuracy: 5,
            timestamp: Date.now(),
          },
          startTime: Date.now() + 7200000, // In 2 hours
          endTime: Date.now() + 21600000, // In 6 hours
          participantCount: 45,
          featuredSets: ['Scarlet & Violet', 'Sword & Shield'],
          distance: 1200,
        },
        {
          eventId: 'event_002',
          name: 'Card Collector Meetup',
          location: {
            latitude: currentLocation.latitude - 0.015,
            longitude: currentLocation.longitude + 0.008,
            accuracy: 8,
            timestamp: Date.now(),
          },
          startTime: Date.now() + 86400000, // Tomorrow
          endTime: Date.now() + 100800000, // Tomorrow + 4 hours
          participantCount: 23,
          featuredSets: ['Base Set', 'Jungle', 'Fossil'],
          distance: 2300,
        },
      ];

      // Filter by radius
      return mockEvents.filter(event => event.distance <= radiusMeters);
    } catch (error) {
      console.error('Failed to find nearby events:', error);
      return [];
    }
  }

  /**
   * Calculate distance between two locations (in meters)
   */
  public calculateDistance(location1: LocationData, location2: LocationData): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (location1.latitude * Math.PI) / 180;
    const φ2 = (location2.latitude * Math.PI) / 180;
    const Δφ = ((location2.latitude - location1.latitude) * Math.PI) / 180;
    const Δλ = ((location2.longitude - location1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Send proximity trading request
   */
  public async sendProximityTradeRequest(traderId: string, cardIds: string[]): Promise<boolean> {
    try {
      this.nativeService.triggerHaptic('impactMedium');

      const trader = this.proximityTraders.find(t => t.userId === traderId);
      if (!trader) {
        Alert.alert('Error', 'Trader not found');
        return false;
      }

      if (trader.distance > 100) {
        Alert.alert('Too Far', 'You need to be within 100 meters to initiate a proximity trade');
        return false;
      }

      // Mock trade request - in production, this would send a real request
      Alert.alert(
        'Trade Request Sent',
        `Proximity trade request sent to ${trader.username}`,
        [
          { text: 'OK', onPress: () => this.nativeService.triggerHaptic('notificationSuccess') }
        ]
      );

      return true;
    } catch (error) {
      console.error('Failed to send proximity trade request:', error);
      return false;
    }
  }

  /**
   * Check if location is in a trading-safe zone
   */
  public isInTradingSafeZone(location: LocationData): boolean {
    // Mock safe zones - in production, this would check against a database
    const safeZones = [
      { lat: 37.7749, lng: -122.4194, radius: 500 }, // San Francisco example
      { lat: 40.7128, lng: -74.0060, radius: 300 },  // New York example
    ];

    return safeZones.some(zone => {
      const distance = this.calculateDistance(location, {
        latitude: zone.lat,
        longitude: zone.lng,
        accuracy: 1,
        timestamp: Date.now(),
      });
      return distance <= zone.radius;
    });
  }

  /**
   * Get location display name
   */
  public async getLocationDisplayName(location: LocationData): Promise<string> {
    try {
      // Mock reverse geocoding - in production, use a real geocoding service
      const mockNames = [
        'Downtown Trading District',
        'Pokemon Center Plaza',
        'Card Collector Square',
        'TCG Tournament Hall',
        'Trainer Meetup Park',
      ];

      return mockNames[Math.floor(Math.random() * mockNames.length)];
    } catch (error) {
      console.error('Failed to get location name:', error);
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
  }

  /**
   * Enable/disable location sharing
   */
  public async setLocationSharingEnabled(enabled: boolean): Promise<void> {
    if (enabled) {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Location access is required to find nearby traders and events'
        );
        return;
      }
    }

    // Store preference (in production, sync with backend)
    console.log(`Location sharing ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Clean up location services
   */
  public cleanup(): void {
    this.stopLocationWatch();
    this.currentLocation = null;
    this.proximityTraders = [];
    console.log('🧹 LocationService cleaned up');
  }
}

export default LocationService;
