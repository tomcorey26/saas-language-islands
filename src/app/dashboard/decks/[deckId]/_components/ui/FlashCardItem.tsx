"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlashCard } from "@/zod/models/flashcard.model";
import { motion } from "framer-motion";
import { Volume2, MoreVertical, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { deleteCard } from "../../actions";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";

interface FlashCardItemProps {
  card: FlashCard;
  index: number;
  deckId: string;
}

export function FlashCardItem({ card, index, deckId }: FlashCardItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();

  // TOMDO: Make language dynamic
  const playAudio = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(card.translation);
      utterance.lang = "es-ES"; // Set language to Spanish
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteCard(card.id, deckId);

      if (result?.message) {
        toast({
          title: result.error ? "Error" : "Success",
          description: result.message,
          variant: result.error ? "destructive" : "default",
        });
      }

      if (!result?.error) {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  return (
    <>
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
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
                  playAudio();
                }}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-1" align="end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>
      </motion.div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flashcard? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeletePending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletePending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
