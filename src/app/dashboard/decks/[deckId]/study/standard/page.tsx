import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getDeckWithCards, getDueCards } from "@/server/db/decks";
import { GamifiedStudyMode } from "./_components/GamifiedStudyMode";
import Link from "next/link";

export default async function StandardStudyPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { deckId } = await params;

  // Get deck info
  const deck = await getDeckWithCards(deckId);
  if (!deck) {
    notFound();
  }

  // Get due cards for study session (max 20)
  const dueCards = await getDueCards(deckId, 20);

  // Check if deck has any cards at all
  const totalCards = deck.islands.reduce((sum, island) => sum + island.cards.length, 0);

  // Empty state - no cards in deck at all
  if (totalCards === 0) {
    return (
      <div className="w-full p-6 flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-2xl font-bold">No cards to study</h2>
        <p className="text-lg text-muted-foreground">
          This deck doesn&apos;t have any flashcards yet.
        </p>
        <Link
          href={`/dashboard/decks/${deckId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Back to Deck
        </Link>
      </div>
    );
  }

  // No cards due for review
  if (dueCards.length === 0) {
    return (
      <div className="w-full p-6 flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-2xl font-bold">All caught up!</h2>
        <p className="text-lg text-muted-foreground text-center">
          No cards are due for review right now.
          <br />
          Check back later or add more cards to your deck.
        </p>
        <Link
          href={`/dashboard/decks/${deckId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Back to Deck
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <GamifiedStudyMode
        cards={dueCards}
        deckId={deckId}
        deckName={deck.name}
        deckLanguage={deck.language}
      />
    </div>
  );
}
