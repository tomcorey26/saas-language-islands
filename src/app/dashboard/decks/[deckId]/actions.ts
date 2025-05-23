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
import { createCards, deleteCardsByCategory } from "@/server/db/cards";

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

export async function deleteIsland(deckId: string, category: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify deck ownership
    const deck = await getDeck({ id: deckId, clerkUserId: userId });
    if (!deck) {
      throw new Error("Unauthorized");
    }

    // Delete all cards in the category
    await deleteCardsByCategory(deckId, category);

    revalidatePath(`/decks/${deckId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting island:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete island",
    };
  }
}
