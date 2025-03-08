"use client";

import { Deck } from "@/zod/contracts/deck.schema";
import { FlashCard } from "@/zod/models/flashcard.model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, Languages, Sparkles, Layers } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DeckHeroProps {
  deck: Deck & { cards: FlashCard[] };
  totalCards: number;
  totalIslands: number;
  onGenerateCards: (formData: GenerateCardsFormData) => Promise<void>;
}

export interface GenerateCardsFormData {
  islandName: string;
  cardCount: number;
  prompt: string;
}

export function DeckHero({
  deck,
  totalCards,
  totalIslands,
  onGenerateCards,
}: DeckHeroProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<GenerateCardsFormData>({
    islandName: "",
    cardCount: 10,
    prompt: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      await onGenerateCards(formData);

      setIsDialogOpen(false);
      setFormData({
        islandName: "",
        cardCount: 10,
        prompt: "",
      });
    } catch (error) {
      console.error("Error generating cards:", error);
      toast({
        title: "Error",
        description: "Failed to generate cards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 mb-8 shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]" />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-2">
            {deck.languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="font-medium">
                {lang}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
            {deck.name}
          </h1>
          <p className="text-gray-600 text-lg font-light leading-relaxed italic border-l-4 border-primary/30 pl-3">
            {deck.description}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary/70" />
              <span className="font-medium">{totalIslands} Islands</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary/70" />
              <span className="font-medium">{totalCards} Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary/70" />
              <span className="font-medium">
                {deck.languages.length} Languages
              </span>
            </div>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 px-5 py-6 rounded-lg text-base">
                    <Sparkles className="h-5 w-5" />
                    <span>Create New Island</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Generate New Cards
                    </DialogTitle>
                    <DialogDescription>
                      Create a new island with AI-generated flashcards
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="islandName" className="text-base">
                        Island Name
                      </Label>
                      <Input
                        id="islandName"
                        value={formData.islandName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            islandName: e.target.value,
                          })
                        }
                        placeholder="e.g., Greetings, Business, Travel"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCount" className="text-base">
                        Number of Cards
                      </Label>
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
                        className="h-11"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Generate up to 50 cards per island
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prompt" className="text-base">
                        Generation Prompt
                      </Label>
                      <Textarea
                        id="prompt"
                        value={formData.prompt}
                        onChange={(e) =>
                          setFormData({ ...formData, prompt: e.target.value })
                        }
                        placeholder="Describe what kind of cards you want to generate..."
                        className="min-h-[120px]"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        For example: &quot;Create beginner-friendly
                        conversational phrases for ordering food in a
                        restaurant&quot;
                      </p>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full sm:w-auto flex items-center gap-2"
                      >
                        {isGenerating ? "Generating..." : "Generate Cards"}
                        {!isGenerating && <Sparkles className="h-4 w-4" />}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate new flashcards with AI</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
