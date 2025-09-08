import { CryptoPaymentError, CRYPTO_ERROR_CODES } from '@ece-platform/shared-types/crypto';

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  client_secret: string;
  metadata?: Record<string, string>;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  payment_methods: string[];
  default_source?: string;
}

export interface FiatOnOffRampTransaction {
  id: string;
  userId: string;
  type: 'on_ramp' | 'off_ramp';
  fiatAmount: number;
  fiatCurrency: string;
  eceAmount: number;
  exchangeRate: number;
  stripePaymentIntentId?: string;
  bankAccount?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fees: {
    stripeFee: number;
    processingFee: number;
    networkFee: number;
    total: number;
  };
  createdAt: Date;
  completedAt?: Date;
}

export class StripeIntegrationService {
  private static instance: StripeIntegrationService;
  private stripeSecretKey: string;
  private stripePublishableKey: string;

  private constructor() {
    // In production, these would come from environment variables
    this.stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_...';
    this.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...';
  }

  public static getInstance(): StripeIntegrationService {
    if (!StripeIntegrationService.instance) {
      StripeIntegrationService.instance = new StripeIntegrationService();
    }
    return StripeIntegrationService.instance;
  }

  /**
   * Create or retrieve Stripe customer
   */
  async createOrRetrieveCustomer(userId: string, email: string, name?: string): Promise<StripeCustomer> {
    try {
      // In production, this would call Stripe API
      // For now, return mock customer
      return {
        id: `cus_${userId}`,
        email,
        name,
        payment_methods: [],
        default_source: undefined
      };
    } catch (error: any) {
      throw new CryptoPaymentError(
        `Failed to create/retrieve Stripe customer: ${error.message}`,
        CRYPTO_ERROR_CODES.NETWORK_ERROR
      );
    }
  }

