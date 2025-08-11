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
    easeFactor: integer("ease_factor").default(250), // Stored as integer (2.50 * 100)
    repetitions: integer("repetitions").default(0),
    lastReviewedAt: integer("last_reviewed_at", { mode: "timestamp" }),
    nextReviewAt: integer("next_review_at", { mode: "timestamp" }),
    // Memory technique fields
    memoryPalaceLocation: varchar("memory_palace_location", { length: 1000 }),
    visualImagery: varchar("visual_imagery", { length: 1000 }),
    personalConnection: varchar("personal_connection", { length: 1000 }),
    createdAt,
    updatedAt,
  },
  (t) => [
    index("cards.deck_id_index").on(t.deckId),
    index("cards.next_review_at_index").on(t.nextReviewAt)
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
