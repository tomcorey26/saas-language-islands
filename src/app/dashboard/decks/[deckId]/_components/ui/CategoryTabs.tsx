"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashCardList } from "./FlashCardList";
import { useEffect, useState } from "react";
import { Deck } from "@/zod/models/deck.model";
import { Island } from "@/zod/models/island.model";
import { FlashCard } from "@/zod/models/flashcard.model";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryTabsProps {
  islands: (Island & { cards: FlashCard[] })[];
  deck: Deck;
}

// TOMOO: Add the ability to view the prompt you used to generate the island
export function CategoryTabs({ islands, deck }: CategoryTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    islands[0]?.name || ""
  );
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  return (
    <Tabs
      defaultValue={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value)}
    >
      <TabsList className="flex items-center justify-start flex-wrap h-auto">
        {islands.map((island) => (
          <motion.div
            key={island.id}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.1 },
            }}
            whileTap={{
              scale: 0.97,
              transition: { duration: 0.05 },
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
          >
            <TabsTrigger value={island.name}>{island.name}</TabsTrigger>
          </motion.div>
        ))}
      </TabsList>
      <div className="mt-6 relative">
        <AnimatePresence mode="wait">
          {islands.map(
            (island) =>
              island.name === selectedCategory && (
                <motion.div
                  key={island.id}
                  initial={isInitialMount ? false : { x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.5,
                  }}
                >
                  <FlashCardList
                    island={island}
                    cards={island.cards}
                    deck={deck}
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </Tabs>
  );
}
