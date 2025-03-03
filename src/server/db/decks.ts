import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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
