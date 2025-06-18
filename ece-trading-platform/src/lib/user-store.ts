import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  provider?: 'google' | 'credentials' | 'solana';
  walletAddress?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    timezone?: string;
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

// In-memory user store (in production, this would be a database)
let users: User[] = [
  {
    id: '1',
    email: 'admin@ecetrading.com',
    name: 'Admin User',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeA6Zc7A/WMzX.W8u', // admin123
    role: 'admin',
    provider: 'credentials',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      company: 'ECE Trading',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
  },
];

export const userStore = {
  // Get all users
  getAll: (): User[] => {
    return users;
  },

  // Get user by ID
  getById: (id: string): User | undefined => {
    return users.find(user => user.id === id);
  },

  // Get user by email
  getByEmail: (email: string): User | undefined => {
    return users.find(user => user.email === email);
  },

  // Get user by wallet address
  getByWalletAddress: (walletAddress: string): User | undefined => {
    return users.find(user => user.walletAddress === walletAddress);
  },

  // Create new user
  create: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };

    // Hash password if provided
    if (newUser.password) {
      newUser.password = await bcrypt.hash(newUser.password, 12);
    }

    users.push(newUser);
    return newUser;
  },

  // Update user
  update: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    // Hash password if being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return users[userIndex];
  },

  // Delete user
  delete: (id: string): boolean => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    users.splice(userIndex, 1);
    return true;
  },

  // Verify password
  verifyPassword: async (email: string, password: string): Promise<User | null> => {
    const user = users.find(u => u.email === email);
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  // Check if email exists
  emailExists: (email: string): boolean => {
    return users.some(user => user.email === email);
  },

  // Check if wallet address exists
  walletExists: (walletAddress: string): boolean => {
    return users.some(user => user.walletAddress === walletAddress);
  },
};

// Helper function to get user without password
export const getUserWithoutPassword = (user: User): Omit<User, 'password'> => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
