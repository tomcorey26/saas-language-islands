"use server";

import {
  createDeck as createDeckDb,
  deleteDeck as deleteDeckDb,
  updateDeck as updateDeckDb,
} from "@/server/db/decks";
import {
  CreateDeckRequest,
  CreateDeckRequestSchema,
} from "@/zod/contracts/deck.schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDeck(data: CreateDeckRequest): Promise<
  | {
      error: boolean;
      message: string;
    }
  | undefined
> {
  const { userId } = await auth();
  const parsedData = CreateDeckRequestSchema.safeParse(data);

  if (!parsedData.success || userId == null) {
    return {
      error: true,
      message: "There was an error creating your deck",
    };
  }

  const deck = await createDeckDb({
    ...parsedData.data,
    clerkUserId: userId,
  });

  redirect(`/dashboard/decks/${deck.id}`);
}

export async function updateDeck(deckId: string, data: CreateDeckRequest) {
  const { userId } = await auth();
  const parsedData = CreateDeckRequestSchema.safeParse(data);

  if (!parsedData.success || userId == null) {
    return {
      error: true,
      message: "There was an error updating your deck",
    };
  }

  const isSuccess = await updateDeckDb(parsedData.data, {
    id: deckId,
    clerkUserId: userId,
  });

  return {
    error: !isSuccess,
    message: isSuccess
      ? "Deck updated successfully"
      : "There was an error updating your deck",
  };
}

export async function deleteDeck(deckId: string) {
  const { userId } = await auth();
  const errorMesssage = "There was an error deleting your deck";

  if (userId == null) {
    return {
      error: true,
      message: errorMesssage,
    };
  }

  const isSuccess = await deleteDeckDb({
    id: deckId,
    clerkUserId: userId,
  });

  revalidatePath("/dashboard/decks");

  return {
    error: !isSuccess,
    message: isSuccess ? "Deck deleted successfully" : errorMesssage,
  };
}
