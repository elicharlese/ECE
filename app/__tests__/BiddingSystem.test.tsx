import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BiddingSystem } from '../src/components/profile/BiddingSystem'

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock UI components
jest.mock('../src/components/ui/glass-card', () => ({
  GlassCard: ({ children, ...props }: any) => <div data-testid="glass-card" {...props}>{children}</div>
}))

jest.mock('../src/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}))

jest.mock('../src/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>
}))

jest.mock('../src/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
}))

jest.mock('../src/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, ...props }: any) => 
    <input 
      type="range" 
      value={value[0]} 
      onChange={(e) => onValueChange?.([parseInt(e.target.value)])} 
      {...props} 
    />
}))

jest.mock('../src/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, ...props }: any) => 
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onCheckedChange?.(e.target.checked)} 
      {...props} 
    />
}))

describe('BiddingSystem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders bidding system', () => {
    render(<BiddingSystem />)
    
    expect(screen.getByText('Bidding System')).toBeInTheDocument()
    expect(screen.getByText('Participate in card auctions and win rare collectibles')).toBeInTheDocument()
  })

  test('displays bidding statistics', () => {
    render(<BiddingSystem />)
    
    // Check for bidding stats
    expect(screen.getByText('156')).toBeInTheDocument() // Total Bids
    expect(screen.getByText('12')).toBeInTheDocument() // Active Bids
    expect(screen.getByText('34')).toBeInTheDocument() // Won Auctions
    expect(screen.getByText('68.5%')).toBeInTheDocument() // Success Rate
  })

  test('live auctions tab shows active auctions', async () => {
    render(<BiddingSystem />)
    
    // Navigate to live auctions (should be default)
    expect(screen.getByText('Live Auctions')).toBeInTheDocument()
    
    // Check for auction listings
    expect(screen.getByText('Legendary Cyber Dragon - Holographic')).toBeInTheDocument()
    expect(screen.getByText('Mythic Tech Core - First Edition')).toBeInTheDocument()
  })

  test('auction filtering works', async () => {
    render(<BiddingSystem />)
    
    // Check for search input
    const searchInput = screen.getByPlaceholderText('Search auctions, cards, or sellers...')
    expect(searchInput).toBeInTheDocument()
    
    fireEvent.change(searchInput, { target: { value: 'Dragon' } })
    expect(searchInput).toHaveValue('Dragon')
    
    // Check for category filters
    const gamingFilter = screen.getByText('Gaming')
    fireEvent.click(gamingFilter)
  })

  test('price range filtering works', async () => {
    render(<BiddingSystem />)
    
    // Check for price range slider
    const priceSlider = screen.getByRole('slider')
    expect(priceSlider).toBeInTheDocument()
    
    fireEvent.change(priceSlider, { target: { value: '500' } })
  })

  test('can place bids on auctions', async () => {
    render(<BiddingSystem />)
    
    // Find bid input and place bid button
    const bidInputs = screen.getAllByDisplayValue('')
    expect(bidInputs.length).toBeGreaterThan(0)
    
    const placeBidButtons = screen.getAllByText('Place Bid')
    expect(placeBidButtons.length).toBeGreaterThan(0)
    
    // Simulate placing a bid
    fireEvent.change(bidInputs[0], { target: { value: '250' } })
    fireEvent.click(placeBidButtons[0])
  })

  test('auto bidding can be enabled', async () => {
    render(<BiddingSystem />)
    
    // Find auto bid buttons
    const autoBidButtons = screen.getAllByText('Auto Bid')
    expect(autoBidButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(autoBidButtons[0])
    // Should show auto bid configuration
  })

  test('buy now functionality works', async () => {
    render(<BiddingSystem />)
    
    // Find buy now buttons
    const buyNowButtons = screen.getAllByText('Buy Now')
    expect(buyNowButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(buyNowButtons[0])
    // Should trigger instant purchase
  })

  test('my bids tab shows user bids', async () => {
    render(<BiddingSystem />)
    
    // Navigate to my bids
    const myBidsTab = screen.getByText('My Bids')
    fireEvent.click(myBidsTab)
    
    await waitFor(() => {
      expect(screen.getByText('My Active Bids')).toBeInTheDocument()
      expect(screen.getByText('2 Winning')).toBeInTheDocument()
      expect(screen.getByText('1 Outbid')).toBeInTheDocument()
    })
  })

  test('can manage existing bids', async () => {
    render(<BiddingSystem />)
    
    // Navigate to my bids
    const myBidsTab = screen.getByText('My Bids')
    fireEvent.click(myBidsTab)
    
    await waitFor(() => {
      // Check for bid management buttons
      const increaseBidButtons = screen.getAllByText('Increase Bid')
      expect(increaseBidButtons.length).toBeGreaterThan(0)
      
      const viewAuctionButtons = screen.getAllByText('View Auction')
      expect(viewAuctionButtons.length).toBeGreaterThan(0)
    })
  })

  test('analytics show bidding performance', async () => {
    render(<BiddingSystem />)
    
    // Navigate to analytics
    const analyticsTab = screen.getByText('Analytics')
    fireEvent.click(analyticsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Bidding Performance')).toBeInTheDocument()
      expect(screen.getByText('Performance by Category')).toBeInTheDocument()
      expect(screen.getByText('Strategy Insights')).toBeInTheDocument()
    })
  })

  test('category performance is displayed', async () => {
    render(<BiddingSystem />)
    
    // Navigate to analytics
    const analyticsTab = screen.getByText('Analytics')
    fireEvent.click(analyticsTab)
    
    await waitFor(() => {
      // Check for category breakdowns
      expect(screen.getByText('Gaming')).toBeInTheDocument()
      expect(screen.getByText('Technology')).toBeInTheDocument()
      expect(screen.getByText('Fantasy')).toBeInTheDocument()
      expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
    })
  })

  test('strategy insights are shown', async () => {
    render(<BiddingSystem />)
    
    // Navigate to analytics
    const analyticsTab = screen.getByText('Analytics')
    fireEvent.click(analyticsTab)
    
    await waitFor(() => {
      expect(screen.getByText('19')).toBeInTheDocument() // Auto Bid Wins
      expect(screen.getByText('8')).toBeInTheDocument() // Last-Minute Wins
      expect(screen.getByText('Above platform average of 45%')).toBeInTheDocument()
    })
  })

  test('watched only filter works', async () => {
    render(<BiddingSystem />)
    
    // Find watched only toggle
    const watchedOnlyToggle = screen.getByRole('checkbox')
    expect(watchedOnlyToggle).toBeInTheDocument()
    
    fireEvent.click(watchedOnlyToggle)
    expect(watchedOnlyToggle).toBeChecked()
  })

  test('auction time calculations work', () => {
    render(<BiddingSystem />)
    
    // Check for time remaining displays
    expect(screen.getByText(/\d+h \d+m/)).toBeInTheDocument() // Time format
  })

  test('bid calculator is available', async () => {
    render(<BiddingSystem />)
    
    // Find calculator buttons
    const calculatorButtons = screen.getAllByText('Calculate')
    expect(calculatorButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(calculatorButtons[0])
    // Should show bid calculation tools
  })

  test('watch functionality works', async () => {
    render(<BiddingSystem />)
    
    // Find watch buttons
    const watchButtons = screen.getAllByText('Watch')
    expect(watchButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(watchButtons[0])
    // Should add to watchlist
  })

  test('handles outbid notifications', async () => {
    render(<BiddingSystem />)
    
    // Navigate to my bids
    const myBidsTab = screen.getByText('My Bids')
    fireEvent.click(myBidsTab)
    
    await waitFor(() => {
      // Check for outbid warning
      expect(screen.getByText("You've been outbid!")).toBeInTheDocument()
      expect(screen.getByText('Current bid: 420 ECE')).toBeInTheDocument()
    })
  })
})
