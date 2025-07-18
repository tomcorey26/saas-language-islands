import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, Sparkles, Play } from "lucide-react";
import { supportedLanguages } from "@/data/supportedLanguages";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
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
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
              {deck.name}
            </h1>
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
          <div className="flex gap-3 flex-col md:flex-row">
            <Link href={`/dashboard/decks/${deck.id}/study`}>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-5 py-6 rounded-lg text-base"
                disabled={totalCards === 0}
              >
                <Play className="h-5 w-5" />
                <span>Study</span>
              </Button>
            </Link>
            <Link href={`/dashboard/decks/${deck.id}?createIsland=true`}>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 px-5 py-6 rounded-lg text-base">
                <Sparkles className="h-5 w-5" />
                <span>Create New Island</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
