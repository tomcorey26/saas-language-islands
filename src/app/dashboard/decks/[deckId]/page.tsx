import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getDeckWithCards } from "@/server/db/decks";
import { DeckPageClient } from "./_components/DeckPageClient";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { deckId } = await params;

  const deck = await getDeckWithCards(deckId);

  if (!deck) {
    notFound();
  }

  const totalCards = deck.islands.reduce(
    (acc, island) => acc + island.cards.length,
    0
  );
  const totalIslands = deck.islands.length;

  return (
    <DeckPageClient 
      deck={deck} 
      totalCards={totalCards} 
      totalIslands={totalIslands}
    />
  );
}
