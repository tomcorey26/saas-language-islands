"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const tabsListRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsListRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === "left"
          ? Math.max(0, tabsListRef.current.scrollLeft - scrollAmount)
          : tabsListRef.current.scrollLeft + scrollAmount;

      tabsListRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <Tabs
      defaultValue={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value)}
      className="w-full"
    >
      <div className="relative flex items-center">
        {/* Left scroll button - always visible */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8 rounded-full bg-background shadow-sm z-10 mr-1"
          onClick={() => scrollTabs("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Tabs with horizontal scrolling */}
        <div ref={tabsListRef} className="flex-grow overflow-hidden">
          <TabsList
            className="flex w-full overflow-x-auto py-2 px-1 no-scrollbar"
            style={{
              msOverflowStyle: "none" /* IE and Edge */,
              scrollbarWidth: "none" /* Firefox */,
            }}
          >
            <style>
              {`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {Object.keys(cardsByCategory).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-shrink-0 whitespace-nowrap items-center gap-1.5 px-4"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Right scroll button - always visible */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8 rounded-full bg-background shadow-sm z-10 ml-1"
          onClick={() => scrollTabs("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Tab Content for Each Category */}
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
