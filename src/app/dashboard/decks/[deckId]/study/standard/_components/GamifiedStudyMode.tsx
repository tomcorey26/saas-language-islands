"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { FlashCard } from "@/zod/models/flashcard.model";
import type { SupportedLanguageCode } from "@/data/supportedLanguages";
import type { ReviewQuality } from "@/zod/contracts/card.schema";

import { SessionProgress } from "./SessionProgress";
import { SessionComplete } from "./SessionComplete";
import { ExerciseRenderer } from "./ExerciseRenderer";
import { reviewCardAction } from "../../../actions";

interface GamifiedStudyModeProps {
  cards: FlashCard[];
  deckId: string;
  deckName: string;
  deckLanguage: SupportedLanguageCode;
}

const XP_PER_CARD = 10;
const STREAK_BONUS_THRESHOLD = 3;
const STREAK_BONUS_XP = 5;

export function GamifiedStudyMode({
  cards,
  deckId,
  deckName,
  deckLanguage,
}: GamifiedStudyModeProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentCard = cards[currentIndex];

  const handleAnswer = useCallback(
    (quality: ReviewQuality) => {
      if (!currentCard) return;

      // Determine if "correct" based on quality (not "again")
      const correct = quality !== "again";

      // Update streak and XP
      if (correct) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setBestStreak((prev) => Math.max(prev, newStreak));
        setCorrectCount((prev) => prev + 1);

        // Calculate XP with streak bonus
        let earnedXp = XP_PER_CARD;
        if (newStreak >= STREAK_BONUS_THRESHOLD) {
          earnedXp += STREAK_BONUS_XP;
        }
        setXp((prev) => prev + earnedXp);
      } else {
        setStreak(0);
      }

      // Record the review
      startTransition(async () => {
        await reviewCardAction({
          cardId: currentCard.id,
          quality,
        });
      });

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionComplete(true);
      }
    },
    [currentCard, currentIndex, cards.length, streak]
  );

  const handleBackToDeck = () => {
    router.push(`/dashboard/decks/${deckId}`);
  };

  const handleStudyMore = () => {
    // Refresh the page to get new due cards
    router.refresh();
  };

  // Session complete screen
  if (sessionComplete) {
    return (
      <SessionComplete
        totalCards={cards.length}
        correctCount={correctCount}
        xp={xp}
        bestStreak={bestStreak}
        onBackToDeck={handleBackToDeck}
        onStudyMore={handleStudyMore}
      />
    );
  }

  // No cards to study
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">No cards to study</h2>
        <p className="text-muted-foreground">Check back later for more reviews.</p>
        <Button onClick={handleBackToDeck}>Back to Deck</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToDeck}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Exit</span>
        </Button>
        <h1 className="text-lg font-medium text-muted-foreground truncate max-w-[50%]">
          {deckName}
        </h1>
      </div>

      {/* Progress */}
      <SessionProgress
        current={currentIndex + 1}
        total={cards.length}
        streak={streak}
        xp={xp}
      />

      {/* Exercise */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          <ExerciseRenderer
            card={currentCard}
            deckLanguage={deckLanguage}
            onAnswer={handleAnswer}
            disabled={isPending}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
