import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LandingScreenProps {
  onEnterPlatform: () => void;
  onViewPricing: () => void;
}

export function LandingScreen({ onEnterPlatform, onViewPricing }: LandingScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ECE Trading Cards</Text>
          <Text style={styles.subtitle}>
            Trade, battle, and build portfolios of technology product cards. Powered by ECE tokens and wallet authentication.
          </Text>
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={onEnterPlatform}>
            <Text style={styles.primaryButtonText}>Enter Platform</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={onViewPricing}>
            <Text style={styles.secondaryButtonText}>Pricing</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Marketplace</Text>
            <Text style={styles.featureDescription}>
              Bid, bet, and battle with real-time analytics.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Discover</Text>
            <Text style={styles.featureDescription}>
              Swipe to match and find high-potential cards.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Portfolio</Text>
            <Text style={styles.featureDescription}>
              Track value, trades, and performance.
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
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
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flexGrow: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuresContainer: {
    marginBottom: 40,
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
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
