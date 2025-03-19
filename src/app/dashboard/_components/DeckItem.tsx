import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
import { Deck } from "@/zod/contracts/deck.schema";
import Link from "next/link";

interface DeckItemProps {
  deck: Deck;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DeckItem({ deck, onEdit, onDelete }: DeckItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card className="relative group overflow-hidden">
        <Link href={`/dashboard/decks/${deck.id}`} className="block">
          <div className="relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-8xl animate-slight-bounce">
              {deck.emoji || "🏝️"}
            </div>
            <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:opacity-0" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{deck.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {deck.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {deck.languages.map((lang) => (
                <span
                  key={lang}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </Link>
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
