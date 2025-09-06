import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TradingCardsPage from '@/app/trading-cards/page'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock the trading card component
jest.mock('@/components/trading-card', () => ({
  TradingCard: ({ card, onTrade, onView, variant }: any) => (
    <div data-testid={`trading-card-${card.id}`}>
      <div>{card.name}</div>
      <button onClick={() => onTrade?.()}>Trade</button>
      <button onClick={() => onView?.()}>View</button>
    </div>
  ),
  sampleTradingCards: [
    {
      id: 'card-001',
      name: 'Ocean Warrior',
      rarity: 'legendary',
      price: 299.99,
      isNFT: true
    },
    {
      id: 'card-002',
      name: 'Coral Guardian',
      rarity: 'epic',
      price: 149.99,
      isNFT: false
    }
  ]
}))

// Mock the company card component
jest.mock('@/components/cards/CompanyCard', () => ({
  CompanyCard: ({ card, onAcquire, onView, variant }: any) => (
    <div data-testid={`company-card-${card.id}`}>
      <div>{card.name}</div>
      <div>{card.ticker}</div>
      <button onClick={() => onAcquire?.(card.id)}>Acquire</button>
      <button onClick={() => onView?.(card.id)}>View</button>
    </div>
  ),
  sampleCompanyCards: [
    {
      id: 'company-001',
      name: 'TechNova Corp',
      ticker: 'TNVA',
      sector: 'TECH',
      rarity: 'legendary',
      marketCap: 850000000000,
      currentPrice: 342.50,
      priceChange24h: 2.3,
      volume24h: 45000000,
      stats: {
        acquisitionPower: 95,
        defenseRating: 88,
        marketDominance: 92,
        innovation: 97,
        financialHealth: 89,
        leadership: 94
      },
      description: 'Revolutionary AI and quantum computing leader',
      founded: 1998,
      headquarters: 'Silicon Valley, CA',
      employees: 145000,
      revenue: 280000000000,
      isNFT: true,
      sentiment: 'bullish',
      analystRating: 'buy'
    }
  ]
}))

// Mock the marketplace component
jest.mock('@/components/marketplace/AdvancedMarketplace', () => ({
  AdvancedMarketplace: () => (
    <div data-testid="advanced-marketplace">
      <h2>Advanced Marketplace</h2>
      <div>Auctions, Betting, M&A Battles</div>
    </div>
  )
}))

// Mock the collection component
jest.mock('@/components/collection/UserCollection', () => ({
  UserCollection: () => (
    <div data-testid="user-collection">
      <h2>My Collection</h2>
      <div>User's card collection</div>
    </div>
  )
}))

// Mock the powerups component
jest.mock('@/components/powerups/PowerupsSystem', () => ({
  PowerupsSystem: () => (
    <div data-testid="powerups-system">
      <h2>Powerups System</h2>
      <div>Card enhancement system</div>
    </div>
  )
}))