  /**
   * Create payment intent for fiat to ECE conversion (on-ramp)
   */
  async createOnRampPaymentIntent(
    userId: string,
    fiatAmount: number,
    fiatCurrency: string = 'USD',
    eceAmount: number,
    exchangeRate: number
  ): Promise<{ paymentIntent: StripePaymentIntent; transaction: FiatOnOffRampTransaction }> {
    try {
      // Calculate fees
      const fees = this.calculateFees(fiatAmount, 'on_ramp');
      const totalAmount = Math.round((fiatAmount + fees.total) * 100); // Convert to cents

      // Mock payment intent - in production, call Stripe API
      const paymentIntent: StripePaymentIntent = {
        id: `pi_${Date.now()}`,
        amount: totalAmount,
        currency: fiatCurrency.toLowerCase(),
        status: 'requires_payment_method',
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).slice(2)}`,
        metadata: {
          userId,
          type: 'on_ramp',
          eceAmount: eceAmount.toString(),
          exchangeRate: exchangeRate.toString()
        }
      };

      // Create transaction record
      const transaction: FiatOnOffRampTransaction = {
        id: `tx_${Date.now()}`,
        userId,
        type: 'on_ramp',
        fiatAmount,
        fiatCurrency,
        eceAmount,
        exchangeRate,
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending',
        fees,
        createdAt: new Date()
      };

      return { paymentIntent, transaction };
    } catch (error: any) {
      throw new CryptoPaymentError(
        `Failed to create on-ramp payment intent: ${error.message}`,
        CRYPTO_ERROR_CODES.NETWORK_ERROR
      );
    }
  }

  /**
   * Process ECE to fiat conversion (off-ramp)
   */
  async createOffRampTransfer(
    userId: string,
    eceAmount: number,
    fiatAmount: number,
    fiatCurrency: string = 'USD',
    bankAccountId: string,
    exchangeRate: number
  ): Promise<FiatOnOffRampTransaction> {
    try {
      // Calculate fees
      const fees = this.calculateFees(fiatAmount, 'off_ramp');
      const netAmount = fiatAmount - fees.total;

      // Validate minimum transfer amount
      if (netAmount < 10) {
        throw new CryptoPaymentError(
          'Minimum transfer amount is $10 USD after fees',
          CRYPTO_ERROR_CODES.LIMIT_EXCEEDED
        );
      }

      // Create transaction record
      const transaction: FiatOnOffRampTransaction = {
        id: `tx_${Date.now()}`,
        userId,
        type: 'off_ramp',
        fiatAmount: netAmount,
        fiatCurrency,
        eceAmount,
        exchangeRate,
        bankAccount: bankAccountId,
        status: 'processing',
        fees,
        createdAt: new Date()
      };

      // In production, this would:
      // 1. Lock the ECE tokens in user's account
      // 2. Create Stripe transfer to bank account
      // 3. Handle webhooks for completion

      return transaction;
    } catch (error: any) {
      throw new CryptoPaymentError(
        `Failed to create off-ramp transfer: ${error.message}`,
        CRYPTO_ERROR_CODES.NETWORK_ERROR
      );
    }
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    try {
      // Mock confirmation - in production, call Stripe API
      return {
        id: paymentIntentId,
        amount: 5000, // $50.00
        currency: 'usd',
        status: 'succeeded',
        client_secret: `${paymentIntentId}_secret`
      };
    } catch (error: any) {
      throw new CryptoPaymentError(
        `Failed to confirm payment intent: ${error.message}`,
        CRYPTO_ERROR_CODES.TRANSACTION_FAILED
      );
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object);
          break;
        case 'transfer.paid':
          await this.handleTransferPaid(event.data.object);
          break;
        case 'transfer.failed':
          await this.handleTransferFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled webhook event: ${event.type}`);
      }
    } catch (error: any) {
      console.error('Webhook handling failed:', error);
      throw new CryptoPaymentError(
        `Webhook processing failed: ${error.message}`,
        CRYPTO_ERROR_CODES.NETWORK_ERROR
      );
    }
  }

  /**
   * Get supported payment methods
   */
  getSupportedPaymentMethods(): string[] {
    return [
      'card',
      'ach_debit',
      'us_bank_account',
      'sepa_debit',
      'ideal',
      'sofort',
      'bancontact',
      'giropay',
      'eps',
      'p24'
    ];
  }

  /**
   * Calculate fees for transactions
   */
  private calculateFees(amount: number, type: 'on_ramp' | 'off_ramp'): {
    stripeFee: number;
    processingFee: number;
    networkFee: number;
    total: number;
  } {
    // Stripe fees (approximate)
    const stripeFee = Math.max(0.30, amount * 0.029); // 2.9% + $0.30
    
    // Processing fee (our fee)
    const processingFee = amount * (type === 'on_ramp' ? 0.01 : 0.015); // 1% on-ramp, 1.5% off-ramp
    
    // Network fee (blockchain gas)
    const networkFee = type === 'on_ramp' ? 2.00 : 1.00; // Fixed fee for minting/burning
    
    const total = stripeFee + processingFee + networkFee;

    return {
      stripeFee: Math.round(stripeFee * 100) / 100,
      processingFee: Math.round(processingFee * 100) / 100,
      networkFee,
      total: Math.round(total * 100) / 100
    };
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(paymentIntent: any): Promise<void> {
    try {
      const { userId, eceAmount, type } = paymentIntent.metadata;
      
      if (type === 'on_ramp') {
        // Mint ECE tokens to user's wallet
        console.log(`Minting ${eceAmount} ECE tokens for user ${userId}`);
        
        // In production:
        // 1. Call smart contract to mint tokens
        // 2. Update user's balance in database
        // 3. Send confirmation email
        // 4. Create transaction record
      }
    } catch (error) {
      console.error('Failed to handle payment success:', error);
    }
  }

  /**
   * Handle failed payment intent
   */
  private async handlePaymentIntentFailed(paymentIntent: any): Promise<void> {
    try {
      const { userId, type } = paymentIntent.metadata;
      
      console.log(`Payment failed for user ${userId}, type: ${type}`);
      
      // In production:
      // 1. Update transaction status
      // 2. Send failure notification
      // 3. Log for investigation
    } catch (error) {
      console.error('Failed to handle payment failure:', error);
    }
  }

  /**
   * Handle successful bank transfer
   */
  private async handleTransferPaid(transfer: any): Promise<void> {
    try {
      console.log(`Bank transfer completed: ${transfer.id}`);
      
      // In production:
      // 1. Update off-ramp transaction status
      // 2. Burn ECE tokens
      // 3. Send completion notification
    } catch (error) {
      console.error('Failed to handle transfer success:', error);
    }
  }

  /**
   * Handle failed bank transfer
   */
  private async handleTransferFailed(transfer: any): Promise<void> {
    try {
      console.log(`Bank transfer failed: ${transfer.id}`);
      
      // In production:
      // 1. Update transaction status
      // 2. Return ECE tokens to user
      // 3. Send failure notification
      // 4. Investigate issue
    } catch (error) {
      console.error('Failed to handle transfer failure:', error);
    }
  }

  /**
   * Get transaction limits based on KYC level
   */
  getTransactionLimits(kycLevel: 'none' | 'basic' | 'intermediate' | 'advanced'): {
    dailyLimit: number;
    monthlyLimit: number;
    perTransactionLimit: number;
  } {
    switch (kycLevel) {
      case 'none':
        return { dailyLimit: 100, monthlyLimit: 1000, perTransactionLimit: 50 };
      case 'basic':
        return { dailyLimit: 1000, monthlyLimit: 10000, perTransactionLimit: 500 };
      case 'intermediate':
        return { dailyLimit: 10000, monthlyLimit: 100000, perTransactionLimit: 5000 };
      case 'advanced':
        return { dailyLimit: 100000, monthlyLimit: 1000000, perTransactionLimit: 50000 };
      default:
        return { dailyLimit: 100, monthlyLimit: 1000, perTransactionLimit: 50 };
    }
  }

  /**
   * Validate transaction against limits
   */
  async validateTransactionLimits(
    userId: string,
    amount: number,
    kycLevel: 'none' | 'basic' | 'intermediate' | 'advanced'
  ): Promise<{ valid: boolean; reason?: string }> {
    const limits = this.getTransactionLimits(kycLevel);
    
    // Check per-transaction limit
    if (amount > limits.perTransactionLimit) {
      return {
        valid: false,
        reason: `Transaction amount exceeds limit of $${limits.perTransactionLimit}`
      };
    }

    // In production, check daily and monthly usage from database
    // For now, assume limits are not exceeded
    return { valid: true };
  }

  /**
   * Get fee estimate
   */
  getFeeEstimate(amount: number, type: 'on_ramp' | 'off_ramp'): {
    fees: { stripeFee: number; processingFee: number; networkFee: number; total: number };
    netAmount: number;
  } {
    const fees = this.calculateFees(amount, type);
    const netAmount = type === 'on_ramp' ? amount - fees.total : amount - fees.total;
    
    return { fees, netAmount };
  }
}
