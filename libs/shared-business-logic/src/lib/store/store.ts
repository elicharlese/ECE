import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Simple, working store interface
interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  holdings: any[];
}

interface UIState {
  currentScreen: string;
  isLoading: boolean;
  error: string | null;
  notifications: any[];
  toast: any;
}

interface ECEState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Portfolio state
  portfolios: Portfolio[];
  activePortfolio: Portfolio | null;
  
  // UI state
  ui: UIState;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentScreen: (screen: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  createPortfolio: (name: string) => Promise<void>;
  loadPortfolios: () => Promise<void>;
  setActivePortfolio: (portfolio: Portfolio | null) => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  portfolios: [],
  activePortfolio: null,
  ui: {
    currentScreen: 'dashboard',
    isLoading: false,
    error: null,
    notifications: [],
    toast: null,
  },
};

export const useECEStore = create<ECEState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // User Actions
        setUser: (user: User | null) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        login: async (email: string, password: string) => {
          set((state) => {
            state.ui.isLoading = true;
            state.ui.error = null;
          });

          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockUser: User = {
              id: '1',
              email,
              name: 'John Doe',
              preferences: {
                theme: 'dark',
                notifications: true,
                language: 'en',
              },
            };

            set((state) => {
              state.user = mockUser;
              state.isAuthenticated = true;
              state.ui.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.ui.error = 'Login failed';
              state.ui.isLoading = false;
            });
          }
        },

        logout: () =>
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.portfolios = [];
            state.activePortfolio = null;
          }),

        // UI Actions
        setCurrentScreen: (screen: string) =>
          set((state) => {
            state.ui.currentScreen = screen;
          }),

        setLoading: (loading: boolean) =>
          set((state) => {
            state.ui.isLoading = loading;
          }),

        setError: (error: string | null) =>
          set((state) => {
            state.ui.error = error;
          }),

        // Portfolio Actions
        createPortfolio: async (name: string) => {
          set((state) => {
            state.ui.isLoading = true;
          });

          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const newPortfolio: Portfolio = {
              id: Date.now().toString(),
              name,
              totalValue: 0,
              holdings: [],
            };

            set((state) => {
              state.portfolios.push(newPortfolio);
              state.ui.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.ui.error = 'Failed to create portfolio';
              state.ui.isLoading = false;
            });
          }
        },

        loadPortfolios: async () => {
          set((state) => {
            state.ui.isLoading = true;
          });

          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockPortfolios: Portfolio[] = [
              {
                id: '1',
                name: 'Main Portfolio',
                totalValue: 28450,
                holdings: [],
              },
              {
                id: '2',
                name: 'Growth Portfolio',
                totalValue: 15200,
                holdings: [],
              },
            ];

            set((state) => {
              state.portfolios = mockPortfolios;
              state.activePortfolio = mockPortfolios[0];
              state.ui.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.ui.error = 'Failed to load portfolios';
              state.ui.isLoading = false;
            });
          }
        },

        setActivePortfolio: (portfolio: Portfolio | null) =>
          set((state) => {
            state.activePortfolio = portfolio;
          }),

        // Notification Actions
        addNotification: (notification: any) =>
          set((state) => {
            const newNotification = {
              ...notification,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            };
            state.ui.notifications.unshift(newNotification);
          }),

        removeNotification: (id: string) =>
          set((state) => {
            state.ui.notifications = state.ui.notifications.filter(
              (n: any) => n.id !== id
            );
          }),
      })),
      {
        name: 'ece-store',
        partialize: (state) => ({
          user: state.user,
          portfolios: state.portfolios,
          activePortfolio: state.activePortfolio,
          ui: {
            currentScreen: state.ui.currentScreen,
          },
        }),
      }
    )
  )
);

export type { ECEState, User, Portfolio };
