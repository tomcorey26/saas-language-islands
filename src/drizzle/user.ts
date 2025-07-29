import { createdAt, id, updatedAt } from "@/drizzle/schemaHelpers";
import { pgTable, text, index, integer } from "drizzle-orm/pg-core";

export const UserTable = pgTable(
  "users",
  {
    id,
    clerkUserId: text("clerk_user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id"),
    tokensBalance: integer("tokens_balance").default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("users.clerk_user_id_index").on(table.clerkUserId),
    index("users.stripe_customer_id_index").on(table.stripeCustomerId),
  ]
);
