"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlashCard } from "@/zod/models/flashcard.model";
import { Volume2, MoreVertical, Trash2, Edit3, Check, X } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { deleteCardAction, updateCardAction } from "../../actions";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { speak } from "@/lib/textToSpeech";
import { Deck } from "@/zod/models/deck.model";
import { Textarea } from "@/components/ui/textarea";

// Validation schema for the edit form
const EditCardSchema = z.object({
  phrase: z
    .string()
    .min(1, "Phrase is required")
    .max(500, "Phrase must be less than 500 characters"),
  translation: z
    .string()
    .min(1, "Translation is required")
    .max(500, "Translation must be less than 500 characters"),
});

type EditCardFormData = z.infer<typeof EditCardSchema>;

interface FlashCardItemProps {
  card: FlashCard;
  deckId: string;
  deck: Deck;
}

// TOMDO:
// - Make it so you can auto translate the phrase
// - Make edit mode siwtch more optimized. copy quizlet
// Update to use shadcn form and add validation
export function FlashCardItem({ card, deckId, deck }: FlashCardItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdatePending, startUpdateTransition] = useTransition();

  const form = useForm<EditCardFormData>({
    resolver: zodResolver(EditCardSchema),
    defaultValues: {
      phrase: card.phrase,
      translation: card.translation,
    },
  });

  const playAudio = () => {
    speak(card.translation, deck.language);
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteCardAction(card.id, deckId);

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

  const handleEdit = () => {
    setIsEditMode(true);
    form.reset({
      phrase: card.phrase,
      translation: card.translation,
    });
  };

  const onSubmit = async (data: EditCardFormData) => {
    startUpdateTransition(async () => {
      const result = await updateCardAction(card.id, {
        phrase: data.phrase,
        translation: data.translation,
      });

      if (result?.message) {
        toast({
          title: result.error ? "Error" : "Success",
          description: result.message,
          variant: result.error ? "destructive" : "default",
        });
      }

      if (!result?.error) {
        setIsEditMode(false);
      }
    });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    form.reset({
      phrase: card.phrase,
      translation: card.translation,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <div key={card.id}>
        <Card className="p-3">
          <div className="flex flex-col">
            {isEditMode ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="phrase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500 font-medium">
                          Phrase
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-1">
                            <Textarea
                              {...field}
                              onKeyDown={handleKeyDown}
                              className="min-h-[60px] resize-none"
                              placeholder="Enter phrase..."
                              maxLength={500}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {field.value.length}/500 characters
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="translation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500 font-medium">
                          Translation
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-1">
                            <Textarea
                              {...field}
                              onKeyDown={handleKeyDown}
                              className="min-h-[60px] resize-none"
                              placeholder="Enter translation..."
                              maxLength={500}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {field.value.length}/500 characters
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      type="submit"
                      disabled={isUpdatePending || !form.formState.isValid}
                      className="flex-1"
                    >
                      {isUpdatePending ? (
                        "Saving..."
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isUpdatePending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <>
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
                        className="w-full justify-start"
                        onClick={() => handleEdit()}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
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
              </>
            )}
          </div>
        </Card>
      </div>

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
