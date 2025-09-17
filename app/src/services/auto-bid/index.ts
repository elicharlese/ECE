import { PrismaClient } from '@prisma/client'';
import { PrismaClient } from '@prisma/client'';

export interface AutoBidRequest {
  userId: string;
  auctionId: string;
  maxBid: number;
  strategy?: AutoBidStrategy;
  activationThreshold?: number;
}

export interface ProxyBidRequest {
  userId: string;
  auctionId: string;
  maximumBid: number;
}

export class AutoBidService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create an auto-bidding rule for an auction
   */
  async createAutoBidRule(request: AutoBidRequest): Promise<void> {
    const { userId, auctionId, maxBid, strategy = AutoBidStrategy.AGGRESSIVE, activationThreshold } = request;

    // Validate auction exists and is active
    const auction = await this.prisma.cardAuction.findUnique({
      where: { id: auctionId },
      include: { bids: { orderBy: { bidAmount: 'desc' }, take: 1 } }
    });

    if (!auction) {
      throw new Error('Auction not found');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new Error('Auction is not active');
    }

    // Check if user already has an auto-bid rule for this auction
    const existingRule = await this.prisma.autoBidRule.findUnique({
      where: {
        userId_auctionId: {
          userId,
          auctionId
        }
      }
    });

    if (existingRule) {
      throw new Error('Auto-bid rule already exists for this auction');
    }

    // Create auto-bid rule
    await this.prisma.autoBidRule.create({
      data: {
        userId,
        auctionId,
        maxBidAmount: maxBid,
        strategy,
        activationThreshold,
        isActive: true
      }
    });

    // Check if we should place an immediate bid
    const currentBid = auction.bids[0]?.bidAmount || auction.startPrice;
    if (currentBid < maxBid && (!activationThreshold || currentBid >= activationThreshold)) {
      await this.executeAutoBidStrategy(auctionId);
    }
  }

  /**
   * Create a proxy bid for an auction
   */
  async createProxyBid(request: ProxyBidRequest): Promise<void> {
    const { userId, auctionId, maximumBid } = request;

    // Validate auction exists and is active
    const auction = await this.prisma.cardAuction.findUnique({
      where: { id: auctionId }
    });

    if (!auction) {
      throw new Error('Auction not found');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new Error('Auction is not active');
    }

    // Check if user already has a proxy bid for this auction
    const existingProxy = await this.prisma.proxyBid.findUnique({
      where: {
        userId_auctionId: {
          userId,
          auctionId
        }
      }
    });

    if (existingProxy) {
      throw new Error('Proxy bid already exists for this auction');
    }

    // Create proxy bid
    await this.prisma.proxyBid.create({
      data: {
        userId,
        auctionId,
        maximumBid,
        isActive: true
      }
    });

    // Execute proxy bidding logic
    await this.executeProxyBidding(auctionId);
  }

  /**
   * Execute auto-bidding strategies for an auction
   */
  async executeAutoBidStrategy(auctionId: string): Promise<void> {
    const auction = await this.prisma.cardAuction.findUnique({
      where: { id: auctionId },
      include: {
        bids: { orderBy: { bidAmount: 'desc' }, take: 1 },
        autoBidRules: { where: { isActive: true } }
      }
    });

    if (!auction || auction.status !== AuctionStatus.ACTIVE) {
      return;
    }

    const currentBid = auction.bids[0]?.bidAmount || auction.startPrice;
    const activeRules = auction.autoBidRules;

    for (const rule of activeRules) {
      if (currentBid >= rule.maxBidAmount) {
        // Deactivate rule if we've reached the maximum
        await this.prisma.autoBidRule.update({
          where: { id: rule.id },
          data: { isActive: false }
        });
        continue;
      }

      // Check activation threshold
      if (rule.activationThreshold && currentBid < rule.activationThreshold) {
        continue;
      }

      // Calculate bid amount based on strategy
      const bidAmount = await this.calculateBidAmount(rule, currentBid, auction.bidIncrement);

      if (bidAmount <= rule.maxBidAmount && bidAmount > currentBid) {
        // Place the bid
        await this.placeBid(auctionId, rule.userId, bidAmount, 'AUTO_BID');
        
        // Record the bid in auto-bid rule
        await this.prisma.autoBidRule.update({
          where: { id: rule.id },
          data: {
            lastBidAmount: bidAmount,
            totalBidsPlaced: { increment: 1 }
          }
        });

        // Send notification
        await this.sendBidNotification(rule.userId, auctionId, bidAmount, 'WINNING');
      }
    }
  }

  /**
   * Execute proxy bidding for an auction
   */
  async executeProxyBidding(auctionId: string): Promise<void> {
    const auction = await this.prisma.cardAuction.findUnique({
      where: { id: auctionId },
      include: {
        bids: { orderBy: { bidAmount: 'desc' }, take: 1 },
        proxyBids: { where: { isActive: true } }
      }
    });

    if (!auction || auction.status !== AuctionStatus.ACTIVE) {
      return;
    }

    const currentBid = auction.bids[0]?.bidAmount || auction.startPrice;
    const activeProxies = auction.proxyBids.sort((a, b) => b.maximumBid - a.maximumBid);

    let highestProxyBid = 0;
    let winningProxy: any = null;

    // Find the highest active proxy bid
    for (const proxy of activeProxies) {
      if (proxy.maximumBid > highestProxyBid) {
        highestProxyBid = proxy.maximumBid;
        winningProxy = proxy;
      }
    }

    if (!winningProxy || highestProxyBid <= currentBid) {
      return;
    }

    // Calculate the actual bid amount (one increment above current bid)
    const bidIncrement = auction.bidIncrement || 10;
    const actualBidAmount = Math.min(
      currentBid + bidIncrement,
      winningProxy.maximumBid
    );

    // Place the proxy bid
    await this.placeBid(auctionId, winningProxy.userId, actualBidAmount, 'PROXY_BID');

    // Record the bid in proxy bid history
    await this.prisma.proxyBidHistory.create({
      data: {
        proxyBidId: winningProxy.id,
        bidAmount: actualBidAmount,
        competingBid: currentBid,
        autoGenerated: true
      }
    });

    // Update proxy bid status
    await this.prisma.proxyBid.update({
      where: { id: winningProxy.id },
      data: {
        currentProxyBid: actualBidAmount,
        bidsPlaced: {
          create: {
            bidAmount: actualBidAmount,
            bidTime: new Date(),
            competingBid: currentBid,
            autoGenerated: true
          }
        }
      }
    });

    // Notify other bidders that they've been outbid
    await this.notifyOutbidBidders(auctionId, winningProxy.userId, actualBidAmount);
  }

  /**
   * Handle a new manual bid and trigger auto-bidding responses
   */
  async handleNewBid(auctionId: string, bidderId: string, bidAmount: number): Promise<void> {
    // Execute auto-bidding strategies in response to the new bid
    await this.executeAutoBidStrategy(auctionId);
    
    // Execute proxy bidding in response to the new bid
    await this.executeProxyBidding(auctionId);

    // Send notifications
    await this.sendBidNotification(bidderId, auctionId, bidAmount, 'WINNING');
  }

  /**
   * Send bid notifications to users
   */
  async sendBidNotification(
    userId: string, 
    auctionId: string, 
    bidAmount: number, 
    notificationType: BidNotificationType,
    outbidAmount?: number
  ): Promise<void> {
    const message = this.generateNotificationMessage(notificationType, bidAmount, outbidAmount);

    await this.prisma.bidNotification.create({
      data: {
        userId,
        auctionId,
        notificationType,
        message,
        bidAmount,
        outbidAmount,
        read: false
      }
    });

    // Here you would integrate with your notification service
    // await notificationService.send(userId, message);
  }

  /**
   * Deactivate auto-bid rules for completed auctions
   */
  async deactivateAutoBidsForAuction(auctionId: string): Promise<void> {
    await this.prisma.autoBidRule.updateMany({
      where: { auctionId, isActive: true },
      data: { isActive: false }
    });

    await this.prisma.proxyBid.updateMany({
      where: { auctionId, isActive: true },
      data: { isActive: false }
    });
  }

  // Private helper methods

  private async calculateBidAmount(rule: any, currentBid: number, bidIncrement: number): Promise<number> {
    switch (rule.strategy) {
      case AutoBidStrategy.AGGRESSIVE:
        // Bid immediately with increment
        return Math.min(currentBid + bidIncrement, rule.maxBidAmount);
      
      case AutoBidStrategy.CONSERVATIVE:
        // Wait and bid at last moment
        return Math.min(currentBid + (bidIncrement * 0.5), rule.maxBidAmount);
      
      case AutoBidStrategy.SNIPER:
        // Bid at the very last moment (not implemented in this simple version)
        return Math.min(currentBid + bidIncrement, rule.maxBidAmount);
      
      case AutoBidStrategy.GRADUAL:
        // Incremental bidding
        const increment = Math.max(bidIncrement * 0.25, 1);
        return Math.min(currentBid + increment, rule.maxBidAmount);
      
      default:
        return Math.min(currentBid + bidIncrement, rule.maxBidAmount);
    }
  }

  private async placeBid(auctionId: string, userId: string, amount: number, bidType: 'AUTO_BID' | 'PROXY_BID' | 'MANUAL' = 'MANUAL'): Promise<void> {
    const auction = await this.prisma.cardAuction.findUnique({
      where: { id: auctionId },
      include: { card: true }
    });

    if (!auction) {
      throw new Error('Auction not found');
    }

    // Create the bid
    await this.prisma.auctionBid.create({
      data: {
        auctionId,
        bidderId: userId,
        bidAmount: amount,
        maxAutoBid: bidType === 'AUTO_BID' ? amount : undefined,
        bidType: bidType as any,
        status: 'ACTIVE'
      }
    });

    // Update auction current bid
    await this.prisma.cardAuction.update({
      where: { id: auctionId },
      data: { currentBid: amount }
    });
  }

  private async notifyOutbidBidders(auctionId: string, winningBidderId: string, winningBidAmount: number): Promise<void> {
    // Get all bidders except the winner
    const otherBids = await this.prisma.auctionBid.findMany({
      where: {
        auctionId,
        bidderId: { not: winningBidderId },
        status: 'ACTIVE'
      },
      distinct: ['bidderId']
    });

    for (const bid of otherBids) {
      await this.sendBidNotification(
        bid.bidderId, 
        auctionId, 
        winningBidAmount, 
        'OUTBID',
        bid.bidAmount
      );
    }
  }

  private generateNotificationMessage(
    type: BidNotificationType, 
    bidAmount: number, 
    outbidAmount?: number
  ): string {
    switch (type) {
      case 'OUTBID':
        return `You've been outbid! Current bid: ${bidAmount} ECE (your bid: ${outbidAmount} ECE)`;
      case 'WINNING':
        return `You're currently winning with a bid of ${bidAmount} ECE!`;
      case 'AUCTION_ENDING':
        return `Auction ending soon! Current bid: ${bidAmount} ECE`;
      case 'AUCTION_ENDED':
        return `Auction ended. Final bid: ${bidAmount} ECE`;
      case 'NEW_BID':
        return `New bid placed: ${bidAmount} ECE`;
      default:
        return `Bid update: ${bidAmount} ECE`;
    }
  }
}
