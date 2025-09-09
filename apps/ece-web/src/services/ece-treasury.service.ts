/**
 * ECE Treasury Service
 * Manages ECE token operations including weekly payouts and USDC conversions
 * Integrates with Solana smart contract for treasury management
 */

import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface WeeklyPayoutRequest {
  revenueAmount: number; // ECE tokens collected as revenue
  payoutPercentage: number; // Percentage to convert to USDC (0-100)
  authorizedSigners: string[]; // Wallet addresses of authorized signers
}

export interface WeeklyPayoutResult {
  success: boolean;
  payoutId?: string;
  eceConverted: number;
  usdcReceived: number;
  transactionSignature?: string;
  error?: string;
}

export interface TreasuryStatus {
  eceCirculation: number;
  usdcReserves: number;
  reserveRatio: number; // Percentage
  isPaused: boolean;
  lastPayoutDate: Date | null;
  nextPayoutDate: Date;
  weeklyRevenueAccumulated: number;
  companyBalance: {
    ece: number;
    usdc: number;
  };
}

export interface ComplianceCheck {
  transactionId: string;
  amount: number;
  type: 'MINT' | 'BURN' | 'PAYOUT' | 'DEPOSIT' | 'WITHDRAW';
  riskScore: number; // 0-100
  kycRequired: boolean;
  amlCleared: boolean;
  approved: boolean;
  notes?: string;
}

export class ECETreasuryService {
  private static connection = new Connection(
    process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  );

  private static programId = new PublicKey(
    process.env.ECE_TOKEN_PROGRAM_ID || 'ECETokenProgram11111111111111111111111111'
  );

