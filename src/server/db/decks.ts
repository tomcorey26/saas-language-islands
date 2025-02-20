import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";

export async function createDeck({
  name,
  clerkUserId,
}: typeof DeckTable.$inferInsert) {
  const [deck] = await db
    .insert(DeckTable)
    .values({
      name,
      clerkUserId,
    })
    .returning();

  return deck;
}
