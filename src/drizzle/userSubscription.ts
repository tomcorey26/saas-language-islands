import { subscriptionTiers, TierNames } from "@/data/subscriptionTiers";
import { createdAt, id, updatedAt } from "@/drizzle/schemaHelpers";
import { pgTable, text, index, pgEnum } from "drizzle-orm/pg-core";

export const TierEnum = pgEnum(
  "tier",
  Object.keys(subscriptionTiers) as [TierNames]
);

export const UserSubscriptionTable = pgTable(
  "user_subscriptions",
  {
    id,
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
