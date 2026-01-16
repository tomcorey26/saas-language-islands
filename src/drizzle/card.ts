import { cardDifficulties } from "@/data/cardDifficulties";
import { CardDifficulty } from "@/data/cardDifficulties";
import { DeckTable } from "@/drizzle/deck";
import { IslandTable } from "@/drizzle/island";
import { createdAt, updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const DifficultyEnum = pgEnum(
  "difficulty",
  Object.keys(cardDifficulties) as [CardDifficulty]
);

export const CardTable = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deckId: uuid("deck_id")
      .notNull()
      .references(() => DeckTable.id, { onDelete: "cascade" }),
    islandId: uuid("island_id")
      .notNull()
      .references(() => IslandTable.id, { onDelete: "cascade" }),
    phrase: varchar("phrase", { length: 500 }).notNull(),
    translation: varchar("translation", { length: 500 }).notNull(),
    difficulty: DifficultyEnum("difficulty").notNull().default("again"),
    position: integer("position").notNull(),
    // Spaced repetition fields
    nextReviewDate: timestamp("next_review_date", { withTimezone: true }), // null = new card
    interval: integer("interval").notNull().default(0), // days
    reviewCount: integer("review_count").notNull().default(0),
    easeFactor: integer("ease_factor").notNull().default(250), // SM-2 factor × 100
    createdAt,
    updatedAt,
  },
  (t) => [
    index("cards.deck_id_index").on(t.deckId),
    index("cards.deck_id_next_review_index").on(t.deckId, t.nextReviewDate),
  ]
);

export const cardRelations = relations(CardTable, ({ one }) => ({
  deck: one(DeckTable, {
    fields: [CardTable.deckId],
    references: [DeckTable.id],
  }),
  island: one(IslandTable, {
    fields: [CardTable.islandId],
    references: [IslandTable.id],
  }),
}));
