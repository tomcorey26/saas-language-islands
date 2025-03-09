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
        <TabsTrigger value="test-1">Very Long Category Name 1</TabsTrigger>
        <TabsTrigger value="test-2">Another Long Category 2</TabsTrigger>
        <TabsTrigger value="test-3">Super Long Category Name 3</TabsTrigger>
        <TabsTrigger value="test-4">Extra Long Category Title 4</TabsTrigger>
        <TabsTrigger value="test-5">Extremely Long Category Name 5</TabsTrigger>
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
