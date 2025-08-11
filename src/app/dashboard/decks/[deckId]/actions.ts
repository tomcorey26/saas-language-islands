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
  getCardsForStudy as getCardsForStudyDb,
} from "@/server/db/cards";
import {
  createIsland as createIslandDb,
  deleteIsland as deleteIslandDb,
} from "@/server/db/islands";
import {
  UpdateCardRequest,
  UpdateCardRequestSchema,
  UpdateCardMemoryTechniquesRequest,
  UpdateCardMemoryTechniquesRequestSchema,
} from "@/zod/contracts/card.schema";

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
    console.error("Schema validation failed:", UpdateCardRequestSchema.safeParse(unsafeData));
    return {
      error: true,
      message: "Invalid request data",
    };
  }

  console.log("Update data received:", data);

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
  if (data.easeFactor !== undefined) {
    trimmedUpdates.easeFactor = data.easeFactor;
  }
  if (data.repetitions !== undefined) {
    trimmedUpdates.repetitions = data.repetitions;
  }
  if (data.lastReviewedAt !== undefined) {
    trimmedUpdates.lastReviewedAt = data.lastReviewedAt;
  }
  if (data.nextReviewAt !== undefined) {
    trimmedUpdates.nextReviewAt = data.nextReviewAt;
  }

  // Update the card
  console.log("Trimmed updates being sent to DB:", trimmedUpdates);
  await updateCardDb(cardId, trimmedUpdates);

  revalidatePath(`/dashboard/decks/${card.deck.id}`);
  revalidatePath(`/dashboard/decks/${card.deck.id}/study`);
  return {
    error: false,
    message: "Card updated successfully",
  };
}

export async function updateCardMemoryTechniquesAction(
  cardId: string,
  unsafeData: UpdateCardMemoryTechniquesRequest
): Promise<
  | {
      error: boolean;
      message: string;
    }
  | undefined
> {
  const { userId } = await auth();
  const { success, data } = UpdateCardMemoryTechniquesRequestSchema.safeParse(unsafeData);
  
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

  // Update the card with memory techniques
  await updateCardDb(cardId, data);

  revalidatePath(`/dashboard/decks/${card.deck.id}`);
  revalidatePath(`/dashboard/decks/${card.deck.id}/study`);
  return {
    error: false,
    message: "Memory techniques saved successfully",
  };
}

export async function getCardsForStudyAction(deckId: string, limit: number = 20) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Verify deck ownership
  const deck = await getDeck({ id: deckId, clerkUserId: userId });
  if (!deck) {
    throw new Error("Unauthorized");
  }

  return await getCardsForStudyDb(deckId, limit);
}
