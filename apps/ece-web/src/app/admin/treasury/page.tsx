import React from 'react';
import { TreasuryDashboard } from '../../../components/admin/TreasuryDashboard';

/**
 * Admin Treasury Management Page
 * Route: /admin/treasury
 * 
 * Provides comprehensive treasury management interface for:
 * - ECE token circulation monitoring
 * - USDC reserves tracking
 * - Weekly payout processing
 * - Emergency pause controls
 * - Compliance oversight
 */

export default function AdminTreasuryPage() {
  return <TreasuryDashboard />;
}

export const metadata = {
  title: 'ECE Treasury Management | Admin Dashboard',
  description: 'Manage ECE token operations, weekly payouts, and treasury reserves',
};
