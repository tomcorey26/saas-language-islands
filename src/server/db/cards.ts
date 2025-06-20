import { db } from "@/drizzle/db";
import { CardTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function createCard(card: typeof CardTable.$inferInsert) {
  await db.insert(CardTable).values(card);
}

export async function createCards(cards: (typeof CardTable.$inferInsert)[]) {
  await db.insert(CardTable).values(cards);
}

export async function deleteCardsByCategory(deckId: string, category: string) {
  return await db
    .delete(CardTable)
    .where(and(eq(CardTable.deckId, deckId), eq(CardTable.category, category)));
}

export async function deleteCardById(deckId: string, cardId: string) {
  return await db
    .delete(CardTable)
    .where(and(eq(CardTable.id, cardId), eq(CardTable.deckId, deckId)));
}
