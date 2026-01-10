import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getDeckWithCards } from "@/server/db/decks";
import { StudyModeSelector } from "./_components/StudyModeSelector";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";

export default async function StudyModeSelectorPage({
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
      <DashboardPageLayout
        pageTitle="Study Mode"
        backButtonHref={`/dashboard/decks/${deckId}`}
      >
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-bold">No cards to study</h2>
          <p className="text-lg text-muted-foreground">
            This deck doesn&apos;t have any flashcards yet.
          </p>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      pageTitle={`Study: ${deck.name}`}
      backButtonHref={`/dashboard/decks/${deckId}`}
    >
      <StudyModeSelector
        deckId={deckId}
        cardCount={allCards.length}
      />
    </DashboardPageLayout>
  );
}
