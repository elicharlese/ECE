/**
 * Native Features Screen
 * Demonstrates and integrates all mobile-native services:
 * - Camera (card scanning, photo capture)
 * - NFC (contactless trading)
 * - Biometrics (secure authentication)
 * - Location (nearby traders, events)
 * - Push Notifications (trading alerts)
 * - Haptic Feedback (touch interactions)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

// Services
import MobileNativeService from '../services/MobileNativeService';
import CameraService from '../services/CameraService';
import BiometricService from '../services/BiometricService';
import LocationService from '../services/LocationService';
import PushNotificationService from '../services/PushNotificationService';

const { width, height } = Dimensions.get('window');

interface NativeFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'available' | 'unavailable' | 'permission_needed' | 'initializing';
  action: () => void;
  premium?: boolean;
}

export default function NativeFeaturesScreen() {
  const [features, setFeatures] = useState<NativeFeature[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const cameraRef = useRef<RNCamera>(null);

  // Service instances
  const nativeService = MobileNativeService.getInstance();
  const cameraService = CameraService.getInstance();
  const biometricService = BiometricService.getInstance();
  const locationService = LocationService.getInstance();
  const notificationService = PushNotificationService.getInstance();

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      setIsInitializing(true);

      // Initialize all services
      await nativeService.initialize();
      const biometricCapabilities = await biometricService.initialize();
      const locationEnabled = await locationService.initialize();
      const notificationsEnabled = await notificationService.initialize();

      // Create feature list based on capabilities
      const featureList: NativeFeature[] = [
        {
          id: 'card_scan',
          title: '📸 Card Scanner',
          description: 'Scan trading cards with AI recognition',
          icon: '📸',
          status: 'available',
          action: handleCardScan,
        },
        {
          id: 'nfc_trade',
          title: '📱 NFC Trading',
          description: 'Trade cards with contactless NFC tap',
          icon: '📱',
          status: 'available',
          action: handleNFCTrade,
          premium: true,
        },
        {
          id: 'biometric_auth',
          title: '🔐 Biometric Security',
          description: `Secure with ${biometricService.getBiometryTypeName(biometricCapabilities.biometryType)}`,
          icon: '🔐',
          status: biometricCapabilities.isAvailable ? 'available' : 'unavailable',
          action: handleBiometricAuth,
        },
        {
          id: 'nearby_traders',
          title: '📍 Nearby Traders',
          description: 'Find traders and events near you',
          icon: '📍',
          status: locationEnabled ? 'available' : 'permission_needed',
          action: handleLocationFeatures,
        },
        {
          id: 'push_notifications',
          title: '🔔 Smart Alerts',
          description: 'Trading alerts and market updates',
          icon: '🔔',
          status: notificationsEnabled ? 'available' : 'permission_needed',
          action: handleNotificationDemo,
        },
        {
          id: 'haptic_feedback',
          title: '📳 Haptic Feedback',
          description: 'Feel every interaction and trade',
          icon: '📳',
          status: 'available',
          action: handleHapticDemo,
        },
        {
          id: 'photo_capture',
          title: '📷 Photo Gallery',
          description: 'Capture and organize card photos',
          icon: '📷',
          status: 'available',
          action: handlePhotoCapture,
        },
        {
          id: 'ar_preview',
          title: '🌟 AR Card Preview',
          description: 'View cards in augmented reality',
          icon: '🌟',
          status: 'available',
          action: handleARPreview,
          premium: true,
        },
      ];

      setFeatures(featureList);
    } catch (error) {
      console.error('Service initialization failed:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  // ==================== FEATURE HANDLERS ====================

  const handleCardScan = async () => {
    try {
      nativeService.triggerHaptic('impactMedium');
      setShowCamera(true);
      
      // Start card scanning
      cameraService.startCardScan((result) => {
        setScanResult(result);
        setShowCamera(false);
        cameraService.stopCardScan();
        
        Alert.alert(
          '🎉 Card Detected!',
          `Found: ${result.cardName}\nRarity: ${result.rarity}\nValue: $${result.estimatedValue}\nConfidence: ${(result.confidence * 100).toFixed(1)}%`,
          [
            { text: 'Add to Collection', onPress: () => addToCollection(result) },
            { text: 'Trade Now', onPress: () => initiateTradeFromScan(result) },
            { text: 'Close', style: 'cancel' }
          ]
        );
      });
    } catch (error) {
      Alert.alert('Camera Error', 'Failed to start card scanner');
    }
  };

  const handleNFCTrade = async () => {
    try {
      nativeService.triggerHaptic('impactMedium');
      
      Alert.alert(
        '📱 NFC Trading',
        'Hold your phone near another ECE user\'s device to start trading',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start NFC', onPress: startNFCTrading }
        ]
      );
    } catch (error) {
      Alert.alert('NFC Error', 'NFC trading failed');
    }
  };

  const startNFCTrading = async () => {
    try {
      const selectedCards = ['card_001', 'card_002']; // Mock selected cards
      const tradeData = await nativeService.startNFCTrade(selectedCards);
      
      if (tradeData) {
        Alert.alert(
          '✅ NFC Trade Successful',
          `Trade completed with ${tradeData.toUserId}\nCards traded: ${selectedCards.length}`,
          [{ text: 'View Trade', onPress: () => viewTrade(tradeData.tradeId) }]
        );
      }
    } catch (error) {
      Alert.alert('Trade Failed', 'NFC trading was interrupted');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await biometricService.authenticateForWallet();
      
      if (result.success) {
        Alert.alert(
          '🔓 Authentication Successful',
          'Your ECE wallet is now accessible',
          [{ text: 'Open Wallet', onPress: () => openWallet() }]
        );
      } else {
        Alert.alert('Authentication Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Biometric Error', 'Authentication service unavailable');
    }
  };

  const handleLocationFeatures = async () => {
    try {
      nativeService.triggerHaptic('impactLight');
      
      const traders = await locationService.findNearbyTraders(10);
      
      if (traders.length > 0) {
        const traderNames = traders.map(t => `${t.username} (${locationService.formatDistance(t.distance)})`).join('\n');
        
        Alert.alert(
          '📍 Nearby Traders Found',
          `Found ${traders.length} traders:\n\n${traderNames}`,
          [
            { text: 'View Map', onPress: () => showTradersMap(traders) },
            { text: 'Close', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('No Traders Found', 'No traders found within 10km');
      }
    } catch (error) {
      Alert.alert('Location Error', 'Failed to find nearby traders');
    }
  };

  const handleNotificationDemo = async () => {
    try {
      nativeService.triggerHaptic('impactMedium');
      
      // Send demo notifications
      await notificationService.notifyTradeCompleted({
        tradeId: 'demo_trade',
        cardName: 'Charizard EX'
      });
      
      await notificationService.notifyPriceAlert({
        cardId: 'demo_card',
        cardName: 'Pikachu VMAX',
        currentPrice: 85,
        targetPrice: 80
      });
      
      Alert.alert(
        '🔔 Notifications Sent',
        'Check your notification tray for demo alerts',
        [{ text: 'Notification Settings', onPress: () => openNotificationSettings() }]
      );
    } catch (error) {
      Alert.alert('Notification Error', 'Failed to send notifications');
    }
  };

  const handleHapticDemo = () => {
    // Demonstrate different haptic patterns
    nativeService.triggerHaptic('impactLight');
    setTimeout(() => nativeService.triggerHaptic('impactMedium'), 200);
    setTimeout(() => nativeService.triggerHaptic('impactHeavy'), 400);
    setTimeout(() => nativeService.triggerCardFlipHaptic(), 600);
    setTimeout(() => nativeService.triggerTradeSuccessHaptic(), 1000);
    
    Alert.alert(
      '📳 Haptic Demo',
      'You should feel different vibration patterns',
      [{ text: 'Haptic Settings', onPress: () => openHapticSettings() }]
    );
  };

  const handlePhotoCapture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraService.capturePhoto(cameraRef.current);
        
        if (photo) {
          Alert.alert(
            '📷 Photo Captured',
            `High-quality photo saved\nSize: ${photo.width}x${photo.height}`,
            [
              { text: 'Add to Gallery', onPress: () => addToGallery(photo) },
              { text: 'Share', onPress: () => sharePhoto(photo) },
              { text: 'Close', style: 'cancel' }
            ]
          );
        }
      }
    } catch (error) {
      Alert.alert('Camera Error', 'Failed to capture photo');
    }
  };

  const handleARPreview = () => {
    nativeService.triggerHaptic('impactMedium');
    Alert.alert(
      '🌟 AR Card Preview',
      'AR features coming soon! View your cards in 3D space.',
      [{ text: 'Join Beta', onPress: () => joinARBeta() }]
    );
  };

  // ==================== HELPER METHODS ====================

  const addToCollection = (cardData: any) => {
    console.log('Adding card to collection:', cardData);
    nativeService.triggerHaptic('notificationSuccess');
  };

  const initiateTradeFromScan = (cardData: any) => {
    console.log('Initiating trade for:', cardData);
    // Navigate to trading screen with card
  };

  const viewTrade = (tradeId: string) => {
    console.log('Viewing trade:', tradeId);
    // Navigate to trade details
  };

  const openWallet = () => {
    console.log('Opening wallet');
    // Navigate to wallet screen
  };

  const showTradersMap = (traders: any[]) => {
    console.log('Showing traders map:', traders);
    // Open map view with trader locations
  };

  const openNotificationSettings = () => {
    console.log('Opening notification settings');
    // Navigate to notification settings
  };

  const openHapticSettings = () => {
    console.log('Opening haptic settings');
    // Navigate to haptic settings
  };

  const addToGallery = (photo: any) => {
    console.log('Adding to gallery:', photo);
    nativeService.triggerHaptic('notificationSuccess');
  };

  const sharePhoto = (photo: any) => {
    console.log('Sharing photo:', photo);
    // Open share dialog
  };

  const joinARBeta = () => {
    console.log('Joining AR beta');
    // Navigate to AR beta signup
  };

  // ==================== RENDER METHODS ====================

  const renderFeatureCard = (feature: NativeFeature) => {
    const getStatusColor = () => {
      switch (feature.status) {
        case 'available': return '#3EBA7C';
        case 'unavailable': return '#75715E';
        case 'permission_needed': return '#F92672';
        case 'initializing': return '#66D9EF';
        default: return '#75715E';
      }
    };

    const getStatusText = () => {
      switch (feature.status) {
        case 'available': return 'Ready';
        case 'unavailable': return 'Unavailable';
        case 'permission_needed': return 'Permission Needed';
        case 'initializing': return 'Initializing...';
        default: return 'Unknown';
      }
    };

    return (
      <TouchableOpacity
        key={feature.id}
        style={[styles.featureCard, { opacity: feature.status === 'available' ? 1 : 0.7 }]}
        onPress={feature.action}
        disabled={feature.status !== 'available'}
        activeOpacity={0.8}
      >
        <View style={styles.featureHeader}>
          <Text style={styles.featureIcon}>{feature.icon}</Text>
          {feature.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        {...cameraService.getCardScanSettings()}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
          console.log('Barcodes detected:', barcodes);
        }}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanInstructions}>
            Position card within the frame
          </Text>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowCamera(false);
              cameraService.stopCardScan();
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
    </View>
  );

  if (showCamera) {
    return renderCameraView();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#272822" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 Native Features</Text>
        <Text style={styles.headerSubtitle}>
          Advanced mobile capabilities for ECE
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isInitializing ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Initializing native services...</Text>
          </View>
        ) : (
          <View style={styles.featuresGrid}>
            {features.map(renderFeatureCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272822',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(39, 40, 34, 0.95)',
    backdropFilter: 'blur(20px)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8EFD6',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#75715E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    color: '#66D9EF',
    fontSize: 16,
  },
  featuresGrid: {
    gap: 15,
  },
  featureCard: {
    backgroundColor: 'rgba(248, 239, 214, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 217, 239, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 32,
  },
  premiumBadge: {
    backgroundColor: '#F92672',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  premiumText: {
    color: '#F8EFD6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8EFD6',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#75715E',
    marginBottom: 15,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanFrame: {
    width: width * 0.8,
    height: width * 0.6,
    borderWidth: 2,
    borderColor: '#66D9EF',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanInstructions: {
    color: '#F8EFD6',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(249, 38, 114, 0.9)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: '#F8EFD6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
