"use server";

import { auth } from "@clerk/nextjs/server";
import { cardDifficulties } from "@/data/cardDifficulties";
import { revalidatePath } from "next/cache";
import { getDeck } from "@/server/db/decks";
import { getUser } from "@/server/db/users";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/user";
import { eq, sql } from "drizzle-orm";
import {
  CreateIslandRequest,
  CreateIslandRequestSchema,
} from "@/zod/contracts/island.schema";
import { generateFlashcardsIsland } from "@/services/openai";
import {
  createCards as createCardsDb,
  deleteCardById as deleteCardByIdDb,
  getCardWithDeck as getCardWithDeckDb,
  updateCard as updateCardDb,
} from "@/server/db/cards";
import {
  createIsland as createIslandDb,
  deleteIsland as deleteIslandDb,
} from "@/server/db/islands";
import {
  UpdateCardRequest,
  UpdateCardRequestSchema,
} from "@/zod/contracts/card.schema";
import { z } from "zod";

// Schema for processing streamed flashcard data
const ProcessStreamedIslandSchema = z.object({
  deckId: z.string(),
  prompt: z.string(),
  islandName: z.string(),
  cards: z.array(z.object({
    phrase: z.string(),
    translation: z.string(),
  })),
  tokensUsed: z.number(),
});

type ProcessStreamedIslandRequest = z.infer<typeof ProcessStreamedIslandSchema>;

export async function processStreamedIslandAction(
  data: ProcessStreamedIslandRequest
): Promise<
  | {
      error: boolean;
      message: string;
      islandId?: string;
    }
  | undefined
> {
  try {
    const { userId } = await auth();
    
    const parsedData = ProcessStreamedIslandSchema.safeParse(data);
    if (!parsedData.success || userId == null) {
      return {
        error: true,
        message: "Invalid request data",
      };
    }

    const { deckId, prompt, islandName, cards, tokensUsed } = parsedData.data;

    // Verify deck ownership and get user data
    const [deck, user] = await Promise.all([
      getDeck({ id: deckId, clerkUserId: userId }),
      getUser(userId),
    ]);

    if (!deck) {
      return {
        error: true,
        message: "Unauthorized",
      };
    }

    if (!user) {
      return {
        error: true,
        message: "User not found",
      };
    }

    // Double-check token balance (client-side validation backup)
    const availableTokens = user.tokensBalance || 0;
    if (availableTokens < tokensUsed) {
      return {
        error: true,
        message: "Insufficient tokens",
      };
    }

    // Create the island
    const island = await createIslandDb({
      deckId,
      prompt,
      name: islandName,
    });

    // Save cards to database
    const cardData = cards.map((card, index) => ({
      deckId,
      islandId: island.id,
      phrase: card.phrase,
      translation: card.translation,
      difficulty: cardDifficulties.again,
      position: index,
    }));

    await createCardsDb(cardData);

    // Deduct tokens from user's balance
    await db
      .update(UserTable)
      .set({
        tokensBalance: sql`${UserTable.tokensBalance} - ${tokensUsed}`,
      })
      .where(eq(UserTable.clerkUserId, userId));

    // Revalidate both the deck page and dashboard to update token display
    revalidatePath(`/dashboard/decks/${deckId}`);
    revalidatePath("/dashboard");

    return {
      error: false,
      message: `Island "${islandName}" created successfully! ${tokensUsed} tokens used.`,
      islandId: island.id,
    };
  } catch (error) {
    console.error("Error processing streamed island:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to process island",
    };
  }
}

export async function generateIslandAction(data: CreateIslandRequest): Promise<
  | {
      error: boolean;
      message: string;
    }
  | undefined
