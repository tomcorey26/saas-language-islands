"use server";

import { auth } from "@clerk/nextjs/server";
import { CardDifficulty } from "@/data/cardDifficulties";
import { revalidatePath } from "next/cache";
import { getDeck } from "@/server/db/decks";
import {
  CreateIslandRequest,
  CreateIslandRequestSchema,
} from "@/zod/contracts/island.schema";
import { generateFlashcardsIsland } from "@/services/openai";
import {
  createCards,
  deleteCardsByCategory,
  deleteCardById,
  updateCard,
} from "@/server/db/cards";

export async function generateCards(data: CreateIslandRequest): Promise<
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

    const { deckId } = parsedData.data;

    // Verify deck ownership
    const deck = await getDeck({ id: deckId, clerkUserId: userId });

    if (!deck) {
      return {
        error: true,
        message: "Unauthorized",
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

    // Save cards to database
    const cards = completion.island.map((card) => ({
      deckId,
      category: parsedData.data.category,
      phrase: card.phrase,
      translation: card.translation,
      difficulty: "again" as CardDifficulty,
    }));

    await createCards(cards);

    revalidatePath(`/dashboard/decks/${deckId}`);
    return {
      error: false,
      message: "Cards generated successfully",
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

export async function deleteIsland(
  deckId: string,
  category: string
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
  await deleteCardsByCategory(deckId, category);

  revalidatePath(`/decks/${deckId}`);
  return {
    error: false,
    message: "Island deleted successfully",
  };
}

export async function deleteCard(
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
  await deleteCardById(deckId, cardId);

  revalidatePath(`/dashboard/decks/${deckId}`);
  return {
    error: false,
    message: "Card deleted successfully",
  };
}

export async function updateCardAction(
  cardId: string,
  deckId: string,
  phrase: string,
  translation: string
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

  // Validate input
  if (!phrase.trim() || !translation.trim()) {
    return {
      error: true,
      message: "Phrase and translation cannot be empty",
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

  // Update the card
  await updateCard(deckId, cardId, {
    phrase: phrase.trim(),
    translation: translation.trim(),
  });

  revalidatePath(`/dashboard/decks/${deckId}`);
  return {
    error: false,
    message: "Card updated successfully",
  };
}
