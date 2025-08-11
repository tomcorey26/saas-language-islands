"use client";

import { useDeckWalkthrough } from "@/hooks/useWalkthrough";
import { DeckHero } from "./ui/DeckHero";
import { EmptyState } from "./ui/EmptyState";
import { CategoryTabs } from "./ui/CategoryTabs";
import { DashboardPageLayout } from "@/app/dashboard/_components/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { ExportDropdown } from "@/components/ExportDropdown";
import { Deck } from "@/zod/models/deck.model";
import { Island } from "@/zod/models/island.model";
import { FlashCard } from "@/zod/models/flashcard.model";

interface DeckPageClientProps {
  deck: Deck & { islands: (Island & { cards: FlashCard[] })[] };
  totalCards: number;
  totalIslands: number;
}

export function DeckPageClient({ deck, totalCards, totalIslands }: DeckPageClientProps) {
  useDeckWalkthrough();

  return (
    <DashboardPageLayout
      pageTitle={deck.name}
      backButtonHref="/dashboard/decks"
      actions={
        <>
          <div data-tour="study-button">
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
          </div>
          {totalCards > 0 && (
            <ExportDropdown 
              deckId={deck.id} 
              deckName={deck.name}
            />
          )}
          <div data-tour="create-island-button">
            <Link href={`/dashboard/decks/${deck.id}?createIsland=true`}>
              <Button variant="default" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Create New Island</span>
              </Button>
            </Link>
          </div>
        </>
      }
    >
      <div data-tour="deck-hero">
        <DeckHero
          deck={deck}
          totalCards={totalCards}
          totalIslands={totalIslands}
        />
      </div>

      {deck.islands.length === 0 ? (
        <EmptyState deckId={deck.id} />
      ) : (
        <div className="space-y-6">
          <div data-tour="category-tabs">
            <CategoryTabs islands={deck.islands} deck={deck} />
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
}