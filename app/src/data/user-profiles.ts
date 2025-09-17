// User Profiles Data for ECE Trading Cards
// This file defines mock user profiles and their associated app cards

import { GitHubRepoCard, ELICHARLESE_REPO_CARDS } from './github-repo-cards'

export interface UserProfile {
  id: string
  email: string
  password: string
  displayName: string
  avatarUrl?: string
  cards: GitHubRepoCard[]
  connectedProviders: string[] // e.g., ['github', 'gitlab', 'aws', 'azure']
}

export const USER_PROFILES: UserProfile[] = [
  {
    id: 'elicharlese-001',
    email: 'elicharles.e@gmail.com',
    password: 'admin',
    displayName: 'Eli Charles',
    avatarUrl: undefined,
    cards: ELICHARLESE_REPO_CARDS, // Assign all 48 repo cards
    connectedProviders: ['github', 'gitlab', 'aws', 'azure']
  }
]

// Helper to get user by email
export const getUserByEmail = (email: string) => USER_PROFILES.find(u => u.email === email)

// Helper to add a card to a user
export const addCardToUser = (email: string, card: GitHubRepoCard) => {
  const user = getUserByEmail(email)
  if (user && !user.cards.find(c => c.id === card.id)) {
    user.cards.push(card)
  }
}

// Helper to connect a provider
export const connectProviderToUser = (email: string, provider: string) => {
  const user = getUserByEmail(email)
  if (user && !user.connectedProviders.includes(provider)) {
    user.connectedProviders.push(provider)
  }
}
