"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardDifficulty } from "@/data/cardDifficulties";
import { SupportedLanguageCode } from "@/data/supportedLanguages";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { FlashCard } from "@/zod/models/flashcard.model";
import { updateCardAction } from "../../actions";
import { cn } from "@/lib/utils";
import { speak } from "@/lib/textToSpeech";

interface StudyModeProps {
  cards: FlashCard[];
  deckId: string;
  deckName: string;
  deckLanguage: SupportedLanguageCode;
}

export function StudyMode({
  cards,
  deckId,
  deckName,
  deckLanguage,
}: StudyModeProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentCard = cards[currentIndex];

  const handleUpdateCard = async (
    cardId: string,
    difficulty: CardDifficulty
  ) => {
    startTransition(async () => {
      try {
        await updateCardAction(cardId, { difficulty });
        // Move to next card
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
        }
      } catch (error) {
        console.error("Failed to update card:", error);
      }
    });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsFlipped((prev) => !prev);
      } else if (
        event.code === "ArrowRight" &&
        currentIndex < cards.length - 1
      ) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else if (event.code === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        setIsFlipped(false);
      }
    },
    [currentIndex, cards.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const playAudio = useCallback(() => {
    if (isFlipped && currentCard) {
      speak(currentCard.translation, deckLanguage);
    }
  }, [isFlipped, currentCard, deckLanguage]);

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
        <Button onClick={() => router.push(`/dashboard/decks/${deckId}`)}>
          Back to Deck
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/decks/${deckId}`)}
            >
              Exit Study Mode
            </Button>
            <h1 className="text-xl font-semibold text-muted-foreground">
              Studying: {deckName}
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {cards.length}
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
              variant="outline"
              className={cn(
                currentCard.difficulty === "again" && "bg-destructive",
                "border-red-500 hover:bg-red-500/10 hover:text-black"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "again")}
              disabled={isPending}
            >
              Again
            </Button>
            <Button
              variant="outline"
              className={cn(
                currentCard.difficulty === "difficult" && "bg-orange-500",
                "border-orange-500 hover:bg-orange-500/10 hover:text-black"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "difficult")}
              disabled={isPending}
            >
              Hard
            </Button>
            <Button
              variant="outline"
              className={cn(
                currentCard.difficulty === "good" && "bg-green-500",
                "border-green-500 hover:bg-green-500/10 hover:text-black"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "good")}
              disabled={isPending}
            >
              Good
            </Button>
            <Button
              variant="outline"
              className={cn(
                currentCard.difficulty === "easy" && "bg-blue-500",
                "border-blue-500 hover:bg-blue-500/10 hover:text-black"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "easy")}
              disabled={isPending}
            >
              Easy
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              currentIndex < cards.length - 1 &&
              setCurrentIndex((prev) => prev + 1)
            }
            disabled={currentIndex === cards.length - 1}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
