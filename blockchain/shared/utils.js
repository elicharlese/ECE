// Shared Blockchain Utilities for ECE Platform
// Provides common functions for Solana and other blockchain interactions

const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');

class BlockchainUtils {
  static CONNECTION_CONFIG = {
    commitment: 'confirmed',
    confirmTransactionInitialTimeoutMs: 60000,
  };

  /**
   * Get Solana connection for specified network
   * @param {string} network - Network name (devnet, mainnet, local)
   * @returns {Connection} Solana connection instance
   */
  static getConnection(network = 'devnet') {
    const endpoints = {
      devnet: 'https://api.devnet.solana.com',
      mainnet: 'https://api.mainnet.solana.com',
      local: 'http://localhost:8899',
    };

    return new Connection(endpoints[network], this.CONNECTION_CONFIG);
  }

  /**
   * Get account balance in SOL
   * @param {string} publicKey - Account public key
   * @param {string} network - Network name
   * @returns {Promise<number>} Balance in SOL
   */
  static async getBalanceSOL(publicKey, network = 'devnet') {
    const connection = this.getConnection(network);
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / LAMPORTS_PER_SOL;
  }

  /**
   * Get account balance in lamports
   * @param {string} publicKey - Account public key
   * @param {string} network - Network name
   * @returns {Promise<number>} Balance in lamports
   */
  static async getBalanceLamports(publicKey, network = 'devnet') {
    const connection = this.getConnection(network);
    return await connection.getBalance(new PublicKey(publicKey));
  }

  /**
   * Check if account exists
   * @param {string} publicKey - Account public key
   * @param {string} network - Network name
   * @returns {Promise<boolean>} True if account exists
   */
  static async accountExists(publicKey, network = 'devnet') {
    const connection = this.getConnection(network);
    const account = await connection.getAccountInfo(new PublicKey(publicKey));
    return account !== null;
  }

  /**
   * Get recent blockhash
   * @param {string} network - Network name
   * @returns {Promise<string>} Recent blockhash
   */
  static async getRecentBlockhash(network = 'devnet') {
    const connection = this.getConnection(network);
    const { blockhash } = await connection.getRecentBlockhash();
    return blockhash;
  }

  /**
   * Create Metaplex instance for NFT operations
   * @param {string} network - Network name
   * @returns {Metaplex} Metaplex instance
   */
  static getMetaplex(network = 'devnet') {
    const connection = this.getConnection(network);
    return Metaplex.make(connection);
  }

  /**
   * Validate Solana public key
   * @param {string} publicKey - Public key string
   * @returns {boolean} True if valid
   */
  static isValidPublicKey(publicKey) {
    try {
      new PublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert SOL to lamports
   * @param {number} sol - Amount in SOL
   * @returns {number} Amount in lamports
   */
  static solToLamports(sol) {
    return Math.floor(sol * LAMPORTS_PER_SOL);
  }

  /**
   * Convert lamports to SOL
   * @param {number} lamports - Amount in lamports
   * @returns {number} Amount in SOL
   */
  static lamportsToSol(lamports) {
    return lamports / LAMPORTS_PER_SOL;
  }

  /**
   * Get transaction confirmation
   * @param {string} signature - Transaction signature
   * @param {string} network - Network name
   * @returns {Promise<object>} Transaction confirmation
   */
  static async confirmTransaction(signature, network = 'devnet') {
    const connection = this.getConnection(network);
    return await connection.confirmTransaction(signature);
  }

  /**
   * Get program accounts
   * @param {string} programId - Program ID
   * @param {string} network - Network name
   * @returns {Promise<Array>} Program accounts
   */
  static async getProgramAccounts(programId, network = 'devnet') {
    const connection = this.getConnection(network);
    return await connection.getProgramAccounts(new PublicKey(programId));
  }

  /**
   * Sleep utility
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Promise that resolves after sleep
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = BlockchainUtils;
