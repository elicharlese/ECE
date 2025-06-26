/**
 * Biometric Authentication Service for ECE Mobile
 * Handles TouchID, FaceID, and Android biometric authentication
 */

import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import MobileNativeService from './MobileNativeService';

export interface BiometricCapabilities {
  isAvailable: boolean;
  biometryType: string | null;
  hasEnrolledFingerprints: boolean;
  hasEnrolledFace: boolean;
}

export interface AuthenticationResult {
  success: boolean;
  error?: string;
  cancelled?: boolean;
  biometryType?: string;
  signature?: string;
}

export interface BiometricSettings {
  enabled: boolean;
  walletAccess: boolean;
  tradingAccess: boolean;
  quickLogin: boolean;
  timeout: number; // minutes
}

export class BiometricService {
  private static instance: BiometricService;
  private rnBiometrics: ReactNativeBiometrics;
  private nativeService: MobileNativeService;
  private readonly SETTINGS_KEY = '@ECE:BiometricSettings';
  private readonly BIOMETRIC_KEY = 'ECE_Biometric_Key';

  public static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
    this.nativeService = MobileNativeService.getInstance();
  }

  /**
   * Initialize biometric authentication
   */
  public async initialize(): Promise<BiometricCapabilities> {
    try {
      const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();

      const capabilities: BiometricCapabilities = {
        isAvailable: available,
        biometryType: biometryType || null,
        hasEnrolledFingerprints: false,
        hasEnrolledFace: false,
      };

      if (available) {
        // Check for specific biometry types
        if (biometryType === BiometryTypes.TouchID) {
          capabilities.hasEnrolledFingerprints = true;
        } else if (biometryType === BiometryTypes.FaceID) {
          capabilities.hasEnrolledFace = true;
        } else if (biometryType === BiometryTypes.Biometrics) {
          // Android - could be either fingerprint or face
          capabilities.hasEnrolledFingerprints = true;
        }

        await this.ensureBiometricKey();
        console.log('✅ BiometricService initialized successfully');
      } else {
        console.log('⚠️ Biometric authentication not available');
      }

      return capabilities;
    } catch (error) {
      console.error('❌ BiometricService initialization failed:', error);
      return {
        isAvailable: false,
        biometryType: null,
        hasEnrolledFingerprints: false,
        hasEnrolledFace: false,
      };
    }
  }

  /**
   * Authenticate user for wallet access
   */
  public async authenticateForWallet(): Promise<AuthenticationResult> {
    return this.authenticate('Access your ECE wallet', 'wallet');
  }

  /**
   * Authenticate user for trading
   */
  public async authenticateForTrading(): Promise<AuthenticationResult> {
    return this.authenticate('Confirm this trade', 'trading');
  }

  /**
   * Authenticate user for app login
   */
  public async authenticateForLogin(): Promise<AuthenticationResult> {
    return this.authenticate('Sign in to ECE', 'login');
  }

  /**
   * Core authentication method
   */
  private async authenticate(promptMessage: string, context: 'wallet' | 'trading' | 'login'): Promise<AuthenticationResult> {
    try {
      this.nativeService.triggerHaptic('impactLight');

      const { available } = await this.rnBiometrics.isSensorAvailable();
      if (!available) {
        return {
          success: false,
          error: 'Biometric authentication not available'
        };
      }

      const settings = await this.getSettings();
      if (!settings.enabled) {
        return {
          success: false,
          error: 'Biometric authentication is disabled'
        };
      }

      // Check if biometric auth is enabled for this context
      if (context === 'wallet' && !settings.walletAccess) {
        return { success: false, error: 'Biometric wallet access is disabled' };
      }
      if (context === 'trading' && !settings.tradingAccess) {
        return { success: false, error: 'Biometric trading access is disabled' };
      }

      const result = await this.rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel'
      });

      if (result.success) {
        this.nativeService.triggerHaptic('notificationSuccess');
        return {
          success: true,
          biometryType: await this.getBiometryType()
        };
      } else {
        this.nativeService.triggerHaptic('notificationError');
        return {
          success: false,
          error: result.error || 'Authentication failed',
          cancelled: result.error === 'User cancelled'
        };
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      this.nativeService.triggerHaptic('notificationError');
      return {
        success: false,
        error: 'Authentication error occurred'
      };
    }
  }

  /**
   * Create a cryptographic signature for secure transactions
   */
  public async createSignature(payload: string): Promise<string | null> {
    try {
      const { available } = await this.rnBiometrics.isSensorAvailable();
      if (!available) return null;

      const { success, signature } = await this.rnBiometrics.createSignature({
        promptMessage: 'Sign this transaction',
        payload: payload,
        cancelButtonText: 'Cancel'
      });

      if (success && signature) {
        this.nativeService.triggerHaptic('notificationSuccess');
        return signature;
      }

      return null;
    } catch (error) {
      console.error('Signature creation failed:', error);
      return null;
    }
  }

  /**
   * Ensure biometric key exists
   */
  private async ensureBiometricKey(): Promise<void> {
    try {
      const { keysExist } = await this.rnBiometrics.biometricKeysExist();
      
      if (!keysExist) {
        const { publicKey } = await this.rnBiometrics.createKeys();
        console.log('🔑 Biometric key created:', publicKey.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('Biometric key creation failed:', error);
    }
  }

  /**
   * Delete biometric keys
   */
  public async deleteKeys(): Promise<boolean> {
    try {
      const { keysDeleted } = await this.rnBiometrics.deleteKeys();
      if (keysDeleted) {
        console.log('🗑️ Biometric keys deleted');
      }
      return keysDeleted;
    } catch (error) {
      console.error('Key deletion failed:', error);
      return false;
    }
  }

  /**
   * Get current biometry type
   */
  private async getBiometryType(): Promise<string | null> {
    try {
      const { biometryType } = await this.rnBiometrics.isSensorAvailable();
      return biometryType || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get biometric settings
   */
  public async getSettings(): Promise<BiometricSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
    } catch (error) {
      console.error('Failed to load biometric settings:', error);
    }

    // Default settings
    return {
      enabled: true,
      walletAccess: true,
      tradingAccess: true,
      quickLogin: true,
      timeout: 15
    };
  }

  /**
   * Update biometric settings
   */
  public async updateSettings(settings: Partial<BiometricSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
      console.log('✅ Biometric settings updated');
    } catch (error) {
      console.error('Failed to update biometric settings:', error);
    }
  }

  /**
   * Check if quick login is available
   */
  public async canQuickLogin(): Promise<boolean> {
    const settings = await this.getSettings();
    const { available } = await this.rnBiometrics.isSensorAvailable();
    return available && settings.enabled && settings.quickLogin;
  }

  /**
   * Get user-friendly biometry type name
   */
  public getBiometryTypeName(biometryType: string | null): string {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.Biometrics:
        return Platform.OS === 'android' ? 'Biometric Authentication' : 'Biometrics';
      default:
        return 'Biometric Authentication';
    }
  }

  /**
   * Show biometric setup prompt
   */
  public showSetupPrompt(): void {
    Alert.alert(
      'Set up Biometric Authentication',
      'Enable biometric authentication for secure and quick access to your ECE wallet and trading features.',
      [
        { text: 'Not Now', style: 'cancel' },
        { 
          text: 'Enable', 
          onPress: () => this.updateSettings({ enabled: true })
        }
      ]
    );
  }

  /**
   * Show biometric disable confirmation
   */
  public showDisableConfirmation(): void {
    Alert.alert(
      'Disable Biometric Authentication',
      'Are you sure you want to disable biometric authentication? You will need to enter your password to access secure features.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disable', 
          style: 'destructive',
          onPress: () => this.updateSettings({ enabled: false })
        }
      ]
    );
  }
}

export default BiometricService;
