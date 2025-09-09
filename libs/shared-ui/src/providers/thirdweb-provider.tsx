'use client';

import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect } from '@thirdweb-dev/react';
import { Ethereum, Polygon, Arbitrum } from '@thirdweb-dev/chains';
import { ReactNode } from 'react';

interface ECEThirdwebProviderProps {
  children: ReactNode;
}

const supportedWallets = [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnect(),
];

const supportedChains = [
  Ethereum,
  Polygon,
  Arbitrum,
];

export function ECEThirdwebProvider({ children }: ECEThirdwebProviderProps) {
  return (
    <ThirdwebProvider
      activeChain={Ethereum}
      supportedChains={supportedChains}
      supportedWallets={supportedWallets}
      clientId={process.env['NEXT_PUBLIC_THIRDWEB_CLIENT_ID'] || 'your_client_id'}
      authConfig={{
        domain: process.env['NEXT_PUBLIC_BASE_URL'] || 'http://localhost:3000',
        authUrl: '/api/auth',
      }}
    >
      {children}
    </ThirdwebProvider>
  );
}
