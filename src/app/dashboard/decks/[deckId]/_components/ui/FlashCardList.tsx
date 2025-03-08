"use client";

import { Button } from "@/components/ui/button";
import { FlashCard } from "@/zod/models/flashcard.model";
import { Trash2 } from "lucide-react";
import { FlashCardItem } from "./FlashCardItem";

interface FlashCardListProps {
  category: string;
  cards: FlashCard[];
  onDeleteCategory: () => void;
}

export function FlashCardList({
  category,
  cards,
  onDeleteCategory,
}: FlashCardListProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">{category}</h3>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={onDeleteCategory}
        >
          <Trash2 className="h-4 w-4" />
          Delete Island
        </Button>
      </div>
      <div className="space-y-2">
        {cards.map((card, index) => (
          <FlashCardItem key={card.id} card={card} index={index} />
        ))}
      </div>
    </>
  );
}
