"use server";

import { auth } from "@clerk/nextjs/server";
import { cardDifficulties } from "@/data/cardDifficulties";
import { revalidatePath } from "next/cache";
import { getDeck } from "@/server/db/decks";
import { getUser } from "@/server/db/users";
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
  ReviewCardRequest,
  ReviewCardRequestSchema,
  UpdateCardRequest,
  UpdateCardRequestSchema,
} from "@/zod/contracts/card.schema";
import { calculateNextReview } from "@/lib/spaced-repetition";
import { updateCardReview } from "@/server/db/cards";
import {
  CreateIslandRequest,
  CreateIslandRequestSchema,
} from "@/zod/contracts/island.schema";
import { openai } from "@ai-sdk/openai";
import { islandNameSchema } from "@/zod/contracts/islandStream.schema";
import { generateObject } from "ai";

// Server action to save completed island data from SSE
export async function createIslandAction(unsafeData: CreateIslandRequest) {
  try {
    const { success, data } = CreateIslandRequestSchema.safeParse(unsafeData);
    if (!success) {
      return {
        error: true,
        message: "Invalid request data",
      };
    }

    const { deckId, prompt, cards } = data;
    const { userId } = await auth();
    if (!userId) {
      return {
        error: true,
        message: "Not authenticated",
      };
    }

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

    // First, generate the island name
    const nameResult = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: islandNameSchema,
      prompt: `Create a short, descriptive name (2-4 words) for a collection of ${cards.length} ${deck.language} flashcards based on this prompt: ${prompt}`,
    });

    // Create the island
    const island = await createIslandDb({
      deckId,
      prompt,
      name: nameResult.object.name,
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

    // Revalidate both the deck page and dashboard to update token display
    revalidatePath(`/dashboard/decks/${deckId}`);
    revalidatePath("/dashboard");

    return {
      error: false,
      message: `Island "${island.name}" created successfully!`,
      islandId: island.id,
    };
  } catch (error) {
    console.error("Error generating and saving island:", error);
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

/**
 * Below are server actions for individual card operations
 * (delete, update, etc.)
 */

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

export async function reviewCardAction(
  unsafeData: ReviewCardRequest
): Promise<{ error: boolean; message: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { error: true, message: "Not authenticated" };
  }

  const { success, data } = ReviewCardRequestSchema.safeParse(unsafeData);
  if (!success) {
    return { error: true, message: "Invalid request data" };
  }

  const { cardId, quality } = data;

  // Get card and verify ownership
  const card = await getCardWithDeckDb(cardId);
  if (!card) {
    return { error: true, message: "Card not found" };
  }

  if (card.deck.clerkUserId !== userId) {
    return { error: true, message: "Unauthorized" };
  }

  // Calculate next review using SM-2
  const srData = calculateNextReview(quality, {
    interval: card.interval,
    easeFactor: card.easeFactor,
    reviewCount: card.reviewCount,
  });

  // Update the card
  await updateCardReview(cardId, srData);

  return { error: false, message: "Review recorded" };
}
