import { db } from "@/drizzle/db";
import { CardTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { CardDifficulty } from "@/data/cardDifficulties";

export async function getCardWithDeck(cardId: string) {
  return await db.query.CardTable.findFirst({
    where: eq(CardTable.id, cardId),
    with: {
      deck: true,
    },
  });
}

export async function createCard(card: typeof CardTable.$inferInsert) {
  await db.insert(CardTable).values(card);
}

export async function createCards(cards: (typeof CardTable.$inferInsert)[]) {
  await db.insert(CardTable).values(cards);
}

export async function updateCard(
  cardId: string,
  updates: {
    phrase?: string;
    translation?: string;
    difficulty?: CardDifficulty;
  }
) {
  return await db
    .update(CardTable)
    .set(updates)
    .where(eq(CardTable.id, cardId));
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
