"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function EmptyState({ deckId }: { deckId: string }) {
  return (
    <Card className="border-dashed border-2 bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <PlusCircle className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-medium text-center mb-2">No Islands Yet</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Start by creating your first island to organize your flashcards into
          categories
        </p>
        <Link href={`/dashboard/decks/${deckId}?createIsland=true`}>
          <Button className="bg-gradient-to-r from-primary to-primary/80">
            Create Your First Island
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
