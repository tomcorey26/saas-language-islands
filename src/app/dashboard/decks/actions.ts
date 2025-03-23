"use server";

import { createDeck as createDeckDb } from "@/server/db/decks";
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
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const parsedData = CreateDeckRequestSchema.safeParse(data);
  if (!parsedData.success) {
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
