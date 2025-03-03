"use client";

import { useState } from "react";
import { FlashCard } from "@/zod/models/flashcard.model";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface IslandProps {
  cards: FlashCard[];
}

export default function Island({ cards }: IslandProps) {
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);

  return (
    <div className="relative min-h-[200px] p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="relative cursor-pointer h-[120px] perspective-1000"
              onClick={() =>
                setFlippedCardIndex(flippedCardIndex === index ? null : index)
              }
            >
              <div className="relative w-full h-full">
                <AnimatePresence initial={false} mode="wait">
                  {flippedCardIndex === index ? (
                    <motion.div
                      key="back"
                      className="absolute inset-0 w-full h-full flex items-center justify-center p-4 bg-white rounded-lg"
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: -90 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <p className="text-sm text-center">{card.translation}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="front"
                      className="absolute inset-0 w-full h-full flex items-center justify-center p-4 bg-white rounded-lg"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <p className="text-sm text-center">{card.phrase}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      {cards.length > 0 && (
        <div className="absolute bottom-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFlippedCardIndex(null)}
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
