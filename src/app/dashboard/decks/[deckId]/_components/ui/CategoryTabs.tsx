"use client";

import { useRef, useEffect, useState } from "react";
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
  // Reference to the TabsList element for scrolling
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Function to check if scrolling is possible
  const checkScrollability = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  // Function to scroll the tabs left or right
  const scrollTabs = (direction: "left" | "right") => {
    if (tabsListRef.current) {
      const scrollAmount = 200; // Amount to scroll in pixels
      const currentScroll = tabsListRef.current.scrollLeft;

      // Calculate new scroll position
      const newScrollLeft =
        direction === "left"
          ? Math.max(0, currentScroll - scrollAmount)
          : currentScroll + scrollAmount;

      // Scroll to the new position with smooth animation
      tabsListRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Update scroll buttons after animation completes
      setTimeout(checkScrollability, 300);
    }
  };

  // Add event listeners and check scrollability when component mounts or categories change
  useEffect(() => {
    // Check initial scrollability
    checkScrollability();

    // Add scroll event listener
    const tabsList = tabsListRef.current;
    if (tabsList) {
      tabsList.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
    }

    return () => {
      if (tabsList) {
        tabsList.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      }
    };
  }, [cardsByCategory]);

  return (
    <Tabs
      defaultValue={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value)}
      className="w-full"
    >
      <div className="relative flex items-center mb-4">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8 rounded-full bg-background shadow-sm z-10 mr-1"
          onClick={() => scrollTabs("left")}
          aria-label="Scroll tabs left"
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Scrollable tabs container */}
        <div className="flex-grow overflow-hidden">
          <TabsList
            ref={tabsListRef}
            className="flex w-full overflow-x-auto py-2 px-1 no-scrollbar"
            onScroll={checkScrollability}
          >
            {/* Map through categories to create tabs */}
            {Object.keys(cardsByCategory).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-shrink-0 whitespace-nowrap items-center gap-1.5 px-4"
              >
                {category}
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="test-1"
              className="flex-shrink-0 whitespace-nowrap items-center gap-1.5 px-4"
            >
              Test Tab 1
            </TabsTrigger>
            <TabsTrigger
              value="test-2"
              className="flex-shrink-0 whitespace-nowrap items-center gap-1.5 px-4"
            >
              Test Tab 2
            </TabsTrigger>
            <TabsTrigger
              value="test-3"
              className="flex-shrink-0 whitespace-nowrap items-center gap-1.5 px-4"
            >
              Test Tab 3
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8 rounded-full bg-background shadow-sm z-10 ml-1"
          onClick={() => scrollTabs("right")}
          aria-label="Scroll tabs right"
          disabled={!canScrollRight}
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
