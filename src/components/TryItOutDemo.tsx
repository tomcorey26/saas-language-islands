"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  ArrowRightIcon,
  Send,
  Sparkles,
  Zap,
  Trophy,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportedLanguagesArray } from "@/data/supportedLanguages";
import { SignUpButton } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { generateDemoFlashcards } from "@/server/actions/demo";

interface FlashCard {
  phrase: string;
  translation: string;
}

export function TryItOutDemo() {
  const [prompt, setPrompt] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

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
        setPrompt(""); // Clear the prompt on success
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

  const selectedLangData = supportedLanguagesArray.find(
    (lang) => lang.languageCode === selectedLanguage
  );

  const examples = [
    `Ordering food at a restaurant`,
    `Asking for directions`,
    `Shopping for clothes`,
    `Booking a hotel room`,
    `Making small talk at work`,
  ];

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

  // Get gradient from language data with forced Tailwind recognition
  const getLanguageGradient = () => {
    const gradientMap: Record<string, string> = {
      es: "from-red-700 via-yellow-400 to-red-700",
      fr: "from-blue-800 via-white to-red-600",
      de: "from-black via-red-600 to-yellow-400",
      it: "from-green-600 via-white to-red-600",
      pt: "from-green-700 via-red-500 to-yellow-400",
    };

    return gradientMap[selectedLanguage] || gradientMap.es;
  };

  return (
    <section
      id="demo"
      className="min-h-screen py-20 flex items-center relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 opacity-20 transition-all duration-1000 bg-gradient-to-br ${getLanguageGradient()}`}
      />

      {/* Floating emoji animations */}
      <AnimatePresence>
        {flashcards.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-20 left-10 text-4xl"
            >
              🎆
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-32 right-20 text-3xl"
            >
              ⭐
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute bottom-20 left-20 text-5xl"
            >
              🏆
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="container px-8 md:px-16 max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="inline-block"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-balance flex items-center justify-center gap-3">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                🏝️
              </motion.span>
              Welcome to Speech Islands
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: 0.2,
                }}
                className="inline-block"
              >
                🌍
              </motion.span>
            </h1>
          </motion.div>
          <p className="text-sm md:text-base lg:text-lg max-w-screen-xl mb-6 text-muted-foreground">
            Generate AI-powered flashcards for real conversations
          </p>
          <div className="flex flex-row gap-4 justify-center mb-6">
            <SignUpButton>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="cta"
                  className="text-base md:text-lg p-4 md:p-6 rounded-full flex gap-2 shadow-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-2 border-green-400"
                >
                  <Zap className="size-5" />
                  Start Learning Free
                  <ArrowRightIcon className="size-5" />
                </Button>
              </motion.div>
            </SignUpButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-2xl border-2 hover:shadow-3xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center text-xl md:text-2xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="size-6 text-yellow-500" />
                </motion.div>
                Try it out! Generate {selectedLangData?.name}{" "}
                {selectedLangData?.flag} Flashcards
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="size-5 text-yellow-500 fill-yellow-500" />
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-3">
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-full lg:w-[200px] text-base md:text-lg py-5 md:py-6 border-2 hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguagesArray.map((lang) => (
                        <SelectItem
                          key={lang.languageCode}
                          value={lang.languageCode}
                        >
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
                    <motion.div
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💡
                    </motion.div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                  </motion.div>
                </div>
              </form>

              {/* Example prompts */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Or try one of these examples:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {examples.map((example, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-sm px-3 py-1.5 bg-gradient-to-r from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 rounded-full transition-all border border-accent/20 hover:border-accent/30 shadow-sm hover:shadow-md"
                      disabled={isPending}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {example}
                    </motion.button>
                  ))}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-600 text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">⚠️</span>
                  {error}
                </motion.div>
              )}

              {isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Zap className="size-5 text-yellow-500" />
                    </motion.div>
                    Generating Your Flashcards...
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="text-2xl"
                    >
                      ✨
                    </motion.span>
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
                </motion.div>
              )}

              {!isPending && flashcards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <motion.h3
                    className="text-lg font-semibold text-center flex items-center justify-center gap-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <Trophy className="size-5 text-yellow-500" />
                    Your Flashcards Are Ready!
                    <span className="text-2xl">🎉</span>
                  </motion.h3>
                  <div className="grid gap-3">
                    {flashcards.map((card, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
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
                            <p className="text-muted-foreground">
                              {card.translation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Like what you see? Get personalized flashcards for your
                      learning goals!
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="cta"
                        className="text-base md:text-lg px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl border-2 border-green-400"
                        onClick={() => (window.location.href = "/sign-up")}
                      >
                        <Trophy className="size-5 mr-2" />
                        Unlock Full Access - It&apos;s Free!
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
