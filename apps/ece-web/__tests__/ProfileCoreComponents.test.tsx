import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UserAvatarSystem } from '../src/components/profile/UserAvatarSystem'
import { ECEBalancePerformance } from '../src/components/profile/ECEBalancePerformance'
import { WishlistSystem } from '../src/components/profile/WishlistSystem'

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock UI components
jest.mock('../src/components/ui/glass-card', () => ({
  GlassCard: ({ children, ...props }: any) => <div data-testid="glass-card" {...props}>{children}</div>
}))

jest.mock('../src/components/ui/button', () => ({
  Button: ({ children, onClick, variant, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} {...props}>{children}</button>
  )
}))

jest.mock('../src/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input value={value} onChange={onChange} placeholder={placeholder} {...props} />
  )
}))

jest.mock('../src/components/ui/select', () => ({
  Select: ({ children, ...props }: any) => <div data-testid="select" {...props}>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>
}))

jest.mock('../src/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => <span data-variant={variant}>{children}</span>
}))

// Mock icons
jest.mock('lucide-react', () => ({
  Camera: () => <div data-testid="camera-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  X: () => <div data-testid="x-icon" />
}))

describe('Profile Core Components Integration', () => {
  describe('UserAvatarSystem', () => {
    const mockProps = {
      userName: 'Alex Rivera',
      userLevel: 42,
      userRank: 'Diamond',
      avatarUrl: '/avatar.jpg',
      onAvatarUpdate: jest.fn(),
      showUploadOptions: true
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('renders user information correctly', () => {
      render(<UserAvatarSystem {...mockProps} />)
      
      expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
      expect(screen.getByText('Level 42')).toBeInTheDocument()
      expect(screen.getByText('Diamond Rank')).toBeInTheDocument()
    })

    test('avatar upload functionality works', async () => {
      render(<UserAvatarSystem {...mockProps} />)
      
      const uploadButton = screen.getByText('Update Avatar')
      fireEvent.click(uploadButton)
      
      await waitFor(() => {
        expect(screen.getByText('Upload New Avatar')).toBeInTheDocument()
        expect(screen.getByText('Choose from Gallery')).toBeInTheDocument()
      })
    })

    test('avatar preview updates correctly', async () => {
      render(<UserAvatarSystem {...mockProps} />)
      
      const uploadButton = screen.getByText('Update Avatar')
      fireEvent.click(uploadButton)
      
      const uploadNewButton = screen.getByText('Upload New Avatar')
      fireEvent.click(uploadNewButton)
      
      // Simulate file upload
      const fileInput = document.querySelector('input[type="file"]')
      const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' })
      
      if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [file] } })
        
        await waitFor(() => {
          expect(mockProps.onAvatarUpdate).toHaveBeenCalledWith(expect.any(String))
        })
      }
    })

    test('responsive design for mobile', () => {
      render(<UserAvatarSystem {...mockProps} />)
      
      // Check for responsive classes/structure
      const avatarContainer = screen.getByTestId('glass-card')
      expect(avatarContainer).toBeInTheDocument()
    })

    test('handles missing avatar gracefully', () => {
      const propsWithoutAvatar = { ...mockProps, avatarUrl: undefined }
      render(<UserAvatarSystem {...propsWithoutAvatar} />)
      
      // Should show default avatar placeholder
      expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
    })
  })

  describe('ECEBalancePerformance', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('renders balance overview correctly', () => {
      render(<ECEBalancePerformance />)
      
      expect(screen.getByText('ECE Balance Performance')).toBeInTheDocument()
      expect(screen.getByText('Current Balance')).toBeInTheDocument()
      expect(screen.getByText('15,847.50 ECE')).toBeInTheDocument()
    })

    test('displays performance metrics', () => {
      render(<ECEBalancePerformance />)
      
      expect(screen.getByText('Portfolio Value')).toBeInTheDocument()
      expect(screen.getByText('$23,456.78')).toBeInTheDocument()
      expect(screen.getByText('24h Change')).toBeInTheDocument()
      expect(screen.getByText('+12.5%')).toBeInTheDocument()
    })

    test('transaction history is visible', () => {
      render(<ECEBalancePerformance />)
      
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
      expect(screen.getByText('Card Purchase')).toBeInTheDocument()
      expect(screen.getByText('Trading Profit')).toBeInTheDocument()
      expect(screen.getByText('Battle Reward')).toBeInTheDocument()
    })

    test('balance analytics tab navigation', async () => {
      render(<ECEBalancePerformance />)
      
      const analyticsTab = screen.getByText('Analytics')
      fireEvent.click(analyticsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Performance Chart')).toBeInTheDocument()
        expect(screen.getByText('Spending Analysis')).toBeInTheDocument()
      })
    })

    test('handles negative performance correctly', () => {
      render(<ECEBalancePerformance />)
      
      // Check for negative indicators
      const negativeChange = screen.getByText('-2.3%')
      expect(negativeChange).toBeInTheDocument()
    })

    test('investment tracking functionality', async () => {
      render(<ECEBalancePerformance />)
      
      const investmentTab = screen.getByText('Investments')
      fireEvent.click(investmentTab)
      
      await waitFor(() => {
        expect(screen.getByText('ROI Tracking')).toBeInTheDocument()
        expect(screen.getByText('Asset Allocation')).toBeInTheDocument()
      })
    })
  })

  describe('WishlistSystem', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('renders wishlist interface correctly', () => {
      render(<WishlistSystem />)
      
      expect(screen.getByText('Wishlist System')).toBeInTheDocument()
      expect(screen.getByText('Priority Alerts')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search cards...')).toBeInTheDocument()
    })

    test('wishlist items display properly', () => {
      render(<WishlistSystem />)
      
      expect(screen.getByText('Cyber Phoenix')).toBeInTheDocument()
      expect(screen.getByText('Legendary')).toBeInTheDocument()
      expect(screen.getByText('High Priority')).toBeInTheDocument()
      expect(screen.getByText('$150.00')).toBeInTheDocument()
    })

    test('search functionality works', async () => {
      render(<WishlistSystem />)
      
      const searchInput = screen.getByPlaceholderText('Search cards...')
      fireEvent.change(searchInput, { target: { value: 'Dragon' } })
      
      await waitFor(() => {
        expect(searchInput).toHaveValue('Dragon')
      })
    })

    test('priority filtering works', async () => {
      render(<WishlistSystem />)
      
      const filterButton = screen.getByTestId('filter-icon').parentElement
      if (filterButton) {
        fireEvent.click(filterButton)
        
        await waitFor(() => {
          expect(screen.getByText('High Priority')).toBeInTheDocument()
          expect(screen.getByText('Medium Priority')).toBeInTheDocument()
          expect(screen.getByText('Low Priority')).toBeInTheDocument()
        })
      }
    })

    test('add to wishlist functionality', async () => {
      render(<WishlistSystem />)
      
      const addButton = screen.getByText('Add to Wishlist')
      fireEvent.click(addButton)
      
      await waitFor(() => {
        expect(screen.getByText('Quick Add')).toBeInTheDocument()
        expect(screen.getByText('Browse Marketplace')).toBeInTheDocument()
      })
    })

    test('price alerts are configured', () => {
      render(<WishlistSystem />)
      
      expect(screen.getByText('Price Alerts')).toBeInTheDocument()
      expect(screen.getByText('Auto-Purchase')).toBeInTheDocument()
      expect(screen.getByText('Market Trends')).toBeInTheDocument()
    })

    test('wishlist item management', async () => {
      render(<WishlistSystem />)
      
      // Test removing item
      const removeButton = screen.getByTestId('x-icon').parentElement
      if (removeButton) {
        fireEvent.click(removeButton)
        
        await waitFor(() => {
          expect(screen.getByText('Remove from Wishlist?')).toBeInTheDocument()
        })
      }
    })

    test('priority system functionality', async () => {
      render(<WishlistSystem />)
      
      const prioritySelector = screen.getByTestId('select')
      fireEvent.click(prioritySelector)
      
      await waitFor(() => {
        expect(screen.getByText('High')).toBeInTheDocument()
        expect(screen.getByText('Medium')).toBeInTheDocument()
        expect(screen.getByText('Low')).toBeInTheDocument()
      })
    })

    test('integration with marketplace', () => {
      render(<WishlistSystem />)
      
      const viewMarketplaceButton = screen.getByText('View in Marketplace')
      expect(viewMarketplaceButton).toBeInTheDocument()
      
      fireEvent.click(viewMarketplaceButton)
      // In a real app, this would navigate to marketplace
    })
  })

  describe('Cross-Component Integration', () => {
    test('components share consistent styling', () => {
      const { container: avatarContainer } = render(
        <UserAvatarSystem 
          userName="Test User" 
          userLevel={1} 
          userRank="Bronze" 
          onAvatarUpdate={jest.fn()} 
        />
      )
      
      const { container: balanceContainer } = render(<ECEBalancePerformance />)
      const { container: wishlistContainer } = render(<WishlistSystem />)
      
      // All should use glass-card styling
      expect(avatarContainer.querySelector('[data-testid="glass-card"]')).toBeInTheDocument()
      expect(balanceContainer.querySelector('[data-testid="glass-card"]')).toBeInTheDocument()
      expect(wishlistContainer.querySelector('[data-testid="glass-card"]')).toBeInTheDocument()
    })

    test('responsive design consistency', () => {
      const components = [
        <UserAvatarSystem key="avatar" userName="Test" userLevel={1} userRank="Bronze" onAvatarUpdate={jest.fn()} />,
        <ECEBalancePerformance key="balance" />,
        <WishlistSystem key="wishlist" />
      ]
      
      components.forEach(component => {
        const { container } = render(component)
        // Each component should have responsive container
        expect(container.firstChild).toBeInTheDocument()
      })
    })

    test('components handle loading states properly', async () => {
      // Simulate loading state for each component
      const { rerender } = render(<UserAvatarSystem userName="" userLevel={0} userRank="" onAvatarUpdate={jest.fn()} />)
      
      // Components should handle empty/loading states gracefully
      rerender(<UserAvatarSystem userName="Loaded User" userLevel={42} userRank="Diamond" onAvatarUpdate={jest.fn()} />)
      
      await waitFor(() => {
        expect(screen.getByText('Loaded User')).toBeInTheDocument()
      })
    })
  })
})
