import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useECEStore } from '@ece-platform/shared-business-logic';
import { useECEWallet } from '@ece-platform/shared-ui';
import type { User, Portfolio } from '@ece-platform/shared-types';

export function DashboardScreen() {
  const { user, activePortfolio, portfolios } = useECEStore();
  const { address, eceBalance } = useECEWallet();
  const [stats, setStats] = useState({
    totalCards: 0,
    totalValue: 0,
    activeTrades: 0,
  });

  useEffect(() => {
    // Calculate dashboard stats
    if (activePortfolio) {
      setStats({
        totalCards: activePortfolio.cards?.length || 0,
        totalValue: activePortfolio.totalValue || 0,
        activeTrades: 0, // TODO: Calculate from active trades
      });
    }
  }, [activePortfolio]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to ECE</Text>
          <Text style={styles.welcomeSubtitle}>
            {user?.name || 'Trader'}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalCards}</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{eceBalance}</Text>
            <Text style={styles.statLabel}>ECE Balance</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalValue.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Portfolio Value</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeTrades}</Text>
            <Text style={styles.statLabel}>Active Trades</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Welcome to ECE Trading Cards!</Text>
            <Text style={styles.activityTime}>Just now</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F92672',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#66D9EF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A6E22E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  activitySection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  activityItem: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  activityText: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});
