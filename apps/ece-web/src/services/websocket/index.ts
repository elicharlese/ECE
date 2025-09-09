import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { PrismaClient } from '../../../generated/prisma';
import { BattleEngineService } from '../battle-engine';
import { AutoBidService } from '../auto-bid';
import { MultiPickBettingService } from '../multi-pick-betting';

export interface WebSocketEventData {
  userId: string;
  event: string;
  data: any;
  timestamp: Date;
}

export interface RoomData {
  id: string;
  type: 'battle' | 'auction' | 'betting';
  participants: string[];
  metadata: any;
}

export class WebSocketService {
  private io: SocketServer;
  private prisma: PrismaClient;
  private battleEngine: BattleEngineService;
  private autoBidService: AutoBidService;
  private bettingService: MultiPickBettingService;
  
  private rooms: Map<string, RoomData> = new Map();
  private userSockets: Map<string, Socket> = new Map();

  constructor(
    httpServer: HTTPServer,
    prisma: PrismaClient,
    battleEngine: BattleEngineService,
    autoBidService: AutoBidService,
    bettingService: MultiPickBettingService
  ) {
    this.prisma = prisma;
    this.battleEngine = battleEngine;
    this.autoBidService = autoBidService;
    this.bettingService = bettingService;

    this.io = new SocketServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.initializeSocketHandlers();
    this.startPeriodicUpdates();
  }

