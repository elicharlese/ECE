import React, { createContext, useContext, useState, useCallback } from 'react';

export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  params: Record<string, any>;
  history: string[];
}

interface NavigationContextType {
  state: NavigationState;
  navigate: (route: string, params?: Record<string, any>) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  replace: (route: string, params?: Record<string, any>) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

interface NavigationProviderProps {
  children: React.ReactNode;
  initialRoute?: string;
}

export function NavigationProvider({ children, initialRoute = 'home' }: NavigationProviderProps) {
  const [state, setState] = useState<NavigationState>({
    currentRoute: initialRoute,
    previousRoute: null,
    params: {},
    history: [initialRoute],
  });

  const navigate = useCallback((route: string, params: Record<string, any> = {}) => {
    setState(prev => ({
      currentRoute: route,
      previousRoute: prev.currentRoute,
      params,
      history: [...prev.history, route],
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      if (prev.history.length <= 1) return prev;
      
      const newHistory = [...prev.history];
      newHistory.pop(); // Remove current route
      const previousRoute = newHistory[newHistory.length - 1];
      
      return {
        currentRoute: previousRoute,
        previousRoute: prev.currentRoute,
        params: {},
        history: newHistory,
      };
    });
  }, []);

  const canGoBack = useCallback(() => {
    return state.history.length > 1;
  }, [state.history.length]);

  const replace = useCallback((route: string, params: Record<string, any> = {}) => {
    setState(prev => {
      const newHistory = [...prev.history];
      newHistory[newHistory.length - 1] = route;
      
      return {
        currentRoute: route,
        previousRoute: prev.previousRoute,
        params,
        history: newHistory,
      };
    });
  }, []);

  const value = {
    state,
    navigate,
    goBack,
    canGoBack,
    replace,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
