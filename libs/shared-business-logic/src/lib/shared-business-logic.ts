import { create } from 'zustand';
import type { User, Portfolio, Card } from '@ece-platform/shared-types';

// ECE Store State Interface
interface ECEStoreState {
  user: User | null;
  portfolios: Portfolio[];
  activePortfolio: Portfolio | null;
  cards: Card[];
  isLoading: boolean;
  error: string | null;
}

// ECE Store Actions Interface
interface ECEStoreActions {
  setUser: (user: User | null) => void;
  loadPortfolios: () => Promise<void>;
  setActivePortfolio: (portfolio: Portfolio | null) => void;
  createPortfolio: (name: string) => Promise<Portfolio>;
  loadCards: () => Promise<void>;
  addCard: (card: Card) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Combined ECE Store Type
export type ECEStore = ECEStoreState & ECEStoreActions;

// ECE Store Implementation
export const useECEStore = create<ECEStore>((set, get) => ({
  // Initial State
  user: null,
  portfolios: [],
  activePortfolio: null,
  cards: [],
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),

  loadPortfolios: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to load portfolios
      const mockPortfolios: Portfolio[] = [
        {
          id: '1',
          name: 'Default Portfolio',
          userId: get().user?.id || '',
          totalValue: 0,
          cards: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      set({ portfolios: mockPortfolios, activePortfolio: mockPortfolios[0] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load portfolios' });
    } finally {
      set({ isLoading: false });
    }
  },

  setActivePortfolio: (portfolio) => set({ activePortfolio: portfolio }),

  createPortfolio: async (name) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to create portfolio
      const newPortfolio: Portfolio = {
        id: Date.now().toString(),
        name,
        userId: get().user?.id || '',
        totalValue: 0,
        cards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const portfolios = [...get().portfolios, newPortfolio];
      set({ portfolios, activePortfolio: newPortfolio });
      return newPortfolio;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create portfolio';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  loadCards: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to load cards
      const mockCards: Card[] = [];
      set({ cards: mockCards });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load cards' });
    } finally {
      set({ isLoading: false });
    }
  },

  addCard: (card) => {
    const cards = [...get().cards, card];
    set({ cards });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export function sharedBusinessLogic(): string {
  return 'shared-business-logic';
}
