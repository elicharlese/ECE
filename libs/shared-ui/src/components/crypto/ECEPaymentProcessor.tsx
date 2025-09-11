'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../lib/button';
import { GlassCard } from '../../lib/glass-card';
import { useCryptoWallet } from '../../hooks/useCryptoWallet';
import { PaymentRequest, ConversionRate, SwapQuote } from '@ece-platform/shared-types';
import {
  DollarSign,
  ArrowRightLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calculator,
  TrendingUp,
  Shield,
  Zap,
  Info
} from 'lucide-react';

interface ECEPaymentProcessorProps {
  amount: number;
  currency: 'USD' | 'ECE';
  description: string;
  recipientAddress?: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const ECEPaymentProcessor: React.FC<ECEPaymentProcessorProps> = ({
  amount,
  currency,
  description,
  recipientAddress,
  onSuccess,
  onError,
  className = ''
}) => {
  const { connection, sendTransaction } = useCryptoWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionRate, setConversionRate] = useState<ConversionRate | null>(null);
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [estimatedGas, setEstimatedGas] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadConversionRates();
    if (currency === 'USD') {
      getSwapQuote();
    }
    estimateGasFees();
  }, [amount, currency]);

  const loadConversionRates = async () => {
    try {
      // Mock conversion rate - in real app, fetch from API
      const mockRate: ConversionRate = {
        id: '1',
        fromCurrency: 'ECE',
        toCurrency: 'USD',
        rate: 0.85, // 1 ECE = $0.85
        lastUpdated: new Date(),
        source: 'chainlink',
        volatilityIndex: 0.12
      };
      setConversionRate(mockRate);
    } catch (error) {
      console.error('Failed to load conversion rates:', error);
    }
  };

  const getSwapQuote = async () => {
    try {
      if (!conversionRate) return;
      
      const eceAmount = (amount / conversionRate.rate).toString();
      const mockQuote: SwapQuote = {
        id: Date.now().toString(),
        fromToken: 'USD',
        toToken: 'ECE',
        fromAmount: amount.toString(),
        toAmount: eceAmount,
        rate: conversionRate.rate,
        slippage: 0.5, // 0.5%
        priceImpact: 0.1, // 0.1%
        gasEstimate: '0.002',
        route: ['USD', 'USDC', 'ECE'],
        validUntil: new Date(Date.now() + 300000), // 5 minutes
        provider: 'ECE DEX'
      };
      setSwapQuote(mockQuote);
    } catch (error) {
      console.error('Failed to get swap quote:', error);
    }
  };

  const estimateGasFees = async () => {
    try {
      // Mock gas estimation
      const gasPrice = Math.random() * 50 + 20; // 20-70 gwei
      setEstimatedGas((gasPrice * 21000 / 1e9).toFixed(6)); // Convert to ETH
    } catch (error) {
      console.error('Failed to estimate gas:', error);
    }
  };

  const processPayment = useCallback(async () => {
    if (!connection?.isConnected) {
      setErrorMessage('Wallet not connected');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      let finalAmount = amount;
      let finalCurrency: 'ETH' | 'ECE' = 'ECE';

      // Convert USD to ECE if needed
      if (currency === 'USD' && swapQuote) {
        finalAmount = parseFloat(swapQuote.toAmount);
        finalCurrency = 'ECE';
      }

      // Check balance
      const userBalance = parseFloat(connection.eceBalance);
      if (finalAmount > userBalance) {
        throw new Error(`Insufficient ECE balance. Required: ${finalAmount}, Available: ${userBalance}`);
      }

      // Send transaction
      const hash = await sendTransaction(
        recipientAddress || '0x0000000000000000000000000000000000000000',
        finalAmount.toString(),
        finalCurrency
      );

      setTxHash(hash);
      setPaymentStatus('success');
      
      if (onSuccess) {
        onSuccess(hash);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Payment failed';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [connection, amount, currency, swapQuote, recipientAddress, sendTransaction, onSuccess, onError]);

  const getPaymentAmount = () => {
    if (currency === 'ECE') {
      return { amount, currency: 'ECE' };
    }
    if (swapQuote) {
      return { amount: parseFloat(swapQuote.toAmount), currency: 'ECE' };
    }
    return { amount, currency: 'USD' };
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Loader2 className="w-6 h-6 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <DollarSign className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing payment...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return errorMessage;
      default:
        return 'Ready to process payment';
    }
  };

  const paymentInfo = getPaymentAmount();

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        {getStatusIcon()}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ECE Payment
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getStatusMessage()}
          </p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Description:</span>
            <span className="font-medium">{description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
            <span className="font-medium">
              {paymentInfo.amount.toLocaleString()} {paymentInfo.currency}
            </span>
          </div>
          {currency === 'USD' && conversionRate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Exchange Rate:</span>
              <span>1 ECE = ${conversionRate.rate}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Network Fee:</span>
            <span className="font-medium">~{estimatedGas} ETH</span>
          </div>
        </div>
      </div>

      {/* Conversion Details */}
      {currency === 'USD' && swapQuote && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Conversion Details</h4>
            <ArrowRightLeft className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">From:</span>
              <span>${amount.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">To:</span>
              <span>{parseFloat(swapQuote.toAmount).toLocaleString()} ECE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Slippage:</span>
              <span>{swapQuote.slippage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Price Impact:</span>
              <span className={swapQuote.priceImpact > 1 ? 'text-red-500' : 'text-green-500'}>
                {swapQuote.priceImpact}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Route:</span>
              <span className="text-xs">{swapQuote.route.join(' → ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Options */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
        
        {showAdvanced && (
          <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Priority Fee: Auto</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Security: High</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Est. Time: 2-5 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span>Success Rate: 99.2%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {paymentStatus === 'idle' && (
        <div className="flex space-x-3">
          <Button
            onClick={processPayment}
            disabled={!connection?.isConnected || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Pay {paymentInfo.amount.toLocaleString()} {paymentInfo.currency}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={estimateGasFees}>
            <Calculator className="w-4 h-4" />
          </Button>
        </div>
      )}

      {paymentStatus === 'success' && txHash && (
        <div className="text-center">
          <p className="text-green-600 dark:text-green-400 mb-4">
            Payment processed successfully!
          </p>
          <button
            onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View on Etherscan →
          </button>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{errorMessage}</p>
          <Button onClick={() => setPaymentStatus('idle')} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Security Notice */}
      {paymentStatus === 'idle' && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Secure Payment</p>
              <p>This transaction is secured by blockchain technology and cannot be reversed once confirmed.</p>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
