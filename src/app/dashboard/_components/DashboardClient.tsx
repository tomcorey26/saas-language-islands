"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeckItem from "./DeckItem";
import DeckDialog from "./DeckDialog";
import { CreateDeckRequest, Deck } from "@/zod/contracts/deck.schema";
import { createDeckAction } from "@/app/dashboard/actions";
import { toast } from "@/hooks/use-toast";

interface DashboardClientProps {
  initialDecks: Deck[];
}

export function DashboardClient({ initialDecks }: DashboardClientProps) {
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  const handleSave = async (deck: CreateDeckRequest) => {
    if (editingDeck) {
      // TODO: Implement edit functionality
      setDecks(
        decks.map((d) =>
          d.id === editingDeck.id
            ? {
                ...d,
                ...deck,
                updatedAt: new Date(),
              }
            : d
        )
      );
    } else {
      try {
        const newDeck = await createDeckAction(deck);
        setDecks([newDeck, ...decks]);
      } catch (error) {
        console.error("Error creating deck:", error);
        toast({
          title: "Error creating deck",
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
    setIsDialogOpen(false);
    setEditingDeck(null);
  };

  const handleEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDecks(decks.filter((deck) => deck.id !== id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Language Islands</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingDeck(null);
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2"
            variant="secondary"
          >
            <Sparkles className="h-4 w-4" />
            Create Deck
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <DeckItem
            key={deck.id}
            deck={deck}
            onEdit={() => handleEdit(deck)}
            onDelete={() => handleDelete(deck.id)}
          />
        ))}
        {decks.length === 0 && (
          <Button
            variant="outline"
            className="h-[300px] border-dashed"
            onClick={() => {
              setEditingDeck(null);
              setIsDialogOpen(true);
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="text-6xl mb-2">🏝️</div>
              <span className="text-lg font-medium">
                Create Your First Deck
              </span>
            </div>
          </Button>
        )}
      </div>

      <DeckDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        deck={editingDeck}
      />
    </>
  );
}
