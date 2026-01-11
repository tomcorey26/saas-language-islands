import { auth } from "@clerk/nextjs/server";
import { startConversationRequestSchema } from "@/zod/contracts/conversation.schema";
import { getUser } from "@/server/db/users";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/user";
import { ConversationTable } from "@/drizzle/conversation";
import { MessageTable } from "@/drizzle/message";
import { eq, sql, and, gte } from "drizzle-orm";

const CONVERSATION_COST = 5;

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse and validate request
    const body = await req.json();
    const { customPrompt, targetLanguage } =
      startConversationRequestSchema.parse(body);

    // Check user has enough tokens (pre-check for better UX)
    const user = await getUser(userId);
    if (!user || (user.tokensBalance ?? 0) < CONVERSATION_COST) {
      return new Response(
        `Insufficient tokens. You need ${CONVERSATION_COST} tokens but only have ${user?.tokensBalance ?? 0}.`,
        { status: 402 }
      );
    }

    // Generate conversation ID upfront for use in transaction
    const conversationId = crypto.randomUUID();

    const systemMessageContent = `You are a language tutor for ${targetLanguage}. ${customPrompt}

Your role is to:
1. Have a natural conversation in ${targetLanguage}
2. Analyze the user's messages for errors (grammar, vocabulary, pronunciation, context)
3. Provide corrections and explanations while staying encouraging
4. Continue the conversation naturally while helping them improve

Always respond with both your message in ${targetLanguage} and an English translation.`;

    // Execute all operations in a single atomic transaction
    // If any step fails, everything rolls back automatically
    await db.transaction(async (tx) => {
      // 1. Deduct tokens with balance guard
      const [deduction] = await tx
        .update(UserTable)
        .set({
          tokensBalance: sql`${UserTable.tokensBalance} - ${CONVERSATION_COST}`,
        })
        .where(
          and(
            eq(UserTable.clerkUserId, userId),
            gte(UserTable.tokensBalance, CONVERSATION_COST)
          )
        )
        .returning({ clerkUserId: UserTable.clerkUserId });

      if (!deduction) {
        throw new Error("INSUFFICIENT_TOKENS");
      }

      // 2. Create conversation
      await tx.insert(ConversationTable).values({
        id: conversationId,
        clerkUserId: userId,
        customPrompt,
        tokensCharged: CONVERSATION_COST,
      });

      // 3. Create system message
      await tx.insert(MessageTable).values({
        conversationId,
        role: "system",
        content: systemMessageContent,
        tokenCount: 0,
      });
    });

    return Response.json({ conversationId });
  } catch (error) {
    // Handle insufficient tokens (thrown from inside transaction)
    if (error instanceof Error && error.message === "INSUFFICIENT_TOKENS") {
      return new Response(
        `Insufficient tokens. You need ${CONVERSATION_COST} tokens to start a conversation.`,
        { status: 402 }
      );
    }
    console.error("Start conversation API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
