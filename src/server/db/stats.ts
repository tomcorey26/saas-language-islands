import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { createCachedFunction, cacheConfig, cacheKeys } from "@/lib/cache";

// Internal stats function
async function getStatsInternal(clerkUserId: string) {
  const decks = await db.query.DeckTable.findMany({
    where: eq(DeckTable.clerkUserId, clerkUserId),
    with: {
      cards: true,
    },
  });

  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const totalMasteredCards = decks.reduce((sum, deck) => {
    return sum + deck.cards.filter((card) => card.difficulty === "easy").length;
  }, 0);

  return {
    totalCards,
    totalDecks: decks.length,
    totalMasteredCards,
  };
}

// React cache for deduplication within the same request
const getCachedStats = cache(async (clerkUserId: string) => {
  return getStatsInternal(clerkUserId);
});

// Next.js cache for persistence across requests
const getNextCachedStats = createCachedFunction(
  getStatsInternal,
  "user-stats",
  cacheConfig.stats
);

export async function getStats(clerkUserId: string) {
  // Use React cache for request deduplication and Next.js cache for persistence
  return getCachedStats(clerkUserId);
}
