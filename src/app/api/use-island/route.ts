import { auth } from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { getDeck } from "@/server/db/decks";
import { addTokensToUser, getUser } from "@/server/db/users";
import { flashcardSchema, useIslandRequestSchema } from "@/zod/contracts/islandStream.schema";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/user";
import { eq, sql, and, gte } from "drizzle-orm";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { deckId, prompt, count } = useIslandRequestSchema.parse(body);

    const tokensRequired = count;

    // Verify deck ownership and get user data
    const [deck, user] = await Promise.all([
      getDeck({ id: deckId, clerkUserId: userId }),
      getUser(userId),
    ]);

    if (!deck) {
      return new Response("Deck not found", { status: 404 });
    }

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Pre-check for better UX error message
    const availableTokens = user.tokensBalance || 0;
    if (availableTokens < tokensRequired) {
      return new Response(
        `Insufficient tokens. You need ${tokensRequired} tokens but only have ${availableTokens}.`,
        { status: 402 }
      );
    }

    // Deduct tokens FIRST with balance guard (prevents race conditions)
    const [deductionResult] = await db
      .update(UserTable)
      .set({
        tokensBalance: sql`${UserTable.tokensBalance} - ${tokensRequired}`,
      })
      .where(
        and(
          eq(UserTable.clerkUserId, userId),
          gte(UserTable.tokensBalance, tokensRequired)
        )
      )
      .returning({ clerkUserId: UserTable.clerkUserId });

    if (!deductionResult) {
      return new Response(
        `Insufficient tokens. You need ${tokensRequired} tokens to generate flashcards.`,
        { status: 402 }
      );
    }

    // Tokens secured - now stream the flashcards
    const result = streamObject({
      model: openai("gpt-4o-mini"),
      output: "array",
      schema: flashcardSchema,
      prompt: `Generate exactly ${count} flashcards for learning ${deck.language}. The flashcards should be based on this prompt: ${prompt}

      Requirements:
      - The phrase field should be in English
      - The translation field should be in ${deck.language}
      - Make the flashcards relevant to the prompt
      - Make them useful for conversation with a native speaker
      - Include a mix of questions and statements`,
      onFinish: async ({ object, error }) => {
        // If generation failed, refund the tokens
        if (!object || error) {
          console.error("AI generation failed, refunding tokens:", error);
          await addTokensToUser(userId, tokensRequired);
        }
      },
      onError: async ({ error }) => {
        console.error("AI generation error, refunding tokens:", error);
        await addTokensToUser(userId, tokensRequired);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
