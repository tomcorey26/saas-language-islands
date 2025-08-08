"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SupportedLanguageCode,
  supportedLanguagesArray,
} from "@/data/supportedLanguages";
import { generateDemoFlashcards } from "@/server/actions/demo";
import { ExamplePrompts } from "./ExamplePrompts";
import { FlashcardsDisplay } from "./FlashcardsDisplay";

interface FlashCard {
  phrase: string;
  translation: string;
}

export function DemoForm() {
  const [prompt, setPrompt] = useState("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguageCode>("es");
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedLangData = supportedLanguagesArray.find(
    (lang) => lang.languageCode === selectedLanguage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError("");
    setFlashcards([]);

    startTransition(async () => {
      const result = await generateDemoFlashcards(
        prompt.trim(),
        selectedLanguage
      );

      if (result.success) {
        setFlashcards(result.data.flashcards);
        setPrompt("");
      } else {
        setError(result.error);
        if (result.retryAfter) {
          setError(
            `${result.error} (Try again in ${result.retryAfter} seconds)`
          );
        }
      }
    });
  };

  const handleExampleClick = async (example: string) => {
    if (isPending) return;

    setPrompt(example);
    setError("");
    setFlashcards([]);

    startTransition(async () => {
      const result = await generateDemoFlashcards(
        example.trim(),
        selectedLanguage
      );

      if (result.success) {
        setFlashcards(result.data.flashcards);
        setPrompt("");
      } else {
        setError(result.error);
        if (result.retryAfter) {
          setError(
            `${result.error} (Try again in ${result.retryAfter} seconds)`
          );
        }
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <Select
            value={selectedLanguage}
            onValueChange={(value) =>
              setSelectedLanguage(value as SupportedLanguageCode)
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-full lg:w-[200px] text-base md:text-lg py-5 md:py-6 border-2 hover:border-primary/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguagesArray.map((lang) => (
                <SelectItem key={lang.languageCode} value={lang.languageCode}>
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1 relative">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`e.g., Ordering coffee in ${selectedLangData?.name}`}
              className="w-full text-base md:text-lg py-5 md:py-6 pl-10 border-2 hover:border-primary/50 focus:border-primary transition-colors"
              maxLength={100}
              disabled={isPending}
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10">
              💡
            </div>
          </div>
          <Button
            type="submit"
            disabled={!prompt.trim() || isPending}
            className="px-5 md:px-6 py-5 md:py-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg border border-violet-400 text-base md:text-lg font-semibold"
          >
            {isPending ? (
              <LoadingSpinner />
            ) : (
              <>
                <Send className="size-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
      </form>

      <ExamplePrompts
        onExampleClick={handleExampleClick}
        isPending={isPending}
      />

      {error && (
        <div className="text-red-600 text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
          <span className="text-xl">⚠️</span>
          {error}
        </div>
      )}

      <FlashcardsDisplay
        flashcards={flashcards}
        isPending={isPending}
        selectedLangData={selectedLangData}
      />
    </>
  );
}
