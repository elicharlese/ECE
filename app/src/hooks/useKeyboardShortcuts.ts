'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts() {
  const router = useRouter()

  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        // Trigger search focus
        const searchInput = document.querySelector('[data-admin-search]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      },
      description: 'Open search'
    },
    {
      key: 'b',
      ctrlKey: true,
      action: () => {
        // Toggle sidebar
        const sidebar = document.querySelector('[data-sidebar]')
        if (sidebar) {
          const isCollapsed = sidebar.getAttribute('data-collapsed') === 'true'
          sidebar.setAttribute('data-collapsed', (!isCollapsed).toString())
        }
      },
      description: 'Toggle sidebar'
    },
    // Quick navigation with G prefix
    {
      key: 'd',
      action: () => router.push('/admin'),
      description: 'Go to dashboard (G + D)'
    },
    {
      key: 'u',
      action: () => router.push('/admin/users'),
      description: 'Go to users (G + U)'
    },
    {
      key: 'a',
      action: () => router.push('/admin/analytics'),
      description: 'Go to analytics (G + A)'
    },
    {
      key: 'n',
      action: () => router.push('/admin/notifications'),
      description: 'Go to notifications (G + N)'
    },
    {
      key: 's',
      action: () => router.push('/admin/settings'),
      description: 'Go to settings (G + S)'
    },
    {
      key: 'm',
      action: () => router.push('/admin/marketplace'),
      description: 'Go to marketplace (G + M)'
    },
    {
      key: 'o',
      action: () => router.push('/admin/orders'),
      description: 'Go to orders (G + O)'
    },
    // Utility shortcuts
    {
      key: 'r',
      action: () => window.location.reload(),
      description: 'Refresh page (R + R)'
    }
  ]

  const [isGPressed, setIsGPressed] = useState(false)
  const [isRPressed, setIsRPressed] = useState(false)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if we're in an input field
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      // Allow certain shortcuts even in input fields
      if (event.ctrlKey || event.altKey) {
        const shortcut = shortcuts.find(s => 
          s.key === event.key.toLowerCase() &&
          s.ctrlKey === event.ctrlKey &&
          s.altKey === event.altKey
        )
        if (shortcut) {
          event.preventDefault()
          shortcut.action()
        }
      }
      return
    }

    // Handle G prefix for navigation
    if (event.key.toLowerCase() === 'g' && !event.ctrlKey && !event.altKey && !event.shiftKey) {
      event.preventDefault()
      setIsGPressed(true)
      setTimeout(() => setIsGPressed(false), 2000) // Reset after 2 seconds
      return
    }

    // Handle R prefix for refresh
    if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.altKey && !event.shiftKey) {
      if (isRPressed) {
        // Second R pressed - trigger refresh
        event.preventDefault()
        shortcuts.find(s => s.key === 'r')?.action()
        setIsRPressed(false)
      } else {
        event.preventDefault()
        setIsRPressed(true)
        setTimeout(() => setIsRPressed(false), 2000) // Reset after 2 seconds
      }
      return
    }

    // Handle navigation shortcuts after G prefix
    if (isGPressed) {
      const navShortcut = shortcuts.find(s => 
        s.key === event.key.toLowerCase() && 
        !s.ctrlKey && 
        !s.altKey &&
        ['d', 'u', 'a', 'n', 's', 'm', 'o'].includes(s.key)
      )
      if (navShortcut) {
        event.preventDefault()
        navShortcut.action()
        setIsGPressed(false)
      }
      return
    }

    // Handle direct shortcuts
    const shortcut = shortcuts.find(s => 
      s.key === event.key.toLowerCase() &&
      s.ctrlKey === event.ctrlKey &&
      s.altKey === event.altKey &&
      s.shiftKey === event.shiftKey
    )

    if (shortcut) {
      event.preventDefault()
      shortcut.action()
    }
  }, [shortcuts, router, isGPressed, isRPressed])

  useEffect(() => {
    // Check if keyboard shortcuts are enabled
    const preferences = localStorage.getItem('admin-preferences')
    let shortcutsEnabled = true
    
    if (preferences) {
      try {
        const parsed = JSON.parse(preferences)
        shortcutsEnabled = parsed.enableKeyboardShortcuts !== false
      } catch (error) {
        console.error('Failed to parse admin preferences:', error)
      }
    }

    if (shortcutsEnabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    shortcuts: shortcuts.map(s => ({
      key: s.key,
      ctrlKey: s.ctrlKey,
      altKey: s.altKey,
      shiftKey: s.shiftKey,
      description: s.description
    })),
    isGPressed,
    isRPressed
  }
}

// Hook to show keyboard shortcut indicators
export function useShortcutIndicator() {
  const [showIndicator, setShowIndicator] = useState(false)
  const [indicatorText, setIndicatorText] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'g') {
        setIndicatorText('Press a key: D (Dashboard), U (Users), A (Analytics), N (Notifications), S (Settings), M (Marketplace), O (Orders)')
        setShowIndicator(true)
        setTimeout(() => setShowIndicator(false), 2000)
      } else if (event.key.toLowerCase() === 'r') {
        setIndicatorText('Press R again to refresh page')
        setShowIndicator(true)
        setTimeout(() => setShowIndicator(false), 2000)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { showIndicator, indicatorText }
}
