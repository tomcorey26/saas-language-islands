"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashCardList } from "./FlashCardList";
import { useState } from "react";
import { Deck } from "@/zod/models/deck.model";
import { Island } from "@/zod/models/island.model";
import { FlashCard } from "@/zod/models/flashcard.model";

interface CategoryTabsProps {
  islands: (Island & { cards: FlashCard[] })[];
  deck: Deck;
}

// TOMOO: Add the ability to view the prompt you used to generate the island
export function CategoryTabs({ islands, deck }: CategoryTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    islands[0]?.name || ""
  );

  return (
    <Tabs
      defaultValue={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value)}
    >
      <TabsList className="flex items-center justify-start flex-wrap h-auto">
        {islands.map((island) => (
          <TabsTrigger key={island.id} value={island.name}>
            {island.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {islands.map((island) => (
        <TabsContent key={island.id} value={island.name} className="mt-6">
          <FlashCardList island={island} cards={island.cards} deck={deck} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
