"use server";

import {
  createDeck as createDeckDb,
  deleteDeck as deleteDeckDb,
} from "@/server/db/decks";
import {
  CreateDeckRequest,
  CreateDeckRequestSchema,
} from "@/zod/contracts/deck.schema";
import { auth } from "@clerk/nextjs/server";
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

  return {
    error: !isSuccess,
    message: isSuccess ? "Deck deleted successfully" : errorMesssage,
  };
}
