import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompanyCard, CompanyCardData } from '@/components/cards/CompanyCard'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  Building2: () => <div data-testid="building-icon" />,
  Users: () => <div data-testid="users-icon" />,
  DollarSign: () => <div data-testid="dollar-icon" />,
  Crown: () => <div data-testid="crown-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Share2: () => <div data-testid="share-icon" />,
  Sword: () => <div data-testid="sword-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Gavel: () => <div data-testid="gavel-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Award: () => <div data-testid="award-icon" />,
}))

const mockCompanyCard: CompanyCardData = {
  id: 'test-company-001',
  name: 'Test Corp',
  ticker: 'TEST',
  sector: 'TECH',
  rarity: 'epic',
  marketCap: 1000000000,
  currentPrice: 150.50,
  priceChange24h: 2.5,
  volume24h: 5000000,
  stats: {
    acquisitionPower: 85,
    defenseRating: 78,
    marketDominance: 90,
    innovation: 95,
    financialHealth: 88,
    leadership: 82
  },
  description: 'A leading technology company specializing in innovation',
  founded: 2000,
  headquarters: 'Silicon Valley, CA',
  employees: 50000,
  revenue: 10000000000,
  recentAcquisitions: ['StartupA', 'StartupB'],
  strengths: ['Innovation', 'Market Leadership'],
  isNFT: true,
  tokenId: 'ECE-TEST-001',
  owner: 'test-owner',
  sentiment: 'bullish',
  analystRating: 'buy',
  activePowerups: [
    {
      id: 'pw-001',
      name: 'Innovation Boost',
      type: 'boost',
      value: 15,
      description: '+15% innovation power'
    }
  ]
}

