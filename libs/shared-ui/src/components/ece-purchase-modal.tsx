'use client';

import { useState } from 'react';
import { useECEWallet } from '../hooks/use-ece-wallet';
import { Button } from '../lib/button';
import { GlassCard } from '../lib/glass-card';
import { Input } from '../lib/input';
import { Coins, CreditCard, Wallet, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ECEPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number, newBalance: number) => void;
}

const PURCHASE_AMOUNTS = [100, 500, 1000, 2500, 5000];

export function ECEPurchaseModal({ isOpen, onClose, onSuccess }: ECEPurchaseModalProps) {
  const { address, eceBalance, refreshBalance } = useECEWallet();
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');

  if (!isOpen) return null;

  const purchaseAmount = isCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  const usdCost = (purchaseAmount * 0.01).toFixed(2); // $0.01 per ECE token

  const handlePurchase = async () => {
    if (!address || purchaseAmount <= 0) return;

    setIsProcessing(true);
    setStep('payment');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('/api/ece/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          amount: purchaseAmount,
          paymentMethod: 'card',
          transactionHash: `mock_tx_${Date.now()}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await refreshBalance();
        setStep('success');
        onSuccess?.(purchaseAmount, data.newBalance);
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
      setStep('select');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderSelectStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-[#F92672] to-[#FD5C63] rounded-full flex items-center justify-center mx-auto mb-4">
          <Coins className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Purchase ECE Tokens</h2>
        <p className="text-gray-400">
          Current Balance: <span className="text-[#F92672] font-semibold">{eceBalance.toFixed(2)} ECE</span>
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Select Amount</h3>
        <div className="grid grid-cols-3 gap-3">
          {PURCHASE_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSelectedAmount(amount);
                setIsCustom(false);
              }}
              className={cn(
                "p-3 rounded-lg border-2 transition-colors text-center",
                selectedAmount === amount && !isCustom
                  ? "border-[#F92672] bg-[#F92672]/10"
                  : "border-gray-700 hover:border-gray-600"
              )}
            >
              <div className="font-semibold">{amount} ECE</div>
              <div className="text-sm text-gray-400">${(amount * 0.01).toFixed(2)}</div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setIsCustom(true)}
            className={cn(
              "w-full p-3 rounded-lg border-2 transition-colors",
              isCustom
                ? "border-[#F92672] bg-[#F92672]/10"
                : "border-gray-700 hover:border-gray-600"
            )}
          >
            Custom Amount
          </button>
          
          {isCustom && (
            <Input
              type="number"
              placeholder="Enter ECE amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full"
              min="1"
              max="10000"
            />
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-800/50 rounded-lg">
        <div className="flex justify-between items-center">
          <span>Total Cost:</span>
          <span className="text-xl font-bold text-[#F92672]">${usdCost}</span>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Rate: $0.01 per ECE token
        </div>
      </div>

      <Button
        onClick={handlePurchase}
        disabled={purchaseAmount <= 0}
        className="w-full gap-2"
      >
        <CreditCard className="h-4 w-4" />
        Purchase {purchaseAmount} ECE for ${usdCost}
      </Button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-r from-[#74C0FC] to-[#A6E3A1] rounded-full flex items-center justify-center mx-auto animate-pulse">
        <CreditCard className="h-8 w-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
        <p className="text-gray-400">
          Purchasing {purchaseAmount} ECE tokens for ${usdCost}
        </p>
      </div>
      <div className="animate-spin w-8 h-8 border-2 border-[#F92672] border-t-transparent rounded-full mx-auto"></div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-r from-[#A6E3A1] to-[#74C0FC] rounded-full flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
        <p className="text-gray-400">
          {purchaseAmount} ECE tokens have been added to your wallet
        </p>
      </div>
      <div className="p-4 bg-green-800/10 border border-green-700 rounded-lg">
        <div className="text-green-400 font-semibold">
          New Balance: {(eceBalance + purchaseAmount).toFixed(2)} ECE
        </div>
      </div>
      <Button onClick={onClose} className="w-full">
        Continue
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <GlassCard className="max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-800 rounded"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'select' && renderSelectStep()}
        {step === 'payment' && renderPaymentStep()}
        {step === 'success' && renderSuccessStep()}
      </GlassCard>
    </div>
  );
}
