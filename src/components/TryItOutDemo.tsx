"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, Send, Zap, Trophy } from "lucide-react";
import { motion } from "motion/react";
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
import { SignUpButton } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { generateDemoFlashcards } from "@/server/actions/demo";
import { DemoRequestSchema } from "@/zod/contracts/demo.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FlashCard {
  phrase: string;
  translation: string;
}

type FormData = z.infer<typeof DemoRequestSchema>;

export function TryItOutDemo() {
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
        form.reset(); // Clear the form on success

        // Smooth scroll to flashcards after a brief delay
        setTimeout(() => {
          flashcardsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
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

  const watchedLanguage = form.watch("language");
  const watchedPrompt = form.watch("prompt");

  const selectedLangData = supportedLanguagesArray.find(
    (lang) => lang.languageCode === watchedLanguage
  );

  const examples = [
    `Ordering food at a restaurant`,
    `Asking for directions`,
    `Shopping for clothes`,
    `Booking a hotel room`,
    `Making small talk at work`,
  ];

  const handleExampleClick = (example: string) => {
    if (isPending) return;

    form.setValue("prompt", example);
    setError("");
    setFlashcards([]);

    // Auto-submit the form
    const formData = { prompt: example, language: watchedLanguage };
    onSubmit(formData);
  };

  // Get gradient colors that complement the green CTA
  const getLanguageColors = () => {
    const colorMap: Record<
      string,
      { primary: string; secondary: string; accent: string }
    > = {
      es: {
        primary: "emerald-400",
        secondary: "teal-300",
        accent: "green-200",
      },
      fr: { primary: "blue-400", secondary: "indigo-300", accent: "sky-200" },
      de: {
        primary: "amber-400",
        secondary: "orange-300",
        accent: "yellow-200",
      },
      it: {
        primary: "green-400",
        secondary: "emerald-300",
        accent: "lime-200",
      },
      pt: {
        primary: "emerald-500",
        secondary: "green-400",
        accent: "teal-200",
      },
    };

    return colorMap[watchedLanguage] || colorMap.es;
  };

  return (
    <section
      id="demo"
      className="pt-24 pb-20 relative overflow-hidden min-h-[100vh] bg-gray-50"
    >
      {/* Simple clean background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${
              getLanguageColors().primary
            } 1px, transparent 1px), radial-gradient(circle at 75% 75%, ${
              getLanguageColors().secondary
            } 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0, 25px 25px",
          }}
        />
      </div>

      <div className="container px-8 md:px-16 max-w-6xl mx-auto relative z-0 mt-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="inline-block"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 text-balance flex items-center justify-center gap-3">
              Welcome to Speech Islands
            </h1>
          </motion.div>
          <p className="text-lg md:text-xl lg:text-2xl max-w-screen-xl mb-6 text-muted-foreground">
            Generate AI-powered flashcards for real conversations
          </p>
          <div className="flex flex-row gap-4 justify-center mb-6">
            <SignUpButton>
              <Button
                variant="cta"
                className="text-lg p-6 rounded-xl flex gap-2"
              >
                <Zap className="size-5 md:size-6" />
                Start Learning Free
                <ArrowRightIcon className="size-5 md:size-6" />
              </Button>
            </SignUpButton>
          </div>
        </div>

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
                  className="text-4xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {selectedLangData?.flag}
                </motion.div>
                Try it out! Generate {selectedLangData?.name} Flashcards
                <motion.div
                  className="text-4xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {selectedLangData?.flag}
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                              maxLength={100}
                              disabled={isPending}
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
                    >
                      {isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="inline-block mr-2"
                          >
                            <Zap className="size-4" />
                          </motion.div>
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
                  ref={flashcardsRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="grid gap-3">
                    {flashcards.map((card, index) => (
                      <SignUpButton key={index}>
                        <motion.div
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
                      </SignUpButton>
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
                        Start Learning Free!
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
