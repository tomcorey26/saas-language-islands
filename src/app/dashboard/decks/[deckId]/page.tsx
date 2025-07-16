import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { DeckHero } from "@/app/dashboard/decks/[deckId]/_components/ui/DeckHero";
import { EmptyState } from "@/app/dashboard/decks/[deckId]/_components/ui/EmptyState";
import { CategoryTabs } from "@/app/dashboard/decks/[deckId]/_components/ui/CategoryTabs";
import { getDeckWithCards } from "@/server/db/decks";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
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

  const totalCards = deck.islands.reduce(
    (acc, island) => acc + island.cards.length,
    0
  );
  const totalIslands = deck.islands.length;

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
        {deck.islands.length === 0 ? (
          <EmptyState deckId={deck.id} />
        ) : (
          <div className="space-y-6">
            <CategoryTabs islands={deck.islands} deck={deck} />
          </div>
        )}
      </div>
    </div>
  );
}
