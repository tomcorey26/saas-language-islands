import { getDeckWithCards } from "@/server/db/decks";
import { DeckHero } from "@/app/dashboard/decks/[deckId]/_components/ui/DeckHero";
import { EmptyState } from "@/app/dashboard/decks/[deckId]/_components/ui/EmptyState";
import { CategoryTabs } from "@/app/dashboard/decks/[deckId]/_components/ui/CategoryTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cache } from "react";

// Cache the deck with cards function
const getCachedDeckWithCards = cache(async (deckId: string) => {
  return await getDeckWithCards(deckId);
});

interface DeckContentProps {
  deckId: string;
}

export async function DeckContent({ deckId }: DeckContentProps) {
  const deck = await getCachedDeckWithCards(deckId);

  if (!deck) {
    return null;
  }

  const totalCards = deck.islands.reduce(
    (acc, island) => acc + island.cards.length,
    0
  );
  const totalIslands = deck.islands.length;

  return (
    <>
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
    </>
  );
}

export function DeckContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96 mb-4" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-6 w-12 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-6xl">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}