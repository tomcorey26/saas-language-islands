import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getDeckWithCards } from "@/server/db/decks";
import { StudyMode } from "./_components/StudyMode";

export default async function StudyPage({
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

  // Flatten all cards from all islands
  const allCards = deck.islands.flatMap((island) => island.cards);

  if (allCards.length === 0) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-2xl font-bold">No cards to study</h2>
        <p className="text-lg text-muted-foreground">
          This deck doesn&apos;t have any flashcards yet.
        </p>
        <a
          href={`/dashboard/decks/${deckId}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Back to Deck
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <StudyMode
        cards={allCards}
        deckId={deckId}
        deckName={deck.name}
        deckLanguage={deck.language}
      />
    </div>
  );
}
