import { db } from "@/drizzle/db";
import { CardTable } from "@/drizzle/schema";
import { and, eq, lte, asc, desc, isNull, or, sql } from "drizzle-orm";
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
    memoryPalaceLocation?: string | null;
    visualImagery?: string | null;
    personalConnection?: string | null;
    easeFactor?: number | null;
    repetitions?: number | null;
    lastReviewedAt?: Date | null;
    nextReviewAt?: Date | null;
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

export async function getCardsForStudy(deckId: string, limit: number = 20) {
  const now = new Date();
  
  return await db.query.CardTable.findMany({
    where: eq(CardTable.deckId, deckId),
    orderBy: [
      // Priority 1: Cards that have never been reviewed (new cards)
      desc(sql`CASE WHEN ${CardTable.lastReviewedAt} IS NULL THEN 1 ELSE 0 END`),
      // Priority 2: Cards that are due for review (overdue first)
      desc(sql`CASE WHEN ${CardTable.nextReviewAt} <= ${now} THEN 1 ELSE 0 END`),
      // Priority 3: Within due cards, prioritize by how overdue they are
      asc(CardTable.nextReviewAt),
      // Priority 4: For new cards, order by creation (oldest first)
      asc(CardTable.createdAt),
    ],
    limit,
    with: {
      island: true,
    },
  });
}

export async function getStudyStats(deckId: string) {
  const now = new Date();
  
  const [stats] = await db
    .select({
      totalCards: sql<number>`COUNT(*)`,
      newCards: sql<number>`SUM(CASE WHEN ${CardTable.lastReviewedAt} IS NULL THEN 1 ELSE 0 END)`,
      dueCards: sql<number>`SUM(CASE WHEN ${CardTable.nextReviewAt} <= ${now} THEN 1 ELSE 0 END)`,
      learningCards: sql<number>`SUM(CASE WHEN ${CardTable.repetitions} > 0 AND ${CardTable.repetitions} < 3 THEN 1 ELSE 0 END)`,
    })
    .from(CardTable)
    .where(eq(CardTable.deckId, deckId));

  return stats;
}
