"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { speak } from "@/lib/textToSpeech";
import type { FlashCard } from "@/zod/models/flashcard.model";
import type { SupportedLanguageCode } from "@/data/supportedLanguages";
import type { ReviewQuality } from "@/zod/contracts/card.schema";

interface RecallPracticeProps {
  card: FlashCard;
  deckLanguage: SupportedLanguageCode;
  onAnswer: (quality: ReviewQuality) => void;
  disabled?: boolean;
}

const RATING_OPTIONS: {
  quality: ReviewQuality;
  label: string;
  className: string;
}[] = [
  {
    quality: "again",
    label: "Forgot",
    className: "bg-red-500 hover:bg-red-600 text-white border-red-500",
  },
  {
    quality: "difficult",
    label: "Struggled",
    className: "bg-orange-500 hover:bg-orange-600 text-white border-orange-500",
  },
  {
    quality: "good",
    label: "Knew It",
    className: "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500",
  },
  {
    quality: "easy",
    label: "Perfect",
    className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
  },
];

function playDing() {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 880; // A5 note
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch {
    // Audio not supported, silently fail
  }
}

export function RecallPractice({
  card,
  deckLanguage,
  onAnswer,
  disabled = false,
}: RecallPracticeProps) {
  const [step, setStep] = useState<"recall" | "revealed">("recall");
  const [selectedQuality, setSelectedQuality] = useState<ReviewQuality | null>(null);

  const handleShowAnswer = () => {
    setStep("revealed");
    speak(card.translation, deckLanguage);
  };

  const handleListenAgain = () => {
    speak(card.translation, deckLanguage);
  };

  const handleRate = useCallback(
    (quality: ReviewQuality) => {
      if (disabled || selectedQuality) return;

      setSelectedQuality(quality);
      playDing();

      // Brief delay to show selection animation before moving on
      setTimeout(() => {
        onAnswer(quality);
      }, 400);
    },
    [disabled, selectedQuality, onAnswer]
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Phrase display */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            What does this mean?
          </p>
          <p className="text-2xl font-medium">{card.phrase}</p>
        </div>

        {step === "recall" ? (
          /* Step 1: Recall - Show answer button */
          <Button
            className="w-full py-6 text-lg"
            onClick={handleShowAnswer}
            disabled={disabled}
          >
            Show Answer
          </Button>
        ) : (
          /* Step 2: Revealed - Translation + rating */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Translation */}
            <div className="text-center border-t pt-6">
              <p className="text-xl font-medium">{card.translation}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleListenAgain}
                className="mt-2"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Listen Again
              </Button>
            </div>

            {/* Self-rating buttons */}
            <div className="space-y-2">
              <p className="text-sm text-center text-muted-foreground">
                How well did you know this?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {RATING_OPTIONS.map(({ quality, label, className }) => {
                  const isSelected = selectedQuality === quality;
                  return (
                    <Button
                      key={quality}
                      variant="outline"
                      onClick={() => handleRate(quality)}
                      disabled={disabled || selectedQuality !== null}
                      className={cn(
                        "py-4 transition-all duration-200",
                        className,
                        isSelected && "scale-110 ring-2 ring-offset-2 ring-offset-background",
                        isSelected && quality === "again" && "ring-red-500",
                        isSelected && quality === "difficult" && "ring-orange-500",
                        isSelected && quality === "good" && "ring-emerald-500",
                        isSelected && quality === "easy" && "ring-blue-500"
                      )}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
