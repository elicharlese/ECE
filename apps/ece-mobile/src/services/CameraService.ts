/**
 * Camera Service for ECE Mobile
 * Handles card scanning, photo capture, and AR features
 */

import { RNCamera } from 'react-native-camera';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import MobileNativeService from './MobileNativeService';

export interface CameraConfig {
  type: 'card-scan' | 'photo-capture' | 'ar-preview';
  quality: number;
  flashMode: 'off' | 'on' | 'auto' | 'torch';
  captureAudio: boolean;
}

export interface CardDetectionResult {
  cardId: string;
  cardName: string;
  setName: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'played' | 'poor';
  estimatedValue: number;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  edges: Array<{ x: number; y: number }>;
}

export interface PhotoCaptureResult {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  timestamp: number;
}

export class CameraService {
  private static instance: CameraService;
  private nativeService: MobileNativeService;
  private isScanning = false;
  private scanCallback?: (result: CardDetectionResult) => void;

  public static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  constructor() {
    this.nativeService = MobileNativeService.getInstance();
  }

  /**
   * Request camera permissions
   */
  public async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'ECE Camera Permission',
            message: 'ECE needs access to your camera to scan trading cards and capture photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Camera permission error:', err);
        return false;
      }
    }
    return true; // iOS permissions handled via Info.plist
  }

  /**
   * Start card scanning mode
   */
  public startCardScan(callback: (result: CardDetectionResult) => void): void {
    this.isScanning = true;
    this.scanCallback = callback;
    this.nativeService.triggerHaptic('impactLight');
  }

  /**
   * Stop card scanning mode
   */
  public stopCardScan(): void {
    this.isScanning = false;
    this.scanCallback = undefined;
    this.nativeService.triggerHaptic('impactLight');
  }

  /**
   * Process camera frame for card detection
   */
  public async processFrame(imageUri: string): Promise<CardDetectionResult | null> {
    if (!this.isScanning) return null;

    try {
      // Mock AI/ML card detection - in production, this would call a real ML model
      const mockDetection: CardDetectionResult = {
        cardId: `detected_${Date.now()}`,
        cardName: this.generateRandomCardName(),
        setName: this.generateRandomSetName(),
        rarity: this.generateRandomRarity(),
        condition: this.generateRandomCondition(),
        estimatedValue: Math.floor(Math.random() * 500) + 10,
        confidence: 0.85 + Math.random() * 0.14, // 85-99% confidence
        boundingBox: {
          x: 0.1,
          y: 0.2,
          width: 0.8,
          height: 0.6,
        },
        edges: [
          { x: 0.1, y: 0.2 },
          { x: 0.9, y: 0.2 },
          { x: 0.9, y: 0.8 },
          { x: 0.1, y: 0.8 },
        ],
      };

      // Trigger haptic feedback for successful detection
      if (mockDetection.confidence > 0.9) {
        this.nativeService.triggerHaptic('notificationSuccess');
      }

      return mockDetection;
    } catch (error) {
      console.error('Frame processing failed:', error);
      return null;
    }
  }

  /**
   * Capture a high-quality photo
   */
  public async capturePhoto(camera: RNCamera, config?: Partial<CameraConfig>): Promise<PhotoCaptureResult | null> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Camera access is needed to capture photos');
        return null;
      }

      this.nativeService.triggerHaptic('impactMedium');

      const options = {
        quality: config?.quality || 0.8,
        base64: true,
        skipProcessing: false,
        forceUpOrientation: true,
        fixOrientation: true,
        mirrorImage: false,
      };

      const data = await camera.takePictureAsync(options);

      const result: PhotoCaptureResult = {
        uri: data.uri,
        width: data.width,
        height: data.height,
        base64: data.base64,
        timestamp: Date.now(),
      };

      this.nativeService.triggerHaptic('notificationSuccess');
      return result;
    } catch (error) {
      console.error('Photo capture failed:', error);
      this.nativeService.triggerHaptic('notificationError');
      return null;
    }
  }

  /**
   * Start video recording for card unboxing/showcase
   */
  public async startRecording(camera: RNCamera): Promise<void> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) return;

      this.nativeService.triggerHaptic('impactMedium');

      const options = {
        quality: RNCamera.Constants.VideoQuality['720p'],
        maxDuration: 30, // 30 seconds max
        mute: false,
      };

      await camera.recordAsync(options);
      this.nativeService.triggerHaptic('notificationSuccess');
    } catch (error) {
      console.error('Video recording failed:', error);
      this.nativeService.triggerHaptic('notificationError');
    }
  }

  /**
   * Stop video recording
   */
  public async stopRecording(camera: RNCamera): Promise<string | null> {
    try {
      await camera.stopRecording();
      this.nativeService.triggerHaptic('impactLight');
      // Return a mock URI since RNCamera.stopRecording() returns void
      return `file://video_${Date.now()}.mp4`;
    } catch (error) {
      console.error('Stop recording failed:', error);
      return null;
    }
  }

  /**
   * Get optimal camera settings for card scanning
   */
  public getCardScanSettings(): any {
    return {
      type: RNCamera.Constants.Type.back,
      flashMode: RNCamera.Constants.FlashMode.auto,
      autoFocus: RNCamera.Constants.AutoFocus.on,
      whiteBalance: RNCamera.Constants.WhiteBalance.auto,
      ratio: '16:9',
      quality: 0.8,
      orientation: 'portrait',
      captureAudio: false,
      videoStabilizationMode: 'auto',
    };
  }

  /**
   * Get camera settings optimized for high-quality photos
   */
  public getPhotoSettings(): any {
    return {
      type: RNCamera.Constants.Type.back,
      flashMode: RNCamera.Constants.FlashMode.auto,
      autoFocus: RNCamera.Constants.AutoFocus.on,
      whiteBalance: RNCamera.Constants.WhiteBalance.auto,
      ratio: '4:3',
      quality: 1.0,
      orientation: 'portrait',
      captureAudio: false,
    };
  }

  // ==================== MOCK DATA GENERATORS ====================

  private generateRandomCardName(): string {
    const cardNames = [
      'Charizard EX', 'Pikachu VMAX', 'Blastoise GX', 'Venusaur V',
      'Mewtwo EX', 'Lugia Legend', 'Rayquaza GX', 'Arceus VSTAR',
      'Dialga Origin Forme', 'Palkia Origin Forme', 'Giratina VSTAR',
      'Eternatus VMAX', 'Calyrex VMAX', 'Zacian V', 'Zamazenta V'
    ];
    return cardNames[Math.floor(Math.random() * cardNames.length)];
  }

  private generateRandomSetName(): string {
    const setNames = [
      'Base Set', 'Jungle', 'Fossil', 'Team Rocket', 'Gym Heroes',
      'Neo Genesis', 'Expedition', 'Ruby & Sapphire', 'Diamond & Pearl',
      'Black & White', 'XY', 'Sun & Moon', 'Sword & Shield', 'Scarlet & Violet'
    ];
    return setNames[Math.floor(Math.random() * setNames.length)];
  }

  private generateRandomRarity(): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    const rarities: Array<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'> = [
      'common', 'common', 'common', 'uncommon', 'uncommon', 
      'rare', 'rare', 'epic', 'legendary'
    ];
    return rarities[Math.floor(Math.random() * rarities.length)];
  }

  private generateRandomCondition(): 'mint' | 'near_mint' | 'excellent' | 'good' | 'played' | 'poor' {
    const conditions: Array<'mint' | 'near_mint' | 'excellent' | 'good' | 'played' | 'poor'> = [
      'mint', 'near_mint', 'near_mint', 'excellent', 'excellent', 
      'good', 'good', 'played', 'poor'
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }
}

export default CameraService;