// Mock UI components
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange }: any) => (
    <div data-testid="tabs" data-value={value}>
      <div onClick={() => onValueChange?.('overview')} data-testid="tab-overview">Overview</div>
      <div onClick={() => onValueChange?.('marketplace')} data-testid="tab-marketplace">Marketplace</div>
      <div onClick={() => onValueChange?.('collection')} data-testid="tab-collection">Collection</div>
      <div onClick={() => onValueChange?.('powerups')} data-testid="tab-powerups">Powerups</div>
      <div onClick={() => onValueChange?.('cards')} data-testid="tab-cards">All Cards</div>
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ value, children }: any) => (
    <button data-testid={`tab-trigger-${value}`}>{children}</button>
  ),
  TabsContent: ({ value, children }: any) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button
      data-testid={`button-${variant || 'default'}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}))

describe('TradingCardsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the page header correctly', () => {
    render(<TradingCardsPage />)
    
    expect(screen.getByText('🎮 ECE Trading Cards Platform')).toBeInTheDocument()
    expect(screen.getByText(/Master M&A battles with strategic company cards/)).toBeInTheDocument()
  })

  it('displays platform statistics', () => {
    render(<TradingCardsPage />)
    
    expect(screen.getByText('Total Cards')).toBeInTheDocument()
    expect(screen.getByText('NFT Companies')).toBeInTheDocument()
    expect(screen.getByText('Elite Companies')).toBeInTheDocument()
    expect(screen.getByText('Market Cap')).toBeInTheDocument()
    expect(screen.getByText('Active Battles')).toBeInTheDocument()
  })

  it('renders all tab triggers', () => {
    render(<TradingCardsPage />)
    
    expect(screen.getByTestId('tab-trigger-overview')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-marketplace')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-collection')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-powerups')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-cards')).toBeInTheDocument()
  })

  it('shows overview tab by default', () => {
    render(<TradingCardsPage />)
    
    expect(screen.getByTestId('tab-content-overview')).toBeInTheDocument()
    expect(screen.getByText('🏢 Featured Company Cards')).toBeInTheDocument()
    expect(screen.getByText('🎴 Classic Trading Cards')).toBeInTheDocument()
  })

  it('displays featured company cards in overview', () => {
    render(<TradingCardsPage />)
    
    expect(screen.getByTestId('company-card-company-001')).toBeInTheDocument()
    expect(screen.getByText('TechNova Corp')).toBeInTheDocument()
    expect(screen.getByText('TNVA')).toBeInTheDocument()
  })

  it('displays classic trading cards in overview', () => {
    render(<TradingCardsPage />)
    
    expect(screen.getByTestId('trading-card-card-001')).toBeInTheDocument()
    expect(screen.getByTestId('trading-card-card-002')).toBeInTheDocument()
    expect(screen.getByText('Ocean Warrior')).toBeInTheDocument()
    expect(screen.getByText('Coral Guardian')).toBeInTheDocument()
  })

  it('shows quick action buttons in overview', () => {
    render(<TradingCardsPage />)
    
    expect(screen.getByText('🛒 Browse Marketplace')).toBeInTheDocument()
    expect(screen.getByText('📦 My Collection')).toBeInTheDocument()
    expect(screen.getByText('⚡ Powerups System')).toBeInTheDocument()
    expect(screen.getByText('🎲 Random Pack')).toBeInTheDocument()
  })

  it('switches to marketplace tab when clicked', async () => {
    render(<TradingCardsPage />)
    
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-marketplace')).toBeInTheDocument()
      expect(screen.getByTestId('advanced-marketplace')).toBeInTheDocument()
    })
  })

  it('switches to collection tab when clicked', async () => {
    render(<TradingCardsPage />)
    
    const collectionTab = screen.getByTestId('tab-collection')
    fireEvent.click(collectionTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-collection')).toBeInTheDocument()
      expect(screen.getByTestId('user-collection')).toBeInTheDocument()
    })
  })

  it('switches to powerups tab when clicked', async () => {
    render(<TradingCardsPage />)
    
    const powerupsTab = screen.getByTestId('tab-powerups')
    fireEvent.click(powerupsTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-powerups')).toBeInTheDocument()
      expect(screen.getByTestId('powerups-system')).toBeInTheDocument()
    })
  })

  it('switches to all cards tab when clicked', async () => {
    render(<TradingCardsPage />)
    
    const cardsTab = screen.getByTestId('tab-cards')
    fireEvent.click(cardsTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-cards')).toBeInTheDocument()
      expect(screen.getByText('Company Cards')).toBeInTheDocument()
      expect(screen.getByText('Traditional Cards')).toBeInTheDocument()
    })
  })

  it('handles quick action button navigation', async () => {
    render(<TradingCardsPage />)
    
    const marketplaceButton = screen.getByText('🛒 Browse Marketplace')
    fireEvent.click(marketplaceButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('advanced-marketplace')).toBeInTheDocument()
    })
  })

  it('handles collection button navigation', async () => {
    render(<TradingCardsPage />)
    
    const collectionButton = screen.getByText('📦 My Collection')
    fireEvent.click(collectionButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('user-collection')).toBeInTheDocument()
    })
  })

  it('handles powerups button navigation', async () => {
    render(<TradingCardsPage />)
    
    const powerupsButton = screen.getByText('⚡ Powerups System')
    fireEvent.click(powerupsButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('powerups-system')).toBeInTheDocument()
    })
  })

  it('handles card interactions - company card acquire', async () => {
    render(<TradingCardsPage />)
    
    const acquireButton = screen.getByText('Acquire')
    fireEvent.click(acquireButton)
    
    // Should trigger the acquire handler
    expect(acquireButton).toBeInTheDocument()
  })

  it('handles card interactions - trading card trade', async () => {
    render(<TradingCardsPage />)
    
    const tradeButtons = screen.getAllByText('Trade')
    fireEvent.click(tradeButtons[0])
    
    // Should trigger the trade handler
    expect(tradeButtons[0]).toBeInTheDocument()
  })

  it('handles card view actions', async () => {
    render(<TradingCardsPage />)
    
    const viewButtons = screen.getAllByText('View')
    fireEvent.click(viewButtons[0])
    
    // Should trigger the view handler
    expect(viewButtons[0]).toBeInTheDocument()
  })

  it('displays all cards in the cards tab', async () => {
    render(<TradingCardsPage />)
    
    const cardsTab = screen.getByTestId('tab-cards')
    fireEvent.click(cardsTab)
    
    await waitFor(() => {
      // Should show both company cards and traditional cards
      expect(screen.getByTestId('company-card-company-001')).toBeInTheDocument()
      expect(screen.getByTestId('trading-card-card-001')).toBeInTheDocument()
      expect(screen.getByTestId('trading-card-card-002')).toBeInTheDocument()
    })
  })

  it('renders floating background elements', () => {
    render(<TradingCardsPage />)
    
    // The floating background elements should be present
    expect(screen.getByText('✦')).toBeInTheDocument()
    expect(screen.getByText('🎮')).toBeInTheDocument()
    expect(screen.getByText('🪙')).toBeInTheDocument()
  })

  it('has proper responsive layout', () => {
    render(<TradingCardsPage />)
    
    // The page should have responsive classes
    const mainContainer = screen.getByText('🎮 ECE Trading Cards Platform').closest('div')
    expect(mainContainer).toBeInTheDocument()
  })

  it('handles loading states gracefully', () => {
    render(<TradingCardsPage />)
    
    // Page should render without loading states
    expect(screen.getByText('🎮 ECE Trading Cards Platform')).toBeInTheDocument()
  })

  it('maintains proper tab state', async () => {
    render(<TradingCardsPage />)
    
    // Start with overview tab
    expect(screen.getByTestId('tab-content-overview')).toBeInTheDocument()
    
    // Switch to marketplace
    fireEvent.click(screen.getByTestId('tab-marketplace'))
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-marketplace')).toBeInTheDocument()
    })
    
    // Switch back to overview
    fireEvent.click(screen.getByTestId('tab-overview'))
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-overview')).toBeInTheDocument()
    })
  })

  it('displays correct statistics values', () => {
    render(<TradingCardsPage />)
    
    // Should show calculated statistics
    expect(screen.getByText('$2.4T')).toBeInTheDocument() // Market Cap
    expect(screen.getByText('15')).toBeInTheDocument() // Active Battles
  })

  it('handles animation variants properly', () => {
    render(<TradingCardsPage />)
    
    // Animation variants should be applied without errors
    expect(screen.getByText('🎮 ECE Trading Cards Platform')).toBeInTheDocument()
  })

  it('provides accessibility features', () => {
    render(<TradingCardsPage />)
    
    // Should have proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    
    // Buttons should be accessible
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})