import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideAnim, onComplete]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#272822', '#134E4A', '#0F766E']}
        style={styles.gradient}
      />

      {/* Animated Background Elements */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle1,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle2,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#F92672', '#66D9EF']}
            style={styles.logo}
          />
          <Text style={styles.logoText}>ECE Cards</Text>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>M&A Trading Cards</Text>
          <Text style={styles.subtitle}>
            Master Corporate Takeovers with Strategic Trading Cards
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: '#A6E22E' }]} />
            <Text style={styles.featureText}>Collect Corporate Cards</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: '#66D9EF' }]} />
            <Text style={styles.featureText}>Trade & Invest in M&A</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: '#F92672' }]} />
            <Text style={styles.featureText}>Join M&A Community</Text>
          </View>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View
          style={[
            styles.ctaContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.ctaButton} onPress={onComplete}>
            <LinearGradient
              colors={['#F92672', '#66D9EF']}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.stat}>
            <Text style={styles.statValue}>100K+</Text>
            <Text style={styles.statLabel}>Active Collectors</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>1M+</Text>
            <Text style={styles.statLabel}>Cards Traded</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>$50M+</Text>
            <Text style={styles.statLabel}>Total Volume</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272822',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.2,
  },
  circle1: {
    width: 400,
    height: 400,
    backgroundColor: '#14B8A6',
    top: -100,
    left: -100,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: '#F92672',
    bottom: -50,
    right: -50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F0FDFA',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0FDFA',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#F0FDFA',
  },
  ctaContainer: {
    marginBottom: 40,
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#66D9EF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    textAlign: 'center',
  },
});
