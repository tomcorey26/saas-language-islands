import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers } from "lucide-react";
import { supportedLanguages } from "@/data/supportedLanguages";
import { Card } from "@/components/ui/card";
import { Deck } from "@/zod/models/deck.model";

interface DeckHeroProps {
  deck: Deck;
  totalCards: number;
  totalIslands: number;
}

export function DeckHero({ deck, totalCards, totalIslands }: DeckHeroProps) {
  return (
    <Card className="relative group overflow-hidden mb-8">
      <div className="relative bg-gradient-to-br  p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 max-w-3xl">
            <p className="text-gray-600 text-lg font-light leading-relaxed italic">
              {deck.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary/70" />
                <span className="font-medium">{totalIslands} Islands</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary/70" />
                <span className="font-medium">{totalCards} Cards</span>
              </div>
              <Badge variant="secondary" className="font-medium">
                {supportedLanguages[deck.language].formatName()}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
