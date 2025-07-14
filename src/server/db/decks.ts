import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function getDeckWithCards(deckId: string) {
  const deck = await db.query.DeckTable.findFirst({
    where: eq(DeckTable.id, deckId),
    with: {
      cards: true,
      islands: {
        with: {
          cards: true,
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

  return rowCount > 0;
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

  return rowCount > 0;
}
