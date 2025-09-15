import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { ECEThirdwebProvider } from '@ece-platform/shared-ui';
import { ECEWalletGuard } from '@ece-platform/shared-ui';
import { MainNavigator } from './components/MainNavigator';

export default function App() {
  return (
    <ECEThirdwebProvider>
      <View style={styles.container}>
        <ECEWalletGuard>
          <MainNavigator />
        </ECEWalletGuard>
        <StatusBar style="auto" />
      </View>
    </ECEThirdwebProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
