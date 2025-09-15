/**
 * Card Scanner Component with Mobile-Native Features
 * Integrates camera, NFC, biometrics, and haptic feedback
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import MobileNativeService from '../services/MobileNativeService';
import CameraService, { CardDetectionResult } from '../services/CameraService';
import BiometricService from '../services/BiometricService';

const { width, height } = Dimensions.get('window');

interface CardScannerProps {
  onCardDetected: (card: CardDetectionResult) => void;
  onClose: () => void;
  enableNFC?: boolean;
  requireBiometric?: boolean;
}

export const CardScanner: React.FC<CardScannerProps> = ({
  onCardDetected,
  onClose,
  enableNFC = true,
  requireBiometric = false,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedCard, setDetectedCard] = useState<CardDetectionResult | null>(null);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.auto);
  const [nfcReady, setNfcReady] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  
  const cameraRef = useRef<RNCamera>(null);
  const nativeService = MobileNativeService.getInstance();
  const cameraService = CameraService.getInstance();
  const biometricService = BiometricService.getInstance();
  
  // Animations
  const scanLineAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    initializeServices();
    startScanAnimation();
    
    return () => {
      cameraService.stopCardScan();
    };
  }, []);

  const initializeServices = async () => {
    try {
      // Initialize native services
      await nativeService.initialize();
      
      // Check biometric requirements
      if (requireBiometric) {
        const biometricCapabilities = await biometricService.initialize();
        if (biometricCapabilities.isAvailable) {
          const authResult = await biometricService.authenticateForWallet();
          setBiometricAuth(authResult.success);
          if (!authResult.success) {
            Alert.alert('Authentication Required', 'Biometric authentication is required to scan cards');
            onClose();
            return;
          }
        }
      }

      // Start card scanning
      cameraService.startCardScan(handleCardDetection);
      setIsScanning(true);
      
      // Enable NFC if requested
      if (enableNFC) {
        setNfcReady(true);
      }
    } catch (error) {
      console.error('Scanner initialization failed:', error);
      Alert.alert('Scanner Error', 'Failed to initialize card scanner');
    }
  };

  const startScanAnimation = () => {
    // Scan line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for detection
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleCardDetection = (card: CardDetectionResult) => {
    if (!isScanning) return;

    setDetectedCard(card);
    nativeService.triggerCardFlipHaptic();

    // Animate overlay for successful detection
    Animated.timing(overlayOpacity, {
      toValue: 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-confirm high confidence detections
    if (card.confidence > 0.95) {
      setTimeout(() => confirmCard(card), 1000);
    }
  };

  const confirmCard = (card: CardDetectionResult) => {
    nativeService.triggerTradeSuccessHaptic();
    setIsScanning(false);
    onCardDetected(card);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      nativeService.triggerHaptic('impactMedium');
      const photo = await cameraService.capturePhoto(cameraRef.current);
      
      if (photo) {
        Alert.alert('Photo Captured', 'Card photo saved to your collection!');
      }
    } catch (error) {
      console.error('Photo capture failed:', error);
      Alert.alert('Capture Failed', 'Unable to capture photo');
    }
  };

  const toggleFlash = () => {
    const modes = [
      RNCamera.Constants.FlashMode.off,
      RNCamera.Constants.FlashMode.on,
      RNCamera.Constants.FlashMode.auto,
      RNCamera.Constants.FlashMode.torch,
    ];
    const currentIndex = modes.indexOf(flashMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setFlashMode(nextMode);
    nativeService.triggerHaptic('impactLight');
  };

  const startNFCTrade = async () => {
    if (!nfcReady || !detectedCard) return;

    try {
      nativeService.triggerHaptic('impactMedium');
      const tradeData = await nativeService.startNFCTrade([detectedCard.cardId]);
      
      if (tradeData) {
        Alert.alert(
          'NFC Trade Initiated',
          `Trade started with ${tradeData.toUserId}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => confirmNFCTrade(tradeData) }
          ]
        );
      }
    } catch (error) {
      console.error('NFC trade failed:', error);
      Alert.alert('NFC Error', 'Failed to initiate NFC trade');
    }
  };

  const confirmNFCTrade = async (tradeData: any) => {
    if (requireBiometric) {
      const authResult = await biometricService.authenticateForTrading();
      if (!authResult.success) {
        Alert.alert('Authentication Failed', 'Biometric authentication required for trading');
        return;
      }
    }

    nativeService.triggerTradeSuccessHaptic();
    Alert.alert('Trade Confirmed', 'NFC trade completed successfully!');
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case RNCamera.Constants.FlashMode.off: return '🔦';
      case RNCamera.Constants.FlashMode.on: return '💡';
      case RNCamera.Constants.FlashMode.auto: return '⚡';
      case RNCamera.Constants.FlashMode.torch: return '🔆';
      default: return '🔦';
    }
  };

  const scanLineTransform = {
    transform: [
      {
        translateY: scanLineAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 300],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        flashMode={flashMode}
        {...cameraService.getCardScanSettings()}
        captureAudio={false}
      >
        {/* Overlay */}
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          {/* Scan Frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Scanning Line */}
            {isScanning && (
              <Animated.View style={[styles.scanLine, scanLineTransform]} />
            )}
          </View>

          {/* Detection Info */}
          {detectedCard && (
            <Animated.View style={[styles.detectionInfo, { transform: [{ scale: pulseAnimation }] }]}>
              <Text style={styles.cardName}>{detectedCard.cardName}</Text>
              <Text style={styles.cardDetails}>
                {detectedCard.rarity} • {detectedCard.condition}
              </Text>
              <Text style={styles.confidence}>
                {Math.round(detectedCard.confidence * 100)}% confidence
              </Text>
              <Text style={styles.estimatedValue}>
                Estimated Value: ${detectedCard.estimatedValue}
              </Text>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => confirmCard(detectedCard)}
              >
                <Text style={styles.confirmButtonText}>Confirm Card</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Status Text */}
          {!detectedCard && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>
                {isScanning ? 'Point camera at a trading card' : 'Initializing scanner...'}
              </Text>
              {biometricAuth && (
                <Text style={styles.authStatus}>🔐 Biometric authentication enabled</Text>
              )}
              {nfcReady && (
                <Text style={styles.nfcStatus}>📲 NFC ready for trading</Text>
              )}
            </View>
          )}
        </Animated.View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={onClose}>
            <Text style={styles.controlButtonText}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={capturePhoto}>
            <Text style={styles.controlButtonText}>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Text style={styles.controlButtonText}>{getFlashIcon()}</Text>
          </TouchableOpacity>

          {nfcReady && detectedCard && (
            <TouchableOpacity style={styles.nfcButton} onPress={startNFCTrade}>
              <Text style={styles.controlButtonText}>📲</Text>
            </TouchableOpacity>
          )}
        </View>
      </RNCamera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.8,
    height: width * 0.8 * 0.63, // Card aspect ratio
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#A6E22E',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#66D9EF',
    shadowColor: '#66D9EF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  detectionInfo: {
    marginTop: 40,
    backgroundColor: 'rgba(39, 40, 34, 0.9)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8EFD6',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDetails: {
    fontSize: 16,
    color: '#66D9EF',
    textAlign: 'center',
    marginBottom: 8,
  },
  confidence: {
    fontSize: 14,
    color: '#A6E22E',
    textAlign: 'center',
    marginBottom: 8,
  },
  estimatedValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E6DB74',
    textAlign: 'center',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#F92672',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  confirmButtonText: {
    color: '#F8EFD6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    color: '#F8EFD6',
    textAlign: 'center',
    marginBottom: 10,
  },
  authStatus: {
    fontSize: 14,
    color: '#A6E22E',
    textAlign: 'center',
    marginBottom: 5,
  },
  nfcStatus: {
    fontSize: 14,
    color: '#66D9EF',
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(39, 40, 34, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#75715E',
  },
  nfcButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(102, 217, 239, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#66D9EF',
  },
  controlButtonText: {
    fontSize: 20,
    color: '#F8EFD6',
  },
});

export default CardScanner;
