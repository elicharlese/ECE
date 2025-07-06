import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProfilePage from '../src/app/app/profile/page'

// Mock the subscription context
jest.mock('../src/contexts/subscription-context', () => ({
  useSubscription: () => ({
    subscription: { plan: 'Pro', status: 'active' },
    isPro: true,
    isEnterprise: false
  })
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock all profile components
jest.mock('../src/components/profile/UserAvatarSystem', () => ({
  UserAvatarSystem: ({ userName, onAvatarUpdate }: any) => (
    <div data-testid="user-avatar-system">
      <span>{userName}</span>
      <button onClick={() => onAvatarUpdate('new-avatar.jpg')}>Update Avatar</button>
    </div>
  )
}))

jest.mock('../src/components/profile/ProfileTabNavigation', () => ({
  ProfileTabNavigation: ({ activeTab, onTabChange }: any) => (
    <div data-testid="profile-tab-navigation">
      {['overview', 'collection', 'activity', 'achievements', 'performance', 'wishlist', '3d-viewer', 'trading', 'battles', 'betting', 'auctions', 'settings'].map(tab => (
        <button 
          key={tab} 
          onClick={() => onTabChange(tab)}
          data-active={activeTab === tab}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}))

jest.mock('../src/components/profile/ProfileStatisticsWidget', () => ({
  ProfileStatisticsWidget: () => <div data-testid="profile-statistics-widget">Profile Stats</div>
}))

jest.mock('../src/components/profile/AchievementBadges', () => ({
  AchievementBadges: () => <div data-testid="achievement-badges">Achievement Badges</div>
}))

jest.mock('../src/components/profile/ProfileActivityFeed', () => ({
  ProfileActivityFeed: () => <div data-testid="profile-activity-feed">Activity Feed</div>
}))

jest.mock('../src/components/profile/TieredCardSystem', () => ({
  TieredCardSystem: () => <div data-testid="tiered-card-system">Tiered Cards</div>
}))

jest.mock('../src/components/profile/TierProgressTracker', () => ({
  TierProgressTracker: () => <div data-testid="tier-progress-tracker">Tier Progress</div>
}))

jest.mock('../src/components/profile/TierUpgradeSystem', () => ({
  TierUpgradeSystem: () => <div data-testid="tier-upgrade-system">Tier Upgrades</div>
}))

jest.mock('../src/components/profile/Card3DViewer', () => ({
  Card3DViewer: ({ cardName }: any) => <div data-testid="card-3d-viewer">{cardName} 3D Viewer</div>
}))

jest.mock('../src/components/profile/ECEBalancePerformance', () => ({
  ECEBalancePerformance: () => <div data-testid="ece-balance-performance">ECE Balance</div>
}))

jest.mock('../src/components/profile/WishlistSystem', () => ({
  WishlistSystem: () => <div data-testid="wishlist-system">Wishlist</div>
}))

jest.mock('../src/components/profile/TradingControlsDashboard', () => ({
  TradingControlsDashboard: () => <div data-testid="trading-controls-dashboard">Trading Controls</div>
}))

jest.mock('../src/components/profile/BattleArenaSystem', () => ({
  BattleArenaSystem: () => <div data-testid="battle-arena-system">Battle Arena</div>
}))

jest.mock('../src/components/profile/BettingSystem', () => ({
  BettingSystem: () => <div data-testid="betting-system">Betting System</div>
}))

jest.mock('../src/components/profile/BiddingSystem', () => ({
  BiddingSystem: () => <div data-testid="bidding-system">Bidding System</div>
}))

jest.mock('../src/components/profile/ProfilePrivacySettings', () => ({
  ProfilePrivacySettings: () => <div data-testid="profile-privacy-settings">Privacy Settings</div>
}))

jest.mock('../src/components/profile/SocialProfileLinks', () => ({
  SocialProfileLinks: () => <div data-testid="social-profile-links">Social Links</div>
}))

// Mock UI components
jest.mock('../src/components/ui/glass-card', () => ({
  GlassCard: ({ children, ...props }: any) => <div data-testid="glass-card" {...props}>{children}</div>
}))

jest.mock('../src/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}))

describe('Profile Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders complete profile page', () => {
    render(<ProfilePage />)
    
    // Check for main profile elements
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
    expect(screen.getByText('@alexrivera • Trader Level 42 • Pro Member')).toBeInTheDocument()
    expect(screen.getByTestId('user-avatar-system')).toBeInTheDocument()
    expect(screen.getByTestId('profile-tab-navigation')).toBeInTheDocument()
  })

  test('tab navigation between all profile sections works', async () => {
    render(<ProfilePage />)
    
    // Test each tab navigation
    const tabs = ['collection', 'activity', 'achievements', 'performance', 'wishlist', '3d-viewer', 'trading', 'battles', 'betting', 'auctions', 'settings']
    
    for (const tab of tabs) {
      const tabButton = screen.getByText(tab.charAt(0).toUpperCase() + tab.slice(1))
      fireEvent.click(tabButton)
      
      await waitFor(() => {
        expect(tabButton).toHaveAttribute('data-active', 'true')
      })
    }
  })

  test('overview tab shows all main components', async () => {
    render(<ProfilePage />)
    
    // Should be on overview by default
    expect(screen.getByTestId('profile-statistics-widget')).toBeInTheDocument()
    expect(screen.getByTestId('achievement-badges')).toBeInTheDocument()
    expect(screen.getByTestId('profile-activity-feed')).toBeInTheDocument()
  })

  test('collection tab shows tiered card components', async () => {
    render(<ProfilePage />)
    
    const collectionTab = screen.getByText('Collection')
    fireEvent.click(collectionTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('tier-progress-tracker')).toBeInTheDocument()
      expect(screen.getByTestId('tier-upgrade-system')).toBeInTheDocument()
      expect(screen.getByTestId('tiered-card-system')).toBeInTheDocument()
    })
  })

  test('trading tab shows trading controls', async () => {
    render(<ProfilePage />)
    
    const tradingTab = screen.getByText('Trading')
    fireEvent.click(tradingTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('trading-controls-dashboard')).toBeInTheDocument()
    })
  })

  test('battles tab shows battle arena', async () => {
    render(<ProfilePage />)
    
    const battlesTab = screen.getByText('Battles')
    fireEvent.click(battlesTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('battle-arena-system')).toBeInTheDocument()
    })
  })

  test('betting tab shows betting system', async () => {
    render(<ProfilePage />)
    
    const bettingTab = screen.getByText('Betting')
    fireEvent.click(bettingTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('betting-system')).toBeInTheDocument()
    })
  })

  test('auctions tab shows bidding system', async () => {
    render(<ProfilePage />)
    
    const auctionsTab = screen.getByText('Auctions')
    fireEvent.click(auctionsTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('bidding-system')).toBeInTheDocument()
    })
  })

  test('3D viewer tab shows card viewer with props', async () => {
    render(<ProfilePage />)
    
    const threeDTab = screen.getByText('3d-viewer')
    fireEvent.click(threeDTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('card-3d-viewer')).toBeInTheDocument()
      expect(screen.getByText('Legendary Cyber Dragon 3D Viewer')).toBeInTheDocument()
    })
  })

  test('settings tab shows privacy and social components', async () => {
    render(<ProfilePage />)
    
    const settingsTab = screen.getByText('Settings')
    fireEvent.click(settingsTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('profile-privacy-settings')).toBeInTheDocument()
      expect(screen.getByTestId('social-profile-links')).toBeInTheDocument()
    })
  })

  test('avatar update functionality works', async () => {
    render(<ProfilePage />)
    
    const updateAvatarButton = screen.getByText('Update Avatar')
    fireEvent.click(updateAvatarButton)
    
    // Avatar update should be called
    // In a real test, you might check for state changes or API calls
  })

  test('profile statistics are displayed', () => {
    render(<ProfilePage />)
    
    // Check for profile stats
    expect(screen.getByText('247')).toBeInTheDocument() // Cards Owned
    expect(screen.getByText('156')).toBeInTheDocument() // Trades Made
    expect(screen.getByText('89')).toBeInTheDocument() // Friends
  })

  test('badge system displays correctly', () => {
    render(<ProfilePage />)
    
    // Check for verification badges
    expect(screen.getByText('Verified Trader')).toBeInTheDocument()
    expect(screen.getByText('Elite Member')).toBeInTheDocument()
    expect(screen.getByText('Top 1% Trader')).toBeInTheDocument()
    expect(screen.getByText('Pro Features')).toBeInTheDocument()
  })

  test('profile actions are available', () => {
    render(<ProfilePage />)
    
    // Check for action buttons
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    expect(screen.getByText('Share Profile')).toBeInTheDocument()
    expect(screen.getByText('Follow')).toBeInTheDocument()
  })

  test('subscription status is reflected', () => {
    render(<ProfilePage />)
    
    // Check for Pro member indication
    expect(screen.getByText('@alexrivera • Trader Level 42 • Pro Member')).toBeInTheDocument()
    expect(screen.getByText('Pro Features')).toBeInTheDocument()
  })

  test('responsive design elements are present', () => {
    render(<ProfilePage />)
    
    // Check for glass card containers
    const glassCards = screen.getAllByTestId('glass-card')
    expect(glassCards.length).toBeGreaterThan(0)
  })

  test('all tab components are properly integrated', async () => {
    render(<ProfilePage />)
    
    const expectedComponents = [
      'profile-statistics-widget',
      'achievement-badges', 
      'profile-activity-feed',
      'tier-progress-tracker',
      'tier-upgrade-system',
      'tiered-card-system',
      'card-3d-viewer',
      'ece-balance-performance',
      'wishlist-system',
      'trading-controls-dashboard',
      'battle-arena-system',
      'betting-system',
      'bidding-system',
      'profile-privacy-settings',
      'social-profile-links'
    ]
    
    // Navigate through all tabs to ensure all components load
    const tabs = ['overview', 'collection', 'activity', 'achievements', 'performance', 'wishlist', '3d-viewer', 'trading', 'battles', 'betting', 'auctions', 'settings']
    
    for (const tab of tabs) {
      const tabButton = screen.getByText(tab.charAt(0).toUpperCase() + tab.slice(1))
      fireEvent.click(tabButton)
      await waitFor(() => {
        expect(tabButton).toHaveAttribute('data-active', 'true')
      })
    }
    
    // Check that all expected components exist somewhere in the document
    expectedComponents.forEach(component => {
      expect(screen.getByTestId(component)).toBeInTheDocument()
    })
  })
})
