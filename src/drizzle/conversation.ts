import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "@/drizzle/schemaHelpers";
import { UserTable } from "@/drizzle/user";

export const ConversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "completed",
  "abandoned",
]);

export const ConversationTable = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id")
      .notNull()
      .references(() => UserTable.clerkUserId, { onDelete: "cascade" }),
    customPrompt: text("custom_prompt").notNull(),
    targetLanguage: text("target_language"),
    status: ConversationStatusEnum("status").notNull().default("active"),
    tokensCharged: integer("tokens_charged").notNull().default(5),
    totalMessages: integer("total_messages").notNull().default(0),
    errorCount: integer("error_count").notNull().default(0),
    conversationSummary: text("conversation_summary"),
    summaryTokenCount: integer("summary_token_count").default(0),
    lastAnalyzedMessageId: uuid("last_analyzed_message_id"),
    createdAt,
    updatedAt,
    completedAt: timestamp("completed_at"),
  },
  (t) => [
    index("conversations.clerk_user_id_index").on(t.clerkUserId),
    index("conversations.status_index").on(t.status),
  ]
);

export const conversationRelations = relations(ConversationTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [ConversationTable.clerkUserId],
    references: [UserTable.clerkUserId],
  }),
  // Forward references - will be defined in message.ts and conversationError.ts
  messages: many("messages" as any),
  errors: many("conversation_errors" as any),
}));
