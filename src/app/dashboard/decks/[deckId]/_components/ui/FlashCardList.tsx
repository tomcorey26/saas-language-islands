import { Button } from "@/components/ui/button";
import { FlashCard } from "@/zod/models/flashcard.model";
import { Trash2 } from "lucide-react";
import { FlashCardItem } from "./FlashCardItem";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Deck } from "@/zod/models/deck.model";
import { Island } from "@/zod/models/island.model";

interface FlashCardListProps {
  cards: FlashCard[];
  island: Island;
  deck: Deck;
}

export function FlashCardList({ island, cards, deck }: FlashCardListProps) {
  const params = useParams();
  const deckId = params.deckId as string;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">{island.prompt}</h3>
        <Link href={`/dashboard/decks/${deckId}?deleteIsland=${island.id}`}>
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
          <FlashCardItem
            key={card.id}
            card={card}
            index={index}
            deckId={deckId}
            deck={deck}
          />
        ))}
      </div>
    </>
  );
}
