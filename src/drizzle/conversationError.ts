import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "@/drizzle/schemaHelpers";
import { ConversationTable } from "@/drizzle/conversation";
import { MessageTable } from "@/drizzle/message";

export const ErrorTypeEnum = pgEnum("error_type", [
  "grammar",
  "vocabulary",
  "pronunciation",
  "context",
]);

export const ErrorSeverityEnum = pgEnum("error_severity", [
  "minor",
  "moderate",
  "major",
]);

export const ConversationErrorTable = pgTable(
  "conversation_errors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => ConversationTable.id, { onDelete: "cascade" }),
    messageId: uuid("message_id")
      .notNull()
      .references(() => MessageTable.id, { onDelete: "cascade" }),
    errorType: ErrorTypeEnum("error_type").notNull(),
    errorText: text("error_text").notNull(),
    correction: text("correction").notNull(),
    explanation: text("explanation").notNull(),
    severity: ErrorSeverityEnum("severity").notNull(),
    createdAt,
  },
  (t) => [index("conversation_errors.conversation_id_index").on(t.conversationId)]
);

export const conversationErrorRelations = relations(
  ConversationErrorTable,
  ({ one }) => ({
    conversation: one(ConversationTable, {
      fields: [ConversationErrorTable.conversationId],
      references: [ConversationTable.id],
    }),
    message: one(MessageTable, {
      fields: [ConversationErrorTable.messageId],
      references: [MessageTable.id],
    }),
  })
);
