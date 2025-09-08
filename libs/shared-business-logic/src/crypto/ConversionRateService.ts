import { ConversionRate, CryptoPaymentError, CRYPTO_ERROR_CODES } from '@ece-platform/shared-types/crypto';

export class ConversionRateService {
  private static instance: ConversionRateService;
  private rates: Map<string, ConversionRate> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_FREQUENCY = 60000; // 1 minute

  private constructor() {
    this.startRateUpdates();
  }

  public static getInstance(): ConversionRateService {
    if (!ConversionRateService.instance) {
      ConversionRateService.instance = new ConversionRateService();
    }
    return ConversionRateService.instance;
  }

  /**
   * Start automatic rate updates
   */
  private startRateUpdates(): void {
    this.updateAllRates();
    this.updateInterval = setInterval(() => {
      this.updateAllRates();
    }, this.UPDATE_FREQUENCY);
  }

  /**
   * Stop automatic rate updates
   */
  public stopRateUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update all conversion rates from external sources
   */
  private async updateAllRates(): Promise<void> {
    try {
      const pairs = [
        { from: 'ECE', to: 'USD' },
        { from: 'USD', to: 'ECE' },
        { from: 'ECE', to: 'ETH' },
        { from: 'ETH', to: 'ECE' },
        { from: 'ECE', to: 'BTC' },
        { from: 'BTC', to: 'ECE' }
      ];

      await Promise.all(pairs.map(pair => this.fetchRate(pair.from, pair.to)));
    } catch (error) {
      console.error('Failed to update conversion rates:', error);
    }
  }

  /**
   * Fetch conversion rate for a specific pair
   */
  private async fetchRate(fromCurrency: string, toCurrency: string): Promise<void> {
    try {
      let rate: number;
      let source: string;

      if (fromCurrency === 'ECE' && toCurrency === 'USD') {
        // ECE to USD - fetch from price oracle or exchange
        rate = await this.fetchECEPrice();
        source = 'chainlink';
      } else if (fromCurrency === 'USD' && toCurrency === 'ECE') {
        // USD to ECE - inverse of ECE price
        const ecePrice = await this.fetchECEPrice();
        rate = 1 / ecePrice;
        source = 'chainlink';
      } else if (fromCurrency === 'ECE' && toCurrency === 'ETH') {
        // ECE to ETH
        const eceUsdRate = await this.fetchECEPrice();
        const ethUsdRate = await this.fetchETHPrice();
        rate = eceUsdRate / ethUsdRate;
        source = 'coingecko';
      } else if (fromCurrency === 'ETH' && toCurrency === 'ECE') {
        // ETH to ECE
        const eceUsdRate = await this.fetchECEPrice();
        const ethUsdRate = await this.fetchETHPrice();
        rate = ethUsdRate / eceUsdRate;
        source = 'coingecko';
      } else if (fromCurrency === 'ECE' && toCurrency === 'BTC') {
        // ECE to BTC
        const eceUsdRate = await this.fetchECEPrice();
        const btcUsdRate = await this.fetchBTCPrice();
        rate = eceUsdRate / btcUsdRate;
        source = 'coingecko';
      } else if (fromCurrency === 'BTC' && toCurrency === 'ECE') {
        // BTC to ECE
        const eceUsdRate = await this.fetchECEPrice();
        const btcUsdRate = await this.fetchBTCPrice();
        rate = btcUsdRate / eceUsdRate;
        source = 'coingecko';
      } else {
        throw new Error(`Unsupported currency pair: ${fromCurrency}/${toCurrency}`);
      }

      const conversionRate: ConversionRate = {
        id: `${fromCurrency}_${toCurrency}`,
        fromCurrency,
        toCurrency,
        rate,
        lastUpdated: new Date(),
        source,
        volatilityIndex: this.calculateVolatility(fromCurrency, toCurrency)
      };

      this.rates.set(`${fromCurrency}_${toCurrency}`, conversionRate);
    } catch (error) {
      console.error(`Failed to fetch rate for ${fromCurrency}/${toCurrency}:`, error);
    }
  }

  /**
   * Get conversion rate between two currencies
   */
  public getRate(fromCurrency: string, toCurrency: string): ConversionRate | null {
    const key = `${fromCurrency}_${toCurrency}`;
    return this.rates.get(key) || null;
  }

