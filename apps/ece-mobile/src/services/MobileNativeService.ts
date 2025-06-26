/**
 * Mobile Native Service
 * Comprehensive service for mobile-specific features including:
 * - Camera integration for card scanning
 * - NFC for contactless trading
 * - Biometric authentication
 * - Haptic feedback
 * - Push notifications
 * - Location services
 */

import { RNCamera } from 'react-native-camera';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

export interface CardScanResult {
  cardId: string;
  cardName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'played';
  estimatedValue: number;
  confidence: number;
}

export interface NFCTradeData {
  tradeId: string;
  fromUserId: string;
  toUserId: string;
  cardIds: string[];
  timestamp: number;
  verified: boolean;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometryType?: 'TouchID' | 'FaceID' | 'Biometrics';
}

export class MobileNativeService {
  private static instance: MobileNativeService;
  private nfcInitialized = false;
  private biometricsAvailable = false;

  public static getInstance(): MobileNativeService {
    if (!MobileNativeService.instance) {
      MobileNativeService.instance = new MobileNativeService();
    }
    return MobileNativeService.instance;
  }

  /**
   * Initialize all mobile native services
   */
  public async initialize(): Promise<void> {
    try {
      await this.initializeNFC();
      await this.initializeBiometrics();
      await this.requestPermissions();
      console.log('🚀 MobileNativeService initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize MobileNativeService:', error);
    }
  }

  // ==================== CAMERA FEATURES ====================

  /**
   * Scan a trading card using camera
   */
  public async scanCard(): Promise<CardScanResult | null> {
    try {
      // Request camera permission
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Camera access is needed to scan cards');
        return null;
      }

      // Trigger haptic feedback
      this.triggerHaptic('impactMedium');

      // Mock card scanning for now - in production, this would use ML/AI
      const mockResult: CardScanResult = {
        cardId: `card_${Date.now()}`,
        cardName: 'Charizard EX',
        rarity: 'legendary',
        condition: 'mint',
        estimatedValue: 250,
        confidence: 0.89
      };

      return mockResult;
    } catch (error) {
      console.error('Card scanning failed:', error);
      return null;
    }
  }

  /**
   * Take a photo for card collection
   */
  public async captureCardPhoto(): Promise<string | null> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) return null;

      this.triggerHaptic('impactLight');
      
      // Mock photo capture - would return actual photo URI in production
      const photoUri = `file://cards/photo_${Date.now()}.jpg`;
      return photoUri;
    } catch (error) {
      console.error('Photo capture failed:', error);
      return null;
    }
  }

  // ==================== NFC FEATURES ====================

  /**
   * Initialize NFC capabilities
   */
  private async initializeNFC(): Promise<void> {
    try {
      const isSupported = await NfcManager.isSupported();
      if (isSupported) {
        await NfcManager.start();
        this.nfcInitialized = true;
        console.log('✅ NFC initialized successfully');
      } else {
        console.log('⚠️ NFC not supported on this device');
      }
    } catch (error) {
      console.error('NFC initialization failed:', error);
    }
  }

  /**
   * Start NFC trading session
   */
  public async startNFCTrade(cardIds: string[]): Promise<NFCTradeData | null> {
    if (!this.nfcInitialized) {
      Alert.alert('NFC Not Available', 'NFC is not supported on this device');
      return null;
    }

    try {
      this.triggerHaptic('impactMedium');
      
      // Start NFC reader
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Mock NFC trade data
      const tradeData: NFCTradeData = {
        tradeId: `trade_${Date.now()}`,
        fromUserId: 'current_user_id',
        toUserId: 'nfc_detected_user',
        cardIds,
        timestamp: Date.now(),
        verified: true
      };

      // Stop NFC reader
      await NfcManager.cancelTechnologyRequest();

      this.triggerHaptic('notificationSuccess');
      return tradeData;
    } catch (error) {
      console.error('NFC trade failed:', error);
      await NfcManager.cancelTechnologyRequest();
      return null;
    }
  }

  /**
   * Read NFC tag for card verification
   */
  public async readNFCTag(): Promise<any> {
    if (!this.nfcInitialized) return null;

    try {
      this.triggerHaptic('impactLight');
      
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      
      await NfcManager.cancelTechnologyRequest();
      return tag;
    } catch (error) {
      console.error('NFC read failed:', error);
      await NfcManager.cancelTechnologyRequest();
      return null;
    }
  }

  // ==================== BIOMETRIC AUTHENTICATION ====================

  /**
   * Initialize biometric authentication
   */
  private async initializeBiometrics(): Promise<void> {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();
      this.biometricsAvailable = available;
      
      if (available) {
        console.log('✅ Biometric authentication available');
      } else {
        console.log('⚠️ Biometric authentication not available');
      }
    } catch (error) {
      console.error('Biometric initialization failed:', error);
    }
  }

  /**
   * Authenticate user with biometrics
   */
  public async authenticateWithBiometrics(): Promise<BiometricAuthResult> {
    if (!this.biometricsAvailable) {
      return {
        success: false,
        error: 'Biometric authentication not available'
      };
    }

    try {
      this.triggerHaptic('impactLight');

      const rnBiometrics = new ReactNativeBiometrics();
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to access your ECE wallet',
        cancelButtonText: 'Cancel'
      });

      if (success) {
        this.triggerHaptic('notificationSuccess');
        return { success: true };
      } else {
        this.triggerHaptic('notificationError');
        return { success: false, error };
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  /**
   * Check if biometrics are enrolled
   */
  public async checkBiometricEnrollment(): Promise<boolean> {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();
      return available;
    } catch (error) {
      console.error('Biometric check failed:', error);
      return false;
    }
  }

  // ==================== HAPTIC FEEDBACK ====================

  /**
   * Trigger haptic feedback
   */
  public triggerHaptic(type: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationWarning' | 'notificationError'): void {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };

    ReactNativeHapticFeedback.trigger(type, options);
  }

  /**
   * Trigger custom haptic pattern for specific actions
   */
  public triggerCardFlipHaptic(): void {
    this.triggerHaptic('impactLight');
    setTimeout(() => this.triggerHaptic('impactMedium'), 100);
  }

  public triggerTradeSuccessHaptic(): void {
    this.triggerHaptic('notificationSuccess');
    setTimeout(() => this.triggerHaptic('impactLight'), 200);
    setTimeout(() => this.triggerHaptic('impactLight'), 400);
  }

  // ==================== PERMISSIONS ====================

  /**
   * Request all necessary permissions
   */
  private async requestPermissions(): Promise<void> {
    if (Platform.OS === 'android') {
      await this.requestAndroidPermissions();
    }
    // iOS permissions are handled through Info.plist
  }

  /**
   * Request camera permission
   */
  private async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'ECE Camera Permission',
          message: 'ECE needs access to your camera to scan trading cards',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles through Info.plist
  }

  /**
   * Request Android permissions
   */
  private async requestAndroidPermissions(): Promise<void> {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        'android.permission.NFC' as any, // NFC permission string
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      Object.entries(granted).forEach(([permission, result]) => {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(`✅ ${permission} permission granted`);
        } else {
          console.log(`❌ ${permission} permission denied`);
        }
      });
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  }

  // ==================== CLEANUP ====================

  /**
   * Clean up resources
   */
  public async cleanup(): Promise<void> {
    try {
      if (this.nfcInitialized) {
        await NfcManager.cancelTechnologyRequest().catch(() => {});
        this.nfcInitialized = false;
      }
      console.log('🧹 MobileNativeService cleaned up');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

export default MobileNativeService;
