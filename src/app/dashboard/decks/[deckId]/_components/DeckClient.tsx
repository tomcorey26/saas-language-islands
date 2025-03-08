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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCards } from "../actions";
import { deleteIsland } from "@/app/decks/[deckId]/actions";
import {
  PlusCircle,
  BookOpen,
  Languages,
  Sparkles,
  Layers,
  Trash2,
  Volume2,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const { toast } = useToast();

  // Get the first category for default tab selection
  const categories = Object.keys(cardsByCategory);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.length > 0 ? categories[0] : ""
  );

  // State for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate statistics
  const totalCards = Object.values(cardsByCategory).flat().length;
  const totalIslands = Object.keys(cardsByCategory).length;

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

      toast({
        title: "Success!",
        description: `${formData.cardCount} cards generated for "${formData.islandName}" island.`,
        variant: "default",
      });

      setIsDialogOpen(false);
      setFormData({
        islandName: "",
        cardCount: 10,
        prompt: "",
      });
    } catch (error: unknown) {
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

  const handleDeleteIsland = async (category: string) => {
    try {
      setIsDeleting(true);
      await deleteIsland(deck.id, category);
      toast({
        title: "Island Deleted",
        description: `Successfully deleted "${category}" island.`,
      });

      // Set selected category to the first available category after deletion
      if (selectedCategory === category && categories.length > 1) {
        const nextCategory = categories.find((c) => c !== category) || "";
        setSelectedCategory(nextCategory);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: unknown) {
      toast({
        title: "Error",
        description: "Failed to delete island. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
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
                    <form
                      onSubmit={handleGenerateCards}
                      className="space-y-6 py-4"
                    >
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

      {/* Main Content */}
      {Object.keys(cardsByCategory).length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <PlusCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-center mb-2">
              No Islands Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Start by creating your first island to organize your flashcards
              into categories
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary/80">
                  Create Your First Island
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs
            defaultValue={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
            className="w-full"
          >
            <TabsList className="flex w-full overflow-x-auto">
              {Object.keys(cardsByCategory).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-1.5"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content for Each Category */}
            {Object.entries(cardsByCategory).map(([category, cards]) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">{category}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => {
                      setCategoryToDelete(category);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Island
                  </Button>
                </div>
                <div className="space-y-2">
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-3">
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-600">{card.phrase}</p>
                          <p className="text-base font-bold">
                            {card.translation}
                          </p>
                          <div className="flex justify-between mt-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Play audio functionality
                                if ("speechSynthesis" in window) {
                                  const utterance =
                                    new SpeechSynthesisUtterance(
                                      card.translation
                                    );
                                  utterance.lang = "es-ES"; // Set language to Spanish
                                  window.speechSynthesis.speak(utterance);
                                }
                              }}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {/* Delete Island Alert Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Island</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the &ldquo;{categoryToDelete}
              &rdquo; island? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteIsland(categoryToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
