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
import { createCards } from "@/server/db/cards";

export async function generateCards(data: CreateIslandRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const parsedData = CreateIslandRequestSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Invalid request data");
    }

    const { deckId } = parsedData.data;

    // Verify deck ownership
    const deck = await getDeck(deckId);

    if (!deck || deck.clerkUserId !== userId) {
      throw new Error("Unauthorized");
    }

    // Generate cards using OpenAI
    const completion = await generateFlashcardsIsland(parsedData.data);

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

    revalidatePath(`/decks/${deckId}`);
    return { success: true };
  } catch (error) {
    console.error("Error generating cards:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to generate cards",
    };
  }
}
