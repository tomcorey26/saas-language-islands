import { createdAt, id, updatedAt } from "@/drizzle/schemaHelpers";
import { pgTable, text, index, integer } from "drizzle-orm/pg-core";
import { LanguageEnum } from "@/drizzle/deck";

export const UserTable = pgTable(
  "users",
  {
    id,
    clerkUserId: text("clerk_user_id").notNull().unique(),
    tokensBalance: integer("tokens_balance").notNull().default(10000),
    baseLanguage: LanguageEnum("base_language"), // null = needs onboarding
    createdAt,
    updatedAt,
  },
  (table) => [index("users.clerk_user_id_index").on(table.clerkUserId)]
);
