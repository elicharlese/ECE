import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const stats = [
    { label: 'Portfolio Value', value: '$28,450', change: '+8.9%', positive: true },
    { label: 'Active Trades', value: '12', change: '+3', positive: true },
    { label: 'Cards Owned', value: '47', change: '+5', positive: true },
    { label: 'Daily P&L', value: '+$2,450', change: '+1.6%', positive: true },
  ];

  const holdings = [
    { name: 'Microsoft Corp', symbol: 'MSFT', value: '$12,450', change: '+2.4%', positive: true },
    { name: 'Apple Inc', symbol: 'AAPL', value: '$8,920', change: '+1.8%', positive: true },
    { name: 'Tesla Inc', symbol: 'TSLA', value: '$6,750', change: '-0.5%', positive: false },
  ];

  const quickActions = [
    { icon: '🛒', label: 'Buy Cards', color: '#66D9EF' },
    { icon: '💸', label: 'Sell Cards', color: '#F92672' },
    { icon: '🔄', label: 'Trade Offers', color: '#A6E22E' },
    { icon: '📊', label: 'Analytics', color: '#FD971F' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#272822', '#134E4A', '#0F766E']}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#F92672', '#66D9EF']}
              style={styles.logo}
            />
            <Text style={styles.logoText}>ECE Cards</Text>
          </View>
          
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileText}>JD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back, John!</Text>
          <Text style={styles.welcomeSubtext}>Here's your portfolio overview</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={[styles.statChange, { color: stat.positive ? '#A6E22E' : '#F92672' }]}>
                {stat.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Text style={styles.actionEmoji}>{action.icon}</Text>
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Portfolio Performance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Portfolio Performance</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Chart Placeholder */}
          <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartIcon}>📈</Text>
              <Text style={styles.chartText}>Portfolio chart</Text>
            </View>
          </View>
        </View>

        {/* Top Holdings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Holdings</Text>
          <View style={styles.holdingsContainer}>
            {holdings.map((holding, index) => (
              <TouchableOpacity key={index} style={styles.holdingCard}>
                <View style={styles.holdingLeft}>
                  <LinearGradient
                    colors={['#F92672', '#66D9EF']}
                    style={styles.holdingIcon}
                  />
                  <View style={styles.holdingInfo}>
                    <Text style={styles.holdingName}>{holding.name}</Text>
                    <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                  </View>
                </View>
                <View style={styles.holdingRight}>
                  <Text style={styles.holdingValue}>{holding.value}</Text>
                  <Text style={[styles.holdingChange, { color: holding.positive ? '#A6E22E' : '#F92672' }]}>
                    {holding.change}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Market Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Trends</Text>
          <View style={styles.trendsContainer}>
            {[
              { name: 'Tech Sector', change: '+5.2%', positive: true },
              { name: 'Healthcare', change: '+2.1%', positive: true },
              { name: 'Energy', change: '-1.3%', positive: false },
              { name: 'Finance', change: '+0.8%', positive: true },
            ].map((trend, index) => (
              <View key={index} style={styles.trendItem}>
                <Text style={styles.trendName}>{trend.name}</Text>
                <Text style={[styles.trendChange, { color: trend.positive ? '#A6E22E' : '#F92672' }]}>
                  {trend.change}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0FDFA',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0FDFA',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0FDFA',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#A1A1AA',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginRight: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0FDFA',
    marginBottom: 2,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#66D9EF',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0FDFA',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  chartPlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  chartText: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  holdingsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  holdingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  holdingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 2,
  },
  holdingSymbol: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 2,
  },
  holdingChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  trendName: {
    fontSize: 14,
    color: '#F0FDFA',
  },
  trendChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
