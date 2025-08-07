import { getDecks } from "@/server/db/decks";
import DeckItem from "@/app/dashboard/decks/_components/DeckItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cache } from "react";

// Cache the decks function to prevent duplicate calls
const getCachedDecks = cache(async (userId: string, options?: { limit?: number; offset?: number }) => {
  return await getDecks(userId, options);
});

interface DecksListProps {
  userId: string;
}

export async function DecksList({ userId }: DecksListProps) {
  const decks = await getCachedDecks(userId, { limit: 10 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.length === 0 ? (
        <Link href="/dashboard/decks/new">
          <Button
            variant="outline"
            className="h-[300px] border-dashed w-full"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="text-6xl mb-2">🏝️</div>
              <span className="text-lg font-medium">
                Create Your First Deck
              </span>
              <div className="flex items-center gap-2 text-2xl">+</div>
            </div>
          </Button>
        </Link>
      ) : (
        decks.map((deck) => <DeckItem key={deck.id} deck={deck} />)
      )}
    </div>
  );
}

export function DecksListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[300px] rounded-lg border p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}