import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getStats(clerkUserId: string) {
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
