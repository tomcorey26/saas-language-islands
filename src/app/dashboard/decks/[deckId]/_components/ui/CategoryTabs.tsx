"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashCard } from "@/zod/models/flashcard.model";
import { FlashCardList } from "./FlashCardList";
import { useState } from "react";

interface CategoryTabsProps {
  cardsByCategory: Record<string, FlashCard[]>;
}

export function CategoryTabs({ cardsByCategory }: CategoryTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(cardsByCategory)[0] || ""
  );

  return (
    <Tabs
      defaultValue={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value)}
    >
      <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
        {Object.keys(cardsByCategory).map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(cardsByCategory).map(([category, cards]) => (
        <TabsContent key={category} value={category} className="mt-6">
          <FlashCardList category={category} cards={cards} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
