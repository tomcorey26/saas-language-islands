import { unstable_cache } from "next/cache";

// Cache configuration for database queries
export const cacheConfig = {
  // Cache for 5 minutes for stats and deck lists
  stats: { revalidate: 300, tags: ["stats"] },
  decks: { revalidate: 300, tags: ["decks"] },
  deckDetails: { revalidate: 600, tags: ["deck-details"] }, // 10 minutes for deck details
} as const;

// Utility to create cached functions with proper typing
export function createCachedFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix: string,
  options?: { revalidate?: number; tags?: string[] }
) {
  return unstable_cache(fn, [keyPrefix], options);
}

// Cache invalidation helpers
export const cacheKeys = {
  stats: (userId: string) => `stats-${userId}`,
  decks: (userId: string, limit?: number, offset?: number) => 
    `decks-${userId}-${limit || 'all'}-${offset || 0}`,
  deckDetails: (deckId: string) => `deck-${deckId}`,
} as const;