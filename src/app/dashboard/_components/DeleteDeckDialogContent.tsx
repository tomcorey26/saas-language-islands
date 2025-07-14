"use client";

import { deleteDeckAction } from "@/app/dashboard/decks/actions";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";

export function DeleteDeckDialogContent({ id }: { id: string }) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Deck</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this deck? This action cannot be
          undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={isDeletePending}
          onClick={() => {
            startDeleteTransition(async () => {
              const result = await deleteDeckAction(id);

              await new Promise((resolve) => setTimeout(resolve, 1000));

              if (result.message) {
                toast({
                  title: result.error ? "Error" : "Success",
                  description: result.message,
                  variant: result.error ? "destructive" : "default",
                });
              }
            });
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
