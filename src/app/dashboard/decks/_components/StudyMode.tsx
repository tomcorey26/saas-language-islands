import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardDifficulty } from "@/data/cardDifficulties";
// import { calculateNextReview } from "@/lib/spaced-repetition";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { FlashCard } from "@/zod/models/flashcard.model";

interface StudyModeProps {
  cards: FlashCard[];
  onUpdateCard: (cardId: string, difficulty: CardDifficulty) => void;
  onExit: () => void;
}

export default function StudyMode({
  cards,
  onUpdateCard,
  onExit,
}: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const sortedCards = cards;

  // useEffect(() => {
  //   // Sort cards by nextReview date and difficulty
  //   const sorted = [...cards].sort((a, b) => {
  //     if (a.difficulty === "again" && b.difficulty !== "again") return -1;
  //     if (b.difficulty === "again" && a.difficulty !== "again") return 1;
  //     return a.nextReview.getTime() - b.nextReview.getTime();
  //   });
  //   setSortedCards(sorted);
  // }, [cards]);

  const currentCard = sortedCards[currentIndex];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsFlipped((prev) => !prev);
      } else if (
        event.code === "ArrowRight" &&
        currentIndex < sortedCards.length - 1
      ) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else if (event.code === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        setIsFlipped(false);
      }
    },
    [currentIndex, sortedCards.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const playAudio = useCallback(() => {
    if (isFlipped && currentCard) {
      const utterance = new SpeechSynthesisUtterance(currentCard.translation);
      utterance.lang = "es-ES";
      window.speechSynthesis.speak(utterance);
    }
  }, [isFlipped, currentCard]);

  useEffect(() => {
    if (isFlipped) {
      playAudio();
    }
  }, [isFlipped, playAudio]);

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-2xl font-bold">¡Bien hecho! 🎉</h2>
        <p className="text-lg">You&apos;ve reviewed all the cards for now.</p>
        <Button onClick={onExit}>Back to Grid</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onExit}>
            Exit Study Mode
          </Button>
          <div className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {sortedCards.length}
          </div>
        </div>

        <Card className="relative h-96 mb-8 cursor-pointer perspective-1000">
          <div
            className={`absolute inset-0 transition-transform duration-500 preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden p-8 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <p className="text-2xl font-medium">{currentCard.phrase}</p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl mb-4">{currentCard.translation}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio();
                    }}
                  >
                    <Volume2 className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() =>
              currentIndex > 0 && setCurrentIndex((prev) => prev - 1)
            }
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => onUpdateCard(currentCard.id, "again")}
            >
              Again
            </Button>
            <Button
              variant="outline"
              className="border-orange-500 hover:bg-orange-500/10"
              onClick={() => onUpdateCard(currentCard.id, "difficult")}
            >
              Hard
            </Button>
            <Button
              variant="outline"
              className="border-green-500 hover:bg-green-500/10"
              onClick={() => onUpdateCard(currentCard.id, "good")}
            >
              Good
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 hover:bg-blue-500/10"
              onClick={() => onUpdateCard(currentCard.id, "easy")}
            >
              Easy
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              currentIndex < sortedCards.length - 1 &&
              setCurrentIndex((prev) => prev + 1)
            }
            disabled={currentIndex === sortedCards.length - 1}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
