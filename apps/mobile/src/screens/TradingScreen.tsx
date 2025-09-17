import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TradingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trading</Text>
      <Text style={styles.subtitle}>Buy, sell, and trade cards</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F92672',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#66D9EF',
  },
});