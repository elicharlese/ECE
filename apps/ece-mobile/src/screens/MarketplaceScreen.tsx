import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

interface Card {
  id: string;
  name: string;
  symbol: string;
  price: number;
  rarity: string;
  category: string;
  power: number;
  growth: number;
  change: number;
}

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  const mockCards: Card[] = [
    { id: '1', name: 'Microsoft Corp', symbol: 'MSFT', price: 1350, rarity: 'rare', category: 'tech', power: 95, growth: 88, change: 2.4 },
    { id: '2', name: 'Apple Inc', symbol: 'AAPL', price: 1050, rarity: 'epic', category: 'tech', power: 92, growth: 85, change: 1.8 },
    { id: '3', name: 'Tesla Inc', symbol: 'TSLA', price: 1950, rarity: 'legendary', category: 'tech', power: 98, growth: 95, change: -0.5 },
    { id: '4', name: 'Amazon.com', symbol: 'AMZN', price: 1920, rarity: 'epic', category: 'retail', power: 90, growth: 87, change: 1.2 },
    { id: '5', name: 'Johnson & Johnson', symbol: 'JNJ', price: 850, rarity: 'uncommon', category: 'healthcare', power: 78, growth: 65, change: 0.8 },
    { id: '6', name: 'JPMorgan Chase', symbol: 'JPM', price: 720, rarity: 'common', category: 'finance', power: 82, growth: 70, change: 1.5 },
  ];

  const categories = ['all', 'tech', 'finance', 'healthcare', 'energy', 'retail'];
  const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#A1A1AA';
      case 'uncommon': return '#A6E22E';
      case 'rare': return '#66D9EF';
      case 'epic': return '#F92672';
      case 'legendary': return '#FD971F';
      default: return '#A1A1AA';
    }
  };

  const renderCard = ({ item }: { item: Card }) => (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.card}
      >
        {/* Card Image */}
        <View style={styles.cardImageContainer}>
          <LinearGradient
            colors={['#F92672', '#66D9EF']}
            style={styles.cardImage}
          >
            <View style={styles.cardImageContent}>
              <Text style={styles.cardEmoji}>🏢</Text>
              <Text style={styles.cardCompany}>COMPANY</Text>
              <Text style={styles.cardSymbolOverlay}>{item.symbol}</Text>
            </View>
          </LinearGradient>
          
          {/* Rarity Badge */}
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
            <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
          </View>

          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${item.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Card Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardCategory}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)} • ${(item.price * 1000).toLocaleString()}M Cap
          </Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#A6E22E' }]}>{item.power}</Text>
              <Text style={styles.statLabel}>Power</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#66D9EF' }]}>{item.growth}</Text>
              <Text style={styles.statLabel}>Growth</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.offerButton}>
              <Text style={styles.offerButtonText}>Make Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
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
          <Text style={styles.headerTitle}>Marketplace</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>My Listings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerButton, styles.sellButton]}>
              <Text style={styles.sellButtonText}>Sell Cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cards..."
            placeholderTextColor="#A1A1AA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.filterChipTextActive
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Rarity</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {rarities.map(rarity => (
                <TouchableOpacity
                  key={rarity}
                  style={[
                    styles.filterChip,
                    selectedRarity === rarity && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedRarity(rarity)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedRarity === rarity && styles.filterChipTextActive
                  ]}>
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      {/* Market Stats */}
      <View style={styles.statsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { label: 'Total Cards', value: '2,847', color: '#66D9EF' },
            { label: '24h Volume', value: '$1.2M', color: '#A6E22E' },
            { label: 'Active Traders', value: '15,432', color: '#F92672' },
            { label: 'Avg Price', value: '$847', color: '#66D9EF' },
          ].map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statCardLabel}>{stat.label}</Text>
              <Text style={[styles.statCardValue, { color: stat.color }]}>{stat.value}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Cards Grid */}
      <FlatList
        data={mockCards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  sellButton: {
    backgroundColor: '#66D9EF',
    borderColor: '#66D9EF',
  },
  sellButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  searchSection: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#F0FDFA',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#66D9EF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  filtersContainer: {
    maxHeight: 120,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#66D9EF',
    borderColor: '#66D9EF',
  },
  filterChipText: {
    fontSize: 12,
    color: '#F0FDFA',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    width: (width - 60) / 2,
    marginRight: 20,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
  },
  cardImage: {
    aspectRatio: 3/4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageContent: {
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  cardSymbolOverlay: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  rarityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  cardInfo: {
    padding: 16,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0FDFA',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#A1A1AA',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#66D9EF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  offerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  offerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F0FDFA',
  },
});