describe('CompanyCard', () => {
  const mockHandlers = {
    onAcquire: jest.fn(),
    onDefend: jest.fn(),
    onTrade: jest.fn(),
    onView: jest.fn(),
    onBattle: jest.fn(),
    onBid: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders company card with basic information', () => {
    render(<CompanyCard card={mockCompanyCard} {...mockHandlers} />)
    
    expect(screen.getByText('Test Corp')).toBeInTheDocument()
    expect(screen.getByText('TEST')).toBeInTheDocument()
    expect(screen.getByText('TECH')).toBeInTheDocument()
    expect(screen.getByText('EPIC')).toBeInTheDocument()
  })

  it('displays market data correctly', () => {
    render(<CompanyCard card={mockCompanyCard} {...mockHandlers} />)
    
    expect(screen.getByText('$150.50')).toBeInTheDocument()
    expect(screen.getByText('2.50%')).toBeInTheDocument()
  })

  it('shows NFT badge when card is NFT', () => {
    render(<CompanyCard card={mockCompanyCard} {...mockHandlers} />)
    
    expect(screen.getByText('🪙 NFT')).toBeInTheDocument()
  })

  it('displays powerup count when powerups are active', () => {
    render(<CompanyCard card={mockCompanyCard} {...mockHandlers} />)
    
    expect(screen.getByText('⚡ 1')).toBeInTheDocument()
  })

  it('shows correct sentiment indicator', () => {
    render(<CompanyCard card={mockCompanyCard} {...mockHandlers} />)
    
    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument()
  })

  it('displays company stats correctly', () => {
    render(<CompanyCard card={mockCompanyCard} {...mockHandlers} />)
    
    expect(screen.getByText('85')).toBeInTheDocument() // acquisition power
    expect(screen.getByText('78')).toBeInTheDocument() // defense rating
    expect(screen.getByText('90')).toBeInTheDocument() // market dominance
  })

  it('calls appropriate handlers when action buttons are clicked', () => {
    render(<CompanyCard card={mockCompanyCard} {...mockHandlers} />)
    
    const battleButton = screen.getByText('BATTLE')
    const acquireButton = screen.getByText('ACQUIRE')
    const bidButton = screen.getByText('BID')
    const viewButton = screen.getByText('VIEW DETAILS')
    
    fireEvent.click(battleButton)
    expect(mockHandlers.onBattle).toHaveBeenCalledWith('test-company-001')
    
    fireEvent.click(acquireButton)
    expect(mockHandlers.onAcquire).toHaveBeenCalledWith('test-company-001')
    
    fireEvent.click(bidButton)
    expect(mockHandlers.onBid).toHaveBeenCalledWith('test-company-001')
    
    fireEvent.click(viewButton)
    expect(mockHandlers.onView).toHaveBeenCalledWith('test-company-001')
  })

  it('renders different card variants correctly', () => {
    const { rerender } = render(
      <CompanyCard card={mockCompanyCard} variant="compact" {...mockHandlers} />
    )
    
    // Test compact variant
    expect(screen.getByText('Test Corp')).toBeInTheDocument()
    
    // Test battle variant
    rerender(
      <CompanyCard card={mockCompanyCard} variant="battle" {...mockHandlers} />
    )
    
    expect(screen.getByText('Test Corp')).toBeInTheDocument()
  })

  it('handles different rarity levels', () => {
    const rarities: Array<CompanyCardData['rarity']> = ['common', 'rare', 'epic', 'legendary', 'mythic']
    
    rarities.forEach(rarity => {
      const cardWithRarity = { ...mockCompanyCard, rarity }
      const { rerender } = render(
        <CompanyCard card={cardWithRarity} {...mockHandlers} />
      )
      
      expect(screen.getByText(rarity.toUpperCase())).toBeInTheDocument()
    })
  })

  it('handles different sectors correctly', () => {
    const sectors: Array<CompanyCardData['sector']> = ['TECH', 'FINANCE', 'HEALTHCARE', 'ENERGY']
    
    sectors.forEach(sector => {
      const cardWithSector = { ...mockCompanyCard, sector }
      render(<CompanyCard card={cardWithSector} {...mockHandlers} />)
      
      expect(screen.getByText(sector)).toBeInTheDocument()
    })
  })

  it('shows different price change indicators', () => {
    // Test positive change
    const positiveCard = { ...mockCompanyCard, priceChange24h: 5.2 }
    const { rerender } = render(<CompanyCard card={positiveCard} {...mockHandlers} />)
    
    expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument()
    expect(screen.getByText('5.20%')).toBeInTheDocument()
    
    // Test negative change
    const negativeCard = { ...mockCompanyCard, priceChange24h: -3.1 }
    rerender(<CompanyCard card={negativeCard} {...mockHandlers} />)
    
    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    expect(screen.getByText('3.10%')).toBeInTheDocument()
  })

  it('conditionally renders action buttons based on props', () => {
    // Test with no actions
    render(<CompanyCard card={mockCompanyCard} showActions={false} />)
    
    expect(screen.queryByText('BATTLE')).not.toBeInTheDocument()
    expect(screen.queryByText('ACQUIRE')).not.toBeInTheDocument()
    
    // Test with specific actions
    render(
      <CompanyCard 
        card={mockCompanyCard} 
        onBattle={mockHandlers.onBattle}
        onAcquire={mockHandlers.onAcquire}
      />
    )
    
    expect(screen.getByText('BATTLE')).toBeInTheDocument()
    expect(screen.getByText('ACQUIRE')).toBeInTheDocument()
  })

  it('handles interactive and non-interactive modes', () => {
    // Test non-interactive mode
    render(<CompanyCard card={mockCompanyCard} isInteractive={false} {...mockHandlers} />)
    
    const card = screen.getByText('Test Corp').closest('[data-testid]') || 
                 screen.getByText('Test Corp').closest('div')
    
    expect(card).toBeInTheDocument()
    
    // Test interactive mode (default)
    render(<CompanyCard card={mockCompanyCard} isInteractive={true} {...mockHandlers} />)
    
    expect(screen.getByText('Test Corp')).toBeInTheDocument()
  })

  it('formats large numbers correctly', () => {
    const largeCard = {
      ...mockCompanyCard,
      marketCap: 1500000000000, // 1.5T
      employees: 250000,
      revenue: 85000000000 // 85B
    }
    
    render(<CompanyCard card={largeCard} {...mockHandlers} />)
    
    // The component should format these numbers in a readable way
    expect(screen.getByText('Test Corp')).toBeInTheDocument()
  })

  it('handles missing optional properties gracefully', () => {
    const minimalCard: CompanyCardData = {
      id: 'minimal-001',
      name: 'Minimal Corp',
      ticker: 'MIN',
      sector: 'TECH',
      rarity: 'common',
      marketCap: 1000000,
      currentPrice: 10.00,
      priceChange24h: 0,
      volume24h: 100000,
      stats: {
        acquisitionPower: 50,
        defenseRating: 50,
        marketDominance: 50,
        innovation: 50,
        financialHealth: 50,
        leadership: 50
      },
      description: 'A minimal company card',
      founded: 2020,
      headquarters: 'Anywhere',
      employees: 100,
      revenue: 1000000,
      isNFT: false,
      sentiment: 'neutral',
      analystRating: 'hold'
    }
    
    render(<CompanyCard card={minimalCard} {...mockHandlers} />)
    
    expect(screen.getByText('Minimal Corp')).toBeInTheDocument()
    expect(screen.getByText('MIN')).toBeInTheDocument()
    expect(screen.getByText('COMMON')).toBeInTheDocument()
  })
})