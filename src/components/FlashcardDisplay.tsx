"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface FlashCard {
  phrase: string;
  translation: string;
}

interface LanguageData {
  flag: string;
  name: string;
  languageCode: string;
}

interface FlashcardDisplayProps {
  flashcards: FlashCard[];
  selectedLangData?: LanguageData;
}

export function FlashcardDisplay({
  flashcards,
  selectedLangData,
}: FlashcardDisplayProps) {
  return (
    <div
      data-testid="flashcards-results"
      role="region"
      aria-live="polite"
      aria-label={`Generated ${flashcards.length} flashcards`}
      className="space-y-4 mt-6 animate-fade-in-up"
    >
      <div className="grid gap-3">
        {flashcards.map((card, index) => (
          <SignUpButton key={index} asChild>
            <div
              className="flashcard p-4 border-2 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 cursor-pointer group animate-slide-in-left"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">🇺🇸</span>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {card.phrase}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">
                    {selectedLangData?.flag}
                  </span>
                  <p className="text-muted-foreground">
                    {card.translation}
                  </p>
                </div>
              </div>
            </div>
          </SignUpButton>
        ))}
      </div>
      <div className="text-center pt-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <p className="text-sm text-muted-foreground mb-3">
          Like what you see? Get personalized flashcards for your
          learning goals!
        </p>
        <SignUpButton asChild>
          <Button
            variant="cta"
            className="text-base md:text-lg px-6 py-3 rounded-full transition-all duration-200 hover:scale-105"
          >
            <Trophy className="size-5 mr-2" />
            Start Learning Free!
          </Button>
        </SignUpButton>
      </div>
    </div>
  );
}