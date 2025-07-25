import { createdAt, id } from "@/drizzle/schemaHelpers";
import { pgTable, text, integer, index } from "drizzle-orm/pg-core";

export const PurchasesTable = pgTable(
  "purchases",
  {
    id,
    clerkUserId: text("clerk_user_id").notNull(),
    tokensPurchased: integer("tokens_purchased").notNull(),
    amountPaidCents: integer("amount_paid_cents").notNull(),
    stripeSessionId: text("stripe_session_id").notNull().unique(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt,
  },
  (table) => [
    index("purchases.clerk_user_id_index").on(table.clerkUserId),
    index("purchases.stripe_session_id_index").on(table.stripeSessionId),
    index("purchases.stripe_customer_id_index").on(table.stripeCustomerId),
  ]
);
