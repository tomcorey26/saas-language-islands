import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DeckClient } from "./_components/DeckClient";

async function getDeckWithCards(deckId: string) {
  const deck = await db.query.DeckTable.findFirst({
    where: eq(DeckTable.id, deckId),
    with: {
      cards: true,
    },
  });

  return deck;
}

export default async function DeckPage({
  params,
}: {
  params: { deckId: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { deckId } = await params;

  const deck = await getDeckWithCards(deckId);
  if (!deck) {
    notFound();
  }

  // Group cards by category
  const cardsByCategory = deck.cards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, typeof deck.cards>);

  return (
    <div className="container mx-auto py-8">
      <DeckClient deck={deck} cardsByCategory={cardsByCategory} />
    </div>
  );
}
