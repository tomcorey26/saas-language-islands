"use client";

import { deleteIsland } from "@/app/dashboard/decks/[deckId]/actions";
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
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function DeleteIslandDialog() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();
  const category = searchParams.get("deleteIsland");
  const params = useParams();
  const router = useRouter();

  const handleDeleteIsland = async () => {
    const deckId = params.deckId;

    // validate the island id is a valid uuid
    if (!category) {
      toast({
        title: "Error",
        description: "Invalid category.",
        variant: "destructive",
      });
      return;
    }

    // validate the deck id is a valid uuid
    if (!deckId) {
      toast({
        title: "Error",
        description: "Invalid deck id.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    const result = await deleteIsland(deckId.toString(), category);
    if (result?.message) {
      toast({
        title: result.error ? "Error" : "Success",
        description: result.message,
        variant: result.error ? "destructive" : "default",
      });
    }

    if (!result?.error) {
      router.push(`/dashboard/decks/${params.deckId}`);
    }
    setIsDeleting(false);
  };

  return (
    <AlertDialog open={!!category}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Island</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the &ldquo;{category}&rdquo; island?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={() => {
              router.push(`/dashboard/decks/${params.deckId}`);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteIsland}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
