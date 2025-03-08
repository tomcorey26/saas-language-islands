"use client";

import { useState } from "react";
import { FlashCard } from "@/zod/models/flashcard.model";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
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
import { Trash2, Volume2, MoreVertical } from "lucide-react";

interface IslandProps {
  cards: FlashCard[];
  category: string;
  onDelete: (category: string) => Promise<void>;
}

export default function Island({ cards, category, onDelete }: IslandProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(category);
    } catch (error) {
      console.error("Error deleting island:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const playAudio = (text: string) => {
    // Check if the browser supports speech synthesis
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES"; // Set language to Spanish
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <Card key={category} className="relative max-h-[500px] flex flex-col">
        <CardHeader className="sticky top-0 z-10 bg-card  space-y-0.5">
          <CardTitle className="flex justify-between">
            {category}
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto flex-1">
          <div className="flex flex-col space-y-2">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-3">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-600">{card.phrase}</p>
                    <p className="text-base font-bold">{card.translation}</p>
                    <div className="flex justify-between mt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(card.translation);
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Island</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the &ldquo;{category}&rdquo;
                  island? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </>
  );
}
