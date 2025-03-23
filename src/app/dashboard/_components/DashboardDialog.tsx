"use client";

import { deleteDeck } from "@/app/dashboard/decks/actions";
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
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function DashboardDialog({
  deleteDeckId,
}: {
  deleteDeckId: string | undefined;
}) {
  const router = useRouter();
  const [isDeletePending, startDeleteTransition] = useTransition();

  return (
    <AlertDialog
      open={deleteDeckId !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          router.push("/dashboard/decks");
        }
      }}
    >
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
                if (deleteDeckId == null) {
                  throw new Error(
                    "No deck ID provided - This should never happen"
                  );
                }

                const result = await deleteDeck(deleteDeckId);

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
    </AlertDialog>
  );
}
