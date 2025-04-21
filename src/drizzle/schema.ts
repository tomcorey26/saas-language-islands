import { cardDifficulties, CardDifficulty } from "@/data/cardDifficulties";
import { subscriptionTiers, TierNames } from "@/data/subscriptionTiers";
import {
  SupportedLanguageCode,
  supportedLanguages,
} from "@/data/supportedLanguages";
import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();

const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

// Define enums first
const DifficultyEnum = pgEnum(
  "difficulty",
  Object.keys(cardDifficulties) as [CardDifficulty]
);

const LanguageEnum = pgEnum(
  "language",
  Object.values(supportedLanguages).map((lang) => lang.languageCode) as [
    SupportedLanguageCode
  ]
);

const TierEnum = pgEnum("tier", Object.keys(subscriptionTiers) as [TierNames]);

// Then define tables
export const DeckTable = pgTable(
  "decks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    emoji: text("emoji").default("🏝️").notNull(),
    languages: LanguageEnum("languages").array().notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [index("decks.clerk_user_id_index").on(t.clerkUserId)]
);

export const deckRelations = relations(DeckTable, ({ many }) => ({
  cards: many(CardTable),
}));

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

export const UserSubscriptionTable = pgTable(
  "user_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    stripeSubscriptionItemId: text("stripe_subscription_item_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    tier: TierEnum("tier").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("user_subscriptions.clerk_user_id_index").on(table.clerkUserId),
    index("user_subscriptions.stripe_customer_id_index").on(
      table.stripeCustomerId
    ),
  ]
);
