import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";

export async function createDeck(data: typeof DeckTable.$inferInsert) {
  const [deck] = await db.insert(DeckTable).values(data).returning();

  return deck;
}
