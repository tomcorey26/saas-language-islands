import { Button } from "@/components/ui/button";
import { FlashCard } from "@/zod/models/flashcard.model";
import { Trash2 } from "lucide-react";
import { FlashCardItem } from "./FlashCardItem";
import Link from "next/link";
import { useParams } from "next/navigation";

interface FlashCardListProps {
  category: string;
  cards: FlashCard[];
}

export function FlashCardList({ category, cards }: FlashCardListProps) {
  const params = useParams();
  const deckId = params.deckId;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">{category}</h3>
        <Link href={`/dashboard/decks/${deckId}?deleteIsland=${category}`}>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Delete Island
          </Button>
        </Link>
      </div>
      <div className="space-y-2">
        {cards.map((card, index) => (
          <FlashCardItem key={card.id} card={card} index={index} />
        ))}
      </div>
    </>
  );
}
