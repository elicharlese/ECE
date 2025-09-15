// Advanced Test Utilities for Blockchain Contracts
// Provides helper functions for comprehensive contract testing

const { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { Program } = require('@coral-xyz/anchor');
const { expect } = require('chai');

class BlockchainTestUtils {
  /**
   * Generate a new keypair for testing
   * @returns {Keypair} New Solana keypair
   */
  static generateKeypair() {
    return Keypair.generate();
  }

  /**
   * Airdrop SOL to an account for testing
   * @param {Connection} connection - Solana connection
   * @param {PublicKey} publicKey - Account to airdrop to
   * @param {number} amount - Amount in SOL (default: 2)
   */
  static async airdrop(connection, publicKey, amount = 2) {
    const lamports = amount * LAMPORTS_PER_SOL;
    const signature = await connection.requestAirdrop(publicKey, lamports);
    await connection.confirmTransaction(signature);
    console.log(`✅ Airdropped ${amount} SOL to ${publicKey.toString()}`);
  }

  /**
   * Get account balance
   * @param {Connection} connection - Solana connection
   * @param {PublicKey} publicKey - Account public key
   * @returns {Promise<number>} Balance in lamports
   */
  static async getBalance(connection, publicKey) {
    return await connection.getBalance(publicKey);
  }

  /**
   * Create a program instance for testing
   * @param {string} programId - Program ID
   * @param {Provider} provider - Anchor provider
   * @returns {Program} Anchor program instance
   */
  static createProgram(programId, provider) {
    return new Program(
      require(`../solana/ece-token/target/idl/${programId}.json`),
      new PublicKey(programId),
      provider
    );
  }

  /**
   * Wait for a specific number of slots
   * @param {Connection} connection - Solana connection
   * @param {number} slots - Number of slots to wait
   */
  static async waitForSlots(connection, slots = 1) {
    const currentSlot = await connection.getSlot();
    while (await connection.getSlot() < currentSlot + slots) {
      await this.sleep(100);
    }
  }

  /**
   * Sleep utility
   * @param {number} ms - Milliseconds to sleep
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Assert account balance change
   * @param {Connection} connection - Solana connection
   * @param {PublicKey} account - Account to check
   * @param {number} expectedChange - Expected balance change in lamports
   * @param {number} initialBalance - Initial balance for comparison
   */
  static async assertBalanceChange(connection, account, expectedChange, initialBalance) {
    const finalBalance = await this.getBalance(connection, account);
    const actualChange = finalBalance - initialBalance;
    expect(actualChange).to.equal(expectedChange);
  }

  /**
   * Create a mock user for testing
   * @param {Connection} connection - Solana connection
   * @returns {Promise<{keypair: Keypair, publicKey: PublicKey}>} User object
   */
  static async createMockUser(connection) {
    const keypair = this.generateKeypair();
    await this.airdrop(connection, keypair.publicKey);
    return {
      keypair,
      publicKey: keypair.publicKey
    };
  }

  /**
   * Setup test environment
   * @param {Connection} connection - Solana connection
   * @returns {Promise<Array>} Array of test users
   */
  static async setupTestEnvironment(connection) {
    console.log('🚀 Setting up test environment...');

    const users = [];
    for (let i = 0; i < 3; i++) {
      const user = await this.createMockUser(connection);
      users.push(user);
      console.log(`✅ Created test user ${i + 1}: ${user.publicKey.toString()}`);
    }

    console.log('✅ Test environment setup complete');
    return users;
  }

  /**
   * Cleanup test environment
   * @param {Array} users - Array of test users to clean up
   */
  static cleanupTestEnvironment(users) {
    console.log('🧹 Cleaning up test environment...');
    // Add cleanup logic here if needed
    console.log('✅ Test environment cleaned up');
  }

  /**
   * Log transaction details for debugging
   * @param {string} signature - Transaction signature
   * @param {string} description - Description of the transaction
   */
  static logTransaction(signature, description) {
    console.log(`📝 ${description}: ${signature}`);
  }

  /**
   * Validate transaction success
   * @param {Connection} connection - Solana connection
   * @param {string} signature - Transaction signature
   * @returns {Promise<boolean>} True if transaction was successful
   */
  static async validateTransaction(connection, signature) {
    try {
      const transaction = await connection.getTransaction(signature);
      return transaction !== null && transaction.meta.err === null;
    } catch (error) {
      console.error('❌ Transaction validation failed:', error);
      return false;
    }
  }
}

module.exports = BlockchainTestUtils;
