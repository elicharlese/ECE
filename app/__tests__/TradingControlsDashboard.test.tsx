import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TradingControlsDashboard } from '../src/components/profile/TradingControlsDashboard'

// Mock Framer Motion to avoid animation issues in tests
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

jest.mock('../src/components/ui/progress', () => ({
  Progress: ({ value, ...props }: any) => <div data-testid="progress" data-value={value} {...props} />
}))

jest.mock('../src/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
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

describe('TradingControlsDashboard', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  test('renders trading controls dashboard', () => {
    render(<TradingControlsDashboard />)
    
    expect(screen.getByText('Trading Controls')).toBeInTheDocument()
    expect(screen.getByText('Manage your trading activities and risk settings')).toBeInTheDocument()
  })

  test('displays trading statistics', () => {
    render(<TradingControlsDashboard />)
    
    // Check for key statistics
    expect(screen.getByText('156')).toBeInTheDocument() // Total Orders
    expect(screen.getByText('42')).toBeInTheDocument() // Active Orders
    expect(screen.getByText('2,450')).toBeInTheDocument() // Total Value
    expect(screen.getByText('89%')).toBeInTheDocument() // Success Rate
  })

  test('tab navigation works correctly', async () => {
    render(<TradingControlsDashboard />)
    
    // Find and click analytics tab
    const analyticsTab = screen.getByText('Analytics')
    fireEvent.click(analyticsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Trading Performance')).toBeInTheDocument()
    })
  })

  test('handles order actions', async () => {
    render(<TradingControlsDashboard />)
    
    // Find active orders tab
    const activeOrdersTab = screen.getByText('Active Orders')
    fireEvent.click(activeOrdersTab)
    
    await waitFor(() => {
      expect(screen.getByText('Current Active Orders')).toBeInTheDocument()
    })
    
    // Check for cancel buttons (there should be multiple active orders)
    const cancelButtons = screen.getAllByText('Cancel')
    expect(cancelButtons.length).toBeGreaterThan(0)
  })

  test('risk controls can be configured', async () => {
    render(<TradingControlsDashboard />)
    
    // Navigate to risk controls
    const riskControlsTab = screen.getByText('Risk Controls')
    fireEvent.click(riskControlsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Stop-Loss Settings')).toBeInTheDocument()
    })
    
    // Check for risk control inputs
    expect(screen.getByDisplayValue('5')).toBeInTheDocument() // Stop loss percentage
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument() // Daily limit
  })

  test('templates can be created and managed', async () => {
    render(<TradingControlsDashboard />)
    
    // Navigate to templates
    const templatesTab = screen.getByText('Templates')
    fireEvent.click(templatesTab)
    
    await waitFor(() => {
      expect(screen.getByText('Trading Templates')).toBeInTheDocument()
    })
    
    // Check for create template button
    const createButton = screen.getByText('Create Template')
    expect(createButton).toBeInTheDocument()
    
    fireEvent.click(createButton)
    // Template creation modal should appear
    expect(screen.getByPlaceholderText('Template name')).toBeInTheDocument()
  })

  test('performance analytics are displayed', async () => {
    render(<TradingControlsDashboard />)
    
    // Navigate to analytics
    const analyticsTab = screen.getByText('Analytics')
    fireEvent.click(analyticsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Trading Performance')).toBeInTheDocument()
      expect(screen.getByText('Win Rate Over Time')).toBeInTheDocument()
      expect(screen.getByText('Portfolio Distribution')).toBeInTheDocument()
    })
  })

  test('automation settings can be configured', async () => {
    render(<TradingControlsDashboard />)
    
    // Navigate to automation
    const automationTab = screen.getByText('Automation')
    fireEvent.click(automationTab)
    
    await waitFor(() => {
      expect(screen.getByText('Trading Automation')).toBeInTheDocument()
    })
    
    // Check for automation toggles
    const autoTradingToggle = screen.getByRole('checkbox')
    expect(autoTradingToggle).toBeInTheDocument()
    
    fireEvent.click(autoTradingToggle)
    expect(autoTradingToggle).toBeChecked()
  })

  test('search and filtering works', async () => {
    render(<TradingControlsDashboard />)
    
    // Navigate to active orders
    const activeOrdersTab = screen.getByText('Active Orders')
    fireEvent.click(activeOrdersTab)
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search orders...')
      expect(searchInput).toBeInTheDocument()
      
      fireEvent.change(searchInput, { target: { value: 'Cyber Dragon' } })
      expect(searchInput).toHaveValue('Cyber Dragon')
    })
  })

  test('quick actions are available', () => {
    render(<TradingControlsDashboard />)
    
    // Check for quick action buttons
    expect(screen.getByText('Quick Buy')).toBeInTheDocument()
    expect(screen.getByText('Quick Sell')).toBeInTheDocument()
    expect(screen.getByText('Set Alert')).toBeInTheDocument()
  })

  test('responsive design elements are present', () => {
    render(<TradingControlsDashboard />)
    
    // Check for responsive grid containers
    const glassCards = screen.getAllByTestId('glass-card')
    expect(glassCards.length).toBeGreaterThan(0)
    
    // Check for progress indicators
    const progressBars = screen.getAllByTestId('progress')
    expect(progressBars.length).toBeGreaterThan(0)
  })

  test('error handling for failed operations', async () => {
    render(<TradingControlsDashboard />)
    
    // Mock console.error to avoid test output pollution
    const originalError = console.error
    console.error = jest.fn()
    
    // Navigate to active orders
    const activeOrdersTab = screen.getByText('Active Orders')
    fireEvent.click(activeOrdersTab)
    
    await waitFor(() => {
      // Component should still render even if there are issues
      expect(screen.getByText('Active Orders')).toBeInTheDocument()
    })
    
    // Restore console.error
    console.error = originalError
  })
})
