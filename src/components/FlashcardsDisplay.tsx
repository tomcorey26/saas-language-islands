"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Trophy } from "lucide-react";

interface FlashCard {
  phrase: string;
  translation: string;
}

interface FlashcardsDisplayProps {
  flashcards: FlashCard[];
  isPending: boolean;
  selectedLangData?: {
    name: string;
    flag: string;
    languageCode: string;
  };
}

export function FlashcardsDisplay({
  flashcards,
  isPending,
  selectedLangData,
}: FlashcardsDisplayProps) {
  if (isPending) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
          <Zap className="size-5 text-yellow-500" />
          Generating Your Flashcards...
          <span className="text-2xl">✨</span>
        </h3>
        <div className="grid gap-3">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="p-4 border-2 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 animate-pulse"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isPending && flashcards.length > 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
          <Trophy className="size-5 text-yellow-500" />
          Your Flashcards Are Ready!
          <span className="text-2xl">🎉</span>
        </h3>
        <div className="grid gap-3">
          {flashcards.map((card, index) => (
            <div
              key={index}
              className="p-4 border-2 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary/30 cursor-pointer group"
            >
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">🇺🇸</span>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {card.phrase}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">
                    {selectedLangData?.flag}
                  </span>
                  <p className="text-muted-foreground">{card.translation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Like what you see? Get personalized flashcards for your learning
            goals!
          </p>
          <Button
            variant="cta"
            className="text-base md:text-lg px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl border-2 border-green-400"
            onClick={() => (window.location.href = "/sign-up")}
          >
            <Trophy className="size-5 mr-2" />
            Unlock Full Access - It&apos;s Free!
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
