'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Also apply class for Tailwind dark mode support
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme colors object for easy access
export const themeColors = {
  light: {
    primary: "#FAFAFA", // Light background
    secondary: "#f1f5f9", // Light gray card backgrounds
    accent: "#0e5f59", // Primary accent - teal
    text: "#64748b", // Slate gray text
    textPrimary: "#1e293b", // Dark slate primary text
    border: "#e2e8f0", // Light borders
    card: "#ffffff", // White cards
    input: "#ffffff", // White inputs
  },
  dark: {
    primary: "#334155", // Dark slate background
    secondary: "#475569", // Dark card backgrounds
    accent: "#0e5f59", // Primary accent - teal (consistent)
    text: "#94a3b8", // Light slate text
    textPrimary: "#f1f5f9", // Light primary text
    border: "#64748b", // Dark borders
    card: "#475569", // Dark cards
    input: "#475569", // Dark inputs
  }
};
