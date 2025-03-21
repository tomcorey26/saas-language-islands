"use server";

import { createDeck } from "@/server/db/decks";
import { CreateDeckRequest } from "@/zod/contracts/deck.schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createDeckAction(data: CreateDeckRequest) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const deck = await createDeck({
    ...data,
    clerkUserId: userId,
  });

  revalidatePath("/dashboard");
  return deck;
}
