import { db } from "@/drizzle/db";
import { MessageTable } from "@/drizzle/message";
import { asc, desc, eq, inArray } from "drizzle-orm";

// Save a new message
export async function saveMessage(data: typeof MessageTable.$inferInsert) {
  const [message] = await db.insert(MessageTable).values(data).returning();
  return message;
}

// Get all messages for a conversation (ordered by creation time)
export async function getConversationMessages(conversationId: string) {
  return db.query.MessageTable.findMany({
    where: eq(MessageTable.conversationId, conversationId),
    orderBy: asc(MessageTable.createdAt),
  });
}

// Get recent messages (for Hybrid Summary Buffer)
export async function getRecentMessages(
  conversationId: string,
  limit: number = 10
) {
  return db.query.MessageTable.findMany({
    where: eq(MessageTable.conversationId, conversationId),
    orderBy: desc(MessageTable.createdAt),
    limit,
  });
}

// Mark messages as summarized
export async function markMessagesAsSummarized(messageIds: string[]) {
  if (messageIds.length === 0) return;

  await db
    .update(MessageTable)
    .set({ isInSummary: true })
    .where(inArray(MessageTable.id, messageIds));
}

// Get messages that haven't been summarized yet
export async function getUnsummarizedMessages(conversationId: string) {
  return db.query.MessageTable.findMany({
    where: eq(MessageTable.conversationId, conversationId),
    orderBy: asc(MessageTable.createdAt),
  });
}
