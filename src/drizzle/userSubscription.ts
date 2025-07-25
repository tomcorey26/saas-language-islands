import { paymentTiers, TierNames } from "@/data/paymentTiers";
import { createdAt, id, updatedAt } from "@/drizzle/schemaHelpers";
import { pgTable, text, index, pgEnum, integer } from "drizzle-orm/pg-core";

export const TierEnum = pgEnum(
  "tier",
  Object.keys(paymentTiers) as [TierNames]
);

export const UserSubscriptionTable = pgTable(
  "user_subscriptions",
  {
    id,
    clerkUserId: text("clerk_user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id"),
    tokensBalance: integer("tokens_balance").default(0),
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
