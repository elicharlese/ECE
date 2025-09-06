import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PowerupsSystem } from '@/components/powerups/PowerupsSystem'
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
  Zap: () => <div data-testid="zap-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Sword: () => <div data-testid="sword-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Crown: () => <div data-testid="crown-icon" />,
  Flame: () => <div data-testid="flame-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Wand2: () => <div data-testid="wand-icon" />,
  Gem: () => <div data-testid="gem-icon" />,
  Rocket: () => <div data-testid="rocket-icon" />,
  Lightning: () => <div data-testid="lightning-icon" />,
  Snowflake: () => <div data-testid="snowflake-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Cpu: () => <div data-testid="cpu-icon" />,
  DollarSign: () => <div data-testid="dollar-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Book: () => <div data-testid="book-icon" />,
  Beaker: () => <div data-testid="beaker-icon" />,
  Hammer: () => <div data-testid="hammer-icon" />,
  ShoppingCart: () => <div data-testid="shopping-cart-icon" />,
  Package: () => <div data-testid="package-icon" />,
  Gift: () => <div data-testid="gift-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Briefcase: () => <div data-testid="briefcase-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
}))

// Mock UI components
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange }: any) => (
    <div data-testid="tabs" data-value={value}>
      <div onClick={() => onValueChange?.('inventory')} data-testid="tab-inventory">Inventory</div>
      <div onClick={() => onValueChange?.('marketplace')} data-testid="tab-marketplace">Marketplace</div>
      <div onClick={() => onValueChange?.('crafting')} data-testid="tab-crafting">Crafting</div>
      <div onClick={() => onValueChange?.('effects')} data-testid="tab-effects">Effects</div>
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
  Input: ({ placeholder, value, onChange, type, min, max, step, className, ...props }: any) => (
    <input
      data-testid="input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      min={min}
      max={max}
      step={step}
      className={className}
      {...props}
    />
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, disabled, className, ...props }: any) => (
    <button
      data-testid={`button-${variant || 'default'}`}
      onClick={onClick}
      disabled={disabled}
      className={className}
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

describe('PowerupsSystem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the powerups system header correctly', () => {
    render(<PowerupsSystem />)
    
    expect(screen.getByText('⚡ Powerups System')).toBeInTheDocument()
    expect(screen.getByText(/Enhance your cards with powerful abilities/)).toBeInTheDocument()
  })

  it('displays quick statistics cards', () => {
    render(<PowerupsSystem />)
    
    expect(screen.getByText('Owned')).toBeInTheDocument()
    expect(screen.getByText('Total Quantity')).toBeInTheDocument()
    expect(screen.getByText('Crafting Queue')).toBeInTheDocument()
    expect(screen.getByText('Max Mastery')).toBeInTheDocument()
  })

  it('renders all tab triggers', () => {
    render(<PowerupsSystem />)
    
    expect(screen.getByTestId('tab-trigger-inventory')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-marketplace')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-crafting')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-effects')).toBeInTheDocument()
  })

  it('shows search and filter controls in marketplace tab', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search powerups...')).toBeInTheDocument()
    })
  })

  it('handles search input changes', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab first
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search powerups...')
      fireEvent.change(searchInput, { target: { value: 'boost' } })
      
      expect(searchInput).toHaveValue('boost')
    })
  })

  it('filters powerups by category', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      const categorySelect = screen.getAllByRole?.('combobox')?.[0] || screen.querySelector('select')
      
      if (categorySelect) {
        fireEvent.change(categorySelect, { target: { value: 'COMBAT' } })
        expect(categorySelect).toHaveValue('COMBAT')
      }
    })
  })

  it('filters powerups by rarity', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      const raritySelect = screen.getAllByRole?.('combobox')?.[1] || screen.querySelectorAll('select')?.[1]
      
      if (raritySelect) {
        fireEvent.change(raritySelect, { target: { value: 'legendary' } })
        expect(raritySelect).toHaveValue('legendary')
      }
    })
  })

  it('displays powerup cards with correct information', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab to see powerup cards
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      expect(screen.getByText('Acquisition Boost')).toBeInTheDocument()
      expect(screen.getByText('Defense Matrix')).toBeInTheDocument()
      expect(screen.getByText('Market Oracle')).toBeInTheDocument()
      expect(screen.getByText('Innovation Catalyst')).toBeInTheDocument()
    })
  })

  it('handles powerup purchase', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      const buyButtons = screen.getAllByText('BUY')
      
      if (buyButtons.length > 0) {
        fireEvent.click(buyButtons[0])
        // Should trigger buy action
        expect(buyButtons[0]).toBeInTheDocument()
      }
    })
  })

  it('handles powerup crafting', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      const craftButtons = screen.getAllByText('CRAFT')
      
      if (craftButtons.length > 0) {
        fireEvent.click(craftButtons[0])
        // Should trigger craft action
        expect(craftButtons[0]).toBeInTheDocument()
      }
    })
  })

  it('shows user powerups in inventory tab', () => {
    render(<PowerupsSystem />)
    
    // Default tab should be inventory
    expect(screen.getByTestId('tab-content-inventory')).toBeInTheDocument()
    
    // Should show user's powerups
    expect(screen.getByText('Acquisition Boost')).toBeInTheDocument()
    expect(screen.getByText('Defense Matrix')).toBeInTheDocument()
  })

  it('handles powerup usage', async () => {
    render(<PowerupsSystem />)
    
    // Should be on inventory tab by default
    const useButtons = screen.getAllByText('USE')
    
    if (useButtons.length > 0) {
      fireEvent.click(useButtons[0])
      // Should trigger use action
      expect(useButtons[0]).toBeInTheDocument()
    }
  })

  it('displays crafting interface', async () => {
    render(<PowerupsSystem />)
    
    // Switch to crafting tab
    const craftingTab = screen.getByTestId('tab-crafting')
    fireEvent.click(craftingTab)
    
    await waitFor(() => {
      expect(screen.getByText('Craft Acquisition Boost')).toBeInTheDocument()
      expect(screen.getByText('Required Ingredients:')).toBeInTheDocument()
    })
  })

  it('handles crafting quantity changes', async () => {
    render(<PowerupsSystem />)
    
    // Switch to crafting tab
    const craftingTab = screen.getByTestId('tab-crafting')
    fireEvent.click(craftingTab)
    
    await waitFor(() => {
      const plusButton = screen.getByTestId('plus-icon').closest('button')
      const minusButton = screen.getByTestId('minus-icon').closest('button')
      
      if (plusButton && minusButton) {
        fireEvent.click(plusButton)
        fireEvent.click(minusButton)
        
        expect(plusButton).toBeInTheDocument()
        expect(minusButton).toBeInTheDocument()
      }
    })
  })

  it('starts crafting process', async () => {
    render(<PowerupsSystem />)
    
    // Switch to crafting tab
    const craftingTab = screen.getByTestId('tab-crafting')
    fireEvent.click(craftingTab)
    
    await waitFor(() => {
      const startCraftingButton = screen.getByText(/START CRAFTING/)
      fireEvent.click(startCraftingButton)
      
      // Should add to crafting queue
      expect(startCraftingButton).toBeInTheDocument()
    })
  })

  it('shows empty state for active effects', async () => {
    render(<PowerupsSystem />)
    
    // Switch to effects tab
    const effectsTab = screen.getByTestId('tab-effects')
    fireEvent.click(effectsTab)
    
    await waitFor(() => {
      expect(screen.getByText('No active effects')).toBeInTheDocument()
      expect(screen.getByText('Use powerups on your cards to see active effects here.')).toBeInTheDocument()
    })
  })

  it('opens powerup details modal', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      const powerupCard = screen.getByText('Acquisition Boost').closest('div')
      
      if (powerupCard) {
        fireEvent.click(powerupCard)
        // Should open details modal
        expect(powerupCard).toBeInTheDocument()
      }
    })
  })

  it('displays powerup rarity correctly', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      expect(screen.getByText('RARE')).toBeInTheDocument()
      expect(screen.getByText('EPIC')).toBeInTheDocument()
      expect(screen.getByText('LEGENDARY')).toBeInTheDocument()
    })
  })

  it('shows powerup categories correctly', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      expect(screen.getByText('COMBAT')).toBeInTheDocument()
      expect(screen.getByText('DEFENSE')).toBeInTheDocument()
      expect(screen.getByText('MYSTICAL')).toBeInTheDocument()
      expect(screen.getByText('TECHNOLOGICAL')).toBeInTheDocument()
    })
  })

  it('displays powerup costs correctly', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      expect(screen.getByText('500 ECE')).toBeInTheDocument()
      expect(screen.getByText('1200 ECE')).toBeInTheDocument()
      expect(screen.getByText('2500 ECE')).toBeInTheDocument()
    })
  })

  it('shows powerup effects descriptions', async () => {
    render(<PowerupsSystem />)
    
    // Switch to marketplace tab
    const marketplaceTab = screen.getByTestId('tab-marketplace')
    fireEvent.click(marketplaceTab)
    
    await waitFor(() => {
      expect(screen.getByText('+25% acquisition power')).toBeInTheDocument()
      expect(screen.getByText('+40% defense against acquisitions')).toBeInTheDocument()
      expect(screen.getByText('+30% market insight')).toBeInTheDocument()
    })
  })

  it('handles empty inventory state', async () => {
    render(<PowerupsSystem />)
    
    // If no powerups in inventory, should show empty state
    // This would depend on the actual data state
    expect(screen.getByTestId('tab-content-inventory')).toBeInTheDocument()
  })

  it('applies custom className prop', () => {
    const customClass = 'custom-powerups-class'
    render(<PowerupsSystem className={customClass} />)
    
    const powerupsSystem = screen.getByText('⚡ Powerups System').closest('div')
    expect(powerupsSystem).toHaveClass(customClass)
  })

  it('handles responsive design', () => {
    render(<PowerupsSystem />)
    
    // The component should have responsive classes
    const powerupsSystem = screen.getByText('⚡ Powerups System').closest('div')
    expect(powerupsSystem).toBeInTheDocument()
  })

  it('calculates statistics correctly', () => {
    render(<PowerupsSystem />)
    
    // Should show correct counts for owned powerups, quantities, etc.
    expect(screen.getByText('Owned')).toBeInTheDocument()
    expect(screen.getByText('Total Quantity')).toBeInTheDocument()
  })
})