> {
  try {
    const { userId } = await auth();

    const parsedData = CreateIslandRequestSchema.safeParse(data);
    if (!parsedData.success || userId == null) {
      return {
        error: true,
        message: "Invalid request data",
      };
    }

    const { deckId, prompt } = parsedData.data;

    // Verify deck ownership and get user data
    const [deck, user] = await Promise.all([
      getDeck({ id: deckId, clerkUserId: userId }),
      getUser(userId),
    ]);

    if (!deck) {
      return {
        error: true,
        message: "Unauthorized",
      };
    }

    if (!user) {
      return {
        error: true,
        message: "User not found",
      };
    }

    // Check if user has enough tokens
    const tokensRequired = parsedData.data.count;
    const availableTokens = user.tokensBalance || 0;

    if (availableTokens < tokensRequired) {
      return {
        error: true,
        message: `Insufficient tokens. You need ${tokensRequired} tokens but only have ${availableTokens}.`,
      };
    }

    // Generate cards using OpenAI
    const completion = await generateFlashcardsIsland({
      ...parsedData.data,
      language: deck.language,
    });

    if (!completion) {
      throw new Error("Failed to generate cards");
    }

    const island = await createIslandDb({
      deckId,
      prompt,
      name: completion.name,
    });

    // Save cards to database
    const cards = completion.island.map((card, index) => ({
      deckId,
      islandId: island.id,
      phrase: card.phrase,
      translation: card.translation,
      difficulty: cardDifficulties.again,
      position: index,
    }));

    await createCardsDb(cards);

    // Deduct tokens from user's balance
    await db
      .update(UserTable)
      .set({
        tokensBalance: sql`${UserTable.tokensBalance} - ${tokensRequired}`,
      })
      .where(eq(UserTable.clerkUserId, userId));

    // Revalidate both the deck page and dashboard to update token display
    revalidatePath(`/dashboard/decks/${deckId}`);
    revalidatePath("/dashboard");

    return {
      error: false,
      message: `Cards generated successfully! ${tokensRequired} tokens used.`,
    };
  } catch (error) {
    console.error("Error generating cards:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to generate cards",
    };
  }
}

export async function deleteIslandAction(
  islandId: string,
  deckId: string
): Promise<
  | {
      error: boolean;
      message: string;
    }
  | undefined
> {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "Not authenticated",
    };
  }
  // Verify deck ownership
  const deck = await getDeck({ id: deckId, clerkUserId: userId });
  if (!deck) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  // Delete all cards in the category
  const isSuccess = await deleteIslandDb(islandId);

  revalidatePath(`/dashboard/decks/${deckId}`);
  return {
    error: !isSuccess,
    message: isSuccess
      ? "Island deleted successfully"
      : "There was an error deleting the island",
  };
}

export async function deleteCardAction(
  cardId: string,
  deckId: string
): Promise<
  | {
      error: boolean;
      message: string;
    }
  | undefined
> {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "Not authenticated",
    };
  }

  // Verify deck ownership
  const deck = await getDeck({ id: deckId, clerkUserId: userId });
  if (!deck) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  // Delete the card
  await deleteCardByIdDb(deckId, cardId);

  revalidatePath(`/dashboard/decks/${deckId}`);
  return {
    error: false,
    message: "Card deleted successfully",
  };
}

export async function updateCardAction(
  cardId: string,
  unsafeData: UpdateCardRequest
): Promise<
  | {
      error: boolean;
      message: string;
    }
  | undefined
> {
  const { userId } = await auth();
  const { success, data } = UpdateCardRequestSchema.safeParse(unsafeData);
  if (!userId) {
    return {
      error: true,
      message: "Not authenticated",
    };
  }

  if (!success) {
    return {
      error: true,
      message: "Invalid request data",
    };
  }

  // Verify deck ownership
  const card = await getCardWithDeckDb(cardId);

  if (!card) {
    return {
      error: true,
      message: "Card not found",
    };
  }

  if (card?.deck.clerkUserId !== userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  // Prepare updates object with trimmed values
  const trimmedUpdates: typeof data = {};
  if (data.phrase !== undefined) {
    trimmedUpdates.phrase = data.phrase.trim();
  }
  if (data.translation !== undefined) {
    trimmedUpdates.translation = data.translation.trim();
  }
  if (data.difficulty !== undefined) {
    trimmedUpdates.difficulty = data.difficulty;
  }

  // Update the card
  await updateCardDb(cardId, data);

  revalidatePath(`/dashboard/decks/${card.deck.id}`);
  revalidatePath(`/dashboard/decks/${card.deck.id}/study`);
  return {
    error: false,
    message: "Card updated successfully",
  };
}
