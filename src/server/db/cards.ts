import { db } from "@/drizzle/db";
import { CardTable } from "@/drizzle/schema";

export async function createCard(card: typeof CardTable.$inferInsert) {
  await db.insert(CardTable).values(card);
}

export async function createCards(cards: (typeof CardTable.$inferInsert)[]) {
  await db.insert(CardTable).values(cards);
}
