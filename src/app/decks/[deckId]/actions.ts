"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDeck } from "@/server/db/decks";
import { deleteCardsByCategory } from "@/server/db/cards";

export async function deleteIsland(deckId: string, category: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify deck ownership
    const deck = await getDeck(deckId);
    if (!deck || deck.clerkUserId !== userId) {
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
