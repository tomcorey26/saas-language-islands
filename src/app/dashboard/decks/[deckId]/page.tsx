import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { DeckHero } from "@/app/dashboard/decks/[deckId]/_components/ui/DeckHero";
import { EmptyState } from "@/app/dashboard/decks/[deckId]/_components/ui/EmptyState";
import { CategoryTabs } from "@/app/dashboard/decks/[deckId]/_components/ui/CategoryTabs";
import { ExportDeckDialog } from "@/app/dashboard/decks/[deckId]/_components/ui/ExportDeckDialog";
import { getDeckWithCards } from "@/server/db/decks";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";
import Link from "next/link";

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
          <ExportDeckDialog deck={deck} />
          <Link href={`/dashboard/decks/${deck.id}?createIsland=true`}>
            <Button variant="default" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Create New Island</span>
            </Button>
          </Link>
        </>
      }
    >
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
    </DashboardPageLayout>
  );
}
