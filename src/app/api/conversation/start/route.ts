import { auth } from "@clerk/nextjs/server";
import { startConversationRequestSchema } from "@/zod/contracts/conversation.schema";
import { createConversation } from "@/server/db/conversations";
import { saveMessage } from "@/server/db/messages";
import { deductTokensFromUser, getUser } from "@/server/db/users";

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

    // Check user has enough tokens
    const user = await getUser(userId);
    if (!user || (user.tokensBalance ?? 0) < 5) {
      return new Response(
        `Insufficient tokens. You need 5 tokens but only have ${user?.tokensBalance ?? 0}.`,
        { status: 402 }
      );
    }

    // Create conversation
    const conversation = await createConversation({
      clerkUserId: userId,
      customPrompt,
      tokensCharged: 5,
    });

    // Insert initial system message with scenario instructions
    await saveMessage({
      conversationId: conversation.id,
      role: "system",
      content: `You are a language tutor for ${targetLanguage}. ${customPrompt}

Your role is to:
1. Have a natural conversation in ${targetLanguage}
2. Analyze the user's messages for errors (grammar, vocabulary, pronunciation, context)
3. Provide corrections and explanations while staying encouraging
4. Continue the conversation naturally while helping them improve

Always respond with both your message in ${targetLanguage} and an English translation.`,
      tokenCount: 0,
    });

    // Deduct tokens only after successful conversation creation
    await deductTokensFromUser(userId, 5);

    return Response.json({ conversationId: conversation.id });
  } catch (error) {
    console.error("Start conversation API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
