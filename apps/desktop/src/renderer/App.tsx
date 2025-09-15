import React from 'react';
import { ECEThirdwebProvider } from '@ece-platform/shared-ui';
import { ECEWalletGuard } from '@ece-platform/shared-ui';
import { MainLayout } from './components/MainLayout';
import './styles/globals.css';

export default function App() {
  return (
    <ECEThirdwebProvider>
      <ECEWalletGuard>
        <MainLayout />
      </ECEWalletGuard>
    </ECEThirdwebProvider>
  );
}
