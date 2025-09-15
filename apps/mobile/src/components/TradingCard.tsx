import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

interface TradingCardProps {
  card: {
    id: string;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    price: number;
    image?: string;
    stats?: {
      attack: number;
      defense: number;
      speed: number;
    };
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
}

const { width } = Dimensions.get('window');

// Beach Monokai Color Palette
const colors = {
  accent: '#F92672',
  success: '#A6E22E',
  info: '#66D9EF',
  secondary: '#E6DB74',
  light: '#F8EFD6',
  dark: '#272822',
  primary: '#819AFF',
  successTone: '#3EBA7C',
  muted: '#75715E',
  alert: '#FD5C63',
};

export const TradingCard: React.FC<TradingCardProps> = ({
  card,
  onSwipeLeft,
  onSwipeRight,
  onTap,
}) => {
  const rarityColors = {
    common: colors.muted,
    rare: colors.info,
    epic: colors.success,
    legendary: colors.accent,
  };

  return (
    <View style={styles.cardContainer}>
      {/* Glass Card with Backdrop Blur Effect */}
      <View style={[styles.glassCard, { borderColor: rarityColors[card.rarity] }]}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={onTap}
          activeOpacity={0.9}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardName} numberOfLines={2}>
              {card.name}
            </Text>
            <View
              style={[
                styles.rarityBadge,
                { backgroundColor: rarityColors[card.rarity] },
              ]}
            >
              <Text style={styles.rarityText}>{card.rarity.toUpperCase()}</Text>
            </View>
          </View>

          {/* Card Image Placeholder */}
          <View style={styles.cardImageContainer}>
            <View
              style={[
                styles.cardImage,
                { borderColor: rarityColors[card.rarity] },
              ]}
            >
              <Text style={styles.cardImageText}>✦</Text>
              <View style={styles.cardImageOverlay}>
                <Text style={styles.cardImageLabel}>ECE CARD</Text>
              </View>
            </View>
          </View>

          {/* Card Stats */}
          {card.stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>ATK</Text>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  {card.stats.attack}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>DEF</Text>
                <Text style={[styles.statValue, { color: colors.info }]}>
                  {card.stats.defense}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>SPD</Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {card.stats.speed}
                </Text>
              </View>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Market Price</Text>
            <Text style={styles.priceValue}>${card.price.toFixed(2)}</Text>
          </View>

          {/* Trading Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.passButton]}
              onPress={onSwipeLeft}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonIcon}>👎</Text>
              <Text style={styles.actionButtonText}>PASS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.tradeButton]}
              onPress={onSwipeRight}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonIcon}>🤝</Text>
              <Text style={styles.actionButtonText}>TRADE</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.9,
    height: 650,
    alignSelf: 'center',
    marginVertical: 20,
  },
  glassCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(248, 239, 214, 0.08)',
    borderWidth: 2,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    // Android Shadow
    elevation: 12,
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light,
    flex: 1,
    marginRight: 15,
  },
  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  rarityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.dark,
  },
  cardImageContainer: {
    flex: 1,
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    backgroundColor: 'rgba(39, 40, 34, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
    position: 'relative',
  },
  cardImageText: {
    fontSize: 80,
    color: colors.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(39, 40, 34, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cardImageLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.muted,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    padding: 18,
    backgroundColor: 'rgba(39, 40, 34, 0.4)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(129, 154, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 6,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(230, 219, 116, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(230, 219, 116, 0.3)',
  },
  priceLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 6,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android Shadow
    elevation: 6,
  },
  passButton: {
    backgroundColor: 'rgba(253, 92, 99, 0.9)',
  },
  tradeButton: {
    backgroundColor: 'rgba(249, 38, 114, 0.9)',
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.light,
  },
});
