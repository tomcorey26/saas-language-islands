import { db } from "@/drizzle/db";
import { CardTable, DeckTable } from "@/drizzle/schema";
import { and, asc, eq, isNull, lte, or, sql } from "drizzle-orm";

export async function getDeckWithCards(deckId: string) {
  const deck = await db.query.DeckTable.findFirst({
    where: eq(DeckTable.id, deckId),
    with: {
      islands: {
        with: {
          cards: {
            orderBy: (cards, { asc }) => [asc(cards.position)],
          },
        },
      },
    },
  });

  return deck;
}

export async function createDeck(data: typeof DeckTable.$inferInsert) {
  const [deck] = await db.insert(DeckTable).values(data).returning();

  return deck;
}

export async function updateDeck(
  data: Partial<typeof DeckTable.$inferInsert>,
  { id, clerkUserId }: { id: string; clerkUserId: string }
) {
  const { rowCount } = await db
    .update(DeckTable)
    .set(data)
    .where(and(eq(DeckTable.id, id), eq(DeckTable.clerkUserId, clerkUserId)));

  return (rowCount ?? 0) > 0;
}

export async function getDeck(data: { id: string; clerkUserId: string }) {
  const deck = await db.query.DeckTable.findFirst({
    where: and(
      eq(DeckTable.id, data.id),
      eq(DeckTable.clerkUserId, data.clerkUserId)
    ),
  });

  return deck;
}

export async function getDecks(
  userId: string,
  { limit, offset }: { limit?: number; offset?: number } = {}
) {
  return db.query.DeckTable.findMany({
    where: eq(DeckTable.clerkUserId, userId),
    orderBy: (decks, { desc }) => [desc(decks.createdAt)],
    limit: limit,
    offset: offset ?? 0,
  });
}

export async function deleteDeck(data: { id: string; clerkUserId: string }) {
  const { rowCount } = await db
    .delete(DeckTable)
    .where(
      and(
        eq(DeckTable.id, data.id),
        eq(DeckTable.clerkUserId, data.clerkUserId)
      )
    );

  return (rowCount ?? 0) > 0;
}

/**
 * Get cards due for review in a deck
 * Returns up to `limit` cards, prioritizing:
 * 1. New cards (nextReviewDate = null)
 * 2. Overdue cards, most overdue first
 */
export async function getDueCards(deckId: string, limit: number = 20) {
  const now = new Date();

  // Get new cards (nextReviewDate is null) and due cards
  const cards = await db
    .select()
    .from(CardTable)
    .where(
      and(
        eq(CardTable.deckId, deckId),
        or(isNull(CardTable.nextReviewDate), lte(CardTable.nextReviewDate, now))
      )
    )
    .orderBy(
      // New cards first (nulls first), then by how overdue
      asc(sql`CASE WHEN ${CardTable.nextReviewDate} IS NULL THEN 0 ELSE 1 END`),
      asc(CardTable.nextReviewDate)
    )
    .limit(limit);

  return cards;
}
