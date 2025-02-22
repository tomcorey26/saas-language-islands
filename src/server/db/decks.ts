import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";

export async function createDeck({
  name,
  clerkUserId,
  description,
  imageUrl,
  languages,
}: typeof DeckTable.$inferInsert) {
  const [deck] = await db
    .insert(DeckTable)
    .values({
      name,
      clerkUserId,
      description,
      imageUrl,
      languages,
    })
    .returning();

  return deck;
}
