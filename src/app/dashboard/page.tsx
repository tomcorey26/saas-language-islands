"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeckItem from "./_components/DeckItem";
import DeckDialog from "./_components/DeckDialog";
import { Deck } from "@/zod/contracts/deck.schema";

/*
  TODO:
  - Add a login count to the user subscription
  - upon first login, check if the user has cards in local storage
  - if they do, add them to the database. Or just regenerate the deck
  - if they don't, prompt them to generate cards
  - Create UI from https://bolt.new/~/bolt-shadcn-xwqb6qvu
*/

// Cards
// Each card has the deck name and photo
// Each card is a link to the deck
// If no decks added have one with the dash outline, with a plus button in
// the center of the card that says "Create Deck"

// Deck Generation form
// + Add a island name
// + Add a name
// + Add a description
// + Add a photo
// + Add a language
// + Add a category
// + Add a difficulty
// Add card count you want to generate
// add the prompt you want to use to generate the deck (optional)
// can choose to auto translate when editing individual cards
// Can add individual islands to the deck with just the island
// part of the form, creating the world requires multiple of these forms

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  const handleSave = (deck: Omit<Deck, "id" | "createdAt" | "updatedAt">) => {
    if (editingDeck) {
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
      const newDeck: Deck = {
        id: crypto.randomUUID(),
        ...deck,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDecks([newDeck, ...decks]);
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
              <Sparkles className="h-8 w-8" />
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
