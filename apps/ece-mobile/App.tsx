import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';

type AppState = 'splash' | 'auth' | 'main';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');

  const handleSplashComplete = () => {
    setAppState('auth');
  };

  const handleAuthComplete = () => {
    setAppState('main');
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'auth') {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>ECE Trading Cards Mobile</Text>
        <Text style={styles.subtitle}>M&A Trading Cards Platform</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to ECE Cards</Text>
          <Text style={styles.cardText}>
            Experience the future of M&A trading with our mobile platform.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setAppState('splash')}>
          <Text style={styles.buttonText}>Return to Splash</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272822',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F92672',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#66D9EF',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#A1A1AA',
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'rgba(249, 38, 114, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F92672',
  },
  buttonText: {
    fontSize: 16,
    color: '#F92672',
    fontWeight: '600',
    textAlign: 'center',
  },
});
