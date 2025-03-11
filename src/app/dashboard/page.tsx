import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CreateDeckRequest } from "@/zod/contracts/deck.schema";
import { createDeck, getDecks } from "@/server/db/decks";
import { DashboardClient } from "./_components/DashboardClient";

/*
  TODO:
  - Add a login count to the user subscription
  - upon first login, check if the user has cards in local storage
  - if they do, add them to the database. Or just regenerate the deck
  - if they don't, prompt them to generate cards
  - Create UI from https://bolt.new/~/bolt-shadcn-xwqb6qvu
*/

// Cards
// Each card has the deck name and photo
// Each card is a link to the deck
// If no decks added have one with the dash outline, with a plus button in
// the center of the card that says "Create Deck"

// TODO:
// Make it so
// Deck Generation form
// + Add a island name
// + Add a name
// + Add a description
// + Add a photo
// + Add a language
// + Add a category
// + Add a difficulty
// Add card count you want to generate
// add the prompt you want to use to generate the deck (optional)
// can choose to auto translate when editing individual cards
// Can add individual islands to the deck with just the island
// part of the form, creating the world requires multiple of these forms

async function createDeckAction(data: CreateDeckRequest) {
  "use server";

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

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();

  const decks = await getDecks(userId);

  return (
    <DashboardClient initialDecks={decks} createDeckAction={createDeckAction} />
  );
}
