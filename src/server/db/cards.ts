import { db } from "@/drizzle/db";
import { CardTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function createCard(card: typeof CardTable.$inferInsert) {
  await db.insert(CardTable).values(card);
}

export async function createCards(cards: (typeof CardTable.$inferInsert)[]) {
  await db.insert(CardTable).values(cards);
}

export async function updateCard(
  deckId: string,
  cardId: string,
  updates: { phrase?: string; translation?: string }
) {
  return await db
    .update(CardTable)
    .set(updates)
    .where(and(eq(CardTable.id, cardId), eq(CardTable.deckId, deckId)));
}

export async function deleteCardsByIsland(deckId: string, islandId: string) {
  return await db
    .delete(CardTable)
    .where(and(eq(CardTable.deckId, deckId), eq(CardTable.islandId, islandId)));
}

export async function deleteCardById(deckId: string, cardId: string) {
  return await db
    .delete(CardTable)
    .where(and(eq(CardTable.id, cardId), eq(CardTable.deckId, deckId)));
}
