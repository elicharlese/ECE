import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BattleArenaSystem } from '../src/components/profile/BattleArenaSystem'

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

jest.mock('../src/components/ui/progress', () => ({
  Progress: ({ value, ...props }: any) => <div data-testid="progress" data-value={value} {...props} />
}))

jest.mock('../src/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
}))

describe('BattleArenaSystem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders battle arena system', () => {
    render(<BattleArenaSystem />)
    
    expect(screen.getByText('Battle Arena')).toBeInTheDocument()
    expect(screen.getByText('Engage in strategic card battles and tournaments')).toBeInTheDocument()
  })

  test('displays battle statistics', () => {
    render(<BattleArenaSystem />)
    
    // Check for battle stats
    expect(screen.getByText('89')).toBeInTheDocument() // Total Battles
    expect(screen.getByText('3')).toBeInTheDocument() // Active Battles
    expect(screen.getByText('67')).toBeInTheDocument() // Battles Won
    expect(screen.getByText('75.3%')).toBeInTheDocument() // Win Rate
  })

  test('battle tab navigation works', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to active battles
    const activeBattlesTab = screen.getByText('Active Battles')
    fireEvent.click(activeBattlesTab)
    
    await waitFor(() => {
      expect(screen.getByText('Current Active Battles')).toBeInTheDocument()
    })
  })

  test('can join a battle', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to matchmaking
    const matchmakingTab = screen.getByText('Matchmaking')
    fireEvent.click(matchmakingTab)
    
    await waitFor(() => {
      expect(screen.getByText('Find Opponents')).toBeInTheDocument()
    })
    
    // Find join battle button
    const joinButtons = screen.getAllByText('Join Battle')
    expect(joinButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(joinButtons[0])
    // Should show battle confirmation or start battle
  })

  test('tournament system is accessible', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to tournaments
    const tournamentsTab = screen.getByText('Tournaments')
    fireEvent.click(tournamentsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Active Tournaments')).toBeInTheDocument()
    })
    
    // Check for tournament entries
    expect(screen.getByText('Summer Championship')).toBeInTheDocument()
    expect(screen.getByText('Weekly Blitz')).toBeInTheDocument()
  })

  test('battle history is displayed', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to history
    const historyTab = screen.getByText('Battle History')
    fireEvent.click(historyTab)
    
    await waitFor(() => {
      expect(screen.getByText('Recent Battles')).toBeInTheDocument()
    })
    
    // Check for battle results
    expect(screen.getByText('vs CardMaster_Pro')).toBeInTheDocument()
    expect(screen.getByText('Victory')).toBeInTheDocument()
  })

  test('analytics show performance metrics', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to analytics
    const analyticsTab = screen.getByText('Analytics')
    fireEvent.click(analyticsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Battle Performance')).toBeInTheDocument()
      expect(screen.getByText('Win Rate by Card Type')).toBeInTheDocument()
      expect(screen.getByText('Battle Duration Trends')).toBeInTheDocument()
    })
  })

  test('can create custom battle', async () => {
    render(<BattleArenaSystem />)
    
    // Look for create battle button
    const createBattleButton = screen.getByText('Create Battle')
    fireEvent.click(createBattleButton)
    
    await waitFor(() => {
      expect(screen.getByText('Battle Setup')).toBeInTheDocument()
    })
    
    // Check for battle configuration options
    expect(screen.getByPlaceholderText('Battle name')).toBeInTheDocument()
    expect(screen.getByText('Battle Rules')).toBeInTheDocument()
  })

  test('matchmaking filters work', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to matchmaking
    const matchmakingTab = screen.getByText('Matchmaking')
    fireEvent.click(matchmakingTab)
    
    await waitFor(() => {
      // Check for filter options
      expect(screen.getByText('Skill Level')).toBeInTheDocument()
      expect(screen.getByText('Battle Type')).toBeInTheDocument()
    })
    
    // Test filter interaction
    const skillLevelFilter = screen.getByText('Intermediate')
    fireEvent.click(skillLevelFilter)
  })

  test('battle rewards are displayed', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to tournaments or active battles
    const tournamentsTab = screen.getByText('Tournaments')
    fireEvent.click(tournamentsTab)
    
    await waitFor(() => {
      // Check for reward information
      expect(screen.getByText('1,500 ECE')).toBeInTheDocument() // Prize pool
      expect(screen.getByText('Rare Card Pack')).toBeInTheDocument() // Reward
    })
  })

  test('spectator mode is available', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to active battles
    const activeBattlesTab = screen.getByText('Active Battles')
    fireEvent.click(activeBattlesTab)
    
    await waitFor(() => {
      // Look for spectate options
      const spectateButtons = screen.getAllByText('Spectate')
      expect(spectateButtons.length).toBeGreaterThan(0)
      
      fireEvent.click(spectateButtons[0])
      // Should show battle viewer
    })
  })

  test('deck builder integration', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to deck builder
    const deckBuilderTab = screen.getByText('Deck Builder')
    fireEvent.click(deckBuilderTab)
    
    await waitFor(() => {
      expect(screen.getByText('Battle Deck Configuration')).toBeInTheDocument()
      expect(screen.getByText('Card Collection')).toBeInTheDocument()
    })
    
    // Check for deck management
    expect(screen.getByText('Save Deck')).toBeInTheDocument()
    expect(screen.getByText('Load Preset')).toBeInTheDocument()
  })

  test('real-time battle updates', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to active battles
    const activeBattlesTab = screen.getByText('Active Battles')
    fireEvent.click(activeBattlesTab)
    
    await waitFor(() => {
      // Check for live battle status indicators
      const progressBars = screen.getAllByTestId('progress')
      expect(progressBars.length).toBeGreaterThan(0)
      
      // Check for turn indicators
      expect(screen.getByText('Your Turn')).toBeInTheDocument()
    })
  })

  test('battle settings can be configured', async () => {
    render(<BattleArenaSystem />)
    
    // Navigate to settings
    const settingsTab = screen.getByText('Settings')
    fireEvent.click(settingsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Battle Preferences')).toBeInTheDocument()
      expect(screen.getByText('Notification Settings')).toBeInTheDocument()
    })
    
    // Check for auto-accept settings
    expect(screen.getByText('Auto-accept battles')).toBeInTheDocument()
    expect(screen.getByText('Battle invitations')).toBeInTheDocument()
  })
})
