import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@ece-platform/shared-ui';
import { GlassCard } from '@ece-platform/shared-ui';
import { WalletConnectButton, useECEWallet } from '@ece-platform/shared-ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthScreen() {
  const { isConnected, address, eceBalance } = useECEWallet();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      // Redirect to dashboard or previous page after successful auth
      const returnUrl = new URLSearchParams(window.location.search).get('return') || '/';
      router.push(returnUrl);
    }
  }, [isConnected, address, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            ECE Authentication
          </h1>
          
          <p className="text-gray-300">
            Connect your Web3 wallet to access the ECE Trading Cards platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-8">
            {!isConnected ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Secure Wallet Authentication
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Wallet className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">Connect with any Web3 wallet</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="text-sm">Instant access to ECE tokens</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span className="text-sm">Secure & decentralized</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <WalletConnectButton className="w-full" />
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Successfully Connected!
                  </h2>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
                    <div className="text-white font-mono text-sm break-all">
                      {address}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
                    <div className="text-sm text-gray-400 mb-1">ECE Balance</div>
                    <div className="text-2xl font-bold text-green-400">
                      {eceBalance} ECE
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Continue to Platform
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-400">
            New to Web3 wallets?{' '}
            <a 
              href="https://metamask.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Get MetaMask
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
