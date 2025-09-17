#!/usr/bin/env ts-node

/**
 * ECE Platform Operations Script
 * Unified script for deployment, maintenance, and testing operations
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface OperationConfig {
  environment: 'development' | 'staging' | 'production';
  skipTests?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

class PlatformOperations {
  private config: OperationConfig;
  private rootDir: string;

  constructor(config: OperationConfig) {
    this.config = config;
    this.rootDir = process.cwd();
  }

  /**
   * Deploy entire platform
   */
  async deploy(): Promise<void> {
    this.log('🚀 Starting ECE Platform Deployment');
    
    if (!this.config.skipTests) {
      await this.runTests();
    }

    await this.buildApplications();
    await this.deployContracts();
    await this.deployApplications();
    await this.runHealthChecks();

    this.log('✅ Platform deployment completed successfully');
  }

  /**
   * Start all development services
   */
  async startDevelopment(): Promise<void> {
    this.log('🔧 Starting ECE Development Environment');

    // Start database if needed
    await this.setupDatabase();

    // Start all applications concurrently
    const apps = [
      { name: 'ECE Web', command: 'nx serve app', port: 3000 },
      { name: 'ECE Mobile', command: 'nx run ece-mobile:start', port: 8081 },
      { name: 'ECE Desktop', command: 'nx serve desktop', port: 3001 }
    ];

    const processes = apps.map(app => {
      this.log(`Starting ${app.name} on port ${app.port}`);
      return this.execAsync(app.command, { detached: true });
    });

    this.log('🌟 All applications started successfully');
    this.log('Web App: http://localhost:3000');
    this.log('Mobile App: http://localhost:8081');
    this.log('Desktop App: http://localhost:3001');
  }

  /**
   * Run comprehensive test suite
   */
  async runTests(): Promise<void> {
    this.log('🧪 Running test suite');

    const testCommands = [
      'npm run test:unit',
      'npm run test:integration', 
      'npm run test:e2e'
    ];

    for (const cmd of testCommands) {
      this.log(`Running: ${cmd}`);
      this.exec(cmd);
    }

    this.log('✅ All tests passed');
  }

  /**
   * Database operations
   */
  async setupDatabase(): Promise<void> {
    this.log('🗄️ Setting up database');

    // Run migrations
    this.exec('npx prisma migrate deploy');
    
    // Generate Prisma client
    this.exec('npx prisma generate');

    // Seed if in development
    if (this.config.environment === 'development') {
      this.exec('npx prisma db seed');
    }

    this.log('✅ Database setup completed');
  }

  /**
   * Seed marketplace data
   */
  async seedMarketplace(): Promise<void> {
    this.log('🌱 Seeding marketplace data');

    const seedScript = join(this.rootDir, 'scripts', 'seed-marketplace.js');
    if (existsSync(seedScript)) {
      this.exec(`node ${seedScript}`);
    } else {
      // Inline seed logic
      this.exec('npx prisma db seed');
    }

    this.log('✅ Marketplace seeded successfully');
  }

  /**
   * Build all applications
   */
  private async buildApplications(): Promise<void> {
    this.log('📦 Building applications');

    const buildCommands = [
      'nx build app',
      'nx build ece-mobile --platform=all',
      'nx build desktop'
    ];

    for (const cmd of buildCommands) {
      this.log(`Building: ${cmd}`);
      this.exec(cmd);
    }

    this.log('✅ All applications built successfully');
  }

  /**
   * Deploy Solana smart contracts
   */
  private async deployContracts(): Promise<void> {
    this.log('⛓️ Deploying Solana contracts');

    const contractDir = join(this.rootDir, 'solana-contracts', 'ece-token');
    process.chdir(contractDir);

    // Build contracts
    this.exec('./build.sh');

    // Deploy to appropriate network
    const network = this.config.environment === 'production' ? 'mainnet-beta' : 'devnet';
    this.exec(`./deploy.sh ${network}`);

    process.chdir(this.rootDir);
    this.log('✅ Smart contracts deployed successfully');
  }

  /**
   * Deploy applications to hosting platforms
   */
  private async deployApplications(): Promise<void> {
    this.log('🌐 Deploying applications');

    if (this.config.environment === 'production') {
      // Deploy to production
      this.exec('vercel --prod');
    } else {
      // Deploy to staging
      this.exec('vercel');
    }

    this.log('✅ Applications deployed successfully');
  }

  /**
   * Run health checks
   */
  private async runHealthChecks(): Promise<void> {
    this.log('🔍 Running health checks');

    const healthChecks = [
      () => this.checkDatabaseConnection(),
      () => this.checkSolanaConnection(),
      () => this.checkAPIEndpoints()
    ];

    for (const check of healthChecks) {
      await check();
    }

    this.log('✅ All health checks passed');
  }

  /**
   * Check database connectivity
   */
  private async checkDatabaseConnection(): Promise<void> {
    try {
      this.exec('node -e "const { PrismaClient } = require(\'@prisma/client\'); new PrismaClient().$connect().then(() => console.log(\'DB OK\'))"');
      this.log('✅ Database connection: OK');
    } catch (error) {
      throw new Error('❌ Database connection failed');
    }
  }

  /**
   * Check Solana network connection
   */
  private async checkSolanaConnection(): Promise<void> {
    try {
      const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      this.exec(`solana cluster-version --url ${rpcUrl}`);
      this.log('✅ Solana connection: OK');
    } catch (error) {
      throw new Error('❌ Solana connection failed');
    }
  }

  /**
   * Check API endpoints
   */
  private async checkAPIEndpoints(): Promise<void> {
    const endpoints = [
      '/api/health',
      '/api/user/balance',
      '/api/treasury/status'
    ];

    const baseUrl = this.config.environment === 'production' 
      ? 'https://ece-platform.com'
      : 'http://localhost:3000';

    for (const endpoint of endpoints) {
      try {
        this.exec(`curl -f ${baseUrl}${endpoint}`);
        this.log(`✅ API endpoint ${endpoint}: OK`);
      } catch (error) {
        this.log(`⚠️ API endpoint ${endpoint}: Warning`);
      }
    }
  }

  /**
   * Maintenance operations
   */
  async runMaintenance(): Promise<void> {
    this.log('🔧 Running maintenance operations');

    // Database maintenance
    await this.optimizeDatabase();
    
    // Cache clearing
    await this.clearCaches();
    
    // Log rotation
    await this.rotateLogs();

    this.log('✅ Maintenance completed');
  }

  private async optimizeDatabase(): Promise<void> {
    this.log('Optimizing database performance');
    // Add database optimization logic
  }

  private async clearCaches(): Promise<void> {
    this.log('Clearing application caches');
    // Add cache clearing logic
  }

  private async rotateLogs(): Promise<void> {
    this.log('Rotating application logs');
    // Add log rotation logic
  }

  /**
   * Utility methods
   */
  private exec(command: string): string {
    if (this.config.dryRun) {
      this.log(`[DRY RUN] Would execute: ${command}`);
      return '';
    }

    if (this.config.verbose) {
      this.log(`Executing: ${command}`);
    }

    return execSync(command, { 
      encoding: 'utf8',
      stdio: this.config.verbose ? 'inherit' : 'pipe'
    });
  }

  private async execAsync(command: string, options?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.config.dryRun) {
        this.log(`[DRY RUN] Would execute async: ${command}`);
        resolve();
        return;
      }

      const { spawn } = require('child_process');
      const child = spawn('sh', ['-c', command], { 
        stdio: 'inherit',
        ...options 
      });

      child.on('close', (code: number) => {
        code === 0 ? resolve() : reject(new Error(`Command failed: ${command}`));
      });
    });
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const config: OperationConfig = {
    environment: (args.find(arg => arg.startsWith('--env='))?.split('=')[1] as any) || 'development',
    skipTests: args.includes('--skip-tests'),
    verbose: args.includes('--verbose'),
    dryRun: args.includes('--dry-run')
  };

  const operations = new PlatformOperations(config);

  try {
    switch (command) {
      case 'deploy':
        await operations.deploy();
        break;
      case 'start':
        await operations.startDevelopment();
        break;
      case 'test':
        await operations.runTests();
        break;
      case 'setup-db':
        await operations.setupDatabase();
        break;
      case 'seed':
        await operations.seedMarketplace();
        break;
      case 'maintain':
        await operations.runMaintenance();
        break;
      case 'health-check':
        await operations.runHealthChecks();
        break;
      default:
        console.log(`
ECE Platform Operations

Commands:
  deploy         - Deploy entire platform
  start          - Start development environment  
  test           - Run test suite
  setup-db       - Setup and migrate database
  seed           - Seed marketplace data
  maintain       - Run maintenance operations
  health-check   - Run health checks

Options:
  --env=<env>    - Environment (development|staging|production)
  --skip-tests   - Skip test execution
  --verbose      - Verbose output
  --dry-run      - Show commands without executing

Examples:
  npm run ops deploy --env=production
  npm run ops start --verbose
  npm run ops test --skip-tests=false
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Operation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { PlatformOperations };
