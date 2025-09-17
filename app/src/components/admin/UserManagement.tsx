'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Ban, 
  Shield, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  UserCheck,
  UserX,
  Crown,
  Star,
  ChevronDown,
  Download,
  Upload
} from 'lucide-react';

export type UserRole = 'user' | 'premium' | 'admin' | 'superadmin';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending';

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinDate: Date;
  lastActive: Date;
  avatar?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    location?: string;
    bio?: string;
  };
  stats: {
    cardsOwned: number;
    tradesCompleted: number;
    totalSpent: number;
    reputation: number;
  };
  flags: {
    isVerified: boolean;
    hasViolations: boolean;
    riskScore: number;
  };
}

interface UserManagementProps {
  className?: string;
}

export function UserManagement({ className = '' }: UserManagementProps) {
  const [users, setUsers] = React.useState<User[]>([
    {
      id: '1',
      username: 'johndoe',
      email: 'john.doe@example.com',
      role: 'premium',
      status: 'active',
      joinDate: new Date('2024-01-15'),
      lastActive: new Date(),
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-0123',
        location: 'New York, NY',
        bio: 'Passionate card collector and trader'
      },
      stats: {
        cardsOwned: 234,
        tradesCompleted: 45,
        totalSpent: 1250.00,
        reputation: 4.8
      },
      flags: {
        isVerified: true,
        hasViolations: false,
        riskScore: 12
      }
    },
    {
      id: '2',
      username: 'tradingpro',
      email: 'pro.trader@example.com',
      role: 'user',
      status: 'active',
      joinDate: new Date('2024-03-22'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      profile: {
        firstName: 'Sarah',
        lastName: 'Wilson',
        location: 'Los Angeles, CA',
        bio: 'Professional card trader'
      },
      stats: {
        cardsOwned: 567,
        tradesCompleted: 123,
        totalSpent: 3450.00,
        reputation: 4.9
      },
      flags: {
        isVerified: true,
        hasViolations: false,
        riskScore: 8
      }
    },
    {
      id: '3',
      username: 'suspicioususer',
      email: 'suspicious@example.com',
      role: 'user',
      status: 'suspended',
      joinDate: new Date('2024-06-10'),
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      profile: {
        firstName: 'Unknown',
        lastName: 'User',
        bio: 'New to trading'
      },
      stats: {
        cardsOwned: 12,
        tradesCompleted: 2,
        totalSpent: 50.00,
        reputation: 2.1
      },
      flags: {
        isVerified: false,
        hasViolations: true,
        riskScore: 85
      }
    }
  ]);

  const [filter, setFilter] = React.useState<{
    role: UserRole | 'all';
    status: UserStatus | 'all';
    verified: 'all' | 'verified' | 'unverified';
  }>({
    role: 'all',
    status: 'all',
    verified: 'all'
  });

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<'joinDate' | 'lastActive' | 'reputation' | 'spent'>('lastActive');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const filteredUsers = users
    .filter(user => {
      if (filter.role !== 'all' && user.role !== filter.role) return false;
      if (filter.status !== 'all' && user.status !== filter.status) return false;
      if (filter.verified === 'verified' && !user.flags.isVerified) return false;
      if (filter.verified === 'unverified' && user.flags.isVerified) return false;
      if (searchTerm && 
          !user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !user.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !user.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'joinDate':
          aValue = a.joinDate.getTime();
          bValue = b.joinDate.getTime();
          break;
        case 'lastActive':
          aValue = a.lastActive.getTime();
          bValue = b.lastActive.getTime();
          break;
        case 'reputation':
          aValue = a.stats.reputation;
          bValue = b.stats.reputation;
          break;
        case 'spent':
          aValue = a.stats.totalSpent;
          bValue = b.stats.totalSpent;
          break;
        default:
          return 0;
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const updateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const bulkAction = (action: 'suspend' | 'activate' | 'delete') => {
    setUsers(prev => prev.map(user => {
      if (!selectedUsers.includes(user.id)) return user;
      
      switch (action) {
        case 'suspend':
          return { ...user, status: 'suspended' as UserStatus };
        case 'activate':
          return { ...user, status: 'active' as UserStatus };
        case 'delete':
          return null;
        default:
          return user;
      }
    }).filter(Boolean) as User[]);
    
    setSelectedUsers([]);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return 'text-ece-error bg-ece-error/20';
      case 'admin':
        return 'text-ece-warning bg-ece-warning/20';
      case 'premium':
        return 'text-ece-accent bg-ece-accent/20';
      case 'user':
        return 'text-ece-info bg-ece-info/20';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'text-ece-success bg-ece-success/20';
      case 'suspended':
        return 'text-ece-warning bg-ece-warning/20';
      case 'banned':
        return 'text-ece-error bg-ece-error/20';
      case 'pending':
        return 'text-ece-muted bg-ece-muted/20';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ece-light">User Management</h2>
          <p className="text-ece-muted mt-1">
            Manage {filteredUsers.length} of {users.length} users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-ece-success/20 text-ece-success rounded-lg hover:bg-ece-success/30 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-ece-info/20 text-ece-info rounded-lg hover:bg-ece-info/30 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ece-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light placeholder-ece-muted focus:outline-none focus:border-ece-accent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filter.role}
            onChange={(e) => setFilter(prev => ({ ...prev, role: e.target.value as any }))}
            className="px-3 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light focus:outline-none focus:border-ece-accent"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="premium">Premium</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
            className="px-3 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light focus:outline-none focus:border-ece-accent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
            <option value="pending">Pending</option>
          </select>

          {/* Verification Filter */}
          <select
            value={filter.verified}
            onChange={(e) => setFilter(prev => ({ ...prev, verified: e.target.value as any }))}
            className="px-3 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light focus:outline-none focus:border-ece-accent"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="px-3 py-2 bg-ece-dark/50 border border-ece-accent/20 rounded-lg text-ece-light focus:outline-none focus:border-ece-accent"
          >
            <option value="lastActive-desc">Last Active (Recent)</option>
            <option value="lastActive-asc">Last Active (Oldest)</option>
            <option value="joinDate-desc">Join Date (Recent)</option>
            <option value="joinDate-asc">Join Date (Oldest)</option>
            <option value="reputation-desc">Reputation (High)</option>
            <option value="reputation-asc">Reputation (Low)</option>
            <option value="spent-desc">Spent (High)</option>
            <option value="spent-asc">Spent (Low)</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-ece-accent/10 rounded-lg">
            <span className="text-sm text-ece-light">
              {selectedUsers.length} users selected
            </span>
            <button
              onClick={() => bulkAction('activate')}
              className="px-3 py-1 bg-ece-success/20 text-ece-success rounded text-sm hover:bg-ece-success/30 transition-colors"
            >
              Activate
            </button>
            <button
              onClick={() => bulkAction('suspend')}
              className="px-3 py-1 bg-ece-warning/20 text-ece-warning rounded text-sm hover:bg-ece-warning/30 transition-colors"
            >
              Suspend
            </button>
            <button
              onClick={() => bulkAction('delete')}
              className="px-3 py-1 bg-ece-error/20 text-ece-error rounded text-sm hover:bg-ece-error/30 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-ece-light/5 backdrop-blur-sm border border-ece-accent/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ece-dark/30">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-ece-accent/20"
                  />
                </th>
                <th className="p-4 text-left text-ece-light font-medium">User</th>
                <th className="p-4 text-left text-ece-light font-medium">Role</th>
                <th className="p-4 text-left text-ece-light font-medium">Status</th>
                <th className="p-4 text-left text-ece-light font-medium">Stats</th>
                <th className="p-4 text-left text-ece-light font-medium">Last Active</th>
                <th className="p-4 text-left text-ece-light font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.includes(user.id)}
                  onSelect={(selected) => {
                    if (selected) {
                      setSelectedUsers(prev => [...prev, user.id]);
                    } else {
                      setSelectedUsers(prev => prev.filter(id => id !== user.id));
                    }
                  }}
                  onUpdateStatus={(status) => updateUserStatus(user.id, status)}
                  onUpdateRole={(role) => updateUserRole(user.id, role)}
                  onDelete={() => deleteUser(user.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface UserRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onUpdateStatus: (status: UserStatus) => void;
  onUpdateRole: (role: UserRole) => void;
  onDelete: () => void;
}

function UserRow({ 
  user, 
  isSelected, 
  onSelect, 
  onUpdateStatus, 
  onUpdateRole, 
  onDelete 
}: UserRowProps) {
  const [showActions, setShowActions] = React.useState(false);

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return 'text-ece-error bg-ece-error/20';
      case 'admin':
        return 'text-ece-warning bg-ece-warning/20';
      case 'premium':
        return 'text-ece-accent bg-ece-accent/20';
      case 'user':
        return 'text-ece-info bg-ece-info/20';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'text-ece-success bg-ece-success/20';
      case 'suspended':
        return 'text-ece-warning bg-ece-warning/20';
      case 'banned':
        return 'text-ece-error bg-ece-error/20';
      case 'pending':
        return 'text-ece-muted bg-ece-muted/20';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <tr className="border-b border-ece-accent/10 hover:bg-ece-accent/5 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="rounded border-ece-accent/20"
        />
      </td>
      
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ece-accent to-ece-info rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user.profile.firstName[0]}{user.profile.lastName[0]}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-ece-light font-medium">{user.username}</span>
              {user.flags.isVerified && (
                <UserCheck className="w-4 h-4 text-ece-success" />
              )}
              {user.flags.hasViolations && (
                <UserX className="w-4 h-4 text-ece-error" />
              )}
            </div>
            <p className="text-sm text-ece-muted">{user.email}</p>
            <p className="text-xs text-ece-muted">
              {user.profile.firstName} {user.profile.lastName}
            </p>
          </div>
        </div>
      </td>
      
      <td className="p-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
          {user.role === 'superadmin' ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>
      
      <td className="p-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </td>
      
      <td className="p-4">
        <div className="text-sm">
          <div className="flex items-center gap-2 text-ece-light">
            <Star className="w-3 h-3 text-ece-warning" />
            {user.stats.reputation.toFixed(1)}
          </div>
          <p className="text-xs text-ece-muted">{user.stats.cardsOwned} cards</p>
          <p className="text-xs text-ece-muted">${user.stats.totalSpent.toLocaleString()}</p>
        </div>
      </td>
      
      <td className="p-4">
        <span className="text-sm text-ece-muted">
          {formatTimeAgo(user.lastActive)}
        </span>
      </td>
      
      <td className="p-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-ece-muted hover:text-ece-light hover:bg-ece-accent/10 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-1 bg-ece-dark border border-ece-accent/20 rounded-lg shadow-lg z-10 min-w-48">
              <button
                onClick={() => {
                  // Edit user action
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ece-light hover:bg-ece-accent/10 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </button>
              
              <button
                onClick={() => {
                  onUpdateStatus(user.status === 'active' ? 'suspended' : 'active');
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ece-warning hover:bg-ece-warning/10 transition-colors"
              >
                <Ban className="w-4 h-4" />
                {user.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              
              <button
                onClick={() => {
                  onDelete();
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ece-error hover:bg-ece-error/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default UserManagement;
