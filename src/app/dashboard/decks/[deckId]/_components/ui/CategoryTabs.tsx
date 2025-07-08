"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashCard } from "@/zod/models/flashcard.model";
import { FlashCardList } from "./FlashCardList";
import { useState } from "react";
import { Deck } from "@/zod/models/deck.model";

interface CategoryTabsProps {
  cardsByCategory: Record<string, FlashCard[]>;
  deck: Deck;
}

// TOMOO: Add the ability to view the prompt you used to generate the island
export function CategoryTabs({ cardsByCategory, deck }: CategoryTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(cardsByCategory)[0] || ""
  );

  return (
    <Tabs
      defaultValue={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value)}
    >
      <TabsList className="flex items-center justify-start flex-wrap h-auto">
        {Object.keys(cardsByCategory).map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(cardsByCategory).map(([category, cards]) => (
        <TabsContent key={category} value={category} className="mt-6">
          <FlashCardList category={category} cards={cards} deck={deck} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
