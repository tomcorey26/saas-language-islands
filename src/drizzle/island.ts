import { CardTable } from "@/drizzle/card";
import { DeckTable } from "@/drizzle/deck";
import { createdAt, id, updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

// TODO: show prompt in the UI
export const IslandTable = pgTable("islands", {
  id,
  name: text("name").notNull(),
  prompt: text("prompt").notNull(),
  deckId: uuid("deck_id")
    .notNull()
    .references(() => DeckTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const islandRelations = relations(IslandTable, ({ one, many }) => ({
  deck: one(DeckTable, {
    fields: [IslandTable.deckId],
    references: [DeckTable.id],
  }),
  cards: many(CardTable),
}));
