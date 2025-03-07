"use client";

import { useState } from "react";
import { Deck } from "@/zod/contracts/deck.schema";
import { FlashCard } from "@/zod/models/flashcard.model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Island from "@/components/Island";
import { generateCards } from "../actions";
import { deleteIsland } from "@/app/decks/[deckId]/actions";
import { PlusCircle } from "lucide-react";

interface DeckClientProps {
  deck: Deck & { cards: FlashCard[] };
  cardsByCategory: Record<string, FlashCard[]>;
}

interface GenerateCardsFormData {
  islandName: string;
  cardCount: number;
  prompt: string;
}

export function DeckClient({ deck, cardsByCategory }: DeckClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<GenerateCardsFormData>({
    islandName: "",
    cardCount: 10,
    prompt: "",
  });

  const handleGenerateCards = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const result = await generateCards({
        category: formData.islandName,
        deckId: deck.id,
        count: formData.cardCount,
        prompt: formData.prompt,
        languages: deck.languages,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      console.log("Cards generated successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error generating cards:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteIsland = async (category: string) => {
    await deleteIsland(deck.id, category);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
            {deck.name}
          </h1>
          <p className="text-gray-600 text-lg font-light leading-relaxed italic border-l-4 border-primary/30 pl-3">
            {deck.description}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 px-5 py-2 rounded-lg">
              <PlusCircle className="h-4 w-4" />
              <span>Create New Island</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New Cards</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleGenerateCards} className="space-y-4">
              <div>
                <Label htmlFor="islandName">Island Name</Label>
                <Input
                  id="islandName"
                  value={formData.islandName}
                  onChange={(e) =>
                    setFormData({ ...formData, islandName: e.target.value })
                  }
                  placeholder="e.g., Greetings, Business, Travel"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardCount">Number of Cards</Label>
                <Input
                  id="cardCount"
                  type="number"
                  min={1}
                  max={50}
                  value={formData.cardCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardCount: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="prompt">Generation Prompt</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                  placeholder="Describe what kind of cards you want to generate..."
                  required
                />
              </div>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Cards"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(cardsByCategory).map(([category, cards]) => (
          <Island
            key={category}
            cards={cards}
            category={category}
            onDelete={handleDeleteIsland}
          />
        ))}
      </div>
    </div>
  );
}
