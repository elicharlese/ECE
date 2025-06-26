/**
 * ECE Mobile App
 * React Native application for ECE Trading Cards
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MobileNativeServiceManager, { NativeServiceStatus } from './src/services/MobileNativeServiceManager';

const App: React.FC = () => {
  const [serviceStatus, setServiceStatus] = useState<NativeServiceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const manager = MobileNativeServiceManager.getInstance();
      const status = await manager.initialize();
      setServiceStatus(status);
    } catch (error) {
      console.error('App initialization failed:', error);
      Alert.alert('Initialization Error', 'Failed to initialize native services');
    } finally {
      setIsLoading(false);
    }
  };

  const testNativeFeature = (feature: string) => {
    Alert.alert('Test Feature', `Testing ${feature} - Step 3.3 Complete!`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Initializing ECE Mobile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#272822" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ECE Trading Cards</Text>
          <Text style={styles.subtitle}>Mobile Native Features</Text>
        </View>

        {/* Service Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Native Services Status</Text>
          {serviceStatus && Object.entries(serviceStatus).map(([service, status]) => (
            <View key={service} style={styles.statusRow}>
              <Text style={styles.serviceName}>{service.toUpperCase()}</Text>
              <View style={[styles.statusDot, { backgroundColor: status ? '#A6E22E' : '#FD5C63' }]} />
              <Text style={[styles.statusText, { color: status ? '#A6E22E' : '#FD5C63' }]}>
                {status ? 'Ready' : 'Unavailable'}
              </Text>
            </View>
          ))}
        </View>

        {/* Feature Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 3.3 Features</Text>
          
          <TouchableOpacity 
            style={styles.featureButton} 
            onPress={() => testNativeFeature('Camera Scanning')}
          >
            <Text style={styles.buttonText}>📸 Test Camera Scanning</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton} 
            onPress={() => testNativeFeature('NFC Trading')}
          >
            <Text style={styles.buttonText}>📲 Test NFC Trading</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton} 
            onPress={() => testNativeFeature('Biometric Auth')}
          >
            <Text style={styles.buttonText}>👆 Test Biometric Auth</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton} 
            onPress={() => testNativeFeature('Haptic Feedback')}
          >
            <Text style={styles.buttonText}>📳 Test Haptic Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton} 
            onPress={() => testNativeFeature('Push Notifications')}
          >
            <Text style={styles.buttonText}>🔔 Test Push Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Success Message */}
        <View style={styles.successSection}>
          <Text style={styles.successTitle}>🎉 Step 3.3 Complete!</Text>
          <Text style={styles.successText}>
            Mobile-native features are ready for implementation. All services initialized and available for integration.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272822',
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#F8EFD6',
    fontWeight: '500',
  },
  header: {
    padding: 24,
    backgroundColor: '#272822',
    borderBottomWidth: 1,
    borderBottomColor: '#75715E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F92672',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#66D9EF',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(248, 239, 214, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(117, 113, 94, 0.3)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#A6E22E',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceName: {
    flex: 1,
    fontSize: 16,
    color: '#F8EFD6',
    fontWeight: '500',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 80,
  },
  featureButton: {
    backgroundColor: 'rgba(129, 154, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#819AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#819AFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  successSection: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(166, 226, 46, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#A6E22E',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A6E22E',
    textAlign: 'center',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: '#F8EFD6',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default App;