  /**
   * Convert amount from one currency to another
   */
  public convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): { convertedAmount: number; rate: ConversionRate } {
    if (fromCurrency === toCurrency) {
      return {
        convertedAmount: amount,
        rate: {
          id: `${fromCurrency}_${toCurrency}`,
          fromCurrency,
          toCurrency,
          rate: 1,
          lastUpdated: new Date(),
          source: 'internal'
        }
      };
    }

    const rate = this.getRate(fromCurrency, toCurrency);
    if (!rate) {
      throw new CryptoPaymentError(
        `No conversion rate available for ${fromCurrency} to ${toCurrency}`,
        CRYPTO_ERROR_CODES.RATE_LIMIT_EXCEEDED
      );
    }

    return {
      convertedAmount: amount * rate.rate,
      rate
    };
  }

  /**
   * Get all available rates
   */
  public getAllRates(): ConversionRate[] {
    return Array.from(this.rates.values());
  }

  /**
   * Check if rates are stale (older than 5 minutes)
   */
  public areRatesStale(): boolean {
    const now = new Date();
    for (const rate of this.rates.values()) {
      const ageInMs = now.getTime() - rate.lastUpdated.getTime();
      if (ageInMs > 300000) { // 5 minutes
        return true;
      }
    }
    return false;
  }

  /**
   * Force refresh all rates
   */
  public async refreshRates(): Promise<void> {
    await this.updateAllRates();
  }

  /**
   * Fetch ECE token price from oracle/exchange
   */
  private async fetchECEPrice(): Promise<number> {
    try {
      // In production, this would connect to Chainlink or exchange APIs
      // For now, simulate with mock price with some volatility
      const basePrice = 0.85; // $0.85 USD
      const volatility = (Math.random() - 0.5) * 0.1; // ±5% volatility
      return basePrice + volatility;
    } catch (error) {
      console.error('Failed to fetch ECE price:', error);
      return 0.85; // Fallback price
    }
  }

  /**
   * Fetch ETH price from external API
   */
  private async fetchETHPrice(): Promise<number> {
    try {
      // Mock ETH price - in production use CoinGecko/CoinMarketCap
      const basePrice = 2500;
      const volatility = (Math.random() - 0.5) * 200; // ±$100 volatility
      return basePrice + volatility;
    } catch (error) {
      console.error('Failed to fetch ETH price:', error);
      return 2500; // Fallback price
    }
  }

  /**
   * Fetch BTC price from external API
   */
  private async fetchBTCPrice(): Promise<number> {
    try {
      // Mock BTC price - in production use CoinGecko/CoinMarketCap
      const basePrice = 45000;
      const volatility = (Math.random() - 0.5) * 2000; // ±$1000 volatility
      return basePrice + volatility;
    } catch (error) {
      console.error('Failed to fetch BTC price:', error);
      return 45000; // Fallback price
    }
  }

  /**
   * Calculate volatility index for a currency pair
   */
  private calculateVolatility(fromCurrency: string, toCurrency: string): number {
    // Simplified volatility calculation
    // In production, this would use historical price data
    const volatilityMap: Record<string, number> = {
      'ECE_USD': 0.15, // 15% volatility
      'USD_ECE': 0.15,
      'ECE_ETH': 0.20, // 20% volatility
      'ETH_ECE': 0.20,
      'ECE_BTC': 0.25, // 25% volatility
      'BTC_ECE': 0.25
    };

    return volatilityMap[`${fromCurrency}_${toCurrency}`] || 0.10;
  }

  /**
   * Get price history for analytics
   */
  public async getPriceHistory(
    currency: string,
    days: number = 30
  ): Promise<{ timestamp: Date; price: number }[]> {
    // Mock price history generation
    const history: { timestamp: Date; price: number }[] = [];
    const now = new Date();
    const basePrice = currency === 'ECE' ? 0.85 : 2500;
    
    for (let i = days; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const volatility = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + volatility);
      
      history.push({ timestamp, price });
    }
    
    return history;
  }

  /**
   * Set manual rate (admin override)
   */
  public setManualRate(
    fromCurrency: string,
    toCurrency: string,
    rate: number,
    adminId: string
  ): void {
    const conversionRate: ConversionRate = {
      id: `${fromCurrency}_${toCurrency}`,
      fromCurrency,
      toCurrency,
      rate,
      lastUpdated: new Date(),
      source: 'manual',
      volatilityIndex: 0
    };

    this.rates.set(`${fromCurrency}_${toCurrency}`, conversionRate);
    
    // Log manual rate change for audit
    console.log(`Manual rate set by admin ${adminId}: ${fromCurrency}/${toCurrency} = ${rate}`);
  }

  /**
   * Get rate with slippage calculation
   */
  public getRateWithSlippage(
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): { rate: number; slippage: number; priceImpact: number } {
    const baseRate = this.getRate(fromCurrency, toCurrency);
    if (!baseRate) {
      throw new CryptoPaymentError(
        `No rate available for ${fromCurrency}/${toCurrency}`,
        CRYPTO_ERROR_CODES.RATE_LIMIT_EXCEEDED
      );
    }

    // Calculate slippage based on trade size
    const baseSlippage = 0.005; // 0.5% base slippage
    const volumeImpact = Math.min(amount / 100000, 0.01); // Max 1% volume impact
    const totalSlippage = baseSlippage + volumeImpact;
    
    const adjustedRate = baseRate.rate * (1 - totalSlippage);
    const priceImpact = ((baseRate.rate - adjustedRate) / baseRate.rate) * 100;

    return {
      rate: adjustedRate,
      slippage: totalSlippage * 100,
      priceImpact
    };
  }
}
