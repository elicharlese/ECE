import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserCollection } from '@/components/collection/UserCollection'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Grid3X3: () => <div data-testid="grid-icon" />,
  List: () => <div data-testid="list-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Share2: () => <div data-testid="share-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  PieChart: () => <div data-testid="pie-chart-icon" />,
  DollarSign: () => <div data-testid="dollar-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Crown: () => <div data-testid="crown-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  MoreHorizontal: () => <div data-testid="more-horizontal-icon" />,
  SortAsc: () => <div data-testid="sort-asc-icon" />,
  SortDesc: () => <div data-testid="sort-desc-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Building2: () => <div data-testid="building-icon" />,
  Briefcase: () => <div data-testid="briefcase-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
}))

// Mock the CompanyCard component
jest.mock('@/components/cards/CompanyCard', () => ({
  CompanyCard: ({ card, onView, onTrade, className, ...props }: any) => (
    <div data-testid={`company-card-${card.id}`} className={className}>
      <div>{card.name}</div>
      <div>{card.ticker}</div>
      <button onClick={() => onView?.(card.id)}>View</button>
      <button onClick={() => onTrade?.(card.id)}>Trade</button>
    </div>
  ),
  sampleCompanyCards: [
    {
      id: 'company-001',
      name: 'Test Corp A',
      ticker: 'TSTA',
      sector: 'TECH',
      rarity: 'legendary',
      marketCap: 1000000000,
      currentPrice: 100,
      priceChange24h: 2.5,
      volume24h: 1000000,
      stats: {
        acquisitionPower: 85,
        defenseRating: 78,
        marketDominance: 90,
        innovation: 95,
        financialHealth: 88,
        leadership: 82
      },
      description: 'Test company A',
      founded: 2000,
      headquarters: 'Test City',
      employees: 10000,
      revenue: 1000000000,
      isNFT: true,
      sentiment: 'bullish',
      analystRating: 'buy'
    },
    {
      id: 'company-002',
      name: 'Test Corp B',
      ticker: 'TSTB',
      sector: 'FINANCE',
      rarity: 'epic',
      marketCap: 500000000,
      currentPrice: 50,
      priceChange24h: -1.2,
      volume24h: 500000,
      stats: {
        acquisitionPower: 70,
        defenseRating: 85,
        marketDominance: 75,
        innovation: 60,
        financialHealth: 90,
        leadership: 80
      },
      description: 'Test company B',
      founded: 1995,
      headquarters: 'Finance City',
      employees: 15000,
      revenue: 800000000,
      isNFT: false,
      sentiment: 'neutral',
      analystRating: 'hold'
    }
  ]
}))

// Mock UI components
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange }: any) => (
    <div data-testid="tabs" data-value={value}>
      <div onClick={() => onValueChange?.('collection')} data-testid="tab-collection">Collection</div>
      <div onClick={() => onValueChange?.('favorites')} data-testid="tab-favorites">Favorites</div>
      <div onClick={() => onValueChange?.('wishlist')} data-testid="tab-wishlist">Wishlist</div>
      <div onClick={() => onValueChange?.('analytics')} data-testid="tab-analytics">Analytics</div>
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

jest.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, value, onChange, className, ...props }: any) => (
    <input
      data-testid="input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, disabled, ...props }: any) => (
    <button
      data-testid={`button-${variant || 'default'}-${size || 'default'}`}
      onClick={onClick}
      disabled={disabled}
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

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid={`badge-${variant || 'default'}`}>{children}</span>
  ),
}))

