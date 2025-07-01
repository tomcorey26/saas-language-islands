import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { DeckTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DeckHero } from "@/app/dashboard/decks/[deckId]/_components/ui/DeckHero";
import { EmptyState } from "@/app/dashboard/decks/[deckId]/_components/ui/EmptyState";
import { CategoryTabs } from "@/app/dashboard/decks/[deckId]/_components/ui/CategoryTabs";

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

  // Calculate statistics
  const totalCards = Object.values(cardsByCategory).flat().length;
  const totalIslands = Object.keys(cardsByCategory).length;

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <DeckHero
          deck={deck}
          totalCards={totalCards}
          totalIslands={totalIslands}
        />

        {/* Main Content */}
        {deck.cards.length === 0 ? (
          <EmptyState deckId={deck.id} />
        ) : (
          <div className="space-y-6">
            <CategoryTabs cardsByCategory={cardsByCategory} deck={deck} />
          </div>
        )}
      </div>
    </div>
  );
}
