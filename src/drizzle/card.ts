import { cardDifficulties } from "@/data/cardDifficulties";
import { CardDifficulty } from "@/data/cardDifficulties";
import { DeckTable } from "@/drizzle/deck";
import { createdAt, updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

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
    phrase: text("phrase").notNull(),
    translation: text("translation").notNull(),
    category: text("category").notNull(),
    difficulty: DifficultyEnum("difficulty").notNull().default("again"),
    createdAt,
    updatedAt,
  },
  (t) => [index("cards.deck_id_index").on(t.deckId)]
);

export const cardRelations = relations(CardTable, ({ one }) => ({
  deck: one(DeckTable, {
    fields: [CardTable.deckId],
    references: [DeckTable.id],
  }),
}));