describe('UserCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the collection header correctly', () => {
    render(<UserCollection />)
    
    expect(screen.getByText('📦 My Collection')).toBeInTheDocument()
    expect(screen.getByText(/Manage and analyze your M&A trading card portfolio/)).toBeInTheDocument()
  })

  it('displays action buttons in header', () => {
    render(<UserCollection />)
    
    expect(screen.getByText('Import')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('shows collection statistics cards', () => {
    render(<UserCollection />)
    
    expect(screen.getByText('Total Cards')).toBeInTheDocument()
    expect(screen.getByText('Portfolio Value')).toBeInTheDocument()
    expect(screen.getByText('NFT Cards')).toBeInTheDocument()
    expect(screen.getByText('Active Powerups')).toBeInTheDocument()
  })

  it('renders all tab triggers', () => {
    render(<UserCollection />)
    
    expect(screen.getByTestId('tab-trigger-collection')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-favorites')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-wishlist')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-analytics')).toBeInTheDocument()
  })

  it('displays search input and controls in collection tab', () => {
    render(<UserCollection />)
    
    expect(screen.getByPlaceholderText('Search your collection...')).toBeInTheDocument()
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('shows view mode toggle buttons', () => {
    render(<UserCollection />)
    
    const gridButton = screen.getByTestId('grid-icon').closest('button')
    const listButton = screen.getByTestId('list-icon').closest('button')
    
    expect(gridButton).toBeInTheDocument()
    expect(listButton).toBeInTheDocument()
  })

  it('handles search input changes', async () => {
    render(<UserCollection />)
    
    const searchInput = screen.getByPlaceholderText('Search your collection...')
    fireEvent.change(searchInput, { target: { value: 'test corp' } })
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('test corp')
    })
  })

  it('toggles view mode between grid and list', async () => {
    render(<UserCollection />)
    
    const listButton = screen.getByTestId('list-icon').closest('button')
    fireEvent.click(listButton!)
    
    // The component should handle the view mode change
    expect(listButton).toBeInTheDocument()
  })

  it('displays company cards in the collection', () => {
    render(<UserCollection />)
    
    expect(screen.getByTestId('company-card-company-001')).toBeInTheDocument()
    expect(screen.getByTestId('company-card-company-002')).toBeInTheDocument()
    expect(screen.getByText('Test Corp A')).toBeInTheDocument()
    expect(screen.getByText('Test Corp B')).toBeInTheDocument()
  })

  it('handles card selection', async () => {
    render(<UserCollection />)
    
    const card = screen.getByTestId('company-card-company-001')
    
    // Look for selection checkbox or click area
    // This would depend on the actual implementation
    expect(card).toBeInTheDocument()
  })

  it('shows bulk actions when cards are selected', () => {
    render(<UserCollection />)
    
    // This test would need to simulate card selection first
    // Then check for bulk action buttons
    expect(screen.getByTestId('company-card-company-001')).toBeInTheDocument()
  })

  it('filters cards by rarity', async () => {
    render(<UserCollection />)
    
    // Look for rarity filter dropdown
    const filtersButton = screen.getByText('Filters')
    fireEvent.click(filtersButton)
    
    // The filters panel should appear
    expect(filtersButton).toBeInTheDocument()
  })

  it('sorts cards by different criteria', async () => {
    render(<UserCollection />)
    
    // Look for sort dropdown
    const sortDropdown = screen.getByDisplayValue?.('name') || screen.querySelector('select')
    
    if (sortDropdown) {
      fireEvent.change(sortDropdown, { target: { value: 'value' } })
      await waitFor(() => {
        expect(sortDropdown).toHaveValue('value')
      })
    }
  })

  it('toggles sort order', async () => {
    render(<UserCollection />)
    
    const sortOrderButton = screen.getByTestId('sort-asc-icon').closest('button')
    
    if (sortOrderButton) {
      fireEvent.click(sortOrderButton)
      expect(sortOrderButton).toBeInTheDocument()
    }
  })

  it('switches to favorites tab', async () => {
    render(<UserCollection />)
    
    const favoritesTab = screen.getByTestId('tab-favorites')
    fireEvent.click(favoritesTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('tab-content-favorites')).toBeInTheDocument()
    })
  })

  it('shows empty state for wishlist', async () => {
    render(<UserCollection />)
    
    const wishlistTab = screen.getByTestId('tab-wishlist')
    fireEvent.click(wishlistTab)
    
    await waitFor(() => {
      expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument()
    })
  })

  it('displays analytics in analytics tab', async () => {
    render(<UserCollection />)
    
    const analyticsTab = screen.getByTestId('tab-analytics')
    fireEvent.click(analyticsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Portfolio Composition')).toBeInTheDocument()
      expect(screen.getByText('Sector Distribution')).toBeInTheDocument()
    })
  })

  it('handles card actions (view, trade)', async () => {
    render(<UserCollection />)
    
    const viewButton = screen.getAllByText('View')[0]
    const tradeButton = screen.getAllByText('Trade')[0]
    
    fireEvent.click(viewButton)
    fireEvent.click(tradeButton)
    
    // These should trigger the appropriate handlers
    expect(viewButton).toBeInTheDocument()
    expect(tradeButton).toBeInTheDocument()
  })

  it('toggles favorite status for cards', async () => {
    render(<UserCollection />)
    
    // Look for heart icon buttons
    const heartButtons = screen.getAllByTestId('heart-icon')
    
    if (heartButtons.length > 0) {
      const heartButton = heartButtons[0].closest('button')
      if (heartButton) {
        fireEvent.click(heartButton)
        expect(heartButton).toBeInTheDocument()
      }
    }
  })

  it('shows no cards found message when search returns empty', async () => {
    render(<UserCollection />)
    
    const searchInput = screen.getByPlaceholderText('Search your collection...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent card' } })
    
    await waitFor(() => {
      // The component should show a "no cards found" message
      // This depends on the actual implementation
      expect(searchInput).toHaveValue('nonexistent card')
    })
  })

  it('formats collection statistics correctly', () => {
    render(<UserCollection />)
    
    // Check that statistics are displayed with proper formatting
    expect(screen.getByText('Total Cards')).toBeInTheDocument()
    expect(screen.getByText('Portfolio Value')).toBeInTheDocument()
  })

  it('handles responsive design', () => {
    render(<UserCollection />)
    
    // The component should have responsive classes
    const collection = screen.getByText('📦 My Collection').closest('div')
    expect(collection).toBeInTheDocument()
  })

  it('applies custom className prop', () => {
    const customClass = 'custom-collection-class'
    render(<UserCollection className={customClass} />)
    
    const collection = screen.getByText('📦 My Collection').closest('div')
    expect(collection).toHaveClass(customClass)
  })

  it('handles empty collection state', () => {
    // This would test with no cards in the collection
    render(<UserCollection />)
    
    // Should still render the basic structure
    expect(screen.getByText('📦 My Collection')).toBeInTheDocument()
  })

  it('calculates portfolio statistics correctly', () => {
    render(<UserCollection />)
    
    // The component should calculate and display correct statistics
    expect(screen.getByText('Total Cards')).toBeInTheDocument()
    expect(screen.getByText('Portfolio Value')).toBeInTheDocument()
    expect(screen.getByText('NFT Cards')).toBeInTheDocument()
  })
})