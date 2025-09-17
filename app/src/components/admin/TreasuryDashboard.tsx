import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ece-platform/shared-ui';
import { Button } from '@ece-platform/shared-ui';
import { Badge } from '@ece-platform/shared-ui';
import { ECETreasuryService } from '../../services/ece-treasury.service';
import { useWallet } from '@thirdweb-dev/react';
import { AlertTriangle, DollarSign, Shield, TrendingUp, Clock, Pause, Play } from 'lucide-react';

interface TreasuryStatus {
  eceCirculation: number;
  usdcReserves: number;
  reserveRatio: number;
  isPaused: boolean;
  lastPayoutDate: Date | null;
  nextPayoutDate: Date;
  weeklyRevenueAccumulated: number;
  companyBalance: {
    ece: number;
    usdc: number;
  };
}

interface PayoutHistory {
  payouts: Array<{
    id: string;
    createdAt: Date;
    revenueAmount: number;
    payoutPercentage: number;
    eceConverted: number;
    usdcReceived: number;
    status: string;
    transactionSignature: string;
    complianceApproved: boolean;
  }>;
  total: number;
  hasMore: boolean;
}

export const TreasuryDashboard: React.FC = () => {
  const { address } = useWallet();
  const [treasuryStatus, setTreasuryStatus] = useState<TreasuryStatus | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [payoutPercentage, setPayoutPercentage] = useState(80);

  // Check if user is authorized admin
  const isAuthorizedAdmin = address && process.env.NEXT_PUBLIC_ECE_ADMIN_WALLETS?.split(',').includes(address);

  useEffect(() => {
    if (isAuthorizedAdmin) {
      loadTreasuryData();
    }
  }, [isAuthorizedAdmin]);

  const loadTreasuryData = async () => {
    try {
      setLoading(true);
      const [status, history] = await Promise.all([
        ECETreasuryService.getTreasuryStatus(),
        ECETreasuryService.getPayoutHistory(1, 10)
      ]);
      setTreasuryStatus(status);
      setPayoutHistory(history);
    } catch (error) {
      console.error('Failed to load treasury data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWeeklyPayout = async () => {
    if (!treasuryStatus || !address) return;

    try {
      setPayoutLoading(true);
      const result = await ECETreasuryService.processWeeklyPayout({
        revenueAmount: treasuryStatus.weeklyRevenueAccumulated,
        payoutPercentage,
        authorizedSigners: [address]
      });

      if (result.success) {
        alert(`Payout successful! Converted ${result.eceConverted} ECE to ${result.usdcReceived} USDC`);
        await loadTreasuryData();
      } else {
        alert(`Payout failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Payout error:', error);
      alert('Payout failed due to technical error');
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleEmergencyPause = async () => {
    if (!address) return;

    try {
      setEmergencyLoading(true);
      const result = await ECETreasuryService.emergencyPause(address);

      if (result.success) {
        alert('Emergency pause activated successfully');
        await loadTreasuryData();
      } else {
        alert(`Emergency pause failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Emergency pause error:', error);
      alert('Emergency pause failed due to technical error');
    } finally {
      setEmergencyLoading(false);
    }
  };

  const formatCurrency = (amount: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getReserveRatioColor = (ratio: number) => {
    if (ratio >= 100) return 'text-green-600';
    if (ratio >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const canProcessPayout = treasuryStatus && 
    treasuryStatus.weeklyRevenueAccumulated > 0 &&
    treasuryStatus.nextPayoutDate <= new Date() &&
    !treasuryStatus.isPaused;

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              You must be an authorized admin to access the treasury dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <div className="text-white">Loading treasury data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">ECE Treasury Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage ECE token operations and weekly payouts</p>
          </div>
          
          {treasuryStatus?.isPaused && (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <Pause className="h-4 w-4 mr-2" />
              EMERGENCY PAUSE ACTIVE
            </Badge>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">ECE Circulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(treasuryStatus?.eceCirculation || 0)}
              </div>
              <div className="text-xs text-gray-400 mt-1">Total tokens in circulation</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">USDC Reserves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${formatCurrency(treasuryStatus?.usdcReserves || 0)}
              </div>
              <div className="text-xs text-gray-400 mt-1">Backing reserves</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Reserve Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getReserveRatioColor(treasuryStatus?.reserveRatio || 0)}`}>
                {treasuryStatus?.reserveRatio || 0}%
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {treasuryStatus?.reserveRatio === 100 ? 'Fully backed' : 'Fractional reserve'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Weekly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(treasuryStatus?.weeklyRevenueAccumulated || 0)} ECE
              </div>
              <div className="text-xs text-gray-400 mt-1">Ready for payout</div>
            </CardContent>
          </Card>
        </div>

        {/* Company Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Company Balances</CardTitle>
            <CardDescription>Current company treasury balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400">ECE Balance</div>
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(treasuryStatus?.companyBalance.ece || 0)} ECE
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400">USDC Balance</div>
                  <div className="text-xl font-bold text-white">
                    ${formatCurrency(treasuryStatus?.companyBalance.usdc || 0)}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Payout Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Payout Management
            </CardTitle>
            <CardDescription>
              Process weekly revenue conversion from ECE to USDC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400">Last Payout</label>
                <div className="text-white font-medium">
                  {formatDate(treasuryStatus?.lastPayoutDate)}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Next Payout Available</label>
                <div className="text-white font-medium">
                  {formatDate(treasuryStatus?.nextPayoutDate)}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Payout Percentage</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={payoutPercentage}
                    onChange={(e) => setPayoutPercentage(parseInt(e.target.value))}
                    className="flex-1"
                    disabled={!canProcessPayout}
                  />
                  <span className="text-white font-medium w-12">{payoutPercentage}%</span>
                </div>
              </div>
            </div>

            {treasuryStatus && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">Payout Calculation</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Total Revenue:</span>
                    <span className="text-white ml-2 font-medium">
                      {formatCurrency(treasuryStatus.weeklyRevenueAccumulated)} ECE
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Convert to USDC:</span>
                    <span className="text-green-400 ml-2 font-medium">
                      {formatCurrency(treasuryStatus.weeklyRevenueAccumulated * (payoutPercentage / 100))} ECE
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Retain as ECE:</span>
                    <span className="text-blue-400 ml-2 font-medium">
                      {formatCurrency(treasuryStatus.weeklyRevenueAccumulated * (1 - payoutPercentage / 100))} ECE
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleWeeklyPayout}
                disabled={!canProcessPayout || payoutLoading}
                className="flex-1"
              >
                {payoutLoading ? 'Processing...' : 'Process Weekly Payout'}
              </Button>
              
              {!canProcessPayout && (
                <div className="flex items-center text-yellow-400 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  {treasuryStatus?.isPaused 
                    ? 'Treasury is paused'
                    : treasuryStatus?.weeklyRevenueAccumulated === 0
                      ? 'No revenue to process'
                      : 'Payout window not active'
                  }
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Emergency Controls
            </CardTitle>
            <CardDescription>
              Emergency pause/unpause treasury operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant="destructive"
                onClick={handleEmergencyPause}
                disabled={treasuryStatus?.isPaused || emergencyLoading}
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                {emergencyLoading ? 'Processing...' : 'Emergency Pause'}
              </Button>
              
              {treasuryStatus?.isPaused && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Emergency Unpause
                </Button>
              )}
            </div>
            
            <div className="text-xs text-gray-400 mt-2">
              Emergency pause will halt all token minting, burning, and payout operations.
              Only authorized signers can activate emergency controls.
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Payout History</CardTitle>
            <CardDescription>Recent weekly payout transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-400">Date</th>
                    <th className="text-left py-2 text-gray-400">Revenue (ECE)</th>
                    <th className="text-left py-2 text-gray-400">Payout %</th>
                    <th className="text-left py-2 text-gray-400">Converted (ECE)</th>
                    <th className="text-left py-2 text-gray-400">Received (USDC)</th>
                    <th className="text-left py-2 text-gray-400">Status</th>
                    <th className="text-left py-2 text-gray-400">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory?.payouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-gray-800">
                      <td className="py-2 text-gray-300">
                        {formatDate(payout.createdAt)}
                      </td>
                      <td className="py-2 text-white">
                        {formatCurrency(payout.revenueAmount)}
                      </td>
                      <td className="py-2 text-white">
                        {payout.payoutPercentage}%
                      </td>
                      <td className="py-2 text-white">
                        {formatCurrency(payout.eceConverted)}
                      </td>
                      <td className="py-2 text-white">
                        ${formatCurrency(payout.usdcReceived)}
                      </td>
                      <td className="py-2">
                        <Badge 
                          variant={payout.status === 'COMPLETED' ? 'default' : 'destructive'}
                        >
                          {payout.status}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <Badge 
                          variant={payout.complianceApproved ? 'default' : 'destructive'}
                        >
                          {payout.complianceApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {payoutHistory?.payouts.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No payout history available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