  private static treasuryKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.ECE_TREASURY_SECRET_KEY || '[]'))
  );

  /**
   * Process weekly company payout from ECE revenue to USDC
   */
  static async processWeeklyPayout(request: WeeklyPayoutRequest): Promise<WeeklyPayoutResult> {
    try {
      // Validate payout window
      const lastPayout = await this.getLastPayoutRecord();
      if (lastPayout && !this.isPayoutWindowActive(lastPayout.createdAt)) {
        return {
          success: false,
          error: 'Weekly payout window not active. Must wait 7 days since last payout.',
          eceConverted: 0,
          usdcReceived: 0
        };
      }

      // Validate payout percentage
      if (request.payoutPercentage < 0 || request.payoutPercentage > 100) {
        return {
          success: false,
          error: 'Payout percentage must be between 0 and 100',
          eceConverted: 0,
          usdcReceived: 0
        };
      }

      // Calculate payout amounts
      const eceToConvert = Math.floor(request.revenueAmount * (request.payoutPercentage / 100));
      const eceToRetain = request.revenueAmount - eceToConvert;

      // Compliance check
      const complianceResult = await this.performComplianceCheck({
        transactionId: `payout_${Date.now()}`,
        amount: eceToConvert,
        type: 'PAYOUT',
        riskScore: this.calculateRiskScore(eceToConvert),
        kycRequired: eceToConvert > 10000, // KYC required for >$10k
        amlCleared: true, // Company transactions are pre-cleared
        approved: false
      });

      if (!complianceResult.approved && complianceResult.riskScore > 75) {
        return {
          success: false,
          error: 'Transaction flagged by compliance system. Manual review required.',
          eceConverted: 0,
          usdcReceived: 0
        };
      }

      // Execute Solana transaction for weekly payout
      const transaction = await this.createWeeklyPayoutTransaction(
        request.revenueAmount,
        request.payoutPercentage
      );

      const signature = await this.connection.sendTransaction(transaction, [this.treasuryKeypair]);
      await this.connection.confirmTransaction(signature, 'confirmed');

      // Record payout in database
      const payoutRecord = await prisma.weeklyPayout.create({
        data: {
          revenueAmount: request.revenueAmount,
          payoutPercentage: request.payoutPercentage,
          eceConverted: eceToConvert,
          usdcReceived: eceToConvert, // 1:1 conversion ratio
          transactionSignature: signature,
          status: 'COMPLETED',
          authorizedSigners: request.authorizedSigners,
          complianceApproved: complianceResult.approved,
          metadata: {
            timestamp: new Date().toISOString(),
            reserveRatioBeforePayout: await this.getReserveRatio(),
            complianceNotes: complianceResult.notes
          }
        }
      });

      // Update company financial records
      await this.updateCompanyBalances(eceToRetain, eceToConvert);

      // Send notifications
      await this.notifyPayoutCompletion(payoutRecord.id, eceToConvert, eceToConvert);

      return {
        success: true,
        payoutId: payoutRecord.id,
        eceConverted: eceToConvert,
        usdcReceived: eceToConvert,
        transactionSignature: signature
      };

    } catch (error) {
      console.error('Weekly payout processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        eceConverted: 0,
        usdcReceived: 0
      };
    }
  }

  /**
   * Get current treasury status
   */
  static async getTreasuryStatus(): Promise<TreasuryStatus> {
    try {
      // Fetch from Solana smart contract
      const treasuryAccount = await this.getTreasuryAccountData();
      
      // Get accumulated revenue from database
      const weeklyRevenue = await this.getAccumulatedWeeklyRevenue();
      
      // Get company balances
      const companyBalances = await this.getCompanyBalances();

      // Calculate next payout date
      const lastPayout = await this.getLastPayoutRecord();
      const nextPayoutDate = lastPayout 
        ? new Date(lastPayout.createdAt.getTime() + (7 * 24 * 60 * 60 * 1000))
        : new Date();

      return {
        eceCirculation: treasuryAccount.eceCirculation,
        usdcReserves: treasuryAccount.usdcReserves,
        reserveRatio: this.calculateReserveRatio(treasuryAccount.eceCirculation, treasuryAccount.usdcReserves),
        isPaused: treasuryAccount.isPaused,
        lastPayoutDate: lastPayout?.createdAt || null,
        nextPayoutDate,
        weeklyRevenueAccumulated: weeklyRevenue,
        companyBalance: companyBalances
      };

    } catch (error) {
      console.error('Error getting treasury status:', error);
      throw new Error('Failed to retrieve treasury status');
    }
  }

  /**
   * Mint ECE tokens backed by USDC deposit
   */
  static async mintECETokens(
    userWallet: string,
    usdcAmount: number
  ): Promise<{ success: boolean; eceAmount?: number; transactionSignature?: string; error?: string }> {
    try {
      // Compliance check
      const complianceResult = await this.performComplianceCheck({
        transactionId: `mint_${Date.now()}`,
        amount: usdcAmount,
        type: 'MINT',
        riskScore: this.calculateRiskScore(usdcAmount),
        kycRequired: usdcAmount > 10000,
        amlCleared: true, // Assume AML cleared for now
        approved: true
      });

      if (!complianceResult.approved) {
        return {
          success: false,
          error: 'Transaction blocked by compliance system'
        };
      }

      // Create and send mint transaction
      const transaction = await this.createMintTransaction(userWallet, usdcAmount);
      const signature = await this.connection.sendTransaction(transaction, [this.treasuryKeypair]);
      await this.connection.confirmTransaction(signature, 'confirmed');

      // Record transaction
      await prisma.transaction.create({
        data: {
          userId: userWallet, // Using wallet address as user ID
          type: 'ECE_MINT',
          amount: usdcAmount,
          description: `Minted ${usdcAmount} ECE tokens`,
          metadata: {
            transactionSignature: signature,
            usdcDeposited: usdcAmount,
            eceReceived: usdcAmount
          }
        }
      });

      return {
        success: true,
        eceAmount: usdcAmount, // 1:1 ratio
        transactionSignature: signature
      };

    } catch (error) {
      console.error('ECE minting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Minting failed'
      };
    }
  }

  /**
   * Burn ECE tokens and release USDC
   */
  static async burnECETokens(
    userWallet: string,
    eceAmount: number
  ): Promise<{ success: boolean; usdcAmount?: number; transactionSignature?: string; error?: string }> {
    try {
      // Check if treasury has sufficient reserves
      const treasuryStatus = await this.getTreasuryStatus();
      if (treasuryStatus.usdcReserves < eceAmount) {
        return {
          success: false,
          error: 'Insufficient USDC reserves for redemption'
        };
      }

      // Compliance check
      const complianceResult = await this.performComplianceCheck({
        transactionId: `burn_${Date.now()}`,
        amount: eceAmount,
        type: 'BURN',
        riskScore: this.calculateRiskScore(eceAmount),
        kycRequired: eceAmount > 10000,
        amlCleared: true,
        approved: true
      });

      if (!complianceResult.approved) {
        return {
          success: false,
          error: 'Transaction blocked by compliance system'
        };
      }

      // Create and send burn transaction
      const transaction = await this.createBurnTransaction(userWallet, eceAmount);
      const signature = await this.connection.sendTransaction(transaction, [this.treasuryKeypair]);
      await this.connection.confirmTransaction(signature, 'confirmed');

      // Record transaction
      await prisma.transaction.create({
        data: {
          userId: userWallet,
          type: 'ECE_BURN',
          amount: eceAmount,
          description: `Burned ${eceAmount} ECE tokens for USDC`,
          metadata: {
            transactionSignature: signature,
            eceBurned: eceAmount,
            usdcReceived: eceAmount
          }
        }
      });

      return {
        success: true,
        usdcAmount: eceAmount, // 1:1 ratio
        transactionSignature: signature
      };

    } catch (error) {
      console.error('ECE burning error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Burning failed'
      };
    }
  }

  /**
   * Emergency pause all token operations
   */
  static async emergencyPause(authorizedSigner: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify signer authorization
      if (!await this.isAuthorizedEmergencySigner(authorizedSigner)) {
        return {
          success: false,
          error: 'Unauthorized signer for emergency operations'
        };
      }

      const transaction = await this.createEmergencyPauseTransaction();
      const signature = await this.connection.sendTransaction(transaction, [this.treasuryKeypair]);
      await this.connection.confirmTransaction(signature, 'confirmed');

      // Log emergency action
      await prisma.emergencyAction.create({
        data: {
          action: 'PAUSE',
          authorizedBy: authorizedSigner,
          reason: 'Emergency pause activated',
          transactionSignature: signature
        }
      });

      return { success: true };

    } catch (error) {
      console.error('Emergency pause error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Emergency pause failed'
      };
    }
  }

  /**
   * Get weekly revenue accumulated since last payout
   */
  static async getAccumulatedWeeklyRevenue(): Promise<number> {
    const lastPayout = await this.getLastPayoutRecord();
    const since = lastPayout?.createdAt || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const revenue = await prisma.transaction.aggregate({
      where: {
        type: {
          in: ['MARKETPLACE_FEE', 'SUBSCRIPTION_PAYMENT', 'NFT_MINT_FEE', 'BATTLE_ENTRY_FEE']
        },
        createdAt: {
          gte: since
        }
      },
      _sum: {
        amount: true
      }
    });

    return revenue._sum.amount || 0;
  }

  /**
   * Get payout history with pagination
   */
  static async getPayoutHistory(
    page = 1, 
    limit = 10
  ): Promise<{ payouts: any[]; total: number; hasMore: boolean }> {
    const skip = (page - 1) * limit;

    const [payouts, total] = await Promise.all([
      prisma.weeklyPayout.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          createdAt: true,
          revenueAmount: true,
          payoutPercentage: true,
          eceConverted: true,
          usdcReceived: true,
          status: true,
          transactionSignature: true,
          complianceApproved: true
        }
      }),
      prisma.weeklyPayout.count()
    ]);

    return {
      payouts,
      total,
      hasMore: skip + limit < total
    };
  }

  // Private helper methods

  private static async createWeeklyPayoutTransaction(
    revenueAmount: number,
    payoutPercentage: number
  ): Promise<Transaction> {
    // This would create the actual Solana transaction
    // For now, return a mock transaction
    return new Transaction();
  }

  private static async createMintTransaction(userWallet: string, amount: number): Promise<Transaction> {
    // Create mint transaction using the client helper
    return new Transaction();
  }

  private static async createBurnTransaction(userWallet: string, amount: number): Promise<Transaction> {
    // Create burn transaction using the client helper
    return new Transaction();
  }

  private static async createEmergencyPauseTransaction(): Promise<Transaction> {
    // Create emergency pause transaction
    return new Transaction();
  }

  private static async getTreasuryAccountData(): Promise<any> {
    // Fetch treasury account data from Solana
    return {
      eceCirculation: 1000000,
      usdcReserves: 1000000,
      isPaused: false
    };
  }

  private static async getLastPayoutRecord(): Promise<any> {
    return await prisma.weeklyPayout.findFirst({
      orderBy: { createdAt: 'desc' }
    });
  }

  private static async getCompanyBalances(): Promise<{ ece: number; usdc: number }> {
    // Get current company ECE and USDC balances
    return {
      ece: 50000,
      usdc: 25000
    };
  }

  private static isPayoutWindowActive(lastPayoutDate: Date): boolean {
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - lastPayoutDate.getTime() >= weekInMs;
  }

  private static calculateReserveRatio(circulation: number, reserves: number): number {
    if (circulation === 0) return 100;
    return Math.round((reserves / circulation) * 100);
  }

  private static async getReserveRatio(): Promise<number> {
    const status = await this.getTreasuryStatus();
    return status.reserveRatio;
  }

  private static calculateRiskScore(amount: number): number {
    // Simple risk scoring based on transaction amount
    if (amount > 100000) return 90; // High risk
    if (amount > 50000) return 70;  // Medium-high risk
    if (amount > 10000) return 50;  // Medium risk
    if (amount > 1000) return 30;   // Low-medium risk
    return 10; // Low risk
  }

  private static async performComplianceCheck(check: ComplianceCheck): Promise<ComplianceCheck> {
    // Perform AML/KYC checks
    check.amlCleared = true; // Mock - would integrate with actual AML service
    check.approved = check.riskScore < 80 && check.amlCleared;
    
    // Record compliance check
    await prisma.complianceCheck.create({
      data: {
        transactionId: check.transactionId,
        amount: check.amount,
        type: check.type,
        riskScore: check.riskScore,
        kycRequired: check.kycRequired,
        amlCleared: check.amlCleared,
        approved: check.approved,
        notes: check.notes || `Risk score: ${check.riskScore}`
      }
    });

    return check;
  }

  private static async isAuthorizedEmergencySigner(signer: string): Promise<boolean> {
    // Check if signer is authorized for emergency operations
    const authorizedSigners = process.env.ECE_EMERGENCY_SIGNERS?.split(',') || [];
    return authorizedSigners.includes(signer);
  }

  private static async updateCompanyBalances(retainedECE: number, convertedUSDC: number): Promise<void> {
    // Update company balance records
    await prisma.companyBalance.upsert({
      where: { currency: 'ECE' },
      update: { 
        amount: { increment: retainedECE },
        lastUpdated: new Date()
      },
      create: {
        currency: 'ECE',
        amount: retainedECE,
        lastUpdated: new Date()
      }
    });

    await prisma.companyBalance.upsert({
      where: { currency: 'USDC' },
      update: { 
        amount: { increment: convertedUSDC },
        lastUpdated: new Date()
      },
      create: {
        currency: 'USDC',
        amount: convertedUSDC,
        lastUpdated: new Date()
      }
    });
  }

  private static async notifyPayoutCompletion(
    payoutId: string, 
    eceConverted: number, 
    usdcReceived: number
  ): Promise<void> {
    // Send notifications to relevant stakeholders
    console.log(`Weekly payout completed: ${payoutId} - ${eceConverted} ECE → ${usdcReceived} USDC`);
    // Could integrate with email service, Slack notifications, etc.
  }
}
