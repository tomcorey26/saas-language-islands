import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function createDeck(data: typeof DeckTable.$inferInsert) {
  const [deck] = await db.insert(DeckTable).values(data).returning();

  return deck;
}

export async function getDeck(id: string) {
  const deck = await db.query.DeckTable.findFirst({
    where: eq(DeckTable.id, id),
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
