import { db } from "@/drizzle/db";
import { ConversationErrorTable } from "@/drizzle/conversationError";
import { eq } from "drizzle-orm";

// Save multiple conversation errors (bulk insert)
export async function saveConversationErrors(
  conversationId: string,
  messageId: string,
  errors: Array<{
    errorType: "grammar" | "vocabulary" | "pronunciation" | "context";
    errorText: string;
    correction: string;
    explanation: string;
    severity: "minor" | "moderate" | "major";
  }>
) {
  if (errors.length === 0) return;

  const errorRecords = errors.map((error) => ({
    conversationId,
    messageId,
    errorType: error.errorType,
    errorText: error.errorText,
    correction: error.correction,
    explanation: error.explanation,
    severity: error.severity,
  }));

  await db.insert(ConversationErrorTable).values(errorRecords);
}

// Get all errors for a conversation
export async function getConversationErrors(conversationId: string) {
  return db.query.ConversationErrorTable.findMany({
    where: eq(ConversationErrorTable.conversationId, conversationId),
  });
}

// Get errors for a specific message
export async function getMessageErrors(messageId: string) {
  return db.query.ConversationErrorTable.findMany({
    where: eq(ConversationErrorTable.messageId, messageId),
  });
}
