import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt } from "@/drizzle/schemaHelpers";
import { ConversationTable } from "@/drizzle/conversation";

export const MessageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);

export const MessageTable = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => ConversationTable.id, { onDelete: "cascade" }),
    role: MessageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    translation: text("translation"),
    hasError: boolean("has_error").default(false),
    tokenCount: integer("token_count").notNull().default(0),
    isInSummary: boolean("is_in_summary").default(false),
    createdAt,
  },
  (t) => [
    index("messages.conversation_id_index").on(t.conversationId),
    index("messages.created_at_index").on(t.createdAt),
  ]
);

export const messageRelations = relations(MessageTable, ({ one, many }) => ({
  conversation: one(ConversationTable, {
    fields: [MessageTable.conversationId],
    references: [ConversationTable.id],
  }),
  errors: many("conversation_errors" as any),
}));