  private initializeSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      // Authentication middleware
      socket.use(async (packet, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
          return next(new Error('Authentication required'));
        }
        
        // Store user-socket mapping
        this.userSockets.set(userId, socket);
        socket.data.userId = userId;
        
        next();
      });

      // Battle room handlers
      socket.on('join-battle', (battleId: string) => {
        this.handleJoinBattle(socket, battleId);
      });

      socket.on('leave-battle', (battleId: string) => {
        this.handleLeaveBattle(socket, battleId);
      });

      socket.on('battle-move', (data: any) => {
        this.handleBattleMove(socket, data);
      });

      // Auction room handlers
      socket.on('join-auction', (auctionId: string) => {
        this.handleJoinAuction(socket, auctionId);
      });

      socket.on('leave-auction', (auctionId: string) => {
        this.handleLeaveAuction(socket, auctionId);
      });

      socket.on('place-bid', (data: any) => {
        this.handlePlaceBid(socket, data);
      });

      // Betting room handlers
      socket.on('join-betting-market', (marketId: string) => {
        this.handleJoinBettingMarket(socket, marketId);
      });

      socket.on('leave-betting-market', (marketId: string) => {
        this.handleLeaveBettingMarket(socket, marketId);
      });

      socket.on('place-bet', (data: any) => {
        this.handlePlaceBet(socket, data);
      });

      // General handlers
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
  }

  // Battle Handlers
  private async handleJoinBattle(socket: Socket, battleId: string): Promise<void> {
    try {
      const userId = socket.data.userId;
      const roomId = `battle-${battleId}`;

      // Join socket room
      socket.join(roomId);

      // Update room data
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, {
          id: battleId,
          type: 'battle',
          participants: [],
          metadata: { battleId }
        });
      }

      const room = this.rooms.get(roomId)!;
      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
      }

      // Send current battle state
      const battleState = await this.getBattleState(battleId);
      socket.emit('battle-state', battleState);

      // Notify other participants
      socket.to(roomId).emit('user-joined-battle', {
        userId,
        battleId,
        timestamp: new Date()
      });

      console.log(`User ${userId} joined battle ${battleId}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to join battle', error: error.message });
    }
  }

  private async handleLeaveBattle(socket: Socket, battleId: string): Promise<void> {
    const userId = socket.data.userId;
    const roomId = `battle-${battleId}`;

    socket.leave(roomId);

    const room = this.rooms.get(roomId);
    if (room) {
      room.participants = room.participants.filter(id => id !== userId);
      
      if (room.participants.length === 0) {
        this.rooms.delete(roomId);
      }
    }

    // Notify other participants
    socket.to(roomId).emit('user-left-battle', {
      userId,
      battleId,
      timestamp: new Date()
    });

    console.log(`User ${userId} left battle ${battleId}`);
  }

  private async handleBattleMove(socket: Socket, data: any): Promise<void> {
    try {
      const { battleId, moveType, powerupUsed, targetCardId } = data;
      const userId = socket.data.userId;

      const move = {
        playerId: userId,
        cardId: data.cardId,
        moveType,
        powerupUsed,
        targetCardId
      };

      // Execute battle move
      const result = await this.battleEngine.executeBattleRound(battleId, move);

      // Broadcast move result to battle room
      const roomId = `battle-${battleId}`;
      this.io.to(roomId).emit('battle-move-result', {
        battleId,
        move,
        result,
        timestamp: new Date()
      });

      // Update battle state for all participants
      const battleState = await this.getBattleState(battleId);
      this.io.to(roomId).emit('battle-state-update', battleState);

    } catch (error) {
      socket.emit('error', { message: 'Battle move failed', error: error.message });
    }
  }

  // Auction Handlers
  private async handleJoinAuction(socket: Socket, auctionId: string): Promise<void> {
    try {
      const userId = socket.data.userId;
      const roomId = `auction-${auctionId}`;

      socket.join(roomId);

      // Update room data
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, {
          id: auctionId,
          type: 'auction',
          participants: [],
          metadata: { auctionId }
        });
      }

      const room = this.rooms.get(roomId)!;
      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
      }

      // Send current auction state
      const auctionState = await this.getAuctionState(auctionId);
      socket.emit('auction-state', auctionState);

      console.log(`User ${userId} joined auction ${auctionId}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to join auction', error: error.message });
    }
  }

  private async handleLeaveAuction(socket: Socket, auctionId: string): Promise<void> {
    const userId = socket.data.userId;
    const roomId = `auction-${auctionId}`;

    socket.leave(roomId);

    const room = this.rooms.get(roomId);
    if (room) {
      room.participants = room.participants.filter(id => id !== userId);
      
      if (room.participants.length === 0) {
        this.rooms.delete(roomId);
      }
    }

    console.log(`User ${userId} left auction ${auctionId}`);
  }

  private async handlePlaceBid(socket: Socket, data: any): Promise<void> {
    try {
      const { auctionId, amount } = data;
      const userId = socket.data.userId;

      // Place the bid
      await this.autoBidService.handleNewBid(auctionId, userId, amount);

      // Broadcast bid update to auction room
      const roomId = `auction-${auctionId}`;
      const auctionState = await this.getAuctionState(auctionId);
      
      this.io.to(roomId).emit('auction-bid-update', {
        auctionId,
        bidderId: userId,
        amount,
        timestamp: new Date(),
        auctionState
      });

    } catch (error) {
      socket.emit('error', { message: 'Bid placement failed', error: error.message });
    }
  }

  // Betting Handlers
  private async handleJoinBettingMarket(socket: Socket, marketId: string): Promise<void> {
    try {
      const userId = socket.data.userId;
      const roomId = `betting-${marketId}`;

      socket.join(roomId);

      // Update room data
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, {
          id: marketId,
          type: 'betting',
          participants: [],
          metadata: { marketId }
        });
      }

      const room = this.rooms.get(roomId)!;
      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
      }

      // Send current market state
      const marketState = await this.getBettingMarketState(marketId);
      socket.emit('betting-market-state', marketState);

      console.log(`User ${userId} joined betting market ${marketId}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to join betting market', error: error.message });
    }
  }

  private async handleLeaveBettingMarket(socket: Socket, marketId: string): Promise<void> {
    const userId = socket.data.userId;
    const roomId = `betting-${marketId}`;

    socket.leave(roomId);

    const room = this.rooms.get(roomId);
    if (room) {
      room.participants = room.participants.filter(id => id !== userId);
      
      if (room.participants.length === 0) {
        this.rooms.delete(roomId);
      }
    }

    console.log(`User ${userId} left betting market ${marketId}`);
  }

  private async handlePlaceBet(socket: Socket, data: any): Promise<void> {
    try {
      const { marketId, position, amount } = data;
      const userId = socket.data.userId;

      // Get market details for odds
      const market = await this.prisma.bettingMarket.findUnique({
        where: { id: marketId }
      });

      if (!market) {
        throw new Error('Market not found');
      }

      // Create bet combination
      const betRequest = {
        userId,
        picks: [{
          marketId,
          position,
          odds: market.odds
        }],
        stake: amount
      };

      const result = await this.bettingService.createBetCombination(betRequest);

      // Broadcast bet update to market room
      const roomId = `betting-${marketId}`;
      const marketState = await this.getBettingMarketState(marketId);
      
      this.io.to(roomId).emit('betting-market-update', {
        marketId,
        userId,
        position,
        amount,
        odds: market.odds,
        timestamp: new Date(),
        marketState
      });

      socket.emit('bet-placed', result);

    } catch (error) {
      socket.emit('error', { message: 'Bet placement failed', error: error.message });
    }
  }

  private async handleDisconnect(socket: Socket): Promise<void> {
    const userId = socket.data.userId;
    
    if (userId) {
      this.userSockets.delete(userId);
      
      // Remove user from all rooms
      for (const [roomId, room] of this.rooms.entries()) {
        room.participants = room.participants.filter(id => id !== userId);
        
        if (room.participants.length === 0) {
          this.rooms.delete(roomId);
        } else {
          // Notify other participants
          socket.to(roomId).emit('user-disconnected', {
            userId,
            timestamp: new Date()
          });
        }
      }
    }

    console.log(`User disconnected: ${userId || socket.id}`);
  }

  // State getters
  private async getBattleState(battleId: string): Promise<any> {
    const battle = await this.prisma.mABattle.findUnique({
      where: { id: battleId },
      include: {
        initiatorCard: true,
        targetCard: true,
        battleRounds: {
          orderBy: { roundNumber: 'desc' },
          take: 5
        },
        _count: {
          select: { battleRounds: true }
        }
      }
    });

    return battle ? {
      id: battle.id,
      status: battle.status,
      currentRound: battle._count.battleRounds,
      lastRounds: battle.battleRounds,
      initiatorCard: battle.initiatorCard,
      targetCard: battle.targetCard,
      stakes: battle.stakes,
      timeline: battle.timeline
    } : null;
  }

  private async getAuctionState(auctionId: string): Promise<any> {
    const auction = await this.prisma.cardAuction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          orderBy: { bidAmount: 'desc' },
          take: 5
        },
        card: true,
        _count: {
          select: { bids: true }
        }
      }
    });

    return auction ? {
      id: auction.id,
      title: auction.title,
      currentBid: auction.currentBid,
      bidIncrement: auction.bidIncrement,
      endTime: auction.endTime,
      status: auction.status,
      recentBids: auction.bids,
      totalBids: auction._count.bids,
      card: auction.card
    } : null;
  }

  private async getBettingMarketState(marketId: string): Promise<any> {
    const market = await this.prisma.bettingMarket.findUnique({
      where: { id: marketId },
      include: {
        positions: {
          select: {
            _count: true
          }
        },
        _count: {
          select: { positions: true }
        }
      }
    });

    return market ? {
      id: market.id,
      title: market.title,
      odds: market.odds,
      totalPot: market.totalPot,
      expiryDate: market.expiryDate,
      status: market.status,
      totalPositions: market._count.positions
    } : null;
  }

  // Periodic updates for live data
  private startPeriodicUpdates(): void {
    // Update auction states every 30 seconds
    setInterval(async () => {
      for (const [roomId, room] of this.rooms.entries()) {
        if (room.type === 'auction') {
          try {
            const auctionState = await this.getAuctionState(room.id);
            if (auctionState) {
              this.io.to(roomId).emit('auction-state-update', auctionState);
            }
          } catch (error) {
            console.error(`Failed to update auction ${room.id}:`, error);
          }
        }
      }
    }, 30000);

    // Update betting markets every 60 seconds
    setInterval(async () => {
      for (const [roomId, room] of this.rooms.entries()) {
        if (room.type === 'betting') {
          try {
            const marketState = await this.getBettingMarketState(room.id);
            if (marketState) {
              this.io.to(roomId).emit('betting-market-state-update', marketState);
            }
          } catch (error) {
            console.error(`Failed to update betting market ${room.id}:`, error);
          }
        }
      }
    }, 60000);

    // Update battle states every 10 seconds
    setInterval(async () => {
      for (const [roomId, room] of this.rooms.entries()) {
        if (room.type === 'battle') {
          try {
            const battleState = await this.getBattleState(room.id);
            if (battleState) {
              this.io.to(roomId).emit('battle-state-update', battleState);
            }
          } catch (error) {
            console.error(`Failed to update battle ${room.id}:`, error);
          }
        }
      }
    }, 10000);
  }

  // Public methods for external use
  public broadcastToUser(userId: string, event: string, data: any): void {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit(event, data);
    }
  }

  public broadcastToRoom(roomId: string, event: string, data: any): void {
    this.io.to(roomId).emit(event, data);
  }

  public getRoomParticipants(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    return room ? room.participants : [];
  }

  public getUserRooms(userId: string): string[] {
    const userRooms: string[] = [];
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.participants.includes(userId)) {
        userRooms.push(roomId);
      }
    }
    return userRooms;
  }

  public getServer(): SocketServer {
    return this.io;
  }
}
