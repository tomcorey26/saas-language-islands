import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getDeckWithCards } from "@/server/db/decks";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { DeckContent, DeckContentSkeleton } from "@/components/DeckContent";
import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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

  // Check if deck exists for page title and actions
  const deck = await getDeckWithCards(deckId);
  if (!deck) {
    notFound();
  }

  const totalCards = deck.islands.reduce(
    (acc, island) => acc + island.cards.length,
    0
  );

  return (
    <DashboardPageLayout
      pageTitle={deck.name}
      backButtonHref="/dashboard/decks"
      actions={
        <>
          <Link href={`/dashboard/decks/${deck.id}/study`}>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg text-base"
              disabled={totalCards === 0}
            >
              <Play className="h-5 w-5" />
              <span>Study</span>
            </Button>
          </Link>
          <Link href={`/dashboard/decks/${deck.id}?createIsland=true`}>
            <Button variant="default" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Create New Island</span>
            </Button>
          </Link>
        </>
      }
    >
      <Suspense fallback={<DeckContentSkeleton />}>
        <DeckContent deckId={deckId} />
      </Suspense>
    </DashboardPageLayout>
  );
}
