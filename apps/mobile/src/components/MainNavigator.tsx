import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useECEWallet } from '@ece-platform/shared-ui';
import type { User, Card } from '@ece-platform/shared-types';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CardsScreen } from '../screens/CardsScreen';
import { TradingScreen } from '../screens/TradingScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import { LandingScreen } from '../screens/LandingScreen';

type TabName = 'landing' | 'dashboard' | 'cards' | 'trading' | 'portfolio';

export function MainNavigator() {
  const [activeTab, setActiveTab] = useState<TabName>('landing');
  const { address, eceBalance } = useECEWallet();

  const handleEnterPlatform = () => {
    setActiveTab('dashboard');
  };

  const handleViewPricing = () => {
    // Could navigate to pricing or open external link
    setActiveTab('dashboard');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingScreen 
            onEnterPlatform={handleEnterPlatform}
            onViewPricing={handleViewPricing}
          />
        );
      case 'dashboard':
        return <DashboardScreen />;
      case 'cards':
        return <CardsScreen />;
      case 'trading':
        return <TradingScreen />;
      case 'portfolio':
        return <PortfolioScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  // Show landing screen without header/nav if on landing
  if (activeTab === 'landing') {
    return (
      <View style={styles.container}>
        {renderScreen()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ECE Trading Cards</Text>
        <View style={styles.walletInfo}>
          <Text style={styles.balance}>{eceBalance} ECE</Text>
          <Text style={styles.address}>
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {(['dashboard', 'cards', 'trading', 'portfolio'] as TabName[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.navItem, activeTab === tab && styles.activeNavItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.navText, activeTab === tab && styles.activeNavText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F92672',
  },
  walletInfo: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A6E22E',
  },
  address: {
    fontSize: 12,
    color: '#66D9EF',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeNavItem: {
    backgroundColor: '#F92672',
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  activeNavText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
