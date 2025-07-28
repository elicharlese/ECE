'use client';

// Enhanced User Profile Types
export interface SocialProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
  };
  tradingStats: {
    totalTrades: number;
    successRate: number;
    totalVolume: number;
    winStreak: number;
    favoriteCategory: string;
  };
  preferences: {
    publicProfile: boolean;
    showTradingStats: boolean;
    allowMessages: boolean;
    allowFollows: boolean;
    tradingNotifications: boolean;
  };
  badges: string[];
  level: number;
  experience: number;
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'blocked';
  type: 'follow' | 'friend' | 'mentor' | 'mentee';
  connectedAt: Date;
  metadata: Record<string, any>;
}

export interface TradingGroup {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  bannerImage?: string;
  ownerId: string;
  moderators: string[];
  members: string[];
  isPrivate: boolean;
  requirements: {
    minimumLevel?: number;
    minimumReputation?: number;
    verificationRequired?: boolean;
  };
  settings: {
    allowInvites: boolean;
    requireApproval: boolean;
    allowDiscussions: boolean;
    allowTradingSignals: boolean;
  };
  stats: {
    memberCount: number;
    totalTrades: number;
    averageSuccessRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialPost {
  id: string;
  authorId: string;
  content: string;
  type: 'text' | 'image' | 'trade_share' | 'strategy' | 'poll';
  attachments?: {
    images?: string[];
    trade?: {
      cardId: string;
      price: number;
      result: 'profit' | 'loss';
      percentage: number;
    };
    poll?: {
      question: string;
      options: string[];
      votes: Record<string, number>;
      expiresAt: Date;
    };
  };
  groupId?: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  visibility: 'public' | 'followers' | 'group' | 'private';
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradingSignal {
  id: string;
  creatorId: string;
  cardId: string;
  action: 'buy' | 'sell' | 'hold';
  targetPrice: number;
  currentPrice: number;
  confidence: number; // 1-100
  reasoning: string;
  timeframe: '1h' | '4h' | '1d' | '1w' | '1m';
  tags: string[];
  followersCount: number;
  successRate: number;
  expiresAt: Date;
  status: 'active' | 'executed' | 'expired' | 'cancelled';
  results?: {
    executedAt: Date;
    finalPrice: number;
    profitLoss: number;
  };
  createdAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'trading' | 'collection' | 'social' | 'achievement';
  rules: string[];
  rewards: {
    experience: number;
    reputation: number;
    badges?: string[];
    prizes?: string[];
  };
  requirements: {
    level?: number;
    badges?: string[];
    tradingVolume?: number;
  };
  duration: {
    start: Date;
    end: Date;
  };
  participants: string[];
  leaderboard: Array<{
    userId: string;
    score: number;
    progress: Record<string, any>;
  }>;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'trade' | 'signal' | 'challenge' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export class SocialFeaturesService {
  private profiles: Map<string, SocialProfile> = new Map();
  private connections: Map<string, Connection> = new Map();
  private groups: Map<string, TradingGroup> = new Map();
  private posts: Map<string, SocialPost> = new Map();
  private signals: Map<string, TradingSignal> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private notifications: Map<string, Notification[]> = new Map();

  // Profile Management

  async createProfile(userId: string, profileData: Partial<SocialProfile>): Promise<SocialProfile> {
    const profile: SocialProfile = {
      id: this.generateId(),
      userId,
      displayName: profileData.displayName || `User${userId.slice(-4)}`,
      bio: profileData.bio,
      avatar: profileData.avatar,
      coverImage: profileData.coverImage,
      location: profileData.location,
      website: profileData.website,
      socialLinks: profileData.socialLinks || {},
      tradingStats: {
        totalTrades: 0,
        successRate: 0,
        totalVolume: 0,
        winStreak: 0,
        favoriteCategory: 'cards'
      },
      preferences: {
        publicProfile: true,
        showTradingStats: true,
        allowMessages: true,
        allowFollows: true,
        tradingNotifications: true,
        ...profileData.preferences
      },
      badges: [],
      level: 1,
      experience: 0,
      reputation: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.profiles.set(userId, profile);
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<SocialProfile>): Promise<SocialProfile | null> {
    const profile = this.profiles.get(userId);
    if (!profile) return null;

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date()
    };

    this.profiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  async getProfile(userId: string): Promise<SocialProfile | null> {
    return this.profiles.get(userId) || null;
  }

  async searchProfiles(query: string, filters?: {
    level?: number;
    location?: string;
    badges?: string[];
  }): Promise<SocialProfile[]> {
    const profiles = Array.from(this.profiles.values());
    
    return profiles.filter(profile => {
      if (!profile.preferences.publicProfile) return false;
      
      const matchesQuery = profile.displayName.toLowerCase().includes(query.toLowerCase()) ||
                          (profile.bio && profile.bio.toLowerCase().includes(query.toLowerCase()));
      
      if (!matchesQuery) return false;
      
      if (filters?.level && profile.level < filters.level) return false;
      if (filters?.location && profile.location !== filters.location) return false;
      if (filters?.badges && !filters.badges.some(badge => profile.badges.includes(badge))) return false;
      
      return true;
    });
  }

  // Connection Management

  async createConnection(fromUserId: string, toUserId: string, type: Connection['type']): Promise<Connection> {
    const connection: Connection = {
      id: this.generateId(),
      fromUserId,
      toUserId,
      status: 'pending',
      type,
      connectedAt: new Date(),
      metadata: {}
    };

    this.connections.set(connection.id, connection);
    
    // Send notification to target user
    await this.sendNotification(toUserId, {
      type: 'follow',
      title: 'New Connection Request',
      message: `${fromUserId} wants to connect with you`,
      data: { connectionId: connection.id, fromUserId }
    });

    return connection;
  }

  async acceptConnection(connectionId: string): Promise<boolean> {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.status !== 'pending') return false;

    connection.status = 'accepted';
    connection.connectedAt = new Date();
    this.connections.set(connectionId, connection);

    // Send notification to requester
    await this.sendNotification(connection.fromUserId, {
      type: 'follow',
      title: 'Connection Accepted',
      message: `${connection.toUserId} accepted your connection request`,
      data: { connectionId }
    });

    return true;
  }

  async getConnections(userId: string, type?: Connection['type']): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(connection => 
      (connection.fromUserId === userId || connection.toUserId === userId) &&
      connection.status === 'accepted' &&
      (!type || connection.type === type)
    );
  }

  async getFollowers(userId: string): Promise<SocialProfile[]> {
    const connections = Array.from(this.connections.values()).filter(connection =>
      connection.toUserId === userId &&
      connection.type === 'follow' &&
      connection.status === 'accepted'
    );

    const followerProfiles = await Promise.all(
      connections.map(connection => this.getProfile(connection.fromUserId))
    );

    return followerProfiles.filter(profile => profile !== null) as SocialProfile[];
  }

  async getFollowing(userId: string): Promise<SocialProfile[]> {
    const connections = Array.from(this.connections.values()).filter(connection =>
      connection.fromUserId === userId &&
      connection.type === 'follow' &&
      connection.status === 'accepted'
    );

    const followingProfiles = await Promise.all(
      connections.map(connection => this.getProfile(connection.toUserId))
    );

    return followingProfiles.filter(profile => profile !== null) as SocialProfile[];
  }

  // Trading Groups

  async createTradingGroup(ownerId: string, groupData: Omit<TradingGroup, 'id' | 'ownerId' | 'members' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<TradingGroup> {
    const group: TradingGroup = {
      id: this.generateId(),
      ownerId,
      members: [ownerId],
      stats: {
        memberCount: 1,
        totalTrades: 0,
        averageSuccessRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...groupData
    };

    this.groups.set(group.id, group);
    return group;
  }

  async joinTradingGroup(groupId: string, userId: string): Promise<boolean> {
    const group = this.groups.get(groupId);
    if (!group) return false;

    if (group.members.includes(userId)) return true;

    const userProfile = await this.getProfile(userId);
    if (!userProfile) return false;

    // Check requirements
    if (group.requirements.minimumLevel && userProfile.level < group.requirements.minimumLevel) {
      return false;
    }

    if (group.requirements.minimumReputation && userProfile.reputation < group.requirements.minimumReputation) {
      return false;
    }

    group.members.push(userId);
    group.stats.memberCount = group.members.length;
    group.updatedAt = new Date();
    this.groups.set(groupId, group);

    return true;
  }

  async getTradingGroups(userId?: string): Promise<TradingGroup[]> {
    const groups = Array.from(this.groups.values());
    
    if (userId) {
      return groups.filter(group => group.members.includes(userId));
    }
    
    return groups.filter(group => !group.isPrivate);
  }

  // Social Posts

  async createPost(authorId: string, postData: Omit<SocialPost, 'id' | 'authorId' | 'likes' | 'comments' | 'shares' | 'createdAt' | 'updatedAt'>): Promise<SocialPost> {
    const post: SocialPost = {
      id: this.generateId(),
      authorId,
      likes: 0,
      comments: 0,
      shares: 0,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...postData
    };

    this.posts.set(post.id, post);
    
    // Notify followers for public posts
    if (post.visibility === 'public' || post.visibility === 'followers') {
      const followers = await this.getFollowers(authorId);
      const notifications = followers.map(follower => ({
        type: 'social' as const,
        title: 'New Post',
        message: `${authorId} shared a new post`,
        data: { postId: post.id }
      }));

      await Promise.all(notifications.map(notification => 
        this.sendNotification(notification.data!.userId, notification)
      ));
    }

    return post;
  }

  async likePost(postId: string, userId: string): Promise<boolean> {
    const post = this.posts.get(postId);
    if (!post) return false;

    post.likes++;
    post.updatedAt = new Date();
    this.posts.set(postId, post);

    // Notify post author
    if (post.authorId !== userId) {
      await this.sendNotification(post.authorId, {
        type: 'like',
        title: 'Post Liked',
        message: `${userId} liked your post`,
        data: { postId }
      });
    }

    return true;
  }

  async getFeed(userId: string, type: 'home' | 'public' | 'group' = 'home', groupId?: string): Promise<SocialPost[]> {
    const posts = Array.from(this.posts.values());
    
    switch (type) {
      case 'home':
        const following = await this.getFollowing(userId);
        const followingIds = following.map(profile => profile.userId);
        return posts.filter(post => 
          followingIds.includes(post.authorId) || post.authorId === userId
        ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
      case 'public':
        return posts.filter(post => post.visibility === 'public')
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
      case 'group':
        return posts.filter(post => post.groupId === groupId)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
      default:
        return [];
    }
  }

  // Trading Signals

  async createTradingSignal(creatorId: string, signalData: Omit<TradingSignal, 'id' | 'creatorId' | 'followersCount' | 'successRate' | 'status' | 'createdAt'>): Promise<TradingSignal> {
    const signal: TradingSignal = {
      id: this.generateId(),
      creatorId,
      followersCount: 0,
      successRate: 0,
      status: 'active',
      createdAt: new Date(),
      ...signalData
    };

    this.signals.set(signal.id, signal);

    // Notify followers
    const followers = await this.getFollowers(creatorId);
    const notifications = followers.map(follower => ({
      type: 'signal' as const,
      title: 'New Trading Signal',
      message: `${creatorId} shared a new trading signal`,
      data: { signalId: signal.id }
    }));

    await Promise.all(notifications.map(notification => 
      this.sendNotification(notification.data!.userId, notification)
    ));

    return signal;
  }

  async followSignal(signalId: string, userId: string): Promise<boolean> {
    const signal = this.signals.get(signalId);
    if (!signal) return false;

    signal.followersCount++;
    this.signals.set(signalId, signal);

    return true;
  }

  async getSignals(filters?: {
    creatorId?: string;
    cardId?: string;
    action?: TradingSignal['action'];
    timeframe?: TradingSignal['timeframe'];
    minConfidence?: number;
  }): Promise<TradingSignal[]> {
    const signals = Array.from(this.signals.values());
    
    return signals.filter(signal => {
      if (filters?.creatorId && signal.creatorId !== filters.creatorId) return false;
      if (filters?.cardId && signal.cardId !== filters.cardId) return false;
      if (filters?.action && signal.action !== filters.action) return false;
      if (filters?.timeframe && signal.timeframe !== filters.timeframe) return false;
      if (filters?.minConfidence && signal.confidence < filters.minConfidence) return false;
      
      return signal.status === 'active' && signal.expiresAt > new Date();
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Challenges and Competitions

  async createChallenge(challengeData: Omit<Challenge, 'id' | 'participants' | 'leaderboard' | 'createdAt'>): Promise<Challenge> {
    const challenge: Challenge = {
      id: this.generateId(),
      participants: [],
      leaderboard: [],
      createdAt: new Date(),
      ...challengeData
    };

    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  async joinChallenge(challengeId: string, userId: string): Promise<boolean> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return false;

    if (challenge.participants.includes(userId)) return true;

    const userProfile = await this.getProfile(userId);
    if (!userProfile) return false;

    // Check requirements
    if (challenge.requirements.level && userProfile.level < challenge.requirements.level) {
      return false;
    }

    if (challenge.requirements.badges && 
        !challenge.requirements.badges.every(badge => userProfile.badges.includes(badge))) {
      return false;
    }

    challenge.participants.push(userId);
    challenge.leaderboard.push({
      userId,
      score: 0,
      progress: {}
    });

    this.challenges.set(challengeId, challenge);
    return true;
  }

  async getChallenges(status?: Challenge['status']): Promise<Challenge[]> {
    const challenges = Array.from(this.challenges.values());
    
    if (status) {
      return challenges.filter(challenge => challenge.status === status);
    }
    
    return challenges.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Notifications

  async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    
    const newNotification: Notification = {
      id: this.generateId(),
      userId,
      read: false,
      createdAt: new Date(),
      ...notification
    };

    userNotifications.unshift(newNotification);
    
    // Keep only last 100 notifications
    if (userNotifications.length > 100) {
      userNotifications.splice(100);
    }

    this.notifications.set(userId, userNotifications);
  }

  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const userNotifications = this.notifications.get(userId) || [];
    
    if (unreadOnly) {
      return userNotifications.filter(notification => !notification.read);
    }
    
    return userNotifications;
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    
    if (!notification) return false;
    
    notification.read = true;
    this.notifications.set(userId, userNotifications);
    return true;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.forEach(notification => notification.read = true);
    this.notifications.set(userId, userNotifications);
  }

  // Helper Methods

  private generateId(): string {
    return `ece_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  async addExperience(userId: string, amount: number, reason: string): Promise<void> {
    const profile = await this.getProfile(userId);
    if (!profile) return;

    profile.experience += amount;
    
    // Level up calculation (every 1000 XP = 1 level)
    const newLevel = Math.floor(profile.experience / 1000) + 1;
    if (newLevel > profile.level) {
      profile.level = newLevel;
      
      await this.sendNotification(userId, {
        type: 'achievement',
        title: 'Level Up!',
        message: `Congratulations! You've reached level ${newLevel}`,
        data: { newLevel, experience: amount, reason }
      });
    }

    profile.updatedAt = new Date();
    this.profiles.set(userId, profile);
  }

  async awardBadge(userId: string, badgeId: string, badgeName: string): Promise<void> {
    const profile = await this.getProfile(userId);
    if (!profile) return;

    if (!profile.badges.includes(badgeId)) {
      profile.badges.push(badgeId);
      profile.updatedAt = new Date();
      this.profiles.set(userId, profile);

      await this.sendNotification(userId, {
        type: 'achievement',
        title: 'New Badge Earned!',
        message: `You've earned the "${badgeName}" badge`,
        data: { badgeId, badgeName }
      });
    }
  }
}

// Export singleton instance
export const socialFeaturesService = new SocialFeaturesService();
