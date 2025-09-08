import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

interface Holding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  avgCost: number;
  currentValue: number;
  change: number;
}

export default function PortfolioScreen() {
  const [selectedView, setSelectedView] = useState<'overview' | 'holdings' | 'performance'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  const mockHoldings: Holding[] = [
    { id: '1', name: 'Microsoft Corp', symbol: 'MSFT', quantity: 5, avgCost: 1200, currentValue: 1350, change: 12.5 },
    { id: '2', name: 'Apple Inc', symbol: 'AAPL', quantity: 3, avgCost: 980, currentValue: 1050, change: 7.1 },
    { id: '3', name: 'Tesla Inc', symbol: 'TSLA', quantity: 2, avgCost: 2100, currentValue: 1950, change: -7.1 },
    { id: '4', name: 'Amazon.com', symbol: 'AMZN', quantity: 4, avgCost: 1800, currentValue: 1920, change: 6.7 },
  ];

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Portfolio Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Portfolio Performance</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartIcon}>📈</Text>
          <Text style={styles.chartText}>Performance chart will be displayed here</Text>
        </View>
      </View>

      {/* Allocation */}
      <View style={styles.allocationContainer}>
        <Text style={styles.sectionTitle}>Allocation</Text>
        <View style={styles.allocationList}>
          {[
            { sector: 'Technology', percentage: 45, color: '#66D9EF' },
            { sector: 'Healthcare', percentage: 25, color: '#A6E22E' },
            { sector: 'Finance', percentage: 20, color: '#F92672' },
            { sector: 'Energy', percentage: 10, color: '#FD971F' },
          ].map((item, index) => (
            <View key={index} style={styles.allocationItem}>
              <View style={styles.allocationHeader}>
                <Text style={styles.allocationSector}>{item.sector}</Text>
                <Text style={styles.allocationPercentage}>{item.percentage}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percentage}%`, backgroundColor: item.color }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderHoldings = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {mockHoldings.map((holding) => (
        <View key={holding.id} style={styles.holdingCard}>
          <View style={styles.holdingLeft}>
            <LinearGradient
              colors={['#F92672', '#66D9EF']}
              style={styles.holdingIcon}
            />
            <View style={styles.holdingInfo}>
              <Text style={styles.holdingName}>{holding.name}</Text>
              <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
              <Text style={styles.holdingQuantity}>Qty: {holding.quantity}</Text>
            </View>
          </View>
          <View style={styles.holdingRight}>
            <Text style={styles.holdingValue}>${holding.currentValue.toLocaleString()}</Text>
            <Text style={[styles.holdingChange, { color: holding.change >= 0 ? '#A6E22E' : '#F92672' }]}>
              {holding.change >= 0 ? '+' : ''}{holding.change}%
            </Text>
            <View style={styles.holdingActions}>
              <TouchableOpacity style={styles.sellButton}>
                <Text style={styles.sellButtonText}>Sell</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tradeButton}>
                <Text style={styles.tradeButtonText}>Trade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderPerformance = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Performance Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        {[
          { label: 'Total Return', value: '+28.4%', subtext: 'Since inception' },
          { label: 'Annualized Return', value: '+15.2%', subtext: 'Average yearly' },
          { label: 'Sharpe Ratio', value: '1.34', subtext: 'Risk-adjusted return' },
          { label: 'Max Drawdown', value: '-8.7%', subtext: 'Largest decline' },
        ].map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <View style={styles.metricLeft}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricSubtext}>{metric.subtext}</Text>
            </View>
            <Text style={styles.metricValue}>{metric.value}</Text>
          </View>
        ))}
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {[
          { type: 'Buy', card: 'MSFT', quantity: 2, price: 1350, date: '2 hours ago' },
          { type: 'Sell', card: 'GOOGL', quantity: 1, price: 2100, date: '1 day ago' },
          { type: 'Buy', card: 'AAPL', quantity: 3, price: 1050, date: '2 days ago' },
        ].map((transaction, index) => (
          <View key={index} style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <View style={[
                styles.transactionType,
                { backgroundColor: transaction.type === 'Buy' ? '#A6E22E' : '#F92672' }
              ]}>
                <Text style={styles.transactionTypeText}>
                  {transaction.type === 'Buy' ? 'B' : 'S'}
                </Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {transaction.type} {transaction.card}
                </Text>
                <Text style={styles.transactionDetails}>
                  {transaction.quantity} cards @ ${transaction.price}
                </Text>
              </View>
            </View>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

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
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Portfolio</Text>
            <TouchableOpacity style={styles.portfolioSelector}>
              <Text style={styles.portfolioSelectorText}>Main Portfolio ▼</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={() => setShowCreateModal(true)}>
              <Text style={styles.headerButtonText}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerButton, styles.addButton]}>
              <Text style={styles.addButtonText}>Add Cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Portfolio Summary */}
      <View style={styles.summarySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { label: 'Total Value', value: '$28,450', change: '+$2,340 (8.9%)', positive: true },
            { label: 'Total Cards', value: '14', change: 'Across 4 sectors', neutral: true },
            { label: 'Daily P&L', value: '+$450', change: '+1.6%', positive: true },
            { label: 'Best Performer', value: 'MSFT', change: '+12.5%', positive: true },
          ].map((stat, index) => (
            <View key={index} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{stat.label}</Text>
              <Text style={[
                styles.summaryValue,
                { color: stat.label === 'Total Value' ? '#66D9EF' : '#F0FDFA' }
              ]}>
                {stat.value}
              </Text>
              <Text style={[
                styles.summaryChange,
                {
                  color: stat.neutral ? '#A1A1AA' : stat.positive ? '#A6E22E' : '#F92672'
                }
              ]}>
                {stat.change}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* View Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'holdings', label: 'Holdings' },
          { id: 'performance', label: 'Performance' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedView === tab.id && styles.tabActive
            ]}
            onPress={() => setSelectedView(tab.id as 'overview' | 'holdings' | 'performance')}
          >
            <Text style={[
              styles.tabText,
              selectedView === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'holdings' && renderHoldings()}
        {selectedView === 'performance' && renderPerformance()}
      </View>

      {/* Create Portfolio Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Portfolio</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Portfolio name..."
              placeholderTextColor="#A1A1AA"
              value={newPortfolioName}
              onChangeText={setNewPortfolioName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setNewPortfolioName('');
                  setShowCreateModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0FDFA',
    marginBottom: 4,
  },
  portfolioSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  portfolioSelectorText: {
    fontSize: 12,
    color: '#F0FDFA',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerButtonText: {
    fontSize: 12,
    color: '#F0FDFA',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#66D9EF',
    borderColor: '#66D9EF',
  },
  addButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  summarySection: {
    paddingVertical: 20,
    paddingLeft: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    minWidth: 140,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  summaryChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#66D9EF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A1A1AA',
  },
  tabTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 16,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 40,
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
  allocationContainer: {
    marginBottom: 24,
  },
  allocationList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
  },
  allocationItem: {
    marginBottom: 16,
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  allocationSector: {
    fontSize: 14,
    color: '#F0FDFA',
  },
  allocationPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0FDFA',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  holdingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  holdingQuantity: {
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
    marginBottom: 8,
  },
  holdingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  sellButton: {
    backgroundColor: 'rgba(249, 38, 114, 0.2)',
    borderWidth: 1,
    borderColor: '#F92672',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sellButtonText: {
    fontSize: 10,
    color: '#F92672',
    fontWeight: '600',
  },
  tradeButton: {
    backgroundColor: 'rgba(102, 217, 239, 0.2)',
    borderWidth: 1,
    borderColor: '#66D9EF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tradeButtonText: {
    fontSize: 10,
    color: '#66D9EF',
    fontWeight: '600',
  },
  metricsContainer: {
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLeft: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 2,
  },
  metricSubtext: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#66D9EF',
  },
  transactionsContainer: {
    marginBottom: 24,
  },
  transactionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionType: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 2,
  },
  transactionDetails: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  transactionDate: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#272822',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#F0FDFA',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#66D9EF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalCancelButtonText: {
    color: '#F0FDFA',
  },
});
