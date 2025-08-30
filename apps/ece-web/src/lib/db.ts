// Thin re-export wrapper so `@/lib/db` resolves to the folder implementation at `lib/db/index.ts`.
// This ensures all utilities (e.g., SubscriptionUtils, mockDatabase) and the Prisma singleton
// are sourced from a single canonical module.

export * from './db/index'
export { default as db } from './db/index'
