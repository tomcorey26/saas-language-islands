"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { supportedLanguagesArray } from "@/data/supportedLanguages";
import { generateDemoFlashcards } from "@/server/actions/demo";
import { DemoRequestSchema } from "@/zod/contracts/demo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DEMO_CONFIG, DEMO_EXAMPLES } from "@/constants/examples";
import { FlashcardDisplay } from "./FlashcardDisplay";
import { LoadingSkeletons } from "./LoadingSkeletons";

interface FlashCard {
  phrase: string;
  translation: string;
}

type FormData = z.infer<typeof DemoRequestSchema>;

export function TryItOutFormClient() {
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const flashcardsRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(DemoRequestSchema),
    defaultValues: {
      prompt: "",
      language: "es",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setFlashcards([]);

    startTransition(async () => {
      const result = await generateDemoFlashcards(data.prompt, data.language);

      if (result.success) {
        setFlashcards(result.data.flashcards);
        form.setValue("prompt", ""); // Only clear the prompt, preserve language selection

        // Smooth scroll to flashcards after a brief delay
        setTimeout(() => {
          flashcardsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
        return;
      }
      setError(result.error);
      if (result.retryAfter) {
        setError(
          `${result.error} (Too many requests. Try again in ${result.retryAfter} seconds)`
        );
      }
    });
  };

  const watchedLanguage = form.watch("language");
  const watchedPrompt = form.watch("prompt");

  const selectedLangData = supportedLanguagesArray.find(
    (lang) => lang.languageCode === watchedLanguage
  );

  // Handle example click from child components
  const handleExampleClick = (example: string) => {
    if (isPending) return;

    form.setValue("prompt", example);
    setError("");
    setFlashcards([]);
    form.handleSubmit(onSubmit)();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger
                        className="w-full lg:w-[200px] text-base md:text-lg py-5 md:py-6 border-2 hover:border-primary/50 transition-colors"
                        aria-label="Select target language for flashcards"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguagesArray.map((lang) => (
                          <SelectItem
                            key={lang.languageCode}
                            value={lang.languageCode}
                          >
                            <span className="flex items-center gap-2">
                              {lang.flag}
                              <span className="text-xl"></span>
                              <span>{lang.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`e.g., Ordering coffee in ${selectedLangData?.name}`}
                      className="w-full text-base md:text-lg py-5 md:py-6 border-2 hover:border-primary/50 focus:border-primary transition-colors"
                      maxLength={DEMO_CONFIG.MAX_PROMPT_LENGTH}
                      disabled={isPending}
                      aria-label="Describe the scenario you want to learn phrases for"
                      aria-describedby="prompt-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              type="submit"
              disabled={!watchedPrompt.trim() || isPending}
              className="w-full"
              aria-label={
                isPending
                  ? "Generating flashcards, please wait"
                  : "Generate flashcards for your scenario"
              }
            >
              {isPending ? (
                <>
                  <LoadingSpinner />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {error && (
        <div
          className="text-red-600 text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center gap-2 mt-4 animate-fade-in"
          role="alert"
          aria-live="assertive"
        >
          <span className="text-xl">⚠️</span>
          {error}
        </div>
      )}

      {isPending && <LoadingSkeletons />}

      {!isPending && flashcards.length > 0 && (
        <div ref={flashcardsRef}>
          <FlashcardDisplay
            flashcards={flashcards}
            selectedLangData={selectedLangData}
          />
        </div>
      )}

      {/* Example prompts */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">
          Or try one of these examples:
        </p>
        <div id="prompt-description" className="sr-only">
          Describe a scenario or situation you want to practice. Maximum{" "}
          {DEMO_CONFIG.MAX_PROMPT_LENGTH} characters.
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {DEMO_EXAMPLES.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-sm px-3 py-1.5 bg-gradient-to-r from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 rounded-full transition-all duration-200 border border-accent/20 hover:border-accent/30 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 animate-fade-in-up disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin size-4 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
