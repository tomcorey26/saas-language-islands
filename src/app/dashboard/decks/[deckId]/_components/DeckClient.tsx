"use client";

import { useState } from "react";
import { Deck } from "@/zod/contracts/deck.schema";
import { FlashCard } from "@/zod/models/flashcard.model";
import { deleteIsland, generateCards } from "../actions";
import { useToast } from "@/hooks/use-toast";

// Import the extracted components
import { DeckHero, GenerateCardsFormData } from "./ui/DeckHero";
import { EmptyState } from "./ui/EmptyState";
import { CategoryTabs } from "./ui/CategoryTabs";
import { DeleteDialog } from "./ui/DeleteDialog";

interface DeckClientProps {
  deck: Deck & { cards: FlashCard[] };
  cardsByCategory: Record<string, FlashCard[]>;
}

export function DeckClient({ deck, cardsByCategory }: DeckClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleGenerateCards = async (formData: GenerateCardsFormData) => {
    try {
      const result = await generateCards({
        category: formData.islandName,
        deckId: deck.id,
        count: formData.cardCount,
        prompt: formData.prompt,
        language: deck.language,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setSelectedCategory(formData.islandName);

      toast({
        title: "Success!",
        description: `${formData.cardCount} cards generated for "${formData.islandName}" island.`,
        variant: "default",
      });
    } catch (error: unknown) {
      console.error("Error generating cards:", error);
      throw error;
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

  const handleDeleteRequest = (category: string) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <DeckHero
        deck={deck}
        totalCards={totalCards}
        totalIslands={totalIslands}
        onGenerateCards={handleGenerateCards}
      />

      {/* Main Content */}
      {Object.keys(cardsByCategory).length === 0 ? (
        <EmptyState
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      ) : (
        <div className="space-y-6">
          <CategoryTabs
            cardsByCategory={cardsByCategory}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onDeleteIsland={handleDeleteRequest}
          />
        </div>
      )}

      {/* Delete Island Alert Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemToDelete={categoryToDelete}
        isDeleting={isDeleting}
        onConfirm={() => handleDeleteIsland(categoryToDelete)}
      />
    </div>
  );
}
