"use client";

import {
  useEffect,
  useState,
  useCallback,
  useOptimistic,
  startTransition,
} from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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
  const [optimisticCards, updateOptimisticCards] = useOptimistic(
    cards,
    (state, newDifficulty: { cardId: string; difficulty: CardDifficulty }) => {
      return state.map((card) =>
        card.id === newDifficulty.cardId
          ? { ...card, difficulty: newDifficulty.difficulty }
          : card
      );
    }
  );

  const currentCard = optimisticCards[currentIndex];

  const handleUpdateCard = async (
    cardId: string,
    difficulty: CardDifficulty
  ) => {
    // Move to next card immediately
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }

    // TOMDO: how tf does startTransition work?
    startTransition(async () => {
      // Optimistically update the card
      updateOptimisticCards({ cardId, difficulty });
      await updateCardAction(cardId, { difficulty });
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
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl">
        {/* Mobile header - compact */}
        <div className="flex md:hidden items-center justify-between mb-4 px-2 pr-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/decks/${deckId}`)}
            className="text-xs px-2 py-1 h-8"
          >
            ← Exit
          </Button>
          <div className="text-xs text-muted-foreground font-medium">
            {currentIndex + 1} / {cards.length}
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

        <div className="hidden md:flex justify-center mb-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                Space
              </kbd>
              <span>Flip card</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                ←
              </kbd>
              <span>Previous</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                →
              </kbd>
              <span>Next</span>
            </div>
          </div>
        </div>

        <Card className="relative h-96 mb-4 md:mb-8 cursor-pointer overflow-hidden">
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div
                key="front"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 p-8 flex flex-col"
                onClick={() => setIsFlipped(true)}
              >
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-2xl font-medium">{currentCard.phrase}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 p-8 flex flex-col"
                onClick={() => setIsFlipped(false)}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Mobile controls - compact and touch-friendly */}
        <div className="flex md:hidden flex-col gap-3">
          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                currentIndex > 0 && setCurrentIndex((prev) => prev - 1)
              }
              disabled={currentIndex === 0}
              className="px-3 py-2 h-9"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                currentIndex < cards.length - 1 &&
                setCurrentIndex((prev) => prev + 1)
              }
              disabled={currentIndex === cards.length - 1}
              className="px-3 py-2 h-9"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Difficulty buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                currentCard.difficulty === "again" && "bg-destructive",
                "border-red-500 hover:bg-red-500/10 hover:text-black h-9"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "again")}
            >
              Again
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                currentCard.difficulty === "difficult" && "bg-orange-500",
                "border-orange-500 hover:bg-orange-500/10 hover:text-black h-9"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "difficult")}
            >
              Hard
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                currentCard.difficulty === "good" && "bg-green-500",
                "border-green-500 hover:bg-green-500/10 hover:text-black h-9"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "good")}
            >
              Good
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                currentCard.difficulty === "easy" && "bg-blue-500",
                "border-blue-500 hover:bg-blue-500/10 hover:text-black h-9"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "easy")}
            >
              Easy
            </Button>
          </div>
        </div>

        {/* Desktop controls - original layout */}
        <div className="hidden md:flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={() =>
              currentIndex > 0 && setCurrentIndex((prev) => prev - 1)
            }
            disabled={currentIndex === 0}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <Button
              variant="outline"
              className={cn(
                currentCard.difficulty === "again" && "bg-destructive",
                "border-red-500 hover:bg-red-500/10 hover:text-black"
              )}
              onClick={() => handleUpdateCard(currentCard.id, "again")}
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
            className="w-full sm:w-auto"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
