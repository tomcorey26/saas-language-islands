"use client";
import { useState } from "react";
import { Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlashcardItem from "./FlashcardItem";
import FlashcardDialog from "./FlashcardDialog";
import StudyMode from "./StudyMode";
import { calculateNextReview } from "@/lib/spaced-repetition";
import { CardDifficulty } from "@/data/cardDifficulties";
import { FlashCard } from "@/zod/models/flashcard.model";

export default function FlashcardGrid() {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
  const [isStudyMode, setIsStudyMode] = useState(false);

  const handleSave = (card: Pick<FlashCard, "phrase" | "translation">) => {
    if (editingCard) {
      setCards(
        cards.map((c) =>
          c.id === editingCard.id
            ? {
                ...c,
                ...card,
                lastModified: new Date(),
              }
            : c
        )
      );
    } else {
      const newCard: FlashCard = {
        id: crypto.randomUUID(),
        ...card,
        difficulty: "again",
        createdAt: new Date(),
        updatedAt: new Date(),
        deckId: "1",
        category: "spanish",
      };
      setCards([newCard, ...cards]);
    }
    setIsDialogOpen(false);
    setEditingCard(null);
  };

  const handleEdit = (card: FlashCard) => {
    setEditingCard(card);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleUpdateDifficulty = (
    cardId: string,
    difficulty: CardDifficulty
  ) => {
    setCards(
      cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              difficulty,
              nextReview: calculateNextReview(difficulty),
              lastModified: new Date(),
            }
          : card
      )
    );
  };

  if (isStudyMode) {
    return (
      <StudyMode
        cards={cards}
        onUpdateCard={handleUpdateDifficulty}
        onExit={() => setIsStudyMode(false)}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Language Islands</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsStudyMode(true)}
            className="flex items-center gap-2"
            variant="secondary"
          >
            <GraduationCap className="h-4 w-4" />
            Study Mode
          </Button>
          <Button
            onClick={() => {
              setEditingCard(null);
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Flashcard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <FlashcardItem
            key={card.id}
            card={card}
            onEdit={() => handleEdit(card)}
            onDelete={() => handleDelete(card.id)}
          />
        ))}
      </div>

      <FlashcardDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        card={editingCard}
      />
    </>
  );
}
