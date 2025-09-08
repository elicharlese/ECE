export function sharedTypes(): string {
  return 'shared-types';
}

// Trading Card Types
export interface CardSummary {
  id: string;
  name: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  price: number;
  category: string;
  valuation?: number;
}
