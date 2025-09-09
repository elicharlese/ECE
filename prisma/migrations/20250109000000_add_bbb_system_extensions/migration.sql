-- CreateTable
CREATE TABLE "user_swipe_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredCategories" JSONB,
    "preferredRarities" JSONB,
    "minPricePreference" DECIMAL(65,30),
    "maxPricePreference" DECIMAL(65,30),
    "explorationRate" DECIMAL(65,30) DEFAULT 0.1,
    "diversityScore" DECIMAL(65,30) DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_swipe_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swipe_actions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "action" "SwipeActionType" NOT NULL,
    "sessionId" TEXT,
    "position" INTEGER,
    "timeSpent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swipe_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swipe_matches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchedUserId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "matchType" "MatchType" NOT NULL,
    "matchStrength" DECIMAL(65,30) NOT NULL,
    "userAction" "MatchAction",
    "matchedUserAction" "MatchAction",
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "swipe_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_rounds" (
    "id" TEXT NOT NULL,
    "battleId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "winner" "BattleRoundWinner",
    "damageDealt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "battle_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_moves" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "moveType" "BattleMoveType" NOT NULL,
    "damage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battle_moves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_statistics" (
    "id" TEXT NOT NULL,
    "battleId" TEXT NOT NULL,
    "totalRounds" INTEGER NOT NULL DEFAULT 0,
    "totalDamage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "avgRoundDuration" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battle_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_rankings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodType" "RankingPeriod" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3),
    "battlesWon" INTEGER NOT NULL DEFAULT 0,
    "battlesLost" INTEGER NOT NULL DEFAULT 0,
    "totalBattles" INTEGER NOT NULL DEFAULT 0,
    "winRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "rankingPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battle_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "betting_odds_history" (
    "id" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "odds" DECIMAL(65,30) NOT NULL,
    "totalPot" DECIMAL(65,30) NOT NULL,
    "positionCount" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "betting_odds_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_settlements" (
    "id" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "settledValue" DECIMAL(65,30) NOT NULL,
    "settlementSource" TEXT NOT NULL,
    "settlementProof" JSONB,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "totalPayouts" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "payoutCount" INTEGER NOT NULL DEFAULT 0,
    "payoutProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bet_combinations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "combinationId" TEXT NOT NULL,
    "totalStake" DECIMAL(65,30) NOT NULL,
    "totalOdds" DECIMAL(65,30) NOT NULL,
    "potentialWinnings" DECIMAL(65,30) NOT NULL,
    "status" "CombinationStatus" NOT NULL DEFAULT 'ACTIVE',
    "settled" BOOLEAN NOT NULL DEFAULT false,
    "won" BOOLEAN,
    "actualWinnings" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bet_combinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bet_picks" (
    "id" TEXT NOT NULL,
    "combinationId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "position" "PredictionDirection" NOT NULL,
    "odds" DECIMAL(65,30) NOT NULL,
    "settled" BOOLEAN NOT NULL DEFAULT false,
    "won" BOOLEAN,

    CONSTRAINT "bet_picks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auto_bid_rules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "maxBidAmount" DECIMAL(65,30) NOT NULL,
    "bidIncrement" DECIMAL(65,30) NOT NULL DEFAULT 10,
    "strategyType" "AutoBidStrategy" NOT NULL DEFAULT 'AGGRESSIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastBidAmount" DECIMAL(65,30),
    "totalBidsPlaced" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auto_bid_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "notificationType" "BidNotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "bidAmount" DECIMAL(65,30),
    "outbidAmount" DECIMAL(65,30),
    "read" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proxy_bids" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "maximumBid" DECIMAL(65,30) NOT NULL,
    "currentProxyBid" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "exhausted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proxy_bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proxy_bid_history" (
    "id" TEXT NOT NULL,
    "proxyBidId" TEXT NOT NULL,
    "bidAmount" DECIMAL(65,30) NOT NULL,
    "bidTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "competingBid" DECIMAL(65,30),
    "autoGenerated" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "proxy_bid_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_milestones" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "milestoneType" "OrderMilestoneType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "plannedDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "estimatedDuration" INTEGER,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "completedBy" TEXT,
    "completionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_time_tracking" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "phaseType" "OrderPhase" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "plannedDuration" INTEGER,
    "actualDuration" INTEGER,
    "assignedUserId" TEXT,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "order_time_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_quality_checks" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "checkType" "QualityCheckType" NOT NULL,
    "checkName" TEXT NOT NULL,
    "description" TEXT,
    "criteria" JSONB,
    "automated" BOOLEAN NOT NULL DEFAULT false,
    "status" "QualityStatus" NOT NULL DEFAULT 'PENDING',
    "score" DECIMAL(65,30),
    "passed" BOOLEAN,
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "reviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_quality_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_updates" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "oldStatus" "OrderStatus" NOT NULL,
    "newStatus" "OrderStatus" NOT NULL,
    "changedBy" TEXT NOT NULL,
    "triggerType" "StatusUpdateTrigger" NOT NULL,
    "triggerDetails" JSONB,
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "notifiedUsers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_swipe_preferences_userId_key" ON "user_swipe_preferences"("userId");

-- CreateIndex
CREATE INDEX "swipe_actions_userId_createdAt_idx" ON "swipe_actions"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "swipe_matches_userId_matchedUserId_cardId_key" ON "swipe_matches"("userId", "matchedUserId", "cardId");

-- CreateIndex
CREATE INDEX "swipe_matches_userId_isActive_idx" ON "swipe_matches"("userId", "isActive");

-- CreateIndex
CREATE INDEX "swipe_matches_matchedUserId_isActive_idx" ON "swipe_matches"("matchedUserId", "isActive");

-- CreateIndex
CREATE INDEX "battle_rounds_battleId_roundNumber_idx" ON "battle_rounds"("battleId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "battle_statistics_battleId_key" ON "battle_statistics"("battleId");

-- CreateIndex
CREATE UNIQUE INDEX "battle_rankings_userId_periodType_periodStart_key" ON "battle_rankings"("userId", "periodType", "periodStart");

-- CreateIndex
CREATE INDEX "battle_rankings_periodType_rankingPoints_idx" ON "battle_rankings"("periodType", "rankingPoints");

-- CreateIndex
CREATE INDEX "betting_odds_history_marketId_recordedAt_idx" ON "betting_odds_history"("marketId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "market_settlements_marketId_key" ON "market_settlements"("marketId");

-- CreateIndex
CREATE INDEX "bet_combinations_userId_combinationId_idx" ON "bet_combinations"("userId", "combinationId");

-- CreateIndex
CREATE UNIQUE INDEX "auto_bid_rules_userId_auctionId_key" ON "auto_bid_rules"("userId", "auctionId");

-- CreateIndex
CREATE INDEX "bid_notifications_userId_read_idx" ON "bid_notifications"("userId", "read");

-- CreateIndex
CREATE UNIQUE INDEX "proxy_bids_userId_auctionId_key" ON "proxy_bids"("userId", "auctionId");

-- CreateIndex
CREATE INDEX "order_milestones_orderId_status_idx" ON "order_milestones"("orderId", "status");

-- CreateIndex
CREATE INDEX "order_time_tracking_orderId_phaseType_idx" ON "order_time_tracking"("orderId", "phaseType");

-- CreateIndex
CREATE INDEX "order_quality_checks_orderId_status_idx" ON "order_quality_checks"("orderId", "status");

-- CreateIndex
CREATE INDEX "order_status_updates_orderId_createdAt_idx" ON "order_status_updates"("orderId", "createdAt");

-- AddForeignKey
ALTER TABLE "user_swipe_preferences" ADD CONSTRAINT "user_swipe_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipe_actions" ADD CONSTRAINT "swipe_actions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipe_actions" ADD CONSTRAINT "swipe_actions_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipe_matches" ADD CONSTRAINT "swipe_matches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipe_matches" ADD CONSTRAINT "swipe_matches_matchedUserId_fkey" FOREIGN KEY ("matchedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipe_matches" ADD CONSTRAINT "swipe_matches_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_rounds" ADD CONSTRAINT "battle_rounds_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "ma_battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_moves" ADD CONSTRAINT "battle_moves_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "battle_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_moves" ADD CONSTRAINT "battle_moves_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_moves" ADD CONSTRAINT "battle_moves_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_statistics" ADD CONSTRAINT "battle_statistics_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "ma_battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_rankings" ADD CONSTRAINT "battle_rankings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "betting_odds_history" ADD CONSTRAINT "betting_odds_history_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "betting_markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_settlements" ADD CONSTRAINT "market_settlements_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "betting_markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet_combinations" ADD CONSTRAINT "bet_combinations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet_picks" ADD CONSTRAINT "bet_picks_combinationId_fkey" FOREIGN KEY ("combinationId") REFERENCES "bet_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet_picks" ADD CONSTRAINT "bet_picks_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "betting_markets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_bid_rules" ADD CONSTRAINT "auto_bid_rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_bid_rules" ADD CONSTRAINT "auto_bid_rules_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "card_auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_notifications" ADD CONSTRAINT "bid_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_notifications" ADD CONSTRAINT "bid_notifications_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "card_auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proxy_bids" ADD CONSTRAINT "proxy_bids_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proxy_bids" ADD CONSTRAINT "proxy_bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "card_auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proxy_bid_history" ADD CONSTRAINT "proxy_bid_history_proxyBidId_fkey" FOREIGN KEY ("proxyBidId") REFERENCES "proxy_bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_milestones" ADD CONSTRAINT "order_milestones_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "app_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_time_tracking" ADD CONSTRAINT "order_time_tracking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "app_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_quality_checks" ADD CONSTRAINT "order_quality_checks_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "app_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_updates" ADD CONSTRAINT "order_status_updates_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "app_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
