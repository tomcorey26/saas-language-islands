"use client";

import type { FlashCard } from "@/zod/models/flashcard.model";
import type { SupportedLanguageCode } from "@/data/supportedLanguages";
import type { ReviewQuality } from "@/zod/contracts/card.schema";
import { RecallPractice } from "./exercises/RecallPractice";

interface ExerciseRendererProps {
  card: FlashCard;
  deckLanguage: SupportedLanguageCode;
  onAnswer: (quality: ReviewQuality) => void;
  disabled?: boolean;
}

export function ExerciseRenderer({
  card,
  deckLanguage,
  onAnswer,
  disabled = false,
}: ExerciseRendererProps) {
  return (
    <RecallPractice
      card={card}
      deckLanguage={deckLanguage}
      onAnswer={onAnswer}
      disabled={disabled}
    />
  );
}
