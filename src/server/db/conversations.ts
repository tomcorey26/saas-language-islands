import { db } from "@/drizzle/db";
import { ConversationTable } from "@/drizzle/conversation";
import { and, desc, eq, sql } from "drizzle-orm";

// Create a new conversation
export async function createConversation(
  data: typeof ConversationTable.$inferInsert
) {
  const [conversation] = await db
    .insert(ConversationTable)
    .values(data)
    .returning();
  return conversation;
}

// Get a single conversation with ownership check
export async function getConversation(id: string, clerkUserId: string) {
  return db.query.ConversationTable.findFirst({
    where: and(
      eq(ConversationTable.id, id),
      eq(ConversationTable.clerkUserId, clerkUserId)
    ),
  });
}

// Get user's conversations with pagination
export async function getUserConversations(
  clerkUserId: string,
  options: { limit?: number; offset?: number } = {}
) {
  const { limit = 20, offset = 0 } = options;

  return db.query.ConversationTable.findMany({
    where: eq(ConversationTable.clerkUserId, clerkUserId),
    orderBy: desc(ConversationTable.createdAt),
    limit,
    offset,
  });
}

// Update conversation status
export async function updateConversationStatus(
  id: string,
  status: "active" | "completed" | "abandoned"
) {
  await db
    .update(ConversationTable)
    .set({
      status,
      completedAt: status === "completed" ? new Date() : null,
    })
    .where(eq(ConversationTable.id, id));
}

// Update conversation summary (for Hybrid Summary Buffer)
export async function updateConversationSummary(
  conversationId: string,
  summary: string,
  tokenCount: number
) {
  await db
    .update(ConversationTable)
    .set({
      conversationSummary: summary,
      summaryTokenCount: tokenCount,
    })
    .where(eq(ConversationTable.id, conversationId));
}

// Increment conversation statistics (atomic operation)
export async function incrementConversationStats(
  conversationId: string,
  stats: { messages?: number; errors?: number }
) {
  const updates: Record<string, any> = {};

  if (stats.messages !== undefined && stats.messages > 0) {
    updates.totalMessages = sql`${ConversationTable.totalMessages} + ${stats.messages}`;
  }

  if (stats.errors !== undefined && stats.errors > 0) {
    updates.errorCount = sql`${ConversationTable.errorCount} + ${stats.errors}`;
  }

  if (Object.keys(updates).length > 0) {
    await db
      .update(ConversationTable)
      .set(updates)
      .where(eq(ConversationTable.id, conversationId));
  }
}

// Update the last analyzed message ID for a conversation
export async function updateLastAnalyzedMessageId(
  conversationId: string,
  clerkUserId: string,
  messageId: string
) {
  await db
    .update(ConversationTable)
    .set({ lastAnalyzedMessageId: messageId })
    .where(
      and(
        eq(ConversationTable.id, conversationId),
        eq(ConversationTable.clerkUserId, clerkUserId)
      )
    );
}
