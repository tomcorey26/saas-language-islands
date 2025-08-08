import { supportedLanguageCodes } from "@/data/supportedLanguages";
import { CardTable } from "@/drizzle/card";
import { IslandTable } from "@/drizzle/island";
import { createdAt, id, updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";
import { pgTable, text, index, pgEnum } from "drizzle-orm/pg-core";

export const LanguageEnum = pgEnum("language", supportedLanguageCodes);
export const DeckTable = pgTable(
  "decks",
  {
    id,
    clerkUserId: text("clerk_user_id").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    emoji: text("emoji").default("🏝️").notNull(),
    language: LanguageEnum("language").notNull(),
    // TODO: support multiple languages
    createdAt,
    updatedAt,
  },
  (t) => [index("decks.clerk_user_id_index").on(t.clerkUserId)]
);

export const deckRelations = relations(DeckTable, ({ many }) => ({
  cards: many(CardTable),
  islands: many(IslandTable),
}));
