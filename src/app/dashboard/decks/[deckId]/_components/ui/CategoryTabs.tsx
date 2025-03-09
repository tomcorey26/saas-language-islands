"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashCard } from "@/zod/models/flashcard.model";
import { FlashCardList } from "./FlashCardList";

interface CategoryTabsProps {
  cardsByCategory: Record<string, FlashCard[]>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onDeleteIsland: (category: string) => void;
}

export function CategoryTabs({
  cardsByCategory,
  selectedCategory,
  setSelectedCategory,
  onDeleteIsland,
}: CategoryTabsProps) {
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
          <FlashCardList
            category={category}
            cards={cards}
            onDeleteCategory={() => onDeleteIsland(category)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
