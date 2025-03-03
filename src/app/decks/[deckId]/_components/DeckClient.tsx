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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Island from "@/components/Island";
import { generateCards } from "../actions";

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
  const router = useRouter();
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
      router.refresh();
    } catch (error) {
      console.error("Error generating cards:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{deck.name}</h1>
          <p className="text-gray-600">{deck.description}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Island</Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(cardsByCategory).map(([category, cards]) => (
          <Card key={category} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Island cards={cards} